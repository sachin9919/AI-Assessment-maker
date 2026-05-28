import { Request, Response } from 'express';
import AssignmentModel from '../models/Assignment';
import QuestionPaperModel from '../models/QuestionPaper';
import { AuthRequest } from '../middleware/authMiddleware';

/**
 * GET /api/assignments
 * Returns all assignments sorted by newest first.
 */
export const getAllAssignments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const assignments = await AssignmentModel.find({ createdBy: req.userId }).sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (err) {
    console.error('[assignmentController] getAllAssignments error:', (err as Error).message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignments',
    });
  }
};

/**
 * POST /api/assignments
 * Creates a new assignment with 'pending' status and queues a job.
 */
import { addAssessmentJob } from '../queues/assessmentQueue';
import cloudinary from '../config/cloudinary';

const uploadToCloudinary = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

export const createAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, dueDate, additionalInfo, uploadedFileName } = req.body;
    let { questionTypes } = req.body;

    // questionTypes comes as a JSON string because of FormData
    if (typeof questionTypes === 'string') {
      try {
        questionTypes = JSON.parse(questionTypes);
      } catch (e) {
        questionTypes = [];
      }
    }

    if (!Array.isArray(questionTypes) || questionTypes.length === 0) {
      res.status(400).json({
        success: false,
        message: 'At least one question type is required',
      });
      return;
    }

    // Upload file if it exists
    let fileUrl: string | undefined;
    if (req.file) {
      fileUrl = await uploadToCloudinary(req.file.buffer);
    }

    // Calculate total marks from questionTypes
    let totalMarks = 0;
    if (Array.isArray(questionTypes)) {
      totalMarks = questionTypes.reduce((sum, q) => sum + (q.count * q.marks), 0);
    }

    // 1. Create Assignment in DB
    const newAssignment = await AssignmentModel.create({
      title: title || uploadedFileName || 'Untitled Assignment',
      dueDate,
      description: additionalInfo,
      questionTypes,
      status: 'pending',
      totalMarks,
      fileUrl,
      createdBy: req.userId,
    });

    // 2. Queue the BullMQ job
    await addAssessmentJob(newAssignment._id.toString(), {
      ...req.body,
      questionTypes,
      fileUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Assignment created and job queued successfully',
      assignmentId: newAssignment._id,
    });
  } catch (err) {
    console.error('[assignmentController] createAssignment error:', (err as Error).message);
    res.status(500).json({
      success: false,
      message: 'Failed to create assignment',
    });
  }
};

/**
 * GET /api/assignments/:id/result
 * Fetches the assignment and its generated QuestionPaper
 */
export const getAssignmentResult = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const assignment = await AssignmentModel.findById(id).lean();
    if (!assignment) {
      res.status(404).json({ success: false, message: 'Assignment not found' });
      return;
    }

    if (assignment.createdBy?.toString() !== req.userId) {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }

    const questionPaper = await QuestionPaperModel.findOne({ assignmentId: id }).lean();

    res.status(200).json({
      success: true,
      data: {
        assignment,
        questionPaper,
      },
    });
  } catch (err) {
    console.error('[assignmentController] getAssignmentResult error:', (err as Error).message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignment result',
    });
  }
};

/**
 * DELETE /api/assignments/:id
 * Deletes the assignment and its associated question paper.
 */
export const deleteAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const assignment = await AssignmentModel.findById(id);
    if (!assignment) {
      res.status(404).json({ success: false, message: 'Assignment not found' });
      return;
    }

    if (assignment.createdBy?.toString() !== req.userId) {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }

    await AssignmentModel.findByIdAndDelete(id);

    // Also delete the associated question paper
    await QuestionPaperModel.findOneAndDelete({ assignmentId: id });

    res.status(200).json({
      success: true,
      message: 'Assignment and associated question paper deleted successfully',
    });
  } catch (err) {
    console.error('[assignmentController] deleteAssignment error:', (err as Error).message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete assignment',
    });
  }
};

/**
 * POST /api/assignments/:id/regenerate
 * Regenerates the question paper for an existing assignment.
 * Deletes the old question paper and requeues the job.
 */
export const regenerateAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // 1. Get the existing assignment
    const assignment = await AssignmentModel.findById(id);
    if (!assignment) {
      res.status(404).json({ success: false, message: 'Assignment not found' });
      return;
    }

    if (assignment.createdBy?.toString() !== req.userId) {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }

    // 2. Delete the old question paper
    await QuestionPaperModel.findOneAndDelete({ assignmentId: id });

    // 3. Update assignment status to processing
    await AssignmentModel.findByIdAndUpdate(id, { status: 'processing' });

    // 4. Reconstruct the payload from the assignment data
    const payload = {
      title: assignment.title,
      dueDate: assignment.dueDate,
      additionalInfo: assignment.description,
      fileUrl: assignment.fileUrl,
      uploadedFileName: assignment.title,
      questionTypes: assignment.questionTypes ?? [],
      totalMarks: assignment.totalMarks,
    };

    if (!payload.questionTypes.length) {
      res.status(400).json({
        success: false,
        message: 'Cannot regenerate because question configuration is missing',
      });
      return;
    }

    // 5. Requeue the job
    await addAssessmentJob(id, payload);

    res.status(200).json({
      success: true,
      message: 'Assignment regeneration queued successfully',
      assignmentId: id,
    });
  } catch (err) {
    console.error('[assignmentController] regenerateAssignment error:', (err as Error).message);
    res.status(500).json({
      success: false,
      message: 'Failed to regenerate assignment',
    });
  }
};


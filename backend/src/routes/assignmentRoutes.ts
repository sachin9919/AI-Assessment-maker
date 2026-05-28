import { Router } from 'express';
import multer from 'multer';
import { getAllAssignments, createAssignment, getAssignmentResult, deleteAssignment, regenerateAssignment } from '../controllers/assignmentController';
import { verifyAuth } from '../middleware/authMiddleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
router.use(verifyAuth);

// GET /api/assignments
router.get('/', getAllAssignments);

// GET /api/assignments/:id/result
router.get('/:id/result', getAssignmentResult);

// POST /api/assignments
router.post('/', upload.single('file'), createAssignment);

// POST /api/assignments/:id/regenerate
router.post('/:id/regenerate', regenerateAssignment);

// DELETE /api/assignments/:id
router.delete('/:id', deleteAssignment);

export default router;

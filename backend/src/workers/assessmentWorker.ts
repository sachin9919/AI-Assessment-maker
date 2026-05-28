import { Worker, Job } from 'bullmq';
import { getRedisClient } from '../config/redis';
import AssignmentModel from '../models/Assignment';
import QuestionPaperModel from '../models/QuestionPaper';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getIO } from '../config/socket';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function fetchFileAsGenerativePart(fileUrl: string) {
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch file from ${fileUrl}`);
  }
  const buffer = await response.arrayBuffer();
  const mimeType = response.headers.get('content-type') || 'application/octet-stream';
  
  return {
    inlineData: {
      data: Buffer.from(buffer).toString('base64'),
      mimeType,
    },
  };
}

export const initAssessmentWorker = () => {
  const worker = new Worker(
    'assessment-queue',
    async (job: Job) => {
      const { assignmentId, payload } = job.data;
      const { additionalInfo, questionTypes, fileUrl, title, totalMarks } = payload;

      console.log(`\n[Worker] Started processing assignment: ${assignmentId}`);

      const emitProgress = (msg: string) => {
        try { getIO().to(assignmentId).emit('job:progress', { message: msg }); } catch (e) {}
      };

      // 1. Update status to processing
      await AssignmentModel.findByIdAndUpdate(assignmentId, { status: 'processing' });
      try {
        getIO().to(assignmentId).emit('job:processing', { assignmentId });
      } catch (e) {
        console.warn('[Worker] Socket emit processing skipped (socket not initialized)');
      }

      // 2. Fetch File if present
      const generativeParts: any[] = [];
      if (fileUrl) {
        emitProgress('Reading your uploaded document...');
        console.log(`[Worker] Fetching file from Cloudinary: ${fileUrl}`);
        const filePart = await fetchFileAsGenerativePart(fileUrl);
        generativeParts.push(filePart);
      }

      // 3. Gemini Prompt
      const prompt = `You are an expert curriculum designer and school teacher.
Your task is to generate a highly detailed question paper in STRICT JSON format matching the following schema.
Do not generate generic or meaningless questions. Ensure the questions are highly relevant, pedagogically sound, and specifically based on the provided file context (if any) and the instructions.

Schema Requirements:
Return a single JSON object representing the QuestionPaper. Do NOT wrap it in markdown code blocks (\`\`\`json). Just return the raw JSON string.

{
  "title": "${title}",
  "instructions": "General instructions for the students",
  "totalMarks": ${totalMarks || 100},
  "sections": [
    {
      "title": "Section Title",
      "instructions": "Section specific instructions",
      "questions": [
        {
          "text": "<Generate a real, relevant question here>",
          "type": "mcq" | "short_answer" | "long_answer" | "true_false",
          "difficulty": "easy" | "medium" | "hard",
          "marks": <Number. Must match the exact requested marks for this question type>,
          "options": ["<Real Option A>", "<Real Option B>", "<Real Option C>", "<Real Option D>"], // Only if MCQ or true_false
          "correctAnswer": "<The actual correct answer string>",
          "explanation": "<A real, pedagogically sound explanation for the answer>"
        }
      ]
    }
  ]
}

Specific Requirements for this Assignment:
- Additional Instructions: ${additionalInfo || 'None'}
- Question Types required:
${JSON.stringify(questionTypes, null, 2)}

You must distribute the questions across sections logically or put them all in one section. Make sure the total counts and marks per type EXACTLY match the request.
Return ONLY valid JSON.
`;

      generativeParts.push({ text: prompt });

      // 4. Call Gemini
      emitProgress('Planning the assignment layout...');
      console.log(`[Worker] Calling Gemini API...`);
      const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
      const result = await model.generateContent(generativeParts);
      const response = await result.response;
      let text = response.text();

      // Clean markdown formatting if present
      text = text.trim();
      if (text.startsWith('```json')) text = text.slice(7);
      if (text.startsWith('```')) text = text.slice(3);
      if (text.endsWith('```')) text = text.slice(0, -3);
      text = text.trim();

      // Parse JSON
      console.log(`[Worker] Parsing Gemini output...`);
      const parsedJson = JSON.parse(text);

      // 5. Save to DB
      emitProgress('Saving your new assignment...');
      console.log(`[Worker] Saving QuestionPaper to database...`);
      const paper = await QuestionPaperModel.create({
        ...parsedJson,
        assignmentId,
        generatedByAI: true,
      });

      // Update Assignment status and use the AI-generated title
      await AssignmentModel.findByIdAndUpdate(assignmentId, { 
        status: 'completed',
        title: paper.title || title
      });
      try {
        getIO().to(assignmentId).emit('job:completed', { assignmentId });
      } catch (e) {
        console.warn('[Worker] Socket emit completed skipped');
      }
      console.log(`[Worker] Successfully completed assignment: ${assignmentId}`);
    },
    {
      connection: getRedisClient() as any,
      concurrency: 1, // process 1 at a time
    }
  );

  worker.on('failed', async (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed with error:`, err.message);
    if (job?.data?.assignmentId) {
      await AssignmentModel.findByIdAndUpdate(job.data.assignmentId, { status: 'draft' });
      try {
        getIO().to(job.data.assignmentId).emit('job:failed', { assignmentId: job.data.assignmentId, error: err.message });
      } catch (e) {}
    }
  });

  return worker;
};

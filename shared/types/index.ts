// ─────────────────────────────────────────────────────────────────────────────
// Shared Types — AI Assessment Creator
// These are the canonical interfaces shared across /frontend and /backend.
// Keep both copies in sync until a proper npm-workspace setup is introduced.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Assignment ───────────────────────────────────────────────────────────────

export type AssignmentStatus = 'draft' | 'pending' | 'processing' | 'completed' | 'published' | 'closed' | 'grading';

export interface Assignment {
  _id?: string;
  title: string;
  description?: string;
  dueDate: string;        
  status: AssignmentStatus;
  totalMarks?: number;
  subject?: string;
  grade?: string;
  fileUrl?: string;
  createdBy?: string;     // User ID reference
  createdAt?: string;
  updatedAt?: string;
}

// ─── QuestionPaper ────────────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'mcq' | 'short_answer' | 'long_answer' | 'true_false';

export interface Question {
  _id?: string;
  text: string;
  type: QuestionType;
  difficulty: Difficulty;
  marks: number;
  options?: string[];           // For MCQ / true_false
  correctAnswer?: string;       // Hidden from student-facing APIs
  explanation?: string;
  tags?: string[];
}

export interface Section {
  _id?: string;
  title: string;
  instructions?: string;
  questions: Question[];
  /** Derived: sum of question marks in this section */
  totalMarks?: number;
}

export interface QuestionPaper {
  _id?: string;
  assignmentId: string;
  title: string;
  instructions?: string;
  totalMarks: number;
  duration?: number;            // minutes
  sections: Section[];
  generatedByAI?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

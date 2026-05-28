// Re-exported from /shared/types — keep in sync with that canonical source.
export type AssignmentStatus = 'draft' | 'pending' | 'processing' | 'completed' | 'published' | 'closed' | 'grading';

export interface Assignment {
  _id?: string;
  title: string;
  description?: string;
  dueDate: string;
  questionTypes?: {
    id: string;
    questionType: string;
    count: number;
    marks: number;
  }[];
  status: AssignmentStatus;
  totalMarks?: number;
  subject?: string;
  grade?: string;
  fileUrl?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'mcq' | 'short_answer' | 'long_answer' | 'true_false';

export interface Question {
  _id?: string;
  text: string;
  type: QuestionType;
  difficulty: Difficulty;
  marks: number;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  tags?: string[];
}

export interface Section {
  _id?: string;
  title: string;
  instructions?: string;
  questions: Question[];
  totalMarks?: number;
}

export interface QuestionPaper {
  _id?: string;
  assignmentId: string;
  title: string;
  instructions?: string;
  totalMarks: number;
  duration?: number;
  sections: Section[];
  generatedByAI?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

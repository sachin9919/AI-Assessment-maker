import { create } from 'zustand';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface QuestionTypeRow {
  id: string;
  questionType: string;
  count: number;   // No. of questions
  marks: number;   // Marks per question
}

// ─── Constants ────────────────────────────────────────────────────────────────
export const QUESTION_TYPE_OPTIONS = [
  'Multiple Choice Questions',
  'Short Questions',
  'Long Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'True/False Questions',
  'Essay Questions',
] as const;

const DEFAULT_QUESTION_TYPES: QuestionTypeRow[] = [
  { id: 'q1', questionType: 'Multiple Choice Questions',      count: 4, marks: 1 },
  { id: 'q2', questionType: 'Short Questions',                count: 3, marks: 2 },
  { id: 'q3', questionType: 'Diagram/Graph-Based Questions',  count: 5, marks: 5 },
  { id: 'q4', questionType: 'Numerical Problems',             count: 5, marks: 5 },
];

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Store Interface ──────────────────────────────────────────────────────────
interface AssignmentFormState {
  /* Fields */
  uploadedFileName: string;
  dueDate: string;           // stored as YYYY-MM-DD (native date input value)
  questionTypes: QuestionTypeRow[];
  additionalInfo: string;

  /* Actions */
  setUploadedFileName: (name: string) => void;
  setDueDate: (date: string) => void;
  setAdditionalInfo: (info: string) => void;
  addQuestionType: () => void;
  removeQuestionType: (id: string) => void;
  updateQuestionType: (
    id: string,
    field: keyof Pick<QuestionTypeRow, 'questionType' | 'count' | 'marks'>,
    value: string | number
  ) => void;
  resetForm: () => void;
  validateForm: () => { isValid: boolean; error: string | null };
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useAssignmentStore = create<AssignmentFormState>((set, get) => ({
  uploadedFileName: '',
  dueDate: '',
  questionTypes: DEFAULT_QUESTION_TYPES,
  additionalInfo: '',

  setUploadedFileName: (name) => set({ uploadedFileName: name }),
  setDueDate: (date) => set({ dueDate: date }),
  setAdditionalInfo: (info) => set({ additionalInfo: info }),

  addQuestionType: () =>
    set((s) => ({
      questionTypes: [
        ...s.questionTypes,
        { id: genId(), questionType: QUESTION_TYPE_OPTIONS[0], count: 1, marks: 1 },
      ],
    })),

  removeQuestionType: (id) =>
    set((s) => ({ questionTypes: s.questionTypes.filter((q) => q.id !== id) })),

  updateQuestionType: (id, field, value) =>
    set((s) => {
      let validatedValue = value;
      if (field === 'count' || field === 'marks') {
        const num = Number(value);
        // Enforce no negative numbers and no 0
        validatedValue = isNaN(num) || num < 1 ? 1 : num;
      }
      return {
        questionTypes: s.questionTypes.map((q) =>
          q.id === id ? { ...q, [field]: validatedValue } : q
        ),
      };
    }),

  resetForm: () =>
    set({
      uploadedFileName: '',
      dueDate: '',
      questionTypes: DEFAULT_QUESTION_TYPES,
      additionalInfo: '',
    }),

  validateForm: () => {
    const s = get();
    if (!s.uploadedFileName) return { isValid: false, error: 'Please upload a file' };
    if (!s.dueDate) return { isValid: false, error: 'Please select a due date' };
    if (s.questionTypes.length === 0) return { isValid: false, error: 'Please add at least one question type' };
    for (const q of s.questionTypes) {
      if (q.count < 1 || q.marks < 1) {
        return { isValid: false, error: 'Question count and marks must be at least 1' };
      }
    }
    if (!s.additionalInfo.trim()) return { isValid: false, error: 'Please provide additional information' };
    return { isValid: true, error: null };
  },
}));

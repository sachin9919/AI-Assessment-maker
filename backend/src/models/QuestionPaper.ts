import mongoose, { Schema, Document } from 'mongoose';
import { QuestionPaper, Section, Question } from '../types';

export interface QuestionPaperDocument extends Omit<QuestionPaper, '_id'>, Document {}

const QuestionSchema = new Schema<Question>({
  text: { type: String, required: true },
  type: {
    type: String,
    enum: ['mcq', 'short_answer', 'long_answer', 'true_false'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  marks: { type: Number, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String },
  explanation: { type: String },
  tags: [{ type: String }],
});

const SectionSchema = new Schema<Section>({
  title: { type: String, required: true },
  instructions: { type: String },
  questions: [QuestionSchema],
  totalMarks: { type: Number },
});

const QuestionPaperSchema = new Schema<QuestionPaperDocument>(
  {
    assignmentId: {
      type: String,
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    instructions: { type: String },
    totalMarks: { type: Number, required: true },
    duration: { type: Number },
    sections: [SectionSchema],
    generatedByAI: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.model<QuestionPaperDocument>('QuestionPaper', QuestionPaperSchema);

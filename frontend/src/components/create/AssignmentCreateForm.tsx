'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAssignmentStore, QUESTION_TYPE_OPTIONS } from '@/store/useAssignmentStore';
import GeneratingTabContent from './GeneratingTabContent';
import { getAuthHeaders } from '@/lib/auth';

// ═══════════════════════════════════════════════════════════════════════════════
// Icons
// ═══════════════════════════════════════════════════════════════════════════════
function UploadCloudIcon() {
  return (
    <svg width="44" height="40" viewBox="0 0 44 40" fill="none" aria-hidden="true">
      <path d="M29 24L22 17L15 24" stroke="#C0C0C0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 17V33" stroke="#C0C0C0" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M37 30.8C39 29.4 40.5 27 40.5 24.5C40.5 19.8 36.7 16 32 16H30.8C29.4 10.6 24.6 7 19 7C12.4 7 7 12.4 7 19C7 19.1 7 19.2 7 19.3C3.7 20.5 1.5 23.6 1.5 27.2C1.5 31.4 4.6 34.9 8.7 35.4"
        stroke="#C0C0C0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarPlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8.25" stroke="#BBBBBB" strokeWidth="1.5" />
      <path d="M10 6.5V13.5M6.5 10H13.5" stroke="#BBBBBB" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownSmIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 5L7 9L11 5" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1 1L11 11M11 1L1 11" stroke="#AAAAAA" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CirclePlusIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <circle cx="15" cy="15" r="15" fill="#141414" />
      <path d="M15 9V21M9 15H21" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="6" y="1" width="6" height="9" rx="3" stroke="#BBBBBB" strokeWidth="1.4" />
      <path d="M2 9.5C2 13.09 5.134 16 9 16C12.866 16 16 13.09 16 9.5" stroke="#BBBBBB" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M9 16V18" stroke="#BBBBBB" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M15 9H3M3 9L8 4M3 9L8 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 9H15M15 9L10 4M15 9L10 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// File Upload Zone
// ═══════════════════════════════════════════════════════════════════════════════
function FileUploadZone({
  fileName,
  onFileSelect,
}: {
  fileName: string;
  onFileSelect: (file: File) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  return (
    <div
      role="region"
      aria-label="File upload area"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-[16px] py-10 px-6 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer ${
        isDragging
          ? 'border-[#444] bg-gray-50'
          : 'border-[#D9D9D9] bg-white'
      }`}
      onClick={() => inputRef.current?.click()}
    >
      <UploadCloudIcon />
      <div className="text-center">
        <p className="text-[0.9rem] font-medium text-[#333]">
          {fileName ? fileName : 'Choose a file or drag & drop it here'}
        </p>
        <p className="text-[0.75rem] text-[#AAAAAA] mt-0.5">JPEG, PNG, upto 10MB</p>
      </div>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
        className="px-5 py-1.5 rounded-full border border-gray-300 text-[0.8rem] text-[#555] font-medium hover:bg-gray-50 transition-colors"
      >
        Browse Files
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Counter Stepper  [−] N [+]
// ═══════════════════════════════════════════════════════════════════════════════
function Counter({
  value,
  onChange,
  min = 0,
  id,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  id: string;
}) {
  return (
    <div className="flex items-center gap-0 rounded-[10px] border border-gray-200 overflow-hidden bg-white shrink-0">
      <button
        type="button"
        aria-label="Decrease"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-9 flex items-center justify-center text-[#AAAAAA] hover:text-[#111] hover:bg-gray-50 transition-colors text-lg font-light border-r border-gray-200"
      >
        −
      </button>
      <span
        id={id}
        className="w-8 text-center text-[0.85rem] font-semibold text-[#111] select-none"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase"
        onClick={() => onChange(value + 1)}
        className="w-8 h-9 flex items-center justify-center text-[#AAAAAA] hover:text-[#111] hover:bg-gray-50 transition-colors text-lg font-light border-l border-gray-200"
      >
        +
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Question Type Section
// ═══════════════════════════════════════════════════════════════════════════════
function QuestionTypeSection() {
  const { questionTypes, addQuestionType, removeQuestionType, updateQuestionType } =
    useAssignmentStore();

  const totalQuestions = questionTypes.reduce((sum, q) => sum + q.count, 0);
  const totalMarks = questionTypes.reduce((sum, q) => sum + q.count * q.marks, 0);

  return (
    <div className="flex flex-col gap-3">
      {/* Column headers */}
      <div className="hidden md:grid grid-cols-[1fr_auto_auto] gap-3 items-center px-1">
        <p className="text-[0.85rem] text-[#555] w-28 text-center">No. of Questions</p>
        <p className="text-[0.85rem] text-[#555] w-24 text-center">Marks</p>
      </div>

      {/* Rows — horizontal scroll on mobile */}
      <div className="flex flex-col gap-2.5">
        {questionTypes.map((row) => (
          <div
            key={row.id}
            className="flex items-center gap-2 md:gap-3"
          >
            {/* Dropdown */}
            <div className="relative flex-1 min-w-0">
              <select
                value={row.questionType}
                onChange={(e) => updateQuestionType(row.id, 'questionType', e.target.value)}
                aria-label="Question type"
                className="w-full appearance-none rounded-[10px] border border-gray-200 px-3 py-2.5 pr-8 text-[0.85rem] font-medium text-[#333] bg-white outline-none focus:border-gray-400 cursor-pointer"
              >
                {QUESTION_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDownSmIcon />
              </span>
            </div>

            {/* Remove row button */}
            <button
              type="button"
              onClick={() => removeQuestionType(row.id)}
              aria-label={`Remove ${row.questionType}`}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors shrink-0"
            >
              <XIcon />
            </button>

            {/* No. of Questions counter */}
            <Counter
              id={`count-${row.id}`}
              value={row.count}
              onChange={(v) => updateQuestionType(row.id, 'count', v)}
              min={1}
            />

            {/* Marks counter */}
            <Counter
              id={`marks-${row.id}`}
              value={row.marks}
              onChange={(v) => updateQuestionType(row.id, 'marks', v)}
              min={1}
            />
          </div>
        ))}
      </div>

      {/* Add row button */}
      <button
        type="button"
        id="add-question-type-btn"
        onClick={addQuestionType}
        className="flex items-center gap-2.5 w-fit hover:opacity-80 transition-opacity mt-1"
      >
        <CirclePlusIcon />
        <span className="text-[0.875rem] font-semibold text-[#111]">Add Question Type</span>
      </button>

      {/* Totals */}
      <div className="flex flex-col items-end gap-0.5 pt-1">
        <p className="text-[0.875rem] font-semibold text-[#111]">
          Total Questions : <span className="font-bold">{totalQuestions}</span>
        </p>
        <p className="text-[0.875rem] font-semibold text-[#111]">
          Total Marks : <span className="font-bold">{totalMarks}</span>
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main Form
// ═══════════════════════════════════════════════════════════════════════════════
export default function AssignmentCreateForm() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const {
    uploadedFileName,
    dueDate,
    additionalInfo,
    questionTypes,
    setUploadedFileName,
    setDueDate,
    setAdditionalInfo,
    validateForm,
  } = useAssignmentStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [newId, setNewId] = useState<string | null>(null);

  const handleNext = async () => {
    const { isValid, error } = validateForm();
    if (!isValid) {
      setErrorMsg(error);
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', uploadedFileName);
      formData.append('uploadedFileName', uploadedFileName);
      formData.append('dueDate', dueDate);
      formData.append('additionalInfo', additionalInfo);
      formData.append('questionTypes', JSON.stringify(questionTypes));

      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const base = process.env.NEXT_PUBLIC_BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
      const res = await fetch(`${base}/api/assignments`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...getAuthHeaders(),
        },
        // Note: Do not set Content-Type header manually when sending FormData,
        // the browser will automatically set it with the correct boundary.
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create assignment');
      }

      if (data.success) {
        useAssignmentStore.getState().resetForm();
        setNewId(data.assignmentId);
        setIsGenerating(true);
      } else {
        throw new Error(data.message || 'Failed to create assignment');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setUploadedFileName(file.name);
  };

  return (
    <div className="flex flex-col min-h-full">

      {/* ── Mobile breadcrumb header ── */}
      <div className="md:hidden mx-3 mt-3 bg-white rounded-[20px] px-4 py-3 flex items-center gap-2 shrink-0">
        <Link
          href="/assignments"
          className="w-8 h-8 flex items-center justify-center text-[#555] rounded-lg hover:bg-gray-100 transition-colors no-underline"
        >
          <ArrowLeftIcon />
        </Link>
        <span className="text-[15px] font-semibold text-[#111] flex-1 text-center pr-8">
          Create Assignment
        </span>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 p-4 md:p-5 flex flex-col gap-4 pb-28 md:pb-10">

        {/* Desktop: Page header */}
        <div className="hidden md:flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0"
              style={{ boxShadow: '0 0 0 3px rgba(34,197,94,0.18)' }}
              aria-hidden="true"
            />
            <h1 className="text-[1.2rem] font-bold text-[#111]">Create Assignment</h1>
          </div>
          <p className="text-[0.825rem] text-[#777] ml-[18px]">
            Set up a new assignment for your students
          </p>
        </div>

        {/* Progress bar — 2-step indicator */}
        <div className="flex gap-2" role="progressbar" aria-valuenow={isGenerating ? 2 : 1} aria-valuemin={1} aria-valuemax={2} aria-label={isGenerating ? "Step 2 of 2" : "Step 1 of 2"}>
          <div className="flex-1 h-1.5 bg-[#141414] rounded-full" />
          <div className={`flex-1 h-1.5 rounded-full transition-colors ${isGenerating ? 'bg-[#141414]' : 'bg-gray-200'}`} />
        </div>

        {isGenerating && newId ? (
          <GeneratingTabContent id={newId} />
        ) : (
          <>
            {/* ── White form card ── */}
            <div className="bg-white rounded-[20px] p-5 md:p-8 flex flex-col gap-6">

          {/* Section title */}
          <div>
            <h2 className="text-[1.05rem] font-bold text-[#111]">Assignment Details</h2>
            <p className="text-[0.8rem] text-[#AAAAAA] mt-0.5">
              Basic information about your assignment
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-50 text-red-600 text-[0.85rem] font-medium px-4 py-3 rounded-[12px] border border-red-100 flex items-center gap-2">
               <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5V8M8 11.5H8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
               {errorMsg}
            </div>
          )}

          {/* File upload zone */}
          <div className="flex flex-col gap-2">
            <FileUploadZone fileName={uploadedFileName} onFileSelect={handleFileSelect} />
            <p className="text-[0.75rem] text-[#AAAAAA] text-center">
              Upload images of your preferred document/image
            </p>
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-2">
            <label htmlFor="due-date-input" className="text-[0.9rem] font-bold text-[#111]">
              Due Date
            </label>
            <div className="relative">
              <input
                id="due-date-input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="DD-MM-YYYY"
                className="w-full rounded-[12px] border border-gray-200 px-4 py-3 text-[0.875rem] text-[#333] outline-none focus:border-gray-400 transition-colors appearance-none bg-white pr-12"
                style={{ colorScheme: 'normal' }}
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <CalendarPlusIcon />
              </span>
            </div>
          </div>

          {/* Question Type section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[0.9rem] font-bold text-[#111]">Question Type</h3>
            <QuestionTypeSection />
          </div>

          {/* Additional Information */}
          <div className="flex flex-col gap-2">
            <label htmlFor="additional-info-input" className="text-[0.9rem] font-bold text-[#111]">
              Additional Information{' '}
              <span className="font-normal text-[#AAAAAA]">(For better output)</span>
            </label>
            <div className="relative">
              <textarea
                id="additional-info-input"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
                rows={4}
                className="w-full rounded-[12px] border border-gray-200 px-4 py-3 pb-8 text-[0.875rem] text-[#333] placeholder:text-[#CCCCCC] outline-none focus:border-gray-400 transition-colors resize-none"
              />
              {/* Mic icon inside textarea bottom-right */}
              <button
                type="button"
                aria-label="Voice input"
                className="absolute bottom-3 right-3.5 opacity-60 hover:opacity-100 transition-opacity"
              >
                <MicIcon />
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom navigation ── */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => router.push('/assignments')}
            id="form-prev-btn"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-gray-300 bg-white text-[0.875rem] font-semibold text-[#333] hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon />
            Previous
          </button>

          <button
            type="button"
            id="form-next-btn"
            className={`inline-flex items-center gap-2 px-7 py-3 rounded-full text-white text-[0.875rem] font-semibold transition-colors shadow-md ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#141414] hover:bg-[#2a2a2a]'
            }`}
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Next'}
            {!isSubmitting && <ArrowRightIcon />}
          </button>
        </div>
          </>
        )}
      </div>
    </div>
  );
}

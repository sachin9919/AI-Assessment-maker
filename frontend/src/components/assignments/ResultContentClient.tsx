'use client';

import { useRef, useState } from 'react';
import { Assignment, Question, QuestionPaper } from '@/types';
import { getAuthHeaders } from '@/lib/auth';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

/**
 * Returns the lower-alpha letter for an MCQ correct answer, e.g. "c"
 * Returns '' if the question is not MCQ or the answer can't be matched.
 */
function getOptionLetter(q: Question): string {
  const ans = q.correctAnswer;
  if (!q.options?.length || !ans) return '';
  const idx = q.options.findIndex(
    (opt: string) => opt.trim() === ans.trim(),
  );
  return idx === -1 ? '' : String.fromCharCode(97 + idx);
}

/**
 * Returns difficulty badge styling based on difficulty level
 */
function getDifficultyBadgeStyle(difficulty: string): { bg: string; text: string; label: string } {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return { bg: '#d1fae5', text: '#065f46', label: 'Easy' };
    case 'medium':
      return { bg: '#fef3c7', text: '#92400e', label: 'Medium' };
    case 'hard':
      return { bg: '#fee2e2', text: '#991b1b', label: 'Hard' };
    default:
      return { bg: '#f3f4f6', text: '#374151', label: capitalize(difficulty) };
  }
}

export default function ResultContentClient({
  assignment,
  questionPaper,
}: {
  assignment: Assignment;
  questionPaper: QuestionPaper;
}) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleDownloadPDF = async () => {
    if (!printRef.current || isDownloading) return;
    setIsDownloading(true);

    try {
      // Dynamically import to avoid SSR issues
      const { toPng } = await import('html-to-image');
      const { jsPDF } = await import('jspdf');

      const dataUrl = await toPng(printRef.current, {
        quality: 1,
        backgroundColor: '#ffffff'
      });

      const pdf = new jsPDF('p', 'mm', 'a4');

      // Calculate aspect ratio by creating an image object
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (img.height * pdfWidth) / img.width;

      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);

      let heightLeft = pdfHeight - pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      const safeTitle = (assignment.title || 'Assignment').replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`Question_Paper_${safeTitle}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
      setNotice('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRegenerate = async () => {
    if (isRegenerating) return;
    if (!window.confirm('Regenerate the question paper? This will create a new set of questions.')) return;

    setIsRegenerating(true);
    try {
      const base = process.env.NEXT_PUBLIC_BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
      const res = await fetch(`${base}/api/assignments/${assignment._id}/regenerate`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (res.ok) {
        // Redirect to loading page
        window.location.href = `/assignments/${assignment._id}/loading`;
      } else {
        const data = await res.json().catch(() => null);
        setNotice(data?.message || 'Failed to regenerate. Please try again.');
      }
    } catch (err) {
      console.error('Regeneration error:', err);
      setNotice('An error occurred while regenerating.');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-[#252525] rounded-2xl md:rounded-3xl shadow-xl overflow-hidden">

      {/* ── Dark header: AI message + Buttons ──────────────────────────── */}
      <div className="px-5 py-4 md:px-6 md:py-5 flex flex-col sm:flex-row sm:items-start gap-3">
        <p
          className="text-white text-sm md:text-base leading-relaxed flex-1"
          style={{ fontFamily: 'Segoe UI, system-ui, sans-serif' }}
        >
          Certainly! Here is the customized Question Paper for your{' '}
          <strong>{assignment.subject || 'class'}</strong> on the requested topics:
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 shrink-0 self-start">
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className={`flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${isRegenerating ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700 active:scale-95'}`}
            style={{ fontFamily: 'Segoe UI, system-ui, sans-serif' }}
            title="Generate a new set of questions"
          >
            {/* Refresh icon */}
            {isRegenerating ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
              </svg>
            )}
            {isRegenerating ? 'Regenerating...' : 'Regenerate'}
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className={`flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${isDownloading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-100 active:scale-95'}`}
            style={{ fontFamily: 'Segoe UI, system-ui, sans-serif' }}
          >
            {/* Download icon */}
            {isDownloading ? (
              <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            )}
            {isDownloading ? 'Generating PDF...' : 'Download as PDF'}
          </button>
        </div>
      </div>
      {notice && (
        <div className="mx-5 mb-2 md:mx-6 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm px-3 py-2">
          {notice}
        </div>
      )}

      {/*
        * WHITE QUESTION-PAPER CARD
        * ───────────────────────────────────────────────────────────────────
        * Simulates an MS Word / printed document.
        *
        * KEY FIX: `mx-4 mb-4 md:mx-6 md:mb-6` gives the card a visible gap
        * from the dark outer card's edges on all sides, so it "floats" inside.
        *
        * `p-8 md:p-12 lg:p-16` provides the ~1-inch margin simulation.
        * No negative margins anywhere inside.
        */}
      <div
        ref={printRef}
        className="bg-white rounded-xl md:rounded-2xl mx-3 mb-3 md:mx-4 md:mb-4 p-6 md:p-10 text-black shadow-sm"
        style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}
      >
        {/* ── School / Exam Header ─────────────────────────────────── */}
        <div className="text-center mb-5">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 tracking-tight">
            Delhi Public School, Sector-4, Bokaro
          </h1>
          <p className="text-base md:text-lg font-semibold mb-0.5">
            Subject: {assignment.subject || 'English'}
          </p>
          <p className="text-sm md:text-base font-semibold">Class: 5th</p>
        </div>

        {/* ── Time / Marks ─────────────────────────────────────────── */}
        <div className="flex justify-between items-baseline mb-3 font-semibold text-sm md:text-base">
          <span>Time Allowed: {questionPaper.duration || 45} minutes</span>
          <span>Maximum Marks: {questionPaper.totalMarks}</span>
        </div>

        {/* ── General Instructions ──────────────────────────────────── */}
        <p className="font-bold text-sm md:text-base mb-4" style={{ lineHeight: '1.6' }}>
          All questions are compulsory unless stated otherwise.
        </p>

        {/* ── Student Details ──────────────────────────────────────── */}
        <div className="mb-6 space-y-2 text-sm md:text-base" style={{ lineHeight: '1.6' }}>
          <div>
            Name:{' '}
            <span className="inline-block border-b border-black w-44 md:w-60">&nbsp;</span>
          </div>
          <div>
            Roll Number:{' '}
            <span className="inline-block border-b border-black w-36 md:w-52">&nbsp;</span>
          </div>
          <div>
            Class: 5th &nbsp; Section:{' '}
            <span className="inline-block border-b border-black w-28 md:w-44">&nbsp;</span>
          </div>
        </div>

        {/* ── Question Sections ────────────────────────────────────── */}
        {questionPaper.sections.map((section, sIndex) => (
          <div key={section._id || sIndex} className="mb-6">

            {/* Section title */}
            <h2 className="text-lg md:text-xl font-bold text-center mb-2">
              {section.title}
            </h2>

            {/* Section instructions */}
            {section.instructions && (
              <p
                className="text-center italic text-xs md:text-sm mb-4 text-gray-600"
                style={{ lineHeight: '1.6' }}
              >
                {section.instructions}
              </p>
            )}

            {/*
              * QUESTION LIST
              * ─────────────────────────────────────────────────────────
              * Using a manual flex-row layout instead of CSS list markers.
              *
              * WHY: `list-decimal list-inside` in Tailwind v4 can still
              * bleed the marker if the parent has padding constraints.
              * A flex layout with an explicit number span is bulletproof —
              * the number is always inside the white box.
              */}
            <div className="space-y-4">
              {section.questions.map((q, qIndex) => (
                <div key={q._id || qIndex} className="flex gap-3 items-start">

                  {/* Number badge — always inside the padded container */}
                  <span
                    className="shrink-0 font-semibold text-sm md:text-base mt-0.5 w-7 text-right"
                  >
                    {qIndex + 1}.
                  </span>

                  {/* Question body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {/* Difficulty Badge */}
                      {(() => {
                        const style = getDifficultyBadgeStyle(q.difficulty);
                        return (
                          <span
                            className="text-xs md:text-sm font-semibold px-3 py-1 rounded-full"
                            style={{ backgroundColor: style.bg, color: style.text }}
                          >
                            {style.label}
                          </span>
                        );
                      })()}
                      {/* Marks Badge */}
                      <span
                        className="text-xs md:text-sm font-semibold px-3 py-1 rounded-full"
                        style={{ backgroundColor: '#f0f4ff', color: '#1e40af' }}
                      >
                        {q.marks} Mark{q.marks > 1 ? 's' : ''}
                      </span>
                    </div>
                    <p
                      className="text-sm md:text-base text-black"
                      style={{ lineHeight: '1.6' }}
                    >
                      {q.text}
                    </p>

                    {/* MCQ Options — indented under the question */}
                    {q.options && q.options.length > 0 && (
                      <div className="ml-1 mt-2 space-y-1">
                        {q.options.map((opt: string, oIndex: number) => (
                          <div
                            key={oIndex}
                            className="flex gap-2 items-start text-sm md:text-base"
                            style={{ lineHeight: '1.6' }}
                          >
                            <span className="shrink-0 w-6 text-right font-medium">
                              {String.fromCharCode(97 + oIndex)}.
                            </span>
                            <span className="flex-1">{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* ── End of Paper Marker ──────────────────────────────────── */}
        <div
          className="text-center font-bold text-sm md:text-base mt-8 mb-0"
          style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}
        >
          — End of Question Paper —
        </div>

        {/* ── Answer Key ───────────────────────────────────────────── */}
        {/*
          * mt-24 → large deliberate gap so the Answer Key feels like it is
          * on a separate "page" of the document.
          * border-t separates it visually from the paper body.
          */}
        <div className="mt-10 pt-5 border-t-2 border-gray-200">
          <h2
            className="text-lg md:text-xl font-bold mb-5"
            style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}
          >
            Answer Key:
          </h2>

          <div className="space-y-4">
            {questionPaper.sections
              .flatMap((s) => s.questions)
              .map((q, qIndex) => {
                const letter = getOptionLetter(q);
                return (
                  <div key={q._id || qIndex} className="flex gap-3 items-start">
                    {/* Number */}
                    <span className="shrink-0 font-semibold text-sm md:text-base mt-0.5 w-7 text-right text-gray-800">
                      {qIndex + 1}.
                    </span>

                    {/* Answer body */}
                    <div
                      className="flex-1 min-w-0 text-sm md:text-base text-gray-700"
                      style={{ lineHeight: '1.6' }}
                    >
                      {q.correctAnswer ? (
                        <>
                          {letter && (
                            <span className="font-bold text-black">
                              {letter}.{' '}
                            </span>
                          )}
                          <span className="font-bold text-black">
                            {q.correctAnswer}
                          </span>
                          {q.explanation && (
                            <span className="text-gray-600">
                              {' '}— {q.explanation}
                            </span>
                          )}
                        </>
                      ) : q.explanation ? (
                        <span>{q.explanation}</span>
                      ) : (
                        <span className="italic text-gray-400">
                          No answer provided.
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      {/* end white paper card */}
    </div>
  );
}

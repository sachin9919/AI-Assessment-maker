import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Teacher's Toolkit — VedaAI",
  description: 'AI-assisted grading tools, lesson planning, and document parsing tools.',
};

export default function AIToolkitPage() {
  return (
    <div className="flex flex-col h-full px-6 py-8 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111] tracking-tight">AI Teacher's Toolkit</h1>
        <p className="text-sm text-[#666] mt-1">Supercharge your productivity with specialized AI utility tools.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tool 1 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#111] mb-2">Lesson Plan Generator</h3>
            <p className="text-xs text-[#555] leading-relaxed mb-4">
              Create detailed lesson plans mapped to standard school curriculums based on any subject and topic in seconds.
            </p>
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-purple-600">Coming Soon &rarr;</span>
        </div>

        {/* Tool 2 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#111] mb-2">Rubric Builder</h3>
            <p className="text-xs text-[#555] leading-relaxed mb-4">
              Generate structured grading rubrics for subjective grading assessments. Export directly as docx or PDF.
            </p>
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-orange-600">Coming Soon &rarr;</span>
        </div>

        {/* Tool 3 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#111] mb-2">Question Bank AI</h3>
            <p className="text-xs text-[#555] leading-relaxed mb-4">
              Upload textbook PDFs and extract a comprehensive library of custom multi-difficulty questions.
            </p>
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-green-600">Coming Soon &rarr;</span>
        </div>
      </div>
    </div>
  );
}

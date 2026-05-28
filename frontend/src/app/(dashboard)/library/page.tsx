import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Library — VedaAI',
  description: 'Manage and reuse your assessments, question banks, and templates.',
};

export default function LibraryPage() {
  return (
    <div className="flex flex-col h-full px-6 py-8 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111] tracking-tight">My Library</h1>
        <p className="text-sm text-[#666] mt-1">Access all your historical assessments, drafted banks, and custom templates.</p>
      </div>

      <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-white/50 p-8 text-center min-h-[300px]">
        <div className="max-w-[420px] mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#111] mb-2">Your library is currently empty</h3>
          <p className="text-sm text-[#555] leading-relaxed mb-6">
            Whenever you generate assessments, they will automatically be saved to your personal library database so you can modify, print, or share them at any time.
          </p>
          <button className="px-6 py-2.5 rounded-full border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition-colors">
            Browse Community Templates
          </button>
        </div>
      </div>
    </div>
  );
}

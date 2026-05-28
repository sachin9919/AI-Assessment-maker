import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'My Groups — VedaAI',
  description: 'Manage your classes, students, and parent groups.',
};

export default function GroupsPage() {
  return (
    <div className="flex flex-col h-full px-6 py-8 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#111] tracking-tight">My Groups</h1>
          <p className="text-sm text-[#666] mt-1">Manage your classes, student lists, and grading groups.</p>
        </div>
        <button className="self-start inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141414] text-white text-sm font-semibold hover:bg-[#2a2a2a] transition-all">
          Create Group
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-white/50 p-8 text-center min-h-[300px]">
        <div className="max-w-[420px] mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#111] mb-2">No student groups created yet</h3>
          <p className="text-sm text-[#555] leading-relaxed mb-6">
            Create groups to organize student submissions, sync assignments with classes, and track aggregated performance analytics.
          </p>
          <button className="px-6 py-2.5 rounded-full border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition-colors">
            Learn about Group Management
          </button>
        </div>
      </div>
    </div>
  );
}

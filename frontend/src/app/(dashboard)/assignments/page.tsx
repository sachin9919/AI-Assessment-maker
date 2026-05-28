import type { Metadata } from 'next';
import EmptyAssignmentsIllustration from '@/components/illustrations/EmptyAssignments';
import AssignmentsListClient from '@/components/assignments/AssignmentsListClient';
import Link from 'next/link';
import { BackArrowIcon } from '@/components/icons/NavIcons';
import type { Assignment } from '@/types';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Assignments — VedaAI',
  description: 'Create and manage your AI-powered assessments and assignments.',
};

// ─── Data Fetching ─────────────────────────────────────────────────────────────
async function getAssignments(): Promise<Assignment[]> {
  try {
    const base = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
    const token = (await cookies()).get('token')?.value;
    const res = await fetch(`${base}/api/assignments`, {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data as Assignment[]) ?? [];
  } catch {
    return [];
  }
}

// ─── Shared icon ──────────────────────────────────────────────────────────────
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <line x1="8" y1="2"  x2="8"  y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="2" y1="8"  x2="14" y2="8"  stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col h-full">
      {/* Mobile page breadcrumb header */}
      <div className="md:hidden mx-3 mt-3 bg-white rounded-[20px] px-4 py-3 flex items-center gap-2 shrink-0">
        <Link href="/" className="w-8 h-8 flex items-center justify-center text-[#555] rounded-lg hover:bg-gray-100 transition-colors no-underline">
          <BackArrowIcon />
        </Link>
        <span className="text-[15px] font-semibold text-[#111] flex-1 text-center pr-8">
          Assignments
        </span>
      </div>

      {/* Centered illustration */}
      <div className="flex-1 flex items-center justify-center px-6 pb-24 md:pb-6">
        <div className="fade-up flex flex-col items-center text-center max-width-[460px] w-full max-w-[460px]">
          <EmptyAssignmentsIllustration />

          <h1 className="text-[1.2rem] font-bold text-[#111] mt-5 mb-2.5 tracking-tight">
            No assignments yet
          </h1>
          <p className="text-[0.875rem] text-[#555] leading-relaxed max-w-[360px] mb-8">
            Create your first assignment to start collecting and grading student
            submissions. You can set up rubrics, define marking criteria, and let
            AI assist with grading.
          </p>

          {/* CTA */}
          <Link
            id="create-first-assignment-btn"
            href="/assignments/new"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-[#141414] text-white text-[0.9rem] font-semibold tracking-wide shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:bg-[#2a2a2a] hover:-translate-y-px hover:shadow-lg transition-all duration-200 no-underline"
          >
            <PlusIcon />
            Create Your First Assignment
          </Link>
        </div>
      </div>

      {/* Mobile FAB + Bottom Nav spacing
      <FloatingCreateBtn /> */}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function AssignmentsPage() {
  const assignments = await getAssignments();
  return assignments.length === 0
    ? <EmptyState />
    : <AssignmentsListClient assignments={assignments} />;
}

import { Assignment, QuestionPaper } from '@/types';
import Link from 'next/link';
import ResultContentClient from '@/components/assignments/ResultContentClient';
import { cookies } from 'next/headers';

// ─── Data Fetching (unchanged) ────────────────────────────────────────────────
async function getResult(
  id: string,
): Promise<{ assignment: Assignment; questionPaper: QuestionPaper } | null> {
  try {
    const base = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
    const token = (await cookies()).get('token')?.value;
    const res = await fetch(`${base}/api/assignments/${id}/result`, {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default async function AssignmentResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getResult(id);

  if (!data?.questionPaper) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h1 className="text-xl font-bold mb-4">
          Paper Not Found or Still Generating
        </h1>
        <Link href="/assignments" className="text-blue-600 hover:underline">
          Return to Assignments
        </Link>
      </div>
    );
  }

  const { assignment, questionPaper } = data;

  return (
    /*
     * PAGE WRAPPER
     * ───────────────────────────────────────────────────────────────────────
     * This div is a direct child of <main> (the scroll container in layout.tsx).
     * It MUST NOT have overflow-hidden or min-h-full — those would fight the
     * parent's overflow-y-auto and make padding invisible.
     *
     * Instead: `w-full p-4 md:p-6` provides the gap between the content card
     * and the edges of the scroll container.  `pb-24` keeps items clear of
     * the mobile bottom nav.
     */
    <div className="w-full p-3 md:p-4 pb-20 flex flex-col items-center">
      {/*
       * CLIENT COMPONENT
       * ─────────────────────────────────────────────────────────────────────
       * Contains the AI response message, the white question-paper card,
       * and the PDF download logic.
       */}
      <ResultContentClient
        assignment={assignment}
        questionPaper={questionPaper}
      />
      {/* end dark outer card */}
    </div>
  );
}
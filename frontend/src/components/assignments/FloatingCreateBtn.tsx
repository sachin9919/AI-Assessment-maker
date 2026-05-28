import Link from 'next/link';

function PlusIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <line x1="7.5" y1="1.5" x2="7.5" y2="13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="1.5" y1="7.5" x2="13.5" y2="7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Floating action button — two variants:
 *  Desktop: dark pill, centered in content area using CSS calc
 *  Mobile:  orange circle, fixed bottom-right above bottom nav
 */
export default function FloatingCreateBtn() {
  return (
    <>
      {/* Desktop pill */}
      <Link
        id="floating-create-assignment-btn"
        href="/assignments/new"
        className="hidden md:inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#141414] text-white text-sm font-semibold shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:bg-[#2a2a2a] hover:-translate-y-px hover:shadow-[0_8px_28px_rgba(0,0,0,0.32)] transition-all duration-200 no-underline fixed bottom-7 z-40 -translate-x-1/2"
        style={{ left: 'var(--floating-btn-desktop-left)' }}
      >
        <PlusIcon />
        Create Assignment
      </Link>

      {/* Mobile circle */}
      <Link
        href="/assignments/new"
        className="md:hidden fixed bottom-20 right-5 w-12 h-12 rounded-full bg-white text-[#f97316] flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-[#f97316]/10 hover:bg-neutral-50 transition-colors z-50 no-underline"
        aria-label="Create assignment"
      >
        <PlusIcon size={18} />
      </Link>
    </>
  );
}

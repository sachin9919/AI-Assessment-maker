import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import MobileTopBar from '@/components/layout/MobileTopBar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    redirect('/login');
  }

  return (
    /**
     * OUTER SHELL
     * ─────────────────────────────────────────────────────────────────────────
     * KEY FIXES vs. the previous version:
     *
     * 1. `overflow-hidden` REMOVED from this element.
     *    Previously it was clipping the p-6 padding on desktop, making the
     *    sidebar and navbar appear glued to the viewport edges.  The overflow
     *    is now handled individually by the scrollable <main> element.
     *
     * 2. `items-start` replaces the default `items-stretch`.
     *    `items-stretch` caused the sidebar flex child to grow to the full
     *    viewport height, defeating any attempt to add outer margins.
     *    `items-start` lets each child control its own height.
     *
     * 3. On mobile the shell is `flex-col overflow-y-auto min-h-dvh` so the
     *    page can scroll naturally on small screens.
     */
    <div
      className={[
        /* ── Shared ── */
        'bg-[#f0f2f5]',
        /* ── Mobile: vertical stack, natural scroll ── */
        'flex flex-col min-h-dvh overflow-x-hidden',
        /* ── Desktop: horizontal layout with generous padding ── */
        'md:flex-row md:items-start md:p-4 md:gap-4 md:h-screen md:overflow-hidden',
      ].join(' ')}
    >
      {/* ── Desktop Sidebar Card ────────────────────────────────────────────
          * Self-contained floating card.
          * `self-start`  — overrides stretch so it sizes to its content height.
          * `sticky top-6` — keeps it anchored at the top as main content scrolls.
          * `h-[calc(100vh-3rem)]` — fills the viewport minus the p-6 top+bottom.
          * `shrink-0` — never compressed by the flex algorithm.
          * `overflow-y-auto` — internal scrolling if nav links overflow.
          ────────────────────────────────────────────────────────────────────── */}
      <aside
        className={[
          'hidden md:flex flex-col',
          'bg-white rounded-2xl shadow-md border border-gray-100',
          'w-[260px] shrink-0',
          'h-[calc(100vh-2rem)]',
          'sticky top-0 self-start',
          'overflow-y-auto overflow-x-hidden',
        ].join(' ')}
      >
        <Sidebar />
      </aside>

      {/* ── Right column ────────────────────────────────────────────────────
          * Takes up the rest of the horizontal space.
          * On desktop it matches the sidebar height and scrolls internally.
          ────────────────────────────────────────────────────────────────────── */}
      <div
        className={[
          'flex flex-col flex-1 min-w-0',
          /* Desktop: fixed height + internal overflow so page doesn't double-scroll */
          'md:h-[calc(100vh-2rem)] md:gap-3',
        ].join(' ')}
      >
        {/* ── Mobile Top Bar ── */}
        <div className="md:hidden shrink-0">
          <MobileTopBar />
        </div>

        {/* ── Desktop TopNav Card ─────────────────────────────────────────
            * Floats as its own pill-shaped card above the content.
            * `shrink-0` prevents flex compression.
            ────────────────────────────────────────────────────────────────── */}
        <div
          className={[
            'hidden md:flex',
            'bg-white rounded-2xl shadow-md border border-gray-100',
            'h-[60px] shrink-0',
            'items-center justify-between',
            'px-5',
          ].join(' ')}
        >
          <TopNav />
        </div>

        {/* ── Scrollable content area ─────────────────────────────────────
            * `flex-1` fills remaining vertical space.
            * `overflow-y-auto` makes ONLY this region scroll on desktop.
            * `min-h-0` is required for flex children to shrink properly.
            * No extra background — the outer shell's #f0f2f5 shows through.
            ────────────────────────────────────────────────────────────────── */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto min-h-0"
        >
          {children}
        </main>

        {/* Mobile Bottom Nav — fixed position, rendered in DOM here */}
        <MobileBottomNav />
      </div>
    </div>
  );
}

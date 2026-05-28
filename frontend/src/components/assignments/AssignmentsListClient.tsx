'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import AssignmentCard from '@/components/assignments/AssignmentCard';
import FloatingCreateBtn from '@/components/assignments/FloatingCreateBtn';
import { BackArrowIcon } from '@/components/icons/NavIcons';
import type { Assignment } from '@/types';

// ─── Icons ────────────────────────────────────────────────────────────────────
function FilterIcon() {
  return (
    <svg width="15" height="12" viewBox="0 0 15 12" fill="none" aria-hidden="true">
      <path d="M0.5 1H14.5" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2.5 6H12.5" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 11H10"    stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="5"      stroke="#999" strokeWidth="1.5" />
      <path   d="M10.5 10.5L14 14"          stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────
export default function AssignmentsListClient({
  assignments,
}: {
  assignments: Assignment[];
}) {
  // ── Scroll-tracking state ───────────────────────────────────────────────────
  /*
   * We do NOT make this component its own scroll container because the parent
   * <main id="main-content"> in layout.tsx is already `overflow-y-auto`.
   * Instead we find that element on mount and attach the listener to it.
   */
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // ── Search & Filter State ───────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  type FilterOption = 'Newest' | 'Oldest' | 'A-Z';
  const [filterOption, setFilterOption] = useState<FilterOption>('Newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredAndSortedAssignments = useMemo(() => {
    let result = [...assignments];

    // Filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((a) => a.title?.toLowerCase().includes(lowerQuery));
    }

    // Sort
    result.sort((a, b) => {
      if (filterOption === 'A-Z') {
        return (a.title || '').localeCompare(b.title || '');
      } else if (filterOption === 'Oldest') {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      } else {
        // Newest (default)
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });

    return result;
  }, [assignments, searchQuery, filterOption]);

  const checkBottom = (container: HTMLElement) => {
    // Does the content actually overflow the container?
    const overflows = container.scrollHeight > container.clientHeight + 5;
    setIsOverflowing(overflows);
    // 5 px buffer for sub-pixel rounding
    const atBottom =
      container.scrollHeight - container.scrollTop <= container.clientHeight + 5;
    setIsAtBottom(atBottom);
  };

  useEffect(() => {
    // Walk up the DOM to find the nearest scrollable ancestor (main#main-content)
    const container =
      document.getElementById('main-content') ??
      sentinelRef.current?.closest('[id="main-content"]') as HTMLElement | null ??
      null;

    if (!container) return;

    const handler = () => checkBottom(container);

    // Check immediately in case the list is short and doesn't need scrolling
    handler();

    container.addEventListener('scroll', handler, { passive: true });
    return () => container.removeEventListener('scroll', handler);
  }, [filteredAndSortedAssignments]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div ref={sentinelRef} className="flex flex-col">
      {/* ── Mobile breadcrumb ─────────────────────────────────────────── */}
      <div className="md:hidden mx-3 mt-3 bg-white rounded-[20px] px-4 py-3 flex items-center gap-2 shrink-0">
        <Link
          href="/"
          className="w-8 h-8 flex items-center justify-center text-[#555] rounded-lg hover:bg-gray-100 transition-colors no-underline"
        >
          <BackArrowIcon />
        </Link>
        <span className="text-[15px] font-semibold text-[#111] flex-1 text-center pr-8">
          Assignments
        </span>
      </div>

      {/* ── Content area ──────────────────────────────────────────────── */}
      <div className="p-4 md:p-5 flex flex-col gap-4 pb-28 md:pb-24 flex-1">

        {/* Desktop page header */}
        <div className="hidden md:block">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0"
              style={{ boxShadow: '0 0 0 3px rgba(34,197,94,0.18)' }}
              aria-hidden="true"
            />
            <h1 className="text-[1.25rem] font-bold text-[#111]">Assignments</h1>
          </div>
          <p className="text-[0.825rem] text-[#777] mt-0.5 ml-[18px]">
            Manage and create assignments for your classes.
          </p>
        </div>

        {/* ── Filter + Search bar ────────────────────────────────────── */}
        {/*
         * LAYOUT FIX:
         *  - `justify-between` pushes the filter to the left and the
         *    search wrapper (with `ml-auto`) entirely to the right.
         *  - The search bar is `w-64` (not flex-1) so it doesn't stretch.
         *  - Filter button has no border classes.
         *  - Search input wrapper is bg-white with a thin black border.
         */}
        <div className="bg-white rounded-[20px] px-4 py-3 flex items-center justify-between gap-3">

          {/* Filter dropdown container */}
          <div className="relative">
            <button
              id="filter-by-btn"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[0.85rem] font-medium text-[#555] hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <FilterIcon />
              <span className="hidden sm:inline">
                {filterOption === 'Newest' ? 'Filter By' : filterOption}
              </span>
              <span className="sm:hidden">Filter</span>
            </button>

            {isFilterOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsFilterOpen(false)}
                />
                <div className="absolute left-0 top-full mt-2 w-32 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 z-20 py-1 overflow-hidden">
                  {(['Newest', 'Oldest', 'A-Z'] as FilterOption[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setFilterOption(opt);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-[0.85rem] hover:bg-gray-50 transition-colors ${
                        filterOption === opt ? 'text-[#111] font-semibold bg-gray-50/50' : 'text-[#555]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Search — w-72, white bg, soft grey border */}
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-300 w-72 focus-within:border-gray-400 transition-colors">
            <SearchIcon />
            <input
              id="search-assignments-input"
              type="search"
              placeholder="Search Assignment"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[0.85rem] text-[#333] placeholder:text-[#bbb] min-w-0"
            />
          </div>
        </div>


        {/* ── Assignments grid ───────────────────────────────────────── */}
        {/*
         * `relative` is required so the gradient overlay can be positioned
         * absolutely within the grid bounds.
         */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          {filteredAndSortedAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment._id ?? assignment.title}
              assignment={assignment}
            />
          ))}

          {/*
           * GLASSY BLUR OVERLAY
           * ─────────────────────────────────────────────────────────────
           * Visibility rules:
           *   1. isOverflowing — content is tall enough to scroll (gate).
           *   2. !isAtBottom   — user hasn't reached the end yet.
           * Both must be true for the overlay to show.
           *
           * Visuals: backdrop-blur-sm creates the "frosted glass" blur;
           * the gradient fades from white/90 at bottom to transparent.
           * pointer-events-none ensures the button beneath stays clickable.
           */}
          {filteredAndSortedAssignments.length > 4 && (
            <div
              className={[
                'absolute bottom-0 left-0 right-0 h-32',
                'pointer-events-none col-span-full',
                'backdrop-blur-sm',
                'bg-gradient-to-t from-white/90 to-transparent',
                'transition-opacity duration-300',
                isOverflowing && !isAtBottom ? 'opacity-100' : 'opacity-0',
              ].join(' ')}
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      {/* ── Floating Create button ─────────────────────────────────────── */}
      {/*
       * The button itself is ALWAYS fully visible and clickable.
       * Only the background gradient behind it fades — not the button.
       */}
      <FloatingCreateBtn />
    </div>
  );
}

// Server Component — no client interactions needed
import Link from 'next/link';
import { BellIcon } from '@/components/icons/NavIcons';
import { VedaAILogo } from '@/components/layout/Sidebar';

function HamburgerIcon() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
      <path d="M0 1H20" stroke="#303030" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M0 7H20" stroke="#303030" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M0 13H20" stroke="#303030" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function MobileTopBar() {
  return (
    <div className="mx-3 mt-3 bg-white rounded-[20px] px-4 py-3.5 flex items-center justify-between shrink-0">
      {/* Logo + Name */}
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <VedaAILogo />
        <span className="text-[16px] font-bold text-[#111] tracking-tight">VedaAI</span>
      </Link>

      {/* Right icons */}
      <div className="flex items-center gap-3">
        {/* Bell */}
        <button className="relative w-9 h-9 flex items-center justify-center" aria-label="Notifications">
          <BellIcon size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-[1.5px] border-white" aria-label="1 new notification" />
        </button>

        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
          JD
        </div>

        {/* Hamburger */}
        <button className="flex items-center justify-center" aria-label="Open menu">
          <HamburgerIcon />
        </button>
      </div>
    </div>
  );
}

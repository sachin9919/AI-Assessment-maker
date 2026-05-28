'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon, GroupsIcon, AssignmentsIcon,
  ToolkitIcon, LibraryIcon, SettingsIcon,
} from '@/components/icons/NavIcons';

// ─── VedaAI Logo ──────────────────────────────────────────────────────────────
export function VedaAILogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="VedaAI Logo">
      <rect width="40" height="40" rx="10" fill="#303030" />
      <path fillRule="evenodd" clipRule="evenodd" d="M22.7271 28.3583C22.7271 28.3583 23.4545 30.3003 24.1212 30.4218H15.6969C13.9998 30.4218 12.485 29.4508 11.9997 27.6299L7.09074 13.0637C7.09074 13.0637 6.66669 11.3035 6 11.0001H14.6062C16.3033 11.0609 17.4548 11.6677 18.1215 13.9136L22.7271 28.3583Z" fill="white" />
      <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M22.7271 28.3583C22.7271 28.3583 23.4545 30.3003 24.1212 30.4218H15.6969C13.9998 30.4218 12.485 29.4508 11.9997 27.6299L7.09074 13.0637C7.09074 13.0637 6.66669 11.3035 6 11.0001H14.6062C16.3033 11.0609 17.4548 11.6677 18.1215 13.9136L22.7271 28.3583Z" fill="url(#sb_grad)" />
      <path fillRule="evenodd" clipRule="evenodd" d="M17.3336 28.3585C17.3336 28.3585 16.6061 30.3005 15.9395 30.4221H24.3638C26.0609 30.4221 27.5756 29.4511 28.0609 27.6302L32.9096 13.0643C32.9096 13.0643 33.3336 11.3042 34.0003 11.0008H25.4545C23.7574 11.0008 22.6666 11.6076 22 13.8535L17.3336 28.3585Z" fill="white" />
      <defs>
        <linearGradient id="sb_grad" x1="15.0606" y1="9.34907" x2="15.0606" y2="32.1338" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.33" stopColor="white" stopOpacity="0" />
          <stop offset="0.76" stopColor="#0E1513" />
          <stop offset="1" stopColor="#0E1513" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Sparkle Icon ─────────────────────────────────────────────────────────────
function SparkleIcon() {
  return (
    <svg width="19" height="18" viewBox="0 0 19 18" fill="none" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M4.63783 8.63783L6.18377 4H7.13246L8.6784 8.63783L13.3162 10.1838V11.1325L8.6784 12.6784L7.13246 17.3162H6.18377L4.63783 12.6784L0 11.1325V10.1838L4.63783 8.63783Z" fill="white" />
      <path fillRule="evenodd" clipRule="evenodd" d="M13.3878 2.38783L14.1838 0H15.1325L15.9284 2.38783L18.3162 3.18377V4.13246L15.9284 4.9284L15.1325 7.31623H14.1838L13.3878 4.9284L11 4.13246V3.18377L13.3878 2.38783Z" fill="white" />
    </svg>
  );
}

// ─── School Avatar ────────────────────────────────────────────────────────────
function SchoolAvatar() {
  return (
    <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shrink-0 text-[13px] font-bold text-white tracking-tight">
      DS
    </div>
  );
}

// ─── Nav Items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { href: '/',             label: 'Home',                 Icon: HomeIcon },
  { href: '/groups',       label: 'My Groups',            Icon: GroupsIcon },
  { href: '/assignments',  label: 'Assignments',          Icon: AssignmentsIcon },
  { href: '/ai-toolkit',  label: "AI Teacher's Toolkit",  Icon: ToolkitIcon },
  { href: '/library',     label: 'My Library',            Icon: LibraryIcon },
];

// ─── Sidebar Content (card shell is provided by the layout) ──────────────────
export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <div className="flex flex-col h-full p-6">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-1 py-4 border-b border-[#e8e8e8] mb-8">
        <VedaAILogo />
        <span className="text-[17px] font-bold text-[#111] tracking-tight">VedaAI</span>
      </div>

      {/* Create Assignment */}
      <Link href="/assignments/new" className="btn-create mb-8">
        <SparkleIcon />
        <span className="whitespace-nowrap">Create Assignment</span>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link key={href} href={href} className={`nav-link${active ? ' active' : ''}`}>
              <Icon active={active} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Settings + Profile */}
      <div className="pb-4 flex flex-col gap-4 mt-8">
        <Link href="/settings" className={`nav-link${pathname === '/settings' ? ' active' : ''}`}>
          <SettingsIcon active={pathname === '/settings'} />
          Settings
        </Link>

        <div className="profile-card">
          <SchoolAvatar />
          <div className="overflow-hidden">
            <p className="text-[13px] font-bold text-[#111] truncate">Delhi Public School</p>
            <p className="text-[11.5px] text-[#999] mt-px truncate">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </div>
  );
}

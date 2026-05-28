'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  BellIcon, AssignmentsIcon, ChevronDownIcon,
  GroupsIcon, ToolkitIcon, LibraryIcon, SettingsIcon,
} from '@/components/icons/NavIcons';
import { ArrowLeft } from 'lucide-react';
import { clearStoredToken, getAuthHeaders } from '@/lib/auth';

// ─── Icons ────────────────────────────────────────────────────────────────────

/** Sparkle / "AI create" icon — shown on the result page title. */
function SparkleIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 19 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.63783 8.63783L6.18377 4H7.13246L8.6784 8.63783L13.3162 10.1838V11.1325L8.6784 12.6784L7.13246 17.3162H6.18377L4.63783 12.6784L0 11.1325V10.1838L4.63783 8.63783Z"
        fill="#888"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.3878 2.38783L14.1838 0H15.1325L15.9284 2.38783L18.3162 3.18377V4.13246L15.9284 4.9284L15.1325 7.31623H14.1838L13.3878 4.9284L11 4.13246V3.18377L13.3878 2.38783Z"
        fill="#888"
      />
    </svg>
  );
}

/** Circular user avatar — amber-to-orange gradient with initials. */
function UserAvatar() {
  const initials = 'VD';
  return (
    <div className="w-[30px] h-[30px] rounded-full overflow-hidden border border-[#e0e0e0] shrink-0 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-[11px] font-bold">
      {initials}
    </div>
  );
}

// ─── Route → NavTitle mapping ─────────────────────────────────────────────────
/**
 * Returns { icon, label } for the breadcrumb shown next to the back button.
 *
 * Rules (from spec):
 *  /assignments               → AssignmentsIcon  + "Assignments"
 *  /assignments/new           → no icon           + "Assignments"
 *  /assignments/[id]/result   → SparkleIcon       + "Create New"
 *  everything else            → SparkleIcon       + "Create New"  (safe default)
 */
function useNavTitle(): { icon: React.ReactNode; label: string } {
  const pathname = usePathname();

  // Exact match: the /assignments list page
  if (pathname === '/assignments') {
    return {
      icon: <AssignmentsIcon size={16} />,
      label: 'Assignments',
    };
  }

  // /assignments/new — create flow, no icon per spec
  if (pathname === '/assignments/new') {
    return { icon: null, label: 'Assignments' };
  }

  // My Groups
  if (pathname === '/groups') {
    return {
      icon: <GroupsIcon size={16} />,
      label: 'My Groups',
    };
  }

  // AI Teacher's Toolkit
  if (pathname === '/ai-toolkit') {
    return {
      icon: <ToolkitIcon size={16} />,
      label: "AI Teacher's Toolkit",
    };
  }

  // My Library
  if (pathname === '/library') {
    return {
      icon: <LibraryIcon size={16} />,
      label: 'My Library',
    };
  }

  // Settings
  if (pathname === '/settings') {
    return {
      icon: <SettingsIcon size={16} />,
      label: 'Settings',
    };
  }

  // /assignments/[id]/result
  if (pathname.startsWith('/assignments/') && pathname.endsWith('/result')) {
    return { icon: <SparkleIcon />, label: 'Create New' };
  }

  // Default: sparkle + "Create New" for any other route
  return { icon: <SparkleIcon />, label: 'Create New' };
}

// ─── TopNav ───────────────────────────────────────────────────────────────────
export default function TopNav() {
  const router = useRouter();
  const { icon, label } = useNavTitle();
  const [userName, setUserName] = useState('Teacher');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
    fetch(`${backendUrl}/api/auth/me`, {
      credentials: 'include',
      headers: {
        ...getAuthHeaders(),
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?.name) {
          setUserName(data.user.name);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onMouse = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouse);
    return () => document.removeEventListener('mousedown', onMouse);
  }, [menuOpen]);

  const handleLogout = async () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
    try {
      await fetch(`${backendUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...getAuthHeaders(),
        },
      });
    } catch {
      // Logout should proceed client-side regardless of backend response.
    }
    clearStoredToken();
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      {/* ── Left: back arrow + dynamic title ────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Back button — standard left-arrow, always shown */}
        <button
          id="topnav-back-btn"
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0 text-[#444]"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Dynamic breadcrumb: icon (if any) + label */}
        <div className="flex items-center gap-1.5 text-[#555]">
          {icon}
          <span className="text-[13.5px] font-medium text-[#555]">{label}</span>
        </div>
      </div>

      {/* ── Right: bell + user menu ──────────────────────────────────────── */}
      <div className="flex items-center gap-3">

        {/* Bell notification button */}
        <button
          id="topnav-bell-btn"
          className="w-9 h-9 rounded-full bg-[#f5f5f5] flex items-center justify-center hover:bg-gray-200 transition-colors relative"
          aria-label="Notifications"
        >
          <BellIcon size={20} />
          <span
            aria-label="1 new notification"
            className="absolute top-[9px] right-[9px] w-[7px] h-[7px] rounded-full bg-red-500 border-[1.5px] border-white"
          />
        </button>

        {/* User dropdown trigger */}
        <div ref={menuRef} className="relative">
          <button
            id="topnav-user-menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 px-2.5 py-1.5 pr-2 rounded-xl hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
            aria-label="User menu"
          >
            <UserAvatar />
            <span className="text-[13px] font-semibold text-[#111]">{userName}</span>
            <ChevronDownIcon size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 shadow-md rounded-xl p-1 z-40">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
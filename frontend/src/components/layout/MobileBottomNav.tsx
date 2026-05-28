'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, AssignmentsIcon, LibraryIcon, ToolkitIcon } from '@/components/icons/NavIcons';

const ITEMS = [
  { href: '/',             label: 'Home',        Icon: HomeIcon },
  { href: '/assignments',  label: 'Assignments',  Icon: AssignmentsIcon },
  { href: '/library',      label: 'Library',      Icon: LibraryIcon },
  { href: '/ai-toolkit',  label: 'AI Toolkit',   Icon: ToolkitIcon },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-3 left-3 right-3 bg-[#1a1a1a] rounded-[22px] flex justify-around items-center py-3 px-2 z-50"
      aria-label="Mobile navigation"
    >
      {ITEMS.map(({ href, label, Icon }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-[3px] no-underline w-16"
            aria-current={active ? 'page' : undefined}
          >
            {/* CSS filter inverts the dark SVG colors to white/gray for dark bg */}
            <span style={{ filter: active ? 'brightness(0) invert(1)' : 'brightness(0) invert(0.5)' }}>
              <Icon size={22} />
            </span>
            <span className={`text-[9.5px] font-medium ${active ? 'text-white' : 'text-[#777]'}`}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

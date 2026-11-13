'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarRange,
  Compass,
  MapPinned,
  MessageSquareText,
  UserRound,
} from 'lucide-react';

const navItems = [
  { id: 'explore', label: 'Explore', href: '/explore', icon: Compass },
  { id: 'map', label: 'Map', href: '/map', icon: MapPinned },
  { id: 'bookings', label: 'Bookings', href: '/bookings', icon: CalendarRange },
  { id: 'chat', label: 'Chat', href: '/chat', icon: MessageSquareText },
  { id: 'profile', label: 'Profile', href: '/profile', icon: UserRound },
] as const;

export function MobileShell({
  children,
  activeTab,
  onTabChange,
}: {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}) {
  const pathname = usePathname();
  const currentTab = activeTab ?? navItems.find((item) => pathname === item.href)?.id ?? 'explore';

  return (
    <div className="min-h-dvh bg-[#fffaf5] text-slate-900">
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-[#fffaf5] shadow-[0_0_0_1px_rgba(148,163,184,0.2)]">
        <main className="flex-1 overflow-x-hidden">{children}</main>

        <nav className="sticky bottom-0 z-30 border-t border-slate-200/80 bg-white/85 backdrop-blur-xl safe-bottom">
          <div className="grid grid-cols-5 gap-1 px-3 pb-2 pt-2">
            {navItems.map((item) => {
              const isActive = item.id === currentTab;
              const Icon = item.icon;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-label={item.label}
                  onClick={() => onTabChange?.(item.id)}
                  className={`relative flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1 text-[11px] font-medium transition-all ${
                    isActive ? 'bg-orange-50 text-orange-600' : 'text-slate-500'
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center">
                    <Icon className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
                  </span>
                  <span>{item.label}</span>
                  {item.id === 'chat' || item.id === 'bookings' ? (
                    <span className="absolute right-3 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {item.id === 'chat' ? '3' : '2'}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

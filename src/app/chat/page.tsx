'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { MessageSquareText, PhoneCall, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { MobileShell } from '@/components/mobile-shell';
import { getIncomingBookings, getMyBookings, type BookingRecord } from '@/lib/supabase/bookings';

export default function ChatPage() {
  const [confirmedBookings, setConfirmedBookings] = useState<BookingRecord[]>([]);

  useEffect(() => {
    let active = true;

    async function loadConfirmedChats() {
      try {
        const [myBookings, hostBookings] = await Promise.all([getMyBookings(), getIncomingBookings()]);

        if (!active) {
          return;
        }

        const combined = [...myBookings, ...hostBookings].filter((booking) => booking.status === 'confirmed');
        setConfirmedBookings(
          combined.sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime()),
        );
      } catch (error) {
        console.error('Failed to load confirmed conversations', error);
        if (active) {
          setConfirmedBookings([]);
        }
      }
    }

    void loadConfirmedChats();

    return () => {
      active = false;
    };
  }, []);

  const chats = useMemo(
    () =>
      confirmedBookings.map((booking) => {
        const partner = booking.host?.full_name ?? booking.booker?.full_name ?? 'Confirmed booking';
        const preview = `Plan confirmed for ${new Date(booking.starts_at).toLocaleString([], {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })}`;

        return {
          id: booking.id,
          name: partner,
          preview,
          time: new Date(booking.starts_at).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          unread: 0,
          href: `/bookings/${booking.id}` as Route,
        };
      }),
    [confirmedBookings],
  );

  return (
    <MobileShell>
      <div className="w-full px-4 pb-8 pt-5">
        <header className="flex items-center justify-between pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Chat</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Messages</h1>
          </div>
          <button type="button" aria-label="Search chats" className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-soft">
            <Search className="h-5 w-5 text-slate-700" aria-hidden="true" />
          </button>
        </header>

        <div className="space-y-3">
          {chats.length > 0 ? (
            chats.map((chat) => (
              <Link key={chat.id} href={chat.href} className="flex items-center gap-3 rounded-[28px] bg-white p-3 shadow-soft ring-1 ring-slate-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                  {chat.name.split(' ')[0][0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-base font-semibold text-slate-900">{chat.name}</p>
                    <span className="text-[11px] text-slate-400">{chat.time}</span>
                  </div>
                  <p className="mt-1 truncate text-sm text-slate-500">{chat.preview}</p>
                </div>
                {chat.unread > 0 ? (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {chat.unread}
                  </span>
                ) : (
                  <PhoneCall className="h-4 w-4 text-slate-400" aria-hidden="true" />
                )}
              </Link>
            ))
          ) : (
            <div className="rounded-[28px] bg-white p-4 text-sm text-slate-600 shadow-soft ring-1 ring-slate-100">
              No confirmed booking conversations yet. Once a booking is confirmed, the chat entry will appear here.
            </div>
          )}
        </div>

        <div className="mt-6 rounded-[28px] bg-slate-900 p-4 text-white shadow-soft">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500/20 text-orange-200">
              <MessageSquareText className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold">New conversation</p>
              <p className="text-xs text-slate-300">Start chatting with nearby hosts</p>
            </div>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

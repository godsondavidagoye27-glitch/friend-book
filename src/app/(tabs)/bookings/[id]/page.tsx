'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CalendarCheck2, Check, Clock3, MapPin, MessageSquareText, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getBookingById, type BookingRecord } from '@/lib/supabase/bookings';

function BookingStatusPill({ status }: { status: string }) {
  const meta = {
    requested: { label: 'Pending', classes: 'bg-amber-100 text-amber-700' },
    accepted: { label: 'Accepted', classes: 'bg-emerald-100 text-emerald-700' },
    confirmed: { label: 'Confirmed', classes: 'bg-sky-100 text-sky-700' },
    declined: { label: 'Declined', classes: 'bg-rose-100 text-rose-700' },
    cancelled: { label: 'Cancelled', classes: 'bg-slate-200 text-slate-700' },
    completed: { label: 'Completed', classes: 'bg-violet-100 text-violet-700' },
  }[status] ?? { label: status, classes: 'bg-slate-100 text-slate-700' };

  return <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${meta.classes}`}>{meta.label}</span>;
}

function LifecycleTrack({ status }: { status: string }) {
  const steps = ['requested', 'accepted', 'confirmed'];
  const activeIndex = steps.includes(status) ? steps.indexOf(status) : 0;

  return (
    <div className="mt-4 flex items-center gap-2">
      {steps.map((step, index) => {
        const isActive = index <= activeIndex;
        const isCurrent = step === status;

        return (
          <div key={step} className="flex flex-1 items-center gap-2">
            <div
              className={`h-2.5 flex-1 rounded-full ${
                isActive ? (step === 'confirmed' ? 'bg-sky-400' : step === 'accepted' ? 'bg-emerald-400' : 'bg-amber-400') : 'bg-slate-200'
              } ${isCurrent ? 'ring-2 ring-slate-200' : ''}`}
            />
            {index < steps.length - 1 ? <span className="h-px flex-1 bg-slate-200" /> : null}
          </div>
        );
      })}
    </div>
  );
}

export default function BookingDetailPage() {
  const params = useParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) {
      setLoading(false);
      return;
    }

    let active = true;

    async function loadBooking() {
      try {
        const data = await getBookingById(params.id);

        if (active) {
          setBooking(data);
        }
      } catch (error) {
        console.error('Failed to load booking details', error);
        if (active) {
          setBooking(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadBooking();

    return () => {
      active = false;
    };
  }, [params?.id]);

  if (loading) {
    return (
      <div className="w-full px-4 pb-8 pt-5">
        <div className="rounded-[28px] bg-white p-6 text-center shadow-soft ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">Loading booking details…</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="w-full px-4 pb-8 pt-5">
        <Link href="/bookings" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to bookings
        </Link>
        <div className="mt-4 rounded-[28px] bg-white p-6 shadow-soft ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">This booking could not be found.</p>
        </div>
      </div>
    );
  }

  const isConfirmed = booking.status === 'confirmed';
  const counterpartName = booking.host?.full_name ?? booking.booker?.full_name ?? 'Confirmed guest';

  return (
    <div className="w-full px-4 pb-8 pt-5">
      <Link href="/bookings" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to bookings
      </Link>

      <div className="mt-4 rounded-[32px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Booking detail</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{counterpartName}</h1>
          </div>
          <BookingStatusPill status={booking.status} />
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>{booking.duration_hours} hours</span>
          <span>{booking.place_name}</span>
        </div>

        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <CalendarCheck2 className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <span>{new Date(booking.starts_at).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <span>{booking.place_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <span>{booking.host?.city ?? booking.booker?.city ?? 'Local area'}</span>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-slate-50 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Lifecycle</p>
          <LifecycleTrack status={booking.status} />
          <p className="mt-2 text-xs text-slate-500">
            {booking.status === 'requested' && 'Waiting for host review.'}
            {booking.status === 'accepted' && 'Accepted and ready to be confirmed.'}
            {booking.status === 'confirmed' && 'Confirmed and ready for the meet-up conversation.'}
          </p>
        </div>

        {booking.notes ? (
          <div className="mt-5 rounded-2xl bg-orange-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-600">Notes</p>
            <p className="mt-2 text-sm text-slate-700">{booking.notes}</p>
          </div>
        ) : null}

        {isConfirmed ? (
          <div className="mt-5 rounded-[28px] bg-sky-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                <MessageSquareText className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Conversation ready</p>
                <p className="text-xs text-slate-600">Chat is available now that this booking has been confirmed.</p>
              </div>
            </div>

            <Link href="/chat" className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-4 py-3 text-sm font-semibold text-white">
              <Check className="h-4 w-4" aria-hidden="true" />
              Open chat
            </Link>
          </div>
        ) : (
          <div className="mt-5 rounded-[28px] bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                <X className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Chat not available yet</p>
                <p className="text-xs text-slate-600">A conversation unlocks once the booking is confirmed.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

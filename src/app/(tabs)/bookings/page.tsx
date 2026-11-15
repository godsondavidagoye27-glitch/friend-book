'use client';

import Link from 'next/link';
import { CalendarCheck2, Check, Clock3, MapPin, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { confirmBooking, getIncomingBookings, getMyBookings, respondToBooking, type BookingRecord } from '@/lib/supabase/bookings';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [incomingBookings, setIncomingBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const pendingBookings = useMemo(() => bookings.filter((booking) => booking.status === 'requested'), [bookings]);
  const acceptedBookings = useMemo(() => bookings.filter((booking) => booking.status === 'accepted'), [bookings]);
  const confirmedBookings = useMemo(() => bookings.filter((booking) => booking.status === 'confirmed'), [bookings]);
  const incomingPending = useMemo(() => incomingBookings.filter((booking) => booking.status === 'requested'), [incomingBookings]);

  useEffect(() => {
    let active = true;

    async function loadBookings() {
      try {
        const [myBookings, hostBookings] = await Promise.all([getMyBookings(), getIncomingBookings()]);
        if (active) {
          setBookings(myBookings);
          setIncomingBookings(hostBookings);
        }
      } catch (error) {
        console.error('Failed to load bookings', error);
        if (active) {
          setBookings([]);
          setIncomingBookings([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadBookings();

    return () => {
      active = false;
    };
  }, []);

  const updateBookingStatus = (bookingId: string, nextStatus: string) => {
    setBookings((current) => current.map((booking) => (booking.id === bookingId ? { ...booking, status: nextStatus } : booking)));
    setIncomingBookings((current) =>
      current.map((booking) => (booking.id === bookingId ? { ...booking, status: nextStatus } : booking)),
    );
  };

  const handleRespond = async (bookingId: string, action: 'accept' | 'decline') => {
    setRespondingId(bookingId);
    setActionError(null);

    try {
      await respondToBooking(bookingId, action);
      updateBookingStatus(bookingId, action === 'accept' ? 'accepted' : 'declined');
      if (selectedBookingId === bookingId) {
        setSelectedBookingId(null);
      }
    } catch (error) {
      console.error('Failed to update booking', error);
      setActionError(error instanceof Error ? error.message : 'Unable to update this booking.');
    } finally {
      setRespondingId(null);
    }
  };

  const handleConfirm = async (bookingId: string) => {
    setRespondingId(bookingId);
    setActionError(null);

    try {
      await confirmBooking(bookingId);
      updateBookingStatus(bookingId, 'confirmed');
      if (selectedBookingId === bookingId) {
        setSelectedBookingId(null);
      }
    } catch (error) {
      console.error('Failed to confirm booking', error);
      setActionError(error instanceof Error ? error.message : 'Unable to confirm this booking.');
    } finally {
      setRespondingId(null);
    }
  };

  const selectedBooking =
    bookings.find((booking) => booking.id === selectedBookingId) ??
    incomingBookings.find((booking) => booking.id === selectedBookingId) ??
    null;

  return (
    <div className="w-full px-4 pb-8 pt-5">
      <header className="pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Bookings</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Your schedule</h1>
      </header>

      {actionError ? (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      ) : null}

      {selectedBooking ? (
        <BookingDetailSheet
          booking={selectedBooking}
          onClose={() => setSelectedBookingId(null)}
          onAccept={() => void handleRespond(selectedBooking.id, 'accept')}
          onDecline={() => void handleRespond(selectedBooking.id, 'decline')}
          onConfirm={() => void handleConfirm(selectedBooking.id)}
          responding={respondingId === selectedBooking.id}
        />
      ) : null}

      {loading ? (
        <div className="rounded-[28px] bg-white p-6 text-center shadow-soft ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">Loading your bookings…</p>
        </div>
      ) : (
        <div className="space-y-5">
          {incomingBookings.length > 0 ? (
            <section className="rounded-[28px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Incoming requests</h2>
                <span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-orange-600">
                  {incomingPending.length} pending
                </span>
              </div>

              <div className="space-y-3">
                {incomingPending.length === 0 ? (
                  <p className="text-sm text-slate-500">No pending requests right now.</p>
                ) : (
                  incomingPending.map((booking) => (
                    <BookingRequestCard
                      key={booking.id}
                      booking={booking}
                      responding={respondingId === booking.id}
                      onAccept={() => void handleRespond(booking.id, 'accept')}
                      onDecline={() => void handleRespond(booking.id, 'decline')}
                    />
                  ))
                )}
              </div>
            </section>
          ) : null}

          <section className="rounded-[28px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Your requests</h2>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                {pendingBookings.length + acceptedBookings.length + confirmedBookings.length} active
              </span>
            </div>

            {bookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                <h3 className="text-base font-bold text-slate-900">No bookings yet</h3>
                <p className="mt-2 text-sm text-slate-500">Bookings will appear here once you request a time with a host.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingBookings.length > 0 ? (
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Pending</p>
                    <div className="space-y-3">
                      {pendingBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} onSelect={() => setSelectedBookingId(booking.id)} />
                      ))}
                    </div>
                  </div>
                ) : null}

                {acceptedBookings.length > 0 ? (
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Accepted</p>
                    <div className="space-y-3">
                      {acceptedBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} onSelect={() => setSelectedBookingId(booking.id)} />
                      ))}
                    </div>
                  </div>
                ) : null}

                {confirmedBookings.length > 0 ? (
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Confirmed</p>
                    <div className="space-y-3">
                      {confirmedBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} onSelect={() => setSelectedBookingId(booking.id)} />
                      ))}
                    </div>
                  </div>
                ) : null}

                {pendingBookings.length === 0 && acceptedBookings.length === 0 && confirmedBookings.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                    <p className="text-sm text-slate-500">There are no pending, accepted, or confirmed bookings right now.</p>
                  </div>
                ) : null}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

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
    <div className="mt-3 flex items-center gap-2">
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

function BookingRequestCard({
  booking,
  responding,
  onAccept,
  onDecline,
}: {
  booking: BookingRecord;
  responding: boolean;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Request</p>
          <h3 className="mt-1 text-base font-bold text-slate-900">{booking.booker?.full_name ?? 'Guest'}</h3>
        </div>
        <BookingStatusPill status={booking.status} />
      </div>

      <div className="mt-3 space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <CalendarCheck2 className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <span>{new Date(booking.starts_at).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <span>{booking.place_name}</span>
        </div>
      </div>

      <LifecycleTrack status={booking.status} />

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {booking.status === 'confirmed' ? 'Ready to chat' : 'Review status'}
        </span>
        <Link href={`/bookings/${booking.id}`} className="text-xs font-semibold text-sky-600">
          View details
        </Link>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onAccept}
          disabled={responding}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-500 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          <Check className="h-4 w-4" aria-hidden="true" />
          {responding ? 'Accepting...' : 'Accept'}
        </button>
        <button
          type="button"
          onClick={onDecline}
          disabled={responding}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Decline
        </button>
      </div>
    </article>
  );
}

function BookingCard({ booking, onSelect }: { booking: BookingRecord; onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-slate-300 hover:bg-slate-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{booking.status === 'confirmed' ? 'Confirmed booking' : 'Booking'}</p>
          <h3 className="mt-1 text-base font-bold text-slate-900">{booking.host?.full_name ?? 'Amiora host'}</h3>
        </div>
        <div className="flex items-center gap-2">
          <BookingStatusPill status={booking.status} />
          <span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-orange-600">
            {booking.duration_hours}h
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-2 text-sm text-slate-600">
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
          <span>{booking.host?.city ?? 'Local area'}</span>
        </div>
      </div>

      <LifecycleTrack status={booking.status} />
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          {booking.status === 'requested' && 'Waiting for host review'}
          {booking.status === 'accepted' && 'Accepted and ready to be confirmed'}
          {booking.status === 'confirmed' && 'Confirmed and scheduled'}
        </p>
        <Link href={`/bookings/${booking.id}`} className="text-xs font-semibold text-sky-600">
          Open
        </Link>
      </div>
    </button>
  );
}

function BookingDetailSheet({
  booking,
  onClose,
  onAccept,
  onDecline,
  onConfirm,
  responding,
}: {
  booking: BookingRecord;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
  onConfirm: () => void;
  responding: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40">
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[430px] rounded-t-[32px] bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-20px_50px_rgba(15,23,42,0.18)]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Booking detail</p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">{booking.host?.full_name ?? 'Amiora host'}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600"
            aria-label="Close booking details"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <BookingStatusPill status={booking.status} />
          <span className="text-sm font-medium text-slate-500">{booking.duration_hours} hours</span>
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
            <span>{booking.host?.city ?? 'Local area'}</span>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Lifecycle</p>
          <LifecycleTrack status={booking.status} />
          <p className="mt-2 text-xs text-slate-500">
            {booking.status === 'requested' && 'This request is awaiting host review.'}
            {booking.status === 'accepted' && 'This booking is accepted and can be finalized.'}
            {booking.status === 'confirmed' && 'This booking is confirmed and scheduled.'}
          </p>
        </div>

        <div className="mt-4 space-y-2">
          {booking.status === 'requested' ? (
            <>
              <button type="button" onClick={onAccept} disabled={responding} className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">
                <Check className="h-4 w-4" aria-hidden="true" />
                {responding ? 'Accepting...' : 'Accept request'}
              </button>
              <button type="button" onClick={onDecline} disabled={responding} className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 disabled:opacity-60">
                <X className="h-4 w-4" aria-hidden="true" />
                Decline request
              </button>
            </>
          ) : null}

          {booking.status === 'accepted' ? (
            <button type="button" onClick={onConfirm} disabled={responding} className="flex w-full items-center justify-center gap-2 rounded-full bg-sky-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">
              <Check className="h-4 w-4" aria-hidden="true" />
              {responding ? 'Confirming...' : 'Confirm booking'}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

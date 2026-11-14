'use client';

import { useSearchParams } from 'next/navigation';
import { CalendarCheck2, Clock3, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createBookingFromCheckout, getStoredBookings, saveStoredBooking, type BookingRecord } from '@/lib/bookings';

const defaultBookings: BookingRecord[] = [
  { id: 'placeholder-1', title: 'Walk + coffee', host: 'Maya Lee', time: 'Today • 6:30 PM', status: 'Confirmed', place: 'Café Luna', createdAt: new Date().toISOString(), total: 32 },
  { id: 'placeholder-2', title: 'Football match', host: 'Daniel Cruz', time: 'Thu • 7:00 PM', status: 'Requested', place: 'Riverside Park', createdAt: new Date().toISOString(), total: 42 },
];

export default function BookingsPage() {
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<BookingRecord[]>(defaultBookings);

  useEffect(() => {
    const stored = getStoredBookings();
    if (stored.length > 0) {
      setBookings(stored);
    }

    const checkout = searchParams.get('checkout');
    if (checkout !== 'success') {
      return;
    }

    const bookingId = searchParams.get('booking_id') ?? `checkout_${Date.now()}`;
    const hostName = searchParams.get('hostName') ?? 'FriendBook host';
    const date = searchParams.get('date') ?? 'Today';
    const time = searchParams.get('time') ?? '6:30 PM';
    const duration = Number(searchParams.get('duration') ?? '2');
    const place = searchParams.get('place') ?? 'Café Luna';
    const total = Number(searchParams.get('total') ?? '0');

    const booking = createBookingFromCheckout({
      bookingId,
      hostName,
      total,
      date,
      time,
      duration,
      place,
    });

    setBookings((current) => {
      const next = [booking, ...current.filter((entry) => entry.id !== booking.id)];
      saveStoredBooking(booking);
      return next;
    });
  }, [searchParams]);

  return (
    <div className="w-full px-4 pb-8 pt-5">
      <header className="pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Bookings</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Your schedule</h1>
      </header>

      <div className="space-y-3">
        {bookings.map((booking) => (
          <div key={booking.id} className="rounded-[28px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-slate-900">{booking.title}</p>
                <p className="mt-1 text-sm text-slate-500">with {booking.host}</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                {booking.status}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CalendarCheck2 className="h-4 w-4 text-orange-500" aria-hidden="true" />
                <span>{booking.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" aria-hidden="true" />
                <span>{booking.place}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-orange-500" aria-hidden="true" />
                <span>${booking.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

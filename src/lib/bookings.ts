export type BookingRecord = {
  id: string;
  title: string;
  host: string;
  time: string;
  status: 'Confirmed' | 'Requested';
  place: string;
  createdAt: string;
  total: number;
};

const BOOKINGS_STORAGE_KEY = 'friendbook-bookings';

export function getStoredBookings(): BookingRecord[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as BookingRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredBooking(booking: BookingRecord) {
  if (typeof window === 'undefined') {
    return;
  }

  const next = [booking, ...getStoredBookings()].slice(0, 10);
  window.localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(next));
}

export function createBookingFromCheckout({
  bookingId,
  hostName,
  total,
  date,
  time,
  duration,
  place,
}: {
  bookingId: string;
  hostName: string;
  total: number;
  date: string;
  time: string;
  duration: number;
  place: string;
}): BookingRecord {
  const title = duration > 1 ? `${duration}-hour social plan` : 'Quick social plan';

  return {
    id: bookingId,
    title,
    host: hostName,
    time: `${date} • ${time}`,
    status: 'Confirmed',
    place,
    createdAt: new Date().toISOString(),
    total,
  };
}

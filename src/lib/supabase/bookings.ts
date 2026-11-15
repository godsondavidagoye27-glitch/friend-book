import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export type BookingRecord = {
  id: string;
  host_id: string;
  booker_id: string;
  starts_at: string;
  duration_hours: number;
  place_name: string;
  status: string;
  price_cents: number | null;
  notes: string | null;
  created_at: string;
  host: {
    id: string;
    profile_id: string;
    headline: string | null;
    city: string | null;
    price_per_hour: number | null;
    full_name: string | null;
  } | null;
  booker: {
    id: string;
    full_name: string | null;
    city: string | null;
  } | null;
};

function normalizeBookingRow(row: any): BookingRecord {
  const host = row.host_profiles ? row.host_profiles : null;
  const hostProfile = host && Array.isArray(host.profiles) ? host.profiles[0] : host?.profiles ?? null;

  const booker = row.profiles ? row.profiles : null;

  return {
    id: row.id,
    host_id: row.host_id,
    booker_id: row.booker_id,
    starts_at: row.starts_at,
    duration_hours: Number(row.duration_hours ?? 1),
    place_name: row.place_name,
    status: row.status,
    price_cents: row.price_cents ?? null,
    notes: row.notes ?? null,
    created_at: row.created_at,
    host: host
      ? {
          id: host.id,
          profile_id: host.profile_id,
          headline: host.headline ?? null,
          city: host.city ?? null,
          price_per_hour: host.price_per_hour ?? null,
          full_name: hostProfile?.full_name ?? null,
        }
      : null,
    booker: booker
      ? {
          id: booker.id,
          full_name: booker.full_name ?? null,
          city: booker.city ?? null,
        }
      : null,
  } satisfies BookingRecord;
}

export async function getBookingById(bookingId: string): Promise<BookingRecord | null> {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      id,
      host_id,
      booker_id,
      starts_at,
      duration_hours,
      place_name,
      status,
      price_cents,
      notes,
      created_at,
      host_profiles!bookings_host_id_fkey (
        id,
        profile_id,
        headline,
        city,
        price_per_hour,
        profiles!host_profiles_profile_id_fkey (full_name)
      ),
      profiles!bookings_booker_id_fkey (id, full_name, city)
    `,
    )
    .eq('id', bookingId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? normalizeBookingRow(data) : null;
}

export async function getMyBookings(): Promise<BookingRecord[]> {
  const supabase = getSupabaseBrowserClient();
  const userId = (await supabase.auth.getUser()).data.user?.id ?? '___missing___';

  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      id,
      host_id,
      booker_id,
      starts_at,
      duration_hours,
      place_name,
      status,
      price_cents,
      notes,
      created_at,
      host_profiles!bookings_host_id_fkey (
        id,
        profile_id,
        headline,
        city,
        price_per_hour,
        profiles!host_profiles_profile_id_fkey (full_name)
      ),
      profiles!bookings_booker_id_fkey (id, full_name, city)
    `,
    )
    .eq('booker_id', userId)
    .order('starts_at', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map(normalizeBookingRow);
}

export async function getIncomingBookings(): Promise<BookingRecord[]> {
  const supabase = getSupabaseBrowserClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  if (!userId) {
    return [];
  }

  const { data: hostProfile, error: hostProfileError } = await supabase
    .from('host_profiles')
    .select('id')
    .eq('profile_id', userId)
    .maybeSingle();

  if (hostProfileError) {
    throw hostProfileError;
  }

  if (!hostProfile) {
    return [];
  }

  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      id,
      host_id,
      booker_id,
      starts_at,
      duration_hours,
      place_name,
      status,
      price_cents,
      notes,
      created_at,
      host_profiles!bookings_host_id_fkey (
        id,
        profile_id,
        headline,
        city,
        price_per_hour,
        profiles!host_profiles_profile_id_fkey (full_name)
      ),
      profiles!bookings_booker_id_fkey (id, full_name, city)
    `,
    )
    .eq('host_id', hostProfile.id)
    .order('starts_at', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map(normalizeBookingRow);
}

export async function respondToBooking(bookingId: string, action: 'accept' | 'decline') {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase.rpc('respond_to_booking', {
    p_booking_id: bookingId,
    p_action: action,
  });

  if (error) {
    throw error;
  }

  return data as BookingRecord | null;
}

export async function confirmBooking(bookingId: string) {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase.rpc('confirm_booking', {
    p_booking_id: bookingId,
  });

  if (error) {
    throw error;
  }

  return data as BookingRecord | null;
}

export async function createBookingRequest(input: {
  hostId: string | number;
  startsAt: string;
  durationHours: number;
  placeName: string;
  notes?: string | null;
}) {
  const supabase = getSupabaseBrowserClient();
  const hostId = String(input.hostId);

  const { data, error } = await supabase.rpc('create_booking_request', {
    p_host_id: hostId,
    p_starts_at: input.startsAt,
    p_duration_hours: input.durationHours,
    p_place_name: input.placeName,
    p_notes: input.notes ?? null,
  });

  if (error) {
    throw error;
  }

  return data as string | null;
}

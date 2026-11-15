import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export type AmioraProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  city: string | null;
  bio: string | null;
  role: 'user' | 'host' | 'admin' | null;
  accepted_terms_at: string | null;
  is_suspended: boolean | null;
  created_at?: string;
  updated_at?: string;
};

export type HostProfile = {
  id: string;
  profile_id: string;
  headline: string | null;
  bio: string | null;
  city: string | null;
  price_per_hour: number;
  verified: boolean;
  is_hidden: boolean;
  public_area: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at?: string;
  updated_at?: string;
};

export async function getCurrentProfile(): Promise<AmioraProfile | null> {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();

  if (error) {
    throw error;
  }

  return data as AmioraProfile | null;
}

export async function getCurrentHostProfile(): Promise<HostProfile | null> {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase.from('host_profiles').select('*').eq('profile_id', user.id).maybeSingle();

  if (error) {
    throw error;
  }

  return data as HostProfile | null;
}

export async function saveHostProfile(payload: {
  headline?: string | null;
  bio?: string | null;
  city: string;
  price_per_hour?: number;
  public_area?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_hidden?: boolean;
}) {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('You must be signed in to become a host.');
  }

  const record = {
    profile_id: user.id,
    headline: payload.headline?.trim() || null,
    bio: payload.bio?.trim() || null,
    city: payload.city.trim() || 'San Francisco',
    price_per_hour: payload.price_per_hour ?? 25,
    public_area: payload.public_area?.trim() || null,
    latitude: payload.latitude ?? null,
    longitude: payload.longitude ?? null,
    is_hidden: payload.is_hidden ?? false,
  };

  const { data: existingHost } = await supabase.from('host_profiles').select('id').eq('profile_id', user.id).maybeSingle();

  if (existingHost) {
    const { error } = await supabase.from('host_profiles').update(record).eq('profile_id', user.id);
    if (error) {
      throw error;
    }

    return { ...record, id: existingHost.id };
  }

  const { data, error } = await supabase.from('host_profiles').insert(record).select().single();

  if (error) {
    throw error;
  }

  return data;
}

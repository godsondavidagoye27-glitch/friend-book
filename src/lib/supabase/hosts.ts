import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export type PublicHost = {
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
  full_name: string | null;
  avatar_url: string | null;
};

export async function getPublicHosts(): Promise<PublicHost[]> {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from('host_profiles')
    .select(
      `
      id,
      profile_id,
      headline,
      bio,
      city,
      price_per_hour,
      verified,
      is_hidden,
      public_area,
      latitude,
      longitude,
      profiles!host_profiles_profile_id_fkey (full_name, avatar_url)
    `,
    )
    .eq('verified', true)
    .eq('is_hidden', false)
    .order('price_per_hour', { ascending: true })
    .limit(12);

  if (error) {
    throw error;
  }

  return (data ?? []).map((row: any) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

    return {
      id: row.id,
      profile_id: row.profile_id,
      headline: row.headline ?? null,
      bio: row.bio ?? null,
      city: row.city ?? null,
      price_per_hour: Number(row.price_per_hour ?? 0),
      verified: Boolean(row.verified),
      is_hidden: Boolean(row.is_hidden),
      public_area: row.public_area ?? null,
      latitude: row.latitude ?? null,
      longitude: row.longitude ?? null,
      full_name: profile?.full_name ?? 'Amiora host',
      avatar_url: profile?.avatar_url ?? null,
    } satisfies PublicHost;
  });
}

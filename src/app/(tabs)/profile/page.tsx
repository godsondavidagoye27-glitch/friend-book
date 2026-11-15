'use client';

import Link from 'next/link';
import { ArrowUpRight, MapPin, ShieldCheck, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCurrentProfile, type AmioraProfile } from '@/lib/supabase/profile';

export default function ProfilePage() {
  const [profile, setProfile] = useState<AmioraProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const data = await getCurrentProfile();
        if (active) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Failed to load profile', error);
        if (active) {
          setProfile(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const displayName = profile?.full_name || 'Amiora member';
  const city = profile?.city || 'Location not set';
  const roleLabel = profile?.role === 'host' ? 'Host profile' : profile?.role === 'admin' ? 'Admin' : 'Member';

  return (
    <div className="w-full px-4 pb-8 pt-5">
      <header className="pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Profile</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{loading ? 'Loading...' : displayName}</h1>
      </header>

      <section className="rounded-[30px] bg-gradient-to-br from-orange-500 to-orange-400 p-4 text-white shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-xl font-bold">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-bold">{displayName}</p>
              <p className="text-sm text-orange-100">{city}</p>
            </div>
          </div>
          <Link href="/become-host" className="rounded-full bg-white/15 px-3 py-2 text-xs font-semibold">
            {profile?.role === 'host' ? 'Host profile' : 'Edit'}
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-xl font-bold">{profile?.role === 'host' ? '1' : '0'}</p>
            <p className="text-[11px] text-orange-100">Host</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-xl font-bold">4.9</p>
            <p className="text-[11px] text-orange-100">Rating</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-xl font-bold">0</p>
            <p className="text-[11px] text-orange-100">Saved</p>
          </div>
        </div>
      </section>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between rounded-[24px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-orange-500" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Location</p>
              <p className="text-sm text-slate-500">{city}</p>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
        </div>

        <div className="flex items-center justify-between rounded-[24px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-orange-500" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Account status</p>
              <p className="text-sm text-slate-500">{roleLabel}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-[24px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-orange-500" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Bio</p>
              <p className="text-sm text-slate-500">{profile?.bio || 'Add a short intro in onboarding or the host flow.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

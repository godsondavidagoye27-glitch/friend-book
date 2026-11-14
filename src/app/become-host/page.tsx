'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { getCurrentProfile } from '@/lib/supabase/profile';
import { saveHostProfile } from '@/lib/supabase/profile';

export default function BecomeHostPage() {
  const [headline, setHeadline] = useState('City explorer and conversation host');
  const [bio, setBio] = useState('I help people find easy, fun social plans around the city with low-pressure conversation and good energy.');
  const [city, setCity] = useState('San Francisco');
  const [pricePerHour, setPricePerHour] = useState(28);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const profile = await getCurrentProfile();
        if (!active || !profile) {
          return;
        }

        if (profile.city) {
          setCity(profile.city);
        }

        if (profile.full_name) {
          setHeadline(`${profile.full_name.split(' ')[0]}'s social plans`);
        }
      } catch (loadError) {
        console.error('Failed to load profile for host setup', loadError);
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      setMessage(null);

      await saveHostProfile({
        headline,
        bio,
        city,
        price_per_hour: pricePerHour,
      });

      setMessage('Your host profile was saved successfully.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save your host profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#fffaf5] pb-10">
      <PageHeader title="Become a host" backHref="/" />

      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-5 px-4 py-5">
        <section className="rounded-[30px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-5 text-white shadow-lg shadow-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Host onboarding</p>
          <h2 className="mt-2 text-2xl font-bold">Share your vibe with the community.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-200">Add a clear intro, city, and pricing so people can discover your hosting profile.</p>
        </section>

        <div className="space-y-4 rounded-[30px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <label className="block text-left">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Headline</span>
            <input
              type="text"
              value={headline}
              onChange={(event) => setHeadline(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-700 outline-none"
            />
          </label>

          <label className="block text-left">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Bio</span>
            <textarea
              rows={4}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-700 outline-none"
            />
          </label>

          <label className="block text-left">
            <span className="mb-2 block text-sm font-semibold text-slate-700">City</span>
            <input
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-700 outline-none"
            />
          </label>

          <label className="block text-left">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Price per hour</span>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
              <span className="text-sm font-semibold text-slate-500">$</span>
              <input
                type="number"
                min={10}
                value={pricePerHour}
                onChange={(event) => setPricePerHour(Number(event.target.value) || 25)}
                className="w-full bg-transparent text-base text-slate-700 outline-none"
              />
            </div>
          </label>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        ) : null}

        {message ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>
        ) : null}

        <div className="space-y-3">
          {['Set your bio and pricing', 'Add your categories and availability', 'Review safety requirements and publish'].map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" aria-hidden="true" />
              <p className="text-sm text-slate-600">{item}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Saving...' : 'Save host profile'}
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </button>

        <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200">
          Back to home <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </main>
    </div>
  );
}

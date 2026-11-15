'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, Check, ChevronLeft, MapPin, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { saveProfileFromOnboarding } from '@/lib/supabase/auth';

const slides = [
  {
    title: 'Meet people with the same vibe',
    description: 'Browse nearby profiles, discover shared interests, and find social plans that feel natural.',
    icon: Sparkles,
  },
  {
    title: 'Stay safe while you connect',
    description: 'Public meetups, verified hosts, and clear safety tools keep the experience low-stress and secure.',
    icon: ShieldCheck,
  },
  {
    title: 'Plan something easy and fun',
    description: 'Start with a coffee, a walk, a conversation, or a quick activity near you.',
    icon: UserRound,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState('Jordan Miles');
  const [bio, setBio] = useState('I love casual city walks, coffee chats, and easygoing conversation.');
  const [city, setCity] = useState('San Francisco');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data, error: userError }) => {
      if (userError || !data.user) {
        router.replace('/login');
      }
    });
  }, [router]);

  const currentSlide = slides[step] ?? slides[0];
  const isLastSlide = step === slides.length - 1;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, slides.length));
  const previousStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleFinish = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await saveProfileFromOnboarding({
        full_name: fullName.trim() || 'Amiora user',
        city: city.trim() || 'San Francisco',
        bio: bio.trim() || null,
        username: fullName.trim().toLowerCase().replace(/\s+/g, '.'),
      });
      router.push('/explore');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save your profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#fffaf5] pb-10">
      <PageHeader title="Onboarding" description="Set up your profile" backHref="/" />

      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-5 px-4 py-5">
        <div className="rounded-[30px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              <span>Step {step + 1}</span>
              <span>/ 3</span>
            </div>
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <span
                  key={index}
                  className={`h-2.5 w-2.5 rounded-full ${index === step ? 'bg-orange-500' : 'bg-slate-200'}`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>

          <div className="flex justify-center py-3">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-600">
              <currentSlide.icon className="h-8 w-8" aria-hidden="true" />
            </span>
          </div>

          <h2 className="mt-5 text-center text-2xl font-bold text-slate-900">{currentSlide.title}</h2>
          <p className="mt-3 text-center text-sm leading-6 text-slate-600">{currentSlide.description}</p>
        </div>

        {step === 2 ? (
          <div className="space-y-4 rounded-[30px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <label className="block text-left">
              <span className="mb-2 block text-sm font-semibold text-slate-700">What should we call you?</span>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
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
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                <MapPin className="h-5 w-5 text-orange-500" aria-hidden="true" />
                <input
                  aria-label="Your city"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className="w-full bg-transparent text-base text-slate-700 outline-none"
                />
              </div>
            </label>

            <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              You must be 18+ to use Amiora. You are confirming this as part of your onboarding.
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
            ) : null}
          </div>
        ) : null}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={previousStep}
            disabled={step === 0}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>

          <button
            type="button"
            onClick={isLastSlide ? handleFinish : nextStep}
            disabled={isSubmitting}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLastSlide ? (
              <>
                {isSubmitting ? 'Saving...' : 'Finish'} <Check className="h-4 w-4" aria-hidden="true" />
              </>
            ) : (
              <>
                Next <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

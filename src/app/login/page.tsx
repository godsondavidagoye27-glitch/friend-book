'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { signInWithEmail, signInWithGoogle } from '@/lib/supabase/auth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(searchParams.get('error'));

  const handleEmailSignIn = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await signInWithEmail(trimmed);
      router.push(`/auth/check-email?email=${encodeURIComponent(trimmed)}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to send the sign-in link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await signInWithGoogle();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Google sign-in failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#fffaf5] pb-10">
      <PageHeader title="Welcome back" backHref="/" />

      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-5 px-4 py-5">
        <section className="rounded-[30px] bg-gradient-to-br from-orange-500 to-orange-400 p-5 text-white shadow-lg shadow-orange-200">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-100">Sign in</p>
          <h2 className="mt-2 text-2xl font-bold">Continue with FriendBook.</h2>
          <p className="mt-3 text-sm leading-6 text-orange-50">Use your email or Google account to securely continue to the onboarding flow.</p>
        </section>

        <div className="space-y-3 rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <label className="block text-left">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Email address</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-700 outline-none"
            />
          </label>

          <button
            type="button"
            onClick={handleEmailSignIn}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {isSubmitting ? 'Sending link...' : 'Continue with email'}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            Continue with Google
          </button>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        ) : null}

        <Link href="/terms" className="text-center text-sm text-slate-600 underline underline-offset-2">
          By continuing, you agree to our terms and privacy policy.
        </Link>

        <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200">
          Back home <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </main>
    </div>
  );
}

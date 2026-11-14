'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCheck, Mail } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { signInWithEmail } from '@/lib/supabase/auth';

export default function CheckEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async () => {
    if (!email) {
      setError('No email address was provided to resend the link.');
      return;
    }

    try {
      setIsResending(true);
      setError(null);
      await signInWithEmail(email);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to resend the sign-in link.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#fffaf5] pb-10">
      <PageHeader title="Check your email" backHref="/login" />

      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-5 px-4 py-5">
        <section className="rounded-[30px] bg-white p-5 text-center shadow-sm ring-1 ring-slate-200">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-600">
            <Mail className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-900">Magic link sent</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            We sent a secure sign-in link to <span className="font-semibold text-slate-900">{email || 'your email'}</span>. Use it to continue to the onboarding flow.
          </p>
        </section>

        <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-start gap-3">
            <CheckCheck className="mt-0.5 h-5 w-5 text-emerald-600" aria-hidden="true" />
            <div>
              <h3 className="text-base font-semibold text-emerald-900">Link delivered</h3>
              <p className="mt-2 text-sm leading-6 text-emerald-800">Check your inbox and spam folder before retrying. The auth callback will redirect you into onboarding.</p>
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isResending ? 'Sending...' : 'Resend link'}
          </button>
          <Link href="/login" className="inline-flex flex-1 items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200">
            Back
          </Link>
        </div>
      </main>
    </div>
  );
}

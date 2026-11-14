import Link from 'next/link';
import { ArrowRight, CheckCircle2, LoaderCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

export default function AuthCallbackPage() {
  return (
    <div className="min-h-dvh bg-[#fffaf5] pb-10">
      <PageHeader title="Signing you in" backHref="/" />

      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-5 px-4 py-5">
        <section className="rounded-[30px] bg-white p-5 text-center shadow-sm ring-1 ring-slate-200">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-600">
            <LoaderCircle className="h-6 w-6 animate-spin" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-900">Verifying your session</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            We are confirming your sign-in details and redirecting you into the onboarding flow.
          </p>
        </section>

        <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" aria-hidden="true" />
            <div>
              <h3 className="text-base font-semibold text-emerald-900">Secure sign-in complete</h3>
              <p className="mt-2 text-sm leading-6 text-emerald-800">
                This route is a placeholder for the OAuth and magic-link return handler in the next auth implementation.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/onboarding"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200"
        >
          Continue to onboarding <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </main>
    </div>
  );
}

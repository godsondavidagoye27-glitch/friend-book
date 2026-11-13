import Link from 'next/link';
import { ArrowRight, Mail, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-[#fffaf5] pb-10">
      <PageHeader title="Welcome back" backHref="/" />

      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-5 px-4 py-5">
        <section className="rounded-[30px] bg-gradient-to-br from-orange-500 to-orange-400 p-5 text-white shadow-lg shadow-orange-200">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-100">Sign in</p>
          <h2 className="mt-2 text-2xl font-bold">Authentication comes in the next phase.</h2>
          <p className="mt-3 text-sm leading-6 text-orange-50">This screen is ready as a placeholder while the real auth flow is built in the next group.</p>
        </section>

        <div className="space-y-3">
          <button type="button" className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
            <Mail className="h-4 w-4" aria-hidden="true" />
            Continue with email
          </button>
          <button type="button" className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
            <ShieldCheck className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            Continue with Google
          </button>
        </div>

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

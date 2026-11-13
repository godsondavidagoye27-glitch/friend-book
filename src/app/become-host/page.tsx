import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

export default function BecomeHostPage() {
  return (
    <div className="min-h-dvh bg-[#fffaf5] pb-10">
      <PageHeader title="Become a host" backHref="/" />

      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-5 px-4 py-5">
        <section className="rounded-[30px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-5 text-white shadow-lg shadow-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Host onboarding</p>
          <h2 className="mt-2 text-2xl font-bold">Share your vibe with the community.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-200">The host flow is staged for the next route group, but the starting point is ready.</p>
        </section>

        <div className="space-y-3">
          {['Set your bio and pricing', 'Add your categories and availability', 'Review safety requirements and publish'].map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" aria-hidden="true" />
              <p className="text-sm text-slate-600">{item}</p>
            </div>
          ))}
        </div>

        <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200">
          Back to home <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </main>
    </div>
  );
}

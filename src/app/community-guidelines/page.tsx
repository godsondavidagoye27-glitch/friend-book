import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

const rules = [
  'Social time only: this is for meeting, chatting, and shared activities, not transactional or intimate services.',
  'No sexual services, no coercive behavior, and no illegal activity or harm to others.',
  'Be respectful, honest, and punctual; keep promises and use clear communication.',
  'Violations may result in warnings, account restrictions, or removal from the platform.',
];

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-dvh bg-[#fffaf5] pb-10">
      <PageHeader title="Community guidelines" backHref="/" />

      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-5 px-4 py-5">
        <section className="rounded-[30px] bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-lg shadow-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Our standards</p>
          <h2 className="mt-3 text-2xl font-bold">Keep FriendBook safe and welcoming.</h2>
        </section>

        <div className="space-y-3">
          {rules.map((rule) => (
            <div key={rule} className="flex items-start gap-3 rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" aria-hidden="true" />
              <p className="text-sm leading-6 text-slate-600">{rule}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[30px] border border-orange-200 bg-orange-50 p-5">
          <h3 className="text-base font-semibold text-orange-900">Consequences</h3>
          <p className="mt-2 text-sm leading-6 text-orange-800">
            We may remove content, suspend accounts, or ban repeat offenders. Safety reports are reviewed and enforced consistently.
          </p>
        </div>

        <Link
          href="/terms"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
        >
          Review the terms <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </main>
    </div>
  );
}

import Link from 'next/link';
import { ArrowRight, AlertTriangle, CheckCircle2, ShieldAlert, Siren, Users } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

const safetyItems = [
  { title: 'Verified profiles', description: 'Hosts are verified and public safety checks are built into the experience.' },
  { title: 'Public-place rule', description: 'First-time meetups should happen in a public, well-lit, easy-to-exit place.' },
  { title: 'Share my trip', description: 'Let someone know where you are and when you expect to head home.' },
  { title: 'Quick reporting', description: 'Report bad behavior, suspicious accounts, or safety concerns in a few taps.' },
];

export default function SafetyPage() {
  return (
    <div className="min-h-dvh bg-[#fffaf5] pb-10">
      <PageHeader title="Safety center" backHref="/" />

      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-5 px-4 py-5">
        <section className="rounded-[30px] bg-slate-900 p-5 text-white shadow-lg shadow-slate-200">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
              <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Safety first</p>
              <h2 className="mt-1 text-2xl font-bold">Stay secure while meeting new people.</h2>
            </div>
          </div>
        </section>

        <section className="grid gap-3">
          {safetyItems.map(({ title, description }) => (
            <div key={title} className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <div className="mb-3 flex items-center gap-2 text-orange-600">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
              </div>
              <p className="text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <Siren className="mb-2 h-5 w-5 text-red-500" aria-hidden="true" />
            <h3 className="text-base font-semibold text-slate-900">Emergency help</h3>
            <p className="mt-2 text-sm text-slate-600">Use the SOS flow to contact a trusted contact and see local emergency numbers.</p>
          </div>
          <div className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <Users className="mb-2 h-5 w-5 text-orange-500" aria-hidden="true" />
            <h3 className="text-base font-semibold text-slate-900">Report issues</h3>
            <p className="mt-2 text-sm text-slate-600">Flag suspicious activity or inappropriate content before it escalates.</p>
          </div>
        </div>

        <section className="rounded-[30px] border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" aria-hidden="true" />
            <div>
              <h3 className="text-base font-semibold text-amber-900">What is not allowed</h3>
              <p className="mt-2 text-sm text-amber-800">
                Amiora is for social time only. No sexual services, no illegal activity, and no coercive or unsafe behavior.
              </p>
            </div>
          </div>
        </section>

        <Link
          href="/community-guidelines"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200"
        >
          Read the rules <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </main>
    </div>
  );
}

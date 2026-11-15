import Link from 'next/link';
import { ArrowRight, BadgeCheck, CalendarCheck2, ShieldCheck, Users } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

const steps = [
  {
    title: 'Find the right vibe',
    description: 'Browse verified hosts nearby and filter by activity, category, and distance.',
    icon: Users,
  },
  {
    title: 'Pick a time that works',
    description: 'Choose a meetup slot, confirm your plans, and share the place you want to meet.',
    icon: CalendarCheck2,
  },
  {
    title: 'Meet, connect, and stay safe',
    description: 'Check in with a friend, keep things public, and rely on built-in safety features.',
    icon: ShieldCheck,
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-dvh bg-[#fffaf5] pb-10">
      <PageHeader title="How it works" backHref="/" />

      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-5 px-4 py-5">
        <section className="rounded-[30px] bg-gradient-to-br from-orange-500 to-orange-400 p-5 text-white shadow-lg shadow-orange-200">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-100">For everyone</p>
          <h2 className="mt-3 text-2xl font-bold">Fast, friendly, and low-pressure.</h2>
          <p className="mt-2 text-sm leading-6 text-orange-50">
            Amiora matches people who want real social plans without the friction of a dating app or an overly formal booking tool.
          </p>
        </section>

        <section className="space-y-4">
          {steps.map(({ title, description, icon: Icon }, index) => (
            <div key={title} className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">0{index + 1}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </section>

        <section className="rounded-[30px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-emerald-500" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-slate-900">Built with safety in mind</h3>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>• Verified hosts and public meetups.</li>
            <li>• Clear community rules so everyone knows the boundaries.</li>
            <li>• Quick reporting flow and emergency contact tools.</li>
          </ul>
        </section>

        <div className="pt-2">
          <Link
            href="/safety"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            Learn about safety <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </main>
    </div>
  );
}

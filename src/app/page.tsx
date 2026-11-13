import Link from 'next/link';
import { ArrowRight, CheckCircle2, MapPinned, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { RatingStars } from '@/components/ui/rating-stars';
import { StatusChip } from '@/components/ui/status-chip';

const steps = [
  {
    title: 'Browse nearby hosts',
    description: 'Explore local people by vibe, activity, and distance.',
    icon: MapPinned,
  },
  {
    title: 'Pick a social plan',
    description: 'Choose a meetup time and confirm the flow in a few steps.',
    icon: Star,
  },
  {
    title: 'Meet safely',
    description: 'Stay in public places, share trip details, and report concerns quickly.',
    icon: ShieldCheck,
  },
];

const categories = ['Conversation', 'Walking', 'Fitness', 'Language', 'City Guide', 'Coffee'];

const sampleHosts = [
  { name: 'Maya Lee', role: 'Conversation • City Guide', rating: 4.9, verified: true },
  { name: 'Daniel Cruz', role: 'Football • Walking', rating: 4.8, verified: true },
  { name: 'Noor Hassan', role: 'Language • Coffee', rating: 4.7, verified: true },
];

const faqs = [
  { question: 'Is this a dating app?', answer: 'No. FriendBook is for social plans, shared activities, and real-life meetups.' },
  { question: 'Do I need to verify my profile?', answer: 'Hosts are verified and public safety checks are built into the app experience.' },
  { question: 'Can I use it as a guest?', answer: 'You can browse the public pages without an account, but the full experience is for signed-in users.' },
];

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#fffaf5] pb-10 text-slate-900">
      <header className="mx-auto w-full max-w-[430px] px-4 pb-4 pt-5">
        <nav className="flex items-center justify-between text-sm text-slate-600">
          <div className="font-semibold uppercase tracking-[0.2em] text-orange-600">FriendBook</div>
          <div className="flex items-center gap-2">
            <Link href="/help" className="rounded-full px-3 py-2 transition hover:bg-slate-100">Help</Link>
            <Link href="/login" className="rounded-full bg-slate-900 px-3 py-2 font-medium text-white">Log in</Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-6 px-4">
        <section className="rounded-[30px] bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300 p-5 text-white shadow-lg shadow-orange-200">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-100">Book real social time</p>
          <h1 className="mt-3 text-3xl font-black leading-tight">Meet people nearby who want the same vibe.</h1>
          <p className="mt-3 text-sm leading-6 text-orange-50">
            Find a host, start a conversation, and plan a low-pressure meetup in your area.
          </p>
          <div className="mt-5 flex gap-3">
            <Link href="/explore" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
              Get started <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/become-host" className="inline-flex flex-1 items-center justify-center rounded-full bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/20">
              Become a host
            </Link>
          </div>
        </section>

        <section className="rounded-[30px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">How it works</h2>
            <Link href="/how-it-works" className="text-sm font-medium text-orange-600">See all</Link>
          </div>
          <div className="space-y-3">
            {steps.map(({ title, description, icon: Icon }) => (
              <div key={title} className="flex items-start gap-3 rounded-[22px] bg-slate-50 p-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[30px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Featured categories</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span key={category} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                {category}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Popular nearby</h2>
            <Link href="/explore" className="text-sm font-medium text-orange-600">View all</Link>
          </div>

          {sampleHosts.map(({ name, role, rating, verified }) => (
            <article key={name} className="rounded-[30px] bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <Avatar name={name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-base font-semibold text-slate-900">{name}</h3>
                    {verified ? <StatusChip label="Verified" tone="success" /> : null}
                  </div>
                  <p className="text-sm text-slate-500">{role}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <RatingStars value={rating} count={18} />
                <span className="text-sm font-bold text-slate-900">$28/hr</span>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-[30px] bg-slate-900 p-5 text-white shadow-lg shadow-slate-200">
          <div className="flex items-center gap-2 text-orange-300">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em]">Why people use it</p>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-slate-200">
            {['No awkward guessing', 'Fast local discovery', 'Safety-first meetups'].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">FAQ</h2>
            <Link href="/help" className="text-sm font-medium text-orange-600">More</Link>
          </div>
          {faqs.map(({ question, answer }) => (
            <div key={question} className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-sm font-semibold text-slate-900">{question}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>
            </div>
          ))}
        </section>

        <footer className="rounded-[30px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <Link href="/how-it-works">How it works</Link>
            <Link href="/safety">Safety</Link>
            <Link href="/terms">Terms</Link>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <Link href="/privacy">Privacy</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/install">Install app</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

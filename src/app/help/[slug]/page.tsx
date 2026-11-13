import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const articles = {
  bookings: {
    title: 'How booking requests work',
    category: 'Bookings',
    body: 'Choose a host, pick your time, and send a booking request. The host can accept or decline, and the meeting details stay clear and public.',
  },
  safety: {
    title: 'How to stay safe on a first meetup',
    category: 'Safety',
    body: 'Meet in a public place, tell a friend where you are going, and use the Share my trip flow before the meetup begins.',
  },
  payments: {
    title: 'When do payments happen?',
    category: 'Payments',
    body: 'The price, service fee, and total are calculated on the server. Full payment processing comes in Phase 2, but the UI is ready for that flow.',
  },
  hosting: {
    title: 'What hosts should expect',
    category: 'Hosting',
    body: 'Hosts can set a bio, availability, categories, and pricing. The host dashboard helps review requests, update schedule, and track upcoming bookings.',
  },
  account: {
    title: 'How to update my profile',
    category: 'Account',
    body: 'Visit your profile settings to change your bio, location, interests, and safety preferences. Keep your details accurate so people understand who you are.',
  },
};

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export default function HelpArticlePage({ params }: { params: { slug: string } }) {
  const article = articles[params.slug as keyof typeof articles];

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-dvh bg-[#fffaf5] pb-10">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-[#fffaf5]/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[430px] items-center gap-3 px-4 py-3">
          <Link
            href="/help"
            aria-label="Back to help"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-200"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-600">{article.category}</p>
            <h1 className="text-lg font-bold text-slate-900">{article.title}</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[430px] px-4 py-5">
        <article className="rounded-[30px] bg-white p-5 text-sm leading-7 text-slate-600 shadow-sm ring-1 ring-slate-200">
          <p>{article.body}</p>
          <p className="mt-4">Want more help? Visit the support center and contact us if you need a human answer.</p>
        </article>
      </main>
    </div>
  );
}

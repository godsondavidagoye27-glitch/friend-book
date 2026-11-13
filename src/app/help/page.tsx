'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

const articleMeta = [
  { slug: 'bookings', title: 'How do booking requests work?', category: 'Bookings' },
  { slug: 'safety', title: 'How can I stay safe on a first meetup?', category: 'Safety' },
  { slug: 'payments', title: 'When do payments happen?', category: 'Payments' },
  { slug: 'hosting', title: 'What should I expect as a host?', category: 'Hosting' },
  { slug: 'account', title: 'How do I update my profile?', category: 'Account' },
];

export default function HelpPage() {
  const [query, setQuery] = useState('');

  const filteredArticles = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return articleMeta;
    return articleMeta.filter(({ title, category }) => `${title} ${category}`.toLowerCase().includes(trimmed));
  }, [query]);

  return (
    <div className="min-h-dvh bg-[#fffaf5] pb-10">
      <PageHeader title="Help center" backHref="/" />

      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-5 px-4 py-5">
        <div className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
            <input
              aria-label="Search help articles"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search help articles"
              className="w-full bg-transparent text-base text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          {['Bookings', 'Payments', 'Safety', 'Hosting'].map((category) => (
            <button
              key={category}
              type="button"
              className="rounded-full border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700 shadow-sm"
            >
              {category}
            </button>
          ))}
        </div>

        <section className="space-y-3">
          {filteredArticles.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-5 text-center text-sm text-slate-500">
              No help articles match your search.
            </div>
          ) : (
            filteredArticles.map(({ slug, title, category }) => (
              <Link
                key={slug}
                href={`/help/${slug}`}
                className="block rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-600">{category}</p>
                <h3 className="mt-2 text-base font-semibold text-slate-900">{title}</h3>
              </Link>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

'use client';

import Link from 'next/link';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-dvh bg-[#fffaf5] p-5">
      <div className="mx-auto flex max-w-[430px] flex-col gap-4 rounded-[32px] bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">Something went wrong.</h2>
        <p className="text-sm text-slate-600">A rendering error interrupted the page. You can retry or return home.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => reset()} className="rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white">
            Try again
          </button>
          <Link href="/" className="rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

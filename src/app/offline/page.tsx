import Link from 'next/link';
import { RefreshCw, WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#fffaf5] px-4 py-8">
      <div className="w-full max-w-sm rounded-[32px] border border-slate-200 bg-white p-6 text-center shadow-soft">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
          <WifiOff className="h-7 w-7" aria-hidden="true" />
        </div>

        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Offline
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">You’re offline</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          FriendBook is caching the app shell so you can still revisit the home screen, but live host updates need a connection.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-orange-500 px-5 text-sm font-semibold text-white shadow-lg shadow-orange-200"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </Link>
      </div>
    </main>
  );
}

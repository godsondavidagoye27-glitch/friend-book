import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

export default function AccountSuspendedPage() {
  return (
    <div className="min-h-dvh bg-[#fffaf5] pb-10">
      <PageHeader title="Account review" backHref="/" />

      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-5 px-4 py-5">
        <section className="rounded-[30px] border border-amber-200 bg-amber-50 p-5 text-left shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 h-5 w-5 text-amber-600" aria-hidden="true" />
            <div>
              <h2 className="text-xl font-bold text-amber-900">Your account is temporarily suspended.</h2>
              <p className="mt-2 text-sm leading-6 text-amber-800">
                This is a placeholder account state for the app’s suspension flow. Contact support if you believe this was a mistake.
              </p>
            </div>
          </div>
        </section>

        <div className="flex gap-3">
          <Link href="/contact" className="inline-flex flex-1 items-center justify-center rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200">
            Contact support
          </Link>
          <Link href="/" className="inline-flex flex-1 items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200">
            Home
          </Link>
        </div>
      </main>
    </div>
  );
}

import Link from 'next/link';
import { ArrowRight, Apple, Smartphone } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

export default function InstallPage() {
  return (
    <div className="min-h-dvh bg-[#fffaf5] pb-10">
      <PageHeader title="Add to Home Screen" backHref="/" />

      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-5 px-4 py-5">
        <section className="rounded-[30px] bg-gradient-to-br from-orange-500 to-orange-400 p-5 text-white shadow-lg shadow-orange-200">
          <h2 className="text-2xl font-bold">Install Amiora like an app.</h2>
          <p className="mt-2 text-sm leading-6 text-orange-50">This keeps the experience fast, mobile-first, and easy to access whenever you need it.</p>
        </section>

        <div className="grid gap-4">
          <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="mb-3 flex items-center gap-2 text-slate-900">
              <Apple className="h-5 w-5 text-slate-700" aria-hidden="true" />
              <h3 className="text-lg font-semibold">iPhone or iPad</h3>
            </div>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-600">
              <li>Open the app in Safari.</li>
              <li>Tap the Share button.</li>
              <li>Select Add to Home Screen.</li>
              <li>Confirm and place it on your Home Screen.</li>
            </ol>
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="mb-3 flex items-center gap-2 text-slate-900">
              <Smartphone className="h-5 w-5 text-slate-700" aria-hidden="true" />
              <h3 className="text-lg font-semibold">Android</h3>
            </div>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-600">
              <li>Open the app in Chrome.</li>
              <li>Tap the menu button in the top-right.</li>
              <li>Select Install app or Add to Home Screen.</li>
              <li>Confirm and use the shortcut from your device.</li>
            </ol>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
        >
          Back to home <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </main>
    </div>
  );
}

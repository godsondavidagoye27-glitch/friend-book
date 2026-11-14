import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

export default function AccountDeletedPage() {
  return (
    <div className="min-h-dvh bg-[#fffaf5] pb-10">
      <PageHeader title="Account deleted" backHref="/" />

      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-5 px-4 py-5">
        <section className="rounded-[30px] bg-white p-5 text-center shadow-sm ring-1 ring-slate-200">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-900">Your account has been removed.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            This is the post-delete confirmation screen for the soft-delete flow. You can create a new account later if you want to return.
          </p>
        </section>

        <Link href="/login" className="inline-flex items-center justify-center rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200">
          Return to sign in
        </Link>
      </main>
    </div>
  );
}

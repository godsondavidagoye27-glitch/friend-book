import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';

export default function NotFoundPage() {
  return (
    <div className="min-h-dvh bg-[#fffaf5] pb-10">
      <PageHeader title="Page not found" backHref="/" />
      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-4 px-4 py-5">
        <div className="rounded-[30px] bg-white p-5 text-center shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">This page is missing.</h2>
          <p className="mt-3 text-sm text-slate-600">The route may not be built yet or was moved. Head back home to continue browsing.</p>
          <Link href="/" className="mt-5 inline-flex rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white">
            Return home
          </Link>
        </div>
      </main>
    </div>
  );
}

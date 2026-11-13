import { PageHeader } from '@/components/ui/page-header';

export default function MaintenancePage() {
  return (
    <div className="min-h-dvh bg-[#fffaf5] pb-10">
      <PageHeader title="Maintenance" backHref="/" />
      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-4 px-4 py-5">
        <div className="rounded-[30px] bg-white p-5 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Scheduled update</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">We are briefly improving the app.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">Please check back in a few minutes. Safety and account features remain protected while we work.</p>
        </div>
      </main>
    </div>
  );
}

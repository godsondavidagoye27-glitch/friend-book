import { PageHeader } from '@/components/ui/page-header';

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-[#fffaf5] pb-10">
      <PageHeader title="Privacy" description="Last updated: 2025-01-01" backHref="/" />
      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-4 px-4 py-5 text-sm leading-7 text-slate-600">
        <section className="rounded-[30px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p>Amiora stores only the data needed to support bookings, profile management, and safety operations.</p>
          <p className="mt-3">We do not sell personal data. Data is used for app functionality, fraud prevention, account support, and safety investigations.</p>
          <p className="mt-3">This placeholder policy requires legal review before launch.</p>
        </section>
      </main>
    </div>
  );
}

import { PageHeader } from '@/components/ui/page-header';

export default function CookiesPage() {
  return (
    <div className="min-h-dvh bg-[#fffaf5] pb-10">
      <PageHeader title="Cookies" description="Last updated: 2025-01-01" backHref="/" />
      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-4 px-4 py-5 text-sm leading-7 text-slate-600">
        <section className="rounded-[30px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p>We may use cookies and similar tools to keep the app secure, improve performance, and remember your preferences.</p>
          <p className="mt-3">Essential cookies support authentication, session security, and app stability. Optional analytics or personalization cookies are placeholders and require legal review before launch.</p>
        </section>
      </main>
    </div>
  );
}

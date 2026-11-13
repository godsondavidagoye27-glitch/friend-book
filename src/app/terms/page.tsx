import { PageHeader } from '@/components/ui/page-header';

export default function TermsPage() {
  return (
    <div className="min-h-dvh bg-[#fffaf5] pb-10">
      <PageHeader title="Terms" description="Last updated: 2025-01-01" backHref="/" />
      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-4 px-4 py-5 text-sm leading-7 text-slate-600">
        <section className="rounded-[30px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p>These terms are placeholder legal language and require lawyer review before launch.</p>
          <p className="mt-3">FriendBook is intended for social time, not transactional or illegal activity. Users must comply with all local laws and site rules.</p>
          <p className="mt-3">We reserve the right to remove accounts or content that violates our policies or poses a risk to others.</p>
        </section>
      </main>
    </div>
  );
}

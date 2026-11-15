'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { FormField } from '@/components/ui/form-field';
import { PageHeader } from '@/components/ui/page-header';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-dvh bg-[#fffaf5] pb-10">
      <PageHeader title="Contact support" backHref="/" />

      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-5 px-4 py-5">
        <section className="rounded-[30px] bg-slate-900 p-5 text-white shadow-lg shadow-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Need help?</p>
          <h2 className="mt-2 text-2xl font-bold">Send us a note.</h2>
          <a href="mailto:support@amiora.example" className="mt-3 inline-block text-sm text-orange-200">
            support@amiora.example
          </a>
        </section>

        {submitted ? (
          <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
            Thanks — your message has been queued for review.
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4 rounded-[30px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <FormField label="Name">
            <input type="text" defaultValue="Jordan Miles" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-700 outline-none ring-0" />
          </FormField>
          <FormField label="Email">
            <input type="email" defaultValue="jordan@example.com" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-700 outline-none ring-0" />
          </FormField>
          <FormField label="What do you need help with?">
            <textarea rows={5} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-700 outline-none ring-0" placeholder="Tell us what happened" />
          </FormField>
          <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200">
            Send message <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </main>
    </div>
  );
}

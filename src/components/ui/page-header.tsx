import Link from 'next/link';
import type { Route } from 'next';
import { ArrowLeft } from 'lucide-react';

export function PageHeader({
  title,
  description,
  action,
  backHref,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  backHref?: Route;
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-[#fffaf5]/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[430px] items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          {backHref ? (
            <Link
              href={backHref}
              aria-label="Go back"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : null}
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-slate-900">{title}</h1>
            {description ? <p className="text-xs text-slate-500">{description}</p> : null}
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  );
}

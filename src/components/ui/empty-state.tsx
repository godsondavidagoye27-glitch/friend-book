import { ArrowRight, Inbox } from 'lucide-react';

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-5 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-600">
        <Inbox className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
      {action ? (
        <div className="mt-4 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200">
            {action}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

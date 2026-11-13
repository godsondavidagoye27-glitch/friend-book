import { X } from 'lucide-react';

export function BottomSheet({
  title,
  open,
  onClose,
  children,
}: {
  title?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/30 backdrop-blur-[2px]">
      <div className="w-full max-w-[430px] rounded-t-[32px] bg-[#fffaf5] p-4 shadow-[0_-12px_35px_rgba(15,23,42,0.18)]">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300" />
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? <h3 className="text-lg font-semibold text-slate-900">{title}</h3> : <div />}
          <button
            type="button"
            aria-label="Close sheet"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 ring-1 ring-slate-200"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

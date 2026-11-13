const toneStyles = {
  neutral: 'bg-slate-100 text-slate-700',
  info: 'bg-amber-100 text-amber-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-rose-100 text-rose-700',
  accent: 'bg-orange-100 text-orange-700',
};

export function StatusChip({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: keyof typeof toneStyles;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${toneStyles[tone]}`}
    >
      {label}
    </span>
  );
}

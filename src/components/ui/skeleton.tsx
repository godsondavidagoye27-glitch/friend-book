export function SkeletonLine({ className = '', height = 'h-4' }: { className?: string; height?: string }) {
  return <div className={`animate-pulse rounded-full bg-slate-200 ${height} ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 h-40 animate-pulse rounded-2xl bg-slate-200" />
      <div className="space-y-2">
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-200" />
        <div className="h-4 w-1/3 animate-pulse rounded-full bg-slate-200" />
      </div>
    </div>
  );
}

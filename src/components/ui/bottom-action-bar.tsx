export function BottomActionBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 z-20 border-t border-slate-200/80 bg-white/90 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[430px] items-center gap-3">{children}</div>
    </div>
  );
}

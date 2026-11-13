import { SkeletonCard } from '@/components/ui/skeleton';

export default function LoadingPage() {
  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-col gap-4 px-4 py-5">
      <div className="h-10 w-28 animate-pulse rounded-full bg-slate-200" />
      <div className="h-12 w-full animate-pulse rounded-[26px] bg-slate-200" />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

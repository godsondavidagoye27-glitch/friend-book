import { Star } from 'lucide-react';

export function RatingStars({ value, count }: { value: number; count?: number }) {
  return (
    <div className="flex items-center gap-1 text-sm text-slate-600">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-3.5 w-3.5 ${index < Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="font-medium">{value.toFixed(1)}</span>
      {count ? <span className="text-slate-400">({count})</span> : null}
    </div>
  );
}

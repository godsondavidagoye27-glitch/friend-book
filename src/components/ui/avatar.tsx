export function Avatar({
  name,
  size = 'md',
  accent = 'orange',
}: {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  accent?: 'orange' | 'slate' | 'green';
}) {
  const sizeMap = {
    sm: 'h-9 w-9 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-16 w-16 text-lg',
  };

  const accentMap = {
    orange: 'bg-orange-100 text-orange-700',
    slate: 'bg-slate-100 text-slate-700',
    green: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full font-semibold ${sizeMap[size]} ${accentMap[accent]}`}
      aria-label={name}
    >
      {name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()}
    </div>
  );
}

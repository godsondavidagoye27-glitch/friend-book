const navItems = [
  { id: 'explore', label: 'Explore', icon: '⌂' },
  { id: 'map', label: 'Map', icon: '◌' },
  { id: 'bookings', label: 'Bookings', icon: '✓' },
  { id: 'chat', label: 'Chat', icon: '✉' },
  { id: 'profile', label: 'Profile', icon: '☰' },
] as const;

export function MobileShell({
  children,
  activeTab = 'explore',
  onTabChange,
}: {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}) {
  return (
    <div className="min-h-screen bg-[#fffaf5] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-[#fffaf5] shadow-[0_0_0_1px_rgba(148,163,184,0.2)]">
        <main className="flex-1 overflow-x-hidden">{children}</main>

        <nav className="sticky bottom-0 z-30 border-t border-slate-200/80 bg-white/85 backdrop-blur-xl safe-bottom">
          <div className="grid grid-cols-5 gap-1 px-3 pb-2 pt-2">
            {navItems.map((item) => {
              const isActive = item.id === activeTab;

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={item.label}
                  onClick={() => onTabChange?.(item.id)}
                  className={`relative flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1 text-[11px] font-medium transition-all ${
                    isActive ? 'bg-orange-50 text-orange-600' : 'text-slate-500'
                  }`}
                >
                  <span className="text-lg leading-none">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.id === 'chat' || item.id === 'bookings' ? (
                    <span className="absolute right-3 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {item.id === 'chat' ? '3' : '2'}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

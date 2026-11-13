import { MapPin, Search } from 'lucide-react';

const hosts = [
  { id: 1, name: 'Maya', position: 'left-[18%] top-[22%]' },
  { id: 2, name: 'Daniel', position: 'left-[58%] top-[30%]' },
  { id: 3, name: 'Noor', position: 'left-[38%] top-[56%]' },
];

export default function MapPage() {
  return (
    <div className="relative h-[calc(100dvh-118px)] overflow-hidden bg-[#eaf5f3]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.9),rgba(255,255,255,0)_30%),linear-gradient(135deg,#dff3ed_0%,#eaf5f3_30%,#dfeef8_100%)]" />

      <div className="absolute inset-0 opacity-60">
        <div className="absolute left-[12%] top-[10%] h-[1px] w-[72%] -rotate-12 bg-white/80" />
        <div className="absolute left-[20%] top-[52%] h-[1px] w-[65%] rotate-12 bg-white/80" />
        <div className="absolute left-[8%] top-[28%] h-[52%] w-[1px] -rotate-8 bg-white/70" />
        <div className="absolute left-[44%] top-[8%] h-[60%] w-[1px] rotate-12 bg-white/70" />
        <div className="absolute left-[18%] top-[18%] h-20 w-20 rounded-full border border-white/70" />
        <div className="absolute right-[16%] top-[22%] h-24 w-24 rounded-full border border-white/70" />
        <div className="absolute bottom-[18%] left-[14%] h-24 w-24 rounded-full border border-white/70" />
      </div>

      <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-full bg-white/85 px-3 py-2 text-xs font-semibold text-slate-700 shadow-soft backdrop-blur">
          <MapPin className="h-3.5 w-3.5 text-orange-500" aria-hidden="true" />
          <span>San Francisco • 3.1 km</span>
        </div>
        <button type="button" className="min-h-[44px] rounded-full bg-slate-900 px-3 text-xs font-semibold text-white shadow-soft">
          Use my location
        </button>
      </div>

      <button
        type="button"
        className="absolute left-4 top-20 z-10 flex min-h-[44px] items-center gap-2 rounded-full bg-white px-3 text-sm font-medium text-slate-700 shadow-soft"
      >
        <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
        Search this area
      </button>

      {hosts.map((host) => (
        <button key={host.id} type="button" aria-label={`View ${host.name}`} className={`absolute z-10 ${host.position}`}>
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white shadow-lg shadow-orange-200 ring-4 ring-white/80">
            {host.name[0]}
          </span>
        </button>
      ))}

      <div className="absolute inset-x-0 bottom-0 z-20 rounded-t-[32px] border-t border-slate-200 bg-white pb-6 shadow-[0_-16px_38px_rgba(15,23,42,0.08)]">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-slate-200" />
        <div className="flex items-center justify-between px-4 pt-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Nearby</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Hosts around you</h2>
          </div>
          <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">8 results</span>
        </div>

        <div className="mt-4 space-y-3 px-4">
          {[
            { name: 'Maya Lee', distance: '1.2 km away', price: '$28/hr' },
            { name: 'Daniel Cruz', distance: '2.4 km away', price: '$35/hr' },
            { name: 'Noor Hassan', distance: '0.8 km away', price: '$24/hr' },
          ].map((host) => (
            <div key={host.name} className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-2.5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-200 via-orange-100 to-white text-lg font-bold text-orange-700">
                {host.name.split(' ')[0][0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-slate-900">{host.name}</p>
                <p className="text-sm text-slate-500">{host.distance}</p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-600">⭐ 4.9</span>
                  <span className="text-sm font-bold text-slate-900">{host.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

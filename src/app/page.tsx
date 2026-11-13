'use client';

import { useState } from 'react';
import { BookingFlow } from '@/components/booking-flow';
import { MobileShell } from '@/components/mobile-shell';

const categories = ['Yoga', 'Conversation', 'Football', 'Walks', 'Language', 'Gym'];

const hosts = [
  {
    id: 1,
    name: 'Maya Lee',
    location: '1.2 km away',
    price: 28,
    rating: 4.9,
    reviews: 18,
    category: 'Conversation',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    verified: true,
    position: 'left-[18%] top-[18%]',
  },
  {
    id: 2,
    name: 'Daniel Cruz',
    location: '2.4 km away',
    price: 35,
    rating: 4.8,
    reviews: 32,
    category: 'Football',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    verified: true,
    position: 'left-[60%] top-[34%]',
  },
  {
    id: 3,
    name: 'Noor Hassan',
    location: '0.8 km away',
    price: 24,
    rating: 4.7,
    reviews: 12,
    category: 'Language',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
    verified: true,
    position: 'left-[40%] top-[58%]',
  },
  {
    id: 4,
    name: 'Ari Gomez',
    location: '2.9 km away',
    price: 31,
    rating: 4.9,
    reviews: 29,
    category: 'Walks',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
    verified: true,
    position: 'left-[64%] top-[72%]',
  },
];

const reviews = [
  { name: 'Amina', rating: 5, text: 'Great energy and super easy to talk to.' },
  { name: 'Leo', rating: 5, text: 'Perfect guide for a casual evening walk.' },
  { name: 'Sam', rating: 4, text: 'Helpful and punctual — highly recommended.' },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('explore');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState(hosts[0]);

  const openBooking = (host: (typeof hosts)[number]) => {
    setSelectedHost(host);
    setIsBookingOpen(true);
  };

  return (
    <>
      <BookingFlow
        host={{
          id: selectedHost.id,
          name: selectedHost.name,
          price: selectedHost.price,
          category: selectedHost.category,
          verified: selectedHost.verified,
        }}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <MobileShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'map' ? (
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
            <div className="rounded-full bg-white/85 px-3 py-2 text-xs font-semibold text-slate-700 shadow-soft backdrop-blur">
              San Francisco • 3.1 km
            </div>
            <button type="button" className="min-h-[44px] rounded-full bg-slate-900 px-3 text-xs font-semibold text-white shadow-soft">
              Use my location
            </button>
          </div>

          <button
            type="button"
            className="absolute left-4 top-20 z-10 min-h-[44px] rounded-full bg-white px-3 text-sm font-medium text-slate-700 shadow-soft"
          >
            Search this area
          </button>

          {hosts.map((host) => (
            <button
              key={host.id}
              type="button"
              aria-label={`View ${host.name}`}
              className={`absolute z-10 ${host.position}`}
            >
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white shadow-lg shadow-orange-200 ring-4 ring-white/80">
                {host.name.split(' ')[0][0]}
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
              {hosts.slice(0, 3).map((host) => (
                <div key={host.id} className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-2.5">
                  <img src={host.image} alt={host.name} className="h-16 w-16 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-base font-semibold text-slate-900">{host.name}</p>
                      {host.verified ? <span className="text-[10px] font-bold uppercase text-emerald-700">Verified</span> : null}
                    </div>
                    <p className="text-sm text-slate-500">{host.location}</p>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-slate-600">⭐ {host.rating}</span>
                      <span className="text-sm font-bold text-slate-900">${host.price}/hr</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full px-4 pb-6 pt-5">
          <header className="flex items-center justify-between pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">FriendBook</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Nearby friends</h1>
            </div>
            <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-soft">
              ☰
            </button>
          </header>

          <div className="mb-4 rounded-[28px] border border-slate-200 bg-white p-3 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="text-xl text-slate-400">⌕</span>
              <input
                aria-label="Search nearby hosts"
                className="w-full border-0 bg-transparent text-base text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="Search friends, activities, languages"
                type="search"
              />
            </div>
          </div>

          <div className="mb-5 overflow-x-auto scrollbar-none">
            <div className="flex gap-2 whitespace-nowrap pb-1">
              {categories.map((category, index) => (
                <button
                  key={category}
                  type="button"
                  className={`inline-flex min-h-[40px] items-center rounded-full px-4 text-sm font-medium transition ${
                    index === 0 ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 shadow-sm'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5 flex items-center justify-between rounded-2xl bg-orange-50 p-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-orange-700">Today</p>
              <p className="mt-1 text-sm text-slate-700">23 hosts available within 5 km</p>
            </div>
            <button type="button" className="rounded-full bg-orange-500 px-3 py-2 text-xs font-semibold text-white">
              Filters
            </button>
          </div>

          <section className="space-y-4">
            {hosts.map((host) => (
              <article key={host.id} className="overflow-hidden rounded-[28px] bg-white shadow-soft ring-1 ring-slate-100">
                <div className="relative h-60 w-full overflow-hidden">
                  <img src={host.image} alt={host.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                    <span className="rounded-full bg-white/85 px-2 py-1 text-xs font-semibold text-slate-700">
                      {host.category}
                    </span>
                    <button type="button" aria-label={`Save ${host.name}`} className="rounded-full bg-white/90 p-2 text-lg">
                      ♡
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-900">{host.name}</h2>
                        {host.verified ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Verified</span> : null}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{host.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">${host.price}</p>
                      <p className="text-xs text-slate-500">/ hr</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                    <span>⭐ {host.rating}</span>
                    <span>•</span>
                    <span>{host.reviews} reviews</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <button type="button" className="min-h-[44px] flex-1 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700">
                      Message
                    </button>
                    <button
                      type="button"
                      onClick={() => openBooking(host)}
                      className="min-h-[44px] flex-1 rounded-full bg-orange-500 px-4 text-sm font-semibold text-white shadow-lg shadow-orange-200"
                    >
                      Book now
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="mt-6 rounded-[28px] bg-slate-900 p-4 text-white shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-orange-200">Host profile</p>
                <h3 className="mt-1 text-xl font-bold">Maya Lee</h3>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-semibold text-emerald-300">Available today</span>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-20 w-20 overflow-hidden rounded-2xl bg-slate-700">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80"
                    alt="Maya profile"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2 text-sm">
              <button type="button" className="rounded-full bg-white/10 px-3 py-2">
                About
              </button>
              <button type="button" className="rounded-full bg-white/10 px-3 py-2">
                Availability
              </button>
              <button type="button" className="rounded-full bg-white/10 px-3 py-2">
                Reviews
              </button>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-200">
              I love helping people discover the city through local food, cafés, and scenic walks.
              Great for conversation practice, weekend plans, and easygoing social energy.
            </p>

            <div className="mt-4 space-y-3">
              {reviews.map((review) => (
                <div key={review.name} className="rounded-2xl bg-white/5 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{review.name}</span>
                    <span>{'⭐'.repeat(review.rating)}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-200">{review.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex gap-3">
              <button type="button" className="min-h-[44px] flex-1 rounded-full bg-white font-semibold text-slate-900">
                Save
              </button>
              <button
                type="button"
                onClick={() => openBooking(hosts[0])}
                className="min-h-[44px] flex-1 rounded-full bg-orange-500 font-semibold text-white"
              >
                Book now
              </button>
            </div>
          </section>
        </div>
      )}
      </MobileShell>
    </>
  );
}

import { BadgeCheck, Filter, Heart, Menu, Search, Sparkles, Star } from 'lucide-react';

const categories = ['Yoga', 'Conversation', 'Football', 'Walks', 'Language', 'Gym'];

const hosts = [
  { name: 'Maya Lee', location: '1.2 km away', price: 28, rating: 4.9, reviews: 18, category: 'Conversation', verified: true },
  { name: 'Daniel Cruz', location: '2.4 km away', price: 35, rating: 4.8, reviews: 32, category: 'Football', verified: true },
  { name: 'Noor Hassan', location: '0.8 km away', price: 24, rating: 4.7, reviews: 12, category: 'Language', verified: true },
];

export default function ExplorePage() {
  return (
    <div className="w-full px-4 pb-6 pt-5">
      <header className="flex items-center justify-between pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">FriendBook</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Nearby friends</h1>
        </div>
        <button type="button" aria-label="Open menu" className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-soft">
          <Menu className="h-5 w-5 text-slate-700" aria-hidden="true" />
        </button>
      </header>

      <div className="mb-4 rounded-[28px] border border-slate-200 bg-white p-3 shadow-soft">
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
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
        <button type="button" className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-2 text-xs font-semibold text-white">
          <Filter className="h-3.5 w-3.5" aria-hidden="true" />
          Filters
        </button>
      </div>

      <section className="space-y-4">
        {hosts.map((host) => (
          <article key={host.name} className="overflow-hidden rounded-[28px] bg-white shadow-soft ring-1 ring-slate-100">
            <div className="relative h-52 w-full bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.5),_rgba(255,255,255,0)_40%),linear-gradient(135deg,#fed7aa,#fff7ed)]">
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                <span className="rounded-full bg-white/85 px-2 py-1 text-xs font-semibold text-slate-700">
                  {host.category}
                </span>
                <button type="button" aria-label={`Save ${host.name}`} className="rounded-full bg-white/90 p-2">
                  <Heart className="h-4 w-4 text-slate-700" aria-hidden="true" />
                </button>
              </div>
              <div className="absolute bottom-3 left-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-lg font-bold text-orange-600 shadow-soft">
                {host.name.split(' ')[0][0]}
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">{host.name}</h2>
                    {host.verified ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                        Verified
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{host.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">${host.price}</p>
                  <p className="text-xs text-slate-500">/ hr</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  {host.rating}
                </span>
                <span>•</span>
                <span>{host.reviews} reviews</span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <button type="button" className="min-h-[44px] flex-1 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700">
                  Message
                </button>
                <button type="button" className="min-h-[44px] flex-1 rounded-full bg-orange-500 px-4 text-sm font-semibold text-white shadow-lg shadow-orange-200">
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

        <div className="mt-4 flex gap-2 text-sm">
          <span className="rounded-full bg-white/10 px-3 py-2">About</span>
          <span className="rounded-full bg-white/10 px-3 py-2">Availability</span>
          <span className="rounded-full bg-white/10 px-3 py-2">Reviews</span>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-200">
          I love helping people discover the city through local food, cafés, and scenic walks. Great for conversation practice, weekend plans, and easygoing social energy.
        </p>

        <div className="mt-4 space-y-3">
          {[
            { name: 'Amina', rating: 5, text: 'Great energy and super easy to talk to.' },
            { name: 'Leo', rating: 5, text: 'Perfect guide for a casual evening walk.' },
          ].map((review) => (
            <div key={review.name} className="rounded-2xl bg-white/5 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">{review.name}</span>
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
                  {review.rating}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-200">{review.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex gap-3">
          <button type="button" className="min-h-[44px] flex-1 rounded-full bg-white font-semibold text-slate-900">
            Save
          </button>
          <button type="button" className="min-h-[44px] flex-1 rounded-full bg-orange-500 font-semibold text-white">
            Book now
          </button>
        </div>
      </section>
    </div>
  );
}

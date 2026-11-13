import { ArrowUpRight, MapPin, ShieldCheck, Star } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="w-full px-4 pb-8 pt-5">
      <header className="pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Profile</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Jordan Miles</h1>
      </header>

      <section className="rounded-[30px] bg-gradient-to-br from-orange-500 to-orange-400 p-4 text-white shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-xl font-bold">J</div>
            <div>
              <p className="text-lg font-bold">Jordan Miles</p>
              <p className="text-sm text-orange-100">San Francisco</p>
            </div>
          </div>
          <button type="button" className="rounded-full bg-white/15 px-3 py-2 text-xs font-semibold">
            Edit
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-xl font-bold">12</p>
            <p className="text-[11px] text-orange-100">Bookings</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-xl font-bold">4.9</p>
            <p className="text-[11px] text-orange-100">Rating</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-xl font-bold">8</p>
            <p className="text-[11px] text-orange-100">Saved</p>
          </div>
        </div>
      </section>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between rounded-[24px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-orange-500" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Location</p>
              <p className="text-sm text-slate-500">San Francisco</p>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
        </div>

        <div className="flex items-center justify-between rounded-[24px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-orange-500" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Verified account</p>
              <p className="text-sm text-slate-500">Identity confirmed</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-[24px] bg-white p-4 shadow-soft ring-1 ring-slate-100">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-orange-500" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Reviews</p>
              <p className="text-sm text-slate-500">7 people left you feedback</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

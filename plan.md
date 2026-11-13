# PROJECT: FriendBook (mobile-first marketplace for booking people nearby)

## 1. What it is
FriendBook is a mobile-first web app (installable PWA) where users book nearby people ("Hosts") for social time: local guiding, activity partners (gym, football, walks), language practice, and conversation. Bookers pay upfront, meet in person (or optionally by video), and the Host is paid after the meetup. The platform keeps a 15% commission.

Design and build for a phone FIRST. Desktop is a secondary, simply scaled-up layout. Every decision below prioritizes one-handed use on a 360-430px wide screen.

## 2. Tech stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase: Auth, Postgres, Storage, Realtime (chat), Row Level Security on every table
- Stripe Connect (Express accounts) for payments and Host payouts; multi-currency
- PWA: manifest, service worker, installable, offline fallback page, web push notifications
- Maps: Mapbox or Google Maps (Places + geocoding)
- ID verification: Stripe Identity (or Persona/Veriff)
- Transactional email: Resend
- Deploy: Vercel

## 3. MOBILE-FIRST REQUIREMENTS (highest priority)
Layout and navigation
- Design at 375px width first, then scale up. No horizontal scrolling on any screen.
- Persistent bottom tab bar with 5 tabs: Explore, Map, Bookings, Chat, Profile. Active tab clearly highlighted, unread badges on Chat and Bookings.
- All primary actions sit in the thumb zone (bottom third of the screen). Use sticky bottom action bars, for example a "Book now" button pinned above the tab bar on a Host profile.
- Use bottom sheets (draggable, swipe-down to dismiss) instead of modals for filters, date/time pickers, booking summary, and report/block menus.
- Respect safe areas (iPhone notch and home indicator) using env(safe-area-inset-*). Use dvh units, not vh, so the browser address bar doesn't break layouts.
- Minimum touch target 44x44px, with at least 8px spacing between tappable elements.
- Body text at least 16px (prevents iOS zoom on inputs). Use correct input types and inputmode (tel, email, numeric) so the right keyboard appears.
- When the keyboard opens, the focused field and its submit button must stay visible. Chat input stays above the keyboard.

Interactions
- Explore feed: vertically scrolling Host cards with large photo, name, rating, price per hour, distance, and category chips. Horizontal swipeable category chips at the top. Pull-to-refresh and infinite scroll.
- Host profile: full-width photo carousel (swipe), sticky header that collapses on scroll, tabs for About / Availability / Reviews.
- Map tab: full-screen map with Host pins, a draggable bottom sheet listing nearby Hosts, "Search this area" button, and a "use my location" button.
- Booking flow as a stepped bottom sheet: date, time, duration, meeting place suggestion, price breakdown, pay. Max 4 taps from profile to payment. Support Apple Pay and Google Pay through Stripe.
- Haptic-style feedback with subtle animations (use Framer Motion, 150-250ms). Skeleton loaders everywhere instead of spinners. Respect prefers-reduced-motion.
- Swipe gestures: swipe a booking card to reveal quick actions (chat, cancel); swipe back to navigate where natural.
- Image upload uses the phone camera or gallery directly (input accept="image/*" capture), with client-side compression before upload.

Performance and reliability on mobile networks
- Target Lighthouse mobile score 90+. Initial JS bundle small; lazy-load map and heavy components; use next/image with responsive sizes and WebP/AVIF.
- Works on slow 3G: cache the last Explore results and bookings offline, queue chat messages when offline and send on reconnect, show a clear offline banner.
- PWA install prompt shown after a user's first completed booking, plus an "Add to Home Screen" help page for iOS.
- Web push notifications: new booking request, booking accepted/declined, new message, reminder 1 hour before the meetup, review request after.

Mobile-first testing requirement
- Layouts must be verified at 360px, 390px, and 430px widths, in portrait and landscape, on iOS Safari and Android Chrome.

## 4. Users and roles
- Booker: browses, books, pays, chats, reviews.
- Host: creates a profile, sets price and availability, accepts or declines bookings, gets paid.
- One account can be both (a toggle "Switch to Hosting" in Profile).
- Admin: separate dashboard (desktop-friendly, but still usable on mobile).

## 5. Screens and flows
1. Onboarding: 3 short swipeable intro slides, then sign up with Google or email (magic link). Ask for location permission with a clear explanation, with a manual city search fallback.
2. Explore (home): search bar, category chips, filters (price, distance, rating, availability today, language), sorted by distance by default.
3. Host profile: photos, verified badge, bio, categories, languages, price per hour, rating, review list, availability, "Save" (heart) and "Message" buttons.
4. Booking flow: pick date/time from the Host's availability, duration (1-4 hours), meeting place (suggested public places list from map, required for first meetings), notes, price breakdown (price + service fee), pay. Booking states: requested, accepted, declined, paid/confirmed, completed, cancelled, disputed.
5. Bookings tab: Upcoming / Past, with status chips, countdown to the next meetup, and a "Share my trip" button.
6. Chat: real-time 1-to-1 chat per booking, unread indicators, image sharing, typing indicator. Chat unlocks when a booking is requested. Block phone numbers and external links in messages until the booking is confirmed (platform leakage protection).
7. Host dashboard (within Profile): earnings, pending requests, calendar, payout status, edit profile and availability.
8. Profile and settings: edit details, saved Hosts, notification settings, language, currency, safety center, help, delete account.
9. Reviews: after completion, both sides rate 1-5 stars with an optional comment (within 7 days, hidden until both submit or the window closes).

## 6. Payments
- Booker pays upfront through Stripe Checkout/Payment Element (cards, Apple Pay, Google Pay).
- Funds are held; after the meetup is marked complete by both sides (or auto-complete 24 hours later with no dispute), release to the Host's Stripe Connect account minus 15% platform commission.
- Cancellation policy: full refund if cancelled 24+ hours before; 50% within 24 hours; Host cancellations always get a full refund to the Booker.
- Multi-currency display, based on the user's country, with conversion handled by Stripe.
- Dispute flow: either side can open a dispute within 24 hours after the meetup; admin reviews it.

## 7. Safety and trust (non-negotiable)
- Hosts must complete ID verification before appearing in search. Show a "Verified" badge.
- Public meeting place required for first meetings (suggest cafes, malls, parks via map).
- "Share my trip": send booking details and live location link to a trusted contact by SMS or WhatsApp.
- One-tap SOS button during an active booking that shows local emergency numbers and notifies the saved emergency contact.
- Report and block on every profile and chat. Reports go to the admin queue.
- Terms: social time only; no sexual services, no illegal activity; violations lead to a permanent ban. Users must accept terms at sign-up.
- Hide exact home addresses; show approximate area only.
- Rate limiting and basic spam and scam detection on messages.

## 8. Points system (no crypto)
- Points stored in the database only. Earn points per completed booking and per review.
- Redeem points as discounts on future bookings (for example 100 points = $1 off).
- Show a points balance and history in Profile.
- Do NOT implement any cryptocurrency or token.

## 9. Database (Supabase Postgres, RLS enabled)
Tables: profiles, host_profiles, categories, host_categories, availability_slots, bookings, payments, payouts, conversations, messages, reviews, favorites, reports, blocks, points_ledger, notifications, emergency_contacts, admin_actions.
Use PostGIS (or lat/long with indexes) for distance queries. Write RLS policies so users only see their own bookings, messages, and payments, and Hosts only see requests addressed to them.

## 10. Admin dashboard
Users, Hosts awaiting verification, bookings, disputes, reports queue, revenue and commission totals, ability to suspend or ban accounts, and refund manually.

## 11. Internationalization
English first, with the i18n structure in place (next-intl) for adding languages. Handle time zones properly: store UTC, display in the user's local time. Support RTL later.

## 12. Visual design
Friendly, warm, trustworthy. Rounded cards, soft shadows, one strong accent color, large readable type, real photos prominent. Dark mode supported. Accessible contrast (WCAG AA), screen-reader labels on all icons.

## 13. Build order
1. Project setup, Supabase schema, RLS, auth, PWA shell with bottom tab navigation
2. Host profiles and Explore feed (mobile layout first)
3. Map tab and location features
4. Booking flow and Stripe Connect payments
5. Chat with realtime and push notifications
6. Reviews, points, safety features (verification, share trip, SOS, report/block)
7. Admin dashboard
8. Offline support, performance pass, and mobile testing across the screen sizes above

## 14. Acceptance criteria
- A new user can sign up, find a Host nearby, and complete a paid booking in under 2 minutes on a phone, using one hand.
- No screen has horizontal scroll or clipped content at 360px.
- The app is installable on iOS and Android home screens and works offline for previously loaded content.
- Funds are only released to Hosts after completion, and the 15% commission is calculated correctly.
- Every table has RLS, and no user can read another user's private data.

Start with steps 1 and 2. After each step, tell me what you built and what to test on my phone before moving on.
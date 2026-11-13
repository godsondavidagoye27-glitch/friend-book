# TASK: Phase 1 of FriendBook, turn the prototype into a real, secure foundation

You are working in an existing Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion repo called FriendBook. Read plan.md first; it is the source of truth for the product. Then read src/app/page.tsx, src/components/booking-flow.tsx, src/components/mobile-shell.tsx, src/app/layout.tsx, globals.css, tailwind.config.ts, and public/manifest.webmanifest.

The current code is a static, mobile-first UI prototype with hardcoded mock data. Mobile (360-430px, one-handed use) is the top priority in every decision. Keep the existing visual style (warm orange accent, rounded cards, bottom sheet, bottom tab bar) and improve it, don't redesign it.

## Rules for how you work
- Work in small steps. After each numbered step below: run `npm run lint` and `npm run build`, fix errors, then give me a short summary of what changed and what I should test on my phone before you continue.
- Do not add Stripe, chat, maps, push notifications, reviews, or admin yet. Those are later phases. Do not implement any crypto or token.
- Never put secrets in client code. Use .env.local plus a committed .env.example listing every variable with a placeholder. Only NEXT_PUBLIC_ variables may reach the browser.
- Ask me before installing anything not listed here.
- If something in plan.md conflicts with the code, tell me, and don't guess.

## Step 0: Audit (no code changes)
List what exists, what is mock, and what breaks on mobile. Confirm the issues I already know about: no viewport meta / viewport-fit=cover, missing icon files referenced by the manifest, no service worker, 58vh instead of dvh in the booking sheet, all logic in one page.tsx, fee math only on the client, hardcoded hosts and badge counts. Add anything else you find. Wait for my "go" only if you find something that changes the plan.

## Step 1: Mobile foundations
- layout.tsx: export a `viewport` object (width=device-width, initialScale=1, viewportFit='cover', themeColor) and set apple-touch-icon and appleWebApp metadata.
- Replace Arial with next/font (a friendly, readable sans such as Inter or Plus Jakarta Sans). Body text at least 16px; inputs at least 16px so iOS doesn't zoom.
- Replace unicode icons with lucide-react icons (aria-labels kept).
- Switch all vh to dvh. Make sure the sticky tab bar and the bottom sheet respect env(safe-area-inset-bottom). Keep all touch targets at least 44x44px.
- Generate simple placeholder PWA icons (192, 512, plus a maskable one and apple-touch-icon) so the manifest is valid.
- Add a service worker (use a small, well-maintained approach, or a hand-written one) with: app shell caching, an offline fallback page at /offline, and an offline banner component. Do not cache authenticated API responses blindly.
- Add skeleton loader components and use them instead of spinners.

## Step 2: Real routing
Replace the single-page tab state with real routes using a route group for the app shell:
- /explore, /map, /bookings, /chat, /profile (tabs), /host/[id] (host profile), /login, /onboarding.
- The bottom tab bar uses next/link and usePathname for the active state. Remove the hardcoded badge numbers (leave a clean prop or hook for unread counts to be wired later).
- Move the booking sheet so it opens from /host/[id] (sticky "Book now" bar above the tab bar). Keep it as a bottom sheet with drag-to-dismiss.
- Split page.tsx into components (HostCard, CategoryChips, HostList, etc.). Keep files small and typed.

## Step 3: Supabase setup
- Install @supabase/supabase-js and @supabase/ssr. Create browser and server clients, and middleware that refreshes the session and protects /bookings, /chat, /profile (redirect to /login).
- Create supabase/migrations/ with SQL migrations (not ad-hoc dashboard changes) for these tables: profiles, host_profiles, categories, host_categories, availability_slots, bookings. Use uuid primary keys, created_at/updated_at, and store all timestamps in UTC (timestamptz). Store host location as lat/lng (or PostGIS geography if available) with an index for distance queries, and store only an approximate public area, never an exact address.
- bookings must include: booker_id, host_id, starts_at, duration_hours, place_name, status (requested, accepted, declined, confirmed, completed, cancelled, disputed), price_cents, service_fee_cents, currency, notes.
- Enable Row Level Security on EVERY table, with explicit policies:
  - profiles: users read basic public fields of others, but only update their own row.
  - host_profiles: publicly readable only when verified = true; hosts edit only their own.
  - bookings: only the booker and the host can read them; only the booker can create one for themselves; status changes follow allowed transitions (enforce with a database function or trigger, not just client code).
- Write a seed.sql with 8-10 sample hosts across 2 cities (use the existing mock data as a base) and categories.
- Document every step I need to do manually (create the Supabase project, run migrations, set env vars) in README.md.

## Step 4: Auth and onboarding
- Sign in with Google and email magic link via Supabase Auth. Terms of Service acceptance is required at sign-up (store accepted_terms_at). Add placeholder /terms and /privacy pages stating: social time only; no sexual services; no illegal activity.
- 3-slide swipeable onboarding, then a location permission request with a plain explanation and a manual city-search fallback. Save the chosen city on the profile.
- A "Switch to Hosting" toggle in Profile that creates a host_profiles row (unverified, hidden from search until verified).

## Step 5: Real Explore and Host profile
- Explore reads hosts from Supabase (server components where possible), only verified hosts, sorted by distance when location is known. Category chips filter results. Pull-to-refresh and infinite scroll. Skeletons while loading.
- /host/[id] shows photos, bio, categories, price, rating (placeholder until reviews exist), and availability from availability_slots.
- Convert images to next/image with sensible sizes. Remove the wildcard remotePatterns hostname; restrict it to the actual image hosts (Supabase Storage plus Unsplash for seed data).

## Step 6: Booking request (no payment yet)
- The booking sheet reads real availability from the host, and creates a booking with status "requested" through a server action or API route.
- Compute price, service fee (15%), and total ON THE SERVER from the host's price and the duration. Never trust amounts sent from the client.
- Require a public meeting place for a first-time booking between the same two users. The place list can still be a static suggestion list for now.
- Bookings tab shows Upcoming and Past from the database with status chips. Hosts can accept or decline requests from the Profile > Host dashboard (simple list for now).

## Definition of done for Phase 1
- A new user can sign up, set a city, browse real verified hosts from the database, open a profile, and send a booking request in under 2 minutes, one-handed, on a phone.
- No horizontal scroll or clipped content at 360px, 390px, and 430px, portrait and landscape.
- The app is installable (valid manifest, icons, service worker) and shows the offline page without a connection.
- RLS is enabled on every table, and I can see test queries or tests proving one user can't read another user's bookings.
- `npm run lint` and `npm run build` pass. README explains setup from zero.

Start with Step 0 and Step 1 only, then stop and report.


# TASK: Phase 1.5 of FriendBook, build EVERY page and screen before payments (Phase 2)

Context: Phase 1 is done (real routing, Supabase auth, RLS, real Explore, host profile, booking requests). Read plan.md, README.md, docs/routes.md (create it if missing), the existing supabase/migrations, and the existing components before writing any code.

Goal: when this phase is finished, every screen a user, host, or admin will ever see exists, is reachable by navigation, works on a phone, and is wired to real data wherever no third-party service is required. Phase 2 will then only plug in Stripe, Stripe Identity, push delivery, and payouts.

## Ground rules
- MOBILE FIRST, always. Design at 375px, verify at 360, 390, 430, portrait and landscape. One-handed use. Primary actions in the bottom third. Touch targets at least 44x44px. Text and inputs at least 16px. Safe-area insets and dvh everywhere. No horizontal scroll on any page.
- Reuse and extend the existing design (warm orange accent, rounded cards, bottom sheets). Build shared components first (see "Shared components") and use them on every page for consistency.
- EVERY page must implement four states: loading (skeleton, no spinners), empty (friendly message plus a next action), error (message plus retry), and success. No page may show only the happy path.
- Real data where the backend exists. For anything that depends on Phase 2 services (card payment, payouts, Stripe ID verification, push delivery), build the full UI and put the service behind a small interface (for example `lib/services/payments.ts`) with a clearly named stub implementation and a visible "Coming soon" or "Test mode" marker. NEVER fake a success: a stubbed payment must not mark a booking as paid, and a stubbed verification must not mark a host as verified.
- Every route is protected correctly: public, signed-in, host-only, or admin-only. Admin is gated by a role column checked on the server AND by RLS, never by client code alone.
- Add database migrations (never dashboard edits) for any new table, each with RLS enabled and explicit policies. Add seed data so every page has something to show in development.
- Accessibility: semantic HTML, labels on icon buttons, visible focus, AA contrast, respects prefers-reduced-motion.
- Do not implement any cryptocurrency or token. Points are database-only.
- Work in the order below. After each group: run lint and build, fix errors, update docs/routes.md, and give me a short report: pages built, what to test on my phone, anything stubbed. Then wait for my "continue".

## New database tables needed (migrations with RLS)
conversations, messages, reviews, favorites, reports, blocks, points_ledger, notifications, notification_preferences, emergency_contacts, disputes, host_verifications (status only, filled by Phase 2), admin_actions (audit log), payment_methods (stub fields only, no card data ever stored), payouts (stub), and a user_roles or role column on profiles (user, host, admin). Add an `is_suspended` flag and enforce it in RLS.

## Shared components (build first)
PageHeader (back button, title, optional action), BottomSheet (drag to dismiss, focus trap), BottomActionBar (sticky above the tab bar, safe-area aware), EmptyState, ErrorState, Skeleton variants, Toast, ConfirmDialog (as a bottom sheet), Avatar, RatingStars, StatusChip (booking and verification statuses), VerifiedBadge, Tabs/SegmentedControl, FormField with inline errors, ImageUploader (camera or gallery, client compression, Supabase Storage), ListRow (settings style), OfflineBanner, PullToRefresh, InfiniteList, SwipeableCard.

## GROUP A: Public and marketing pages (no login)
1. `/` Landing page: hero, how it works in 3 steps, safety highlights, featured categories, sample hosts, "Get started" and "Become a host" buttons, FAQ preview, footer. Signed-in users are redirected to /explore.
2. `/how-it-works` Detailed steps for bookers and hosts.
3. `/safety` Public safety center: verification, public-place rule, share my trip, SOS, reporting, what is not allowed.
4. `/community-guidelines` Rules of conduct: social time only, no sexual services, no illegal activity, consequences.
5. `/terms`, `/privacy`, `/cookies` Full placeholder legal pages with last-updated dates, clearly marked for lawyer review before launch.
6. `/help` FAQ with search and categories (bookings, payments, safety, hosting, account), plus `/help/[slug]` article pages.
7. `/contact` Contact and support form (stores to a support_requests table), plus email link.
8. `/install` "Add to Home Screen" guide with separate iOS and Android steps.
9. System pages: custom 404, global error page, `/offline`, `/maintenance`, and a loading.tsx for each route group.

## GROUP B: Authentication and onboarding
10. `/login` Google and email magic link, terms acceptance, link to /terms and /privacy.
11. `/auth/callback` Handles the OAuth/magic-link return and redirects to onboarding or the app.
12. `/auth/check-email` "We sent you a link" screen with resend (rate limited).
13. `/onboarding` 3 swipeable intro slides, then profile basics (name, photo, birth date with 18+ check, short bio), then location permission with manual city fallback, then interests/categories, then notification permission explanation. Resumable if the user quits halfway.
14. `/account/suspended` Shown to suspended users with an appeal/contact link.
15. `/account/deleted` Confirmation after account deletion.

## GROUP C: Main app tabs and discovery (signed in)
16. `/explore` Real data: search bar, category chips, filter bottom sheet (price, distance, rating, availability today, language, verified), sorting, infinite scroll, pull to refresh.
17. `/explore/search` Full-screen search with recent searches and suggestions.
18. `/map` Full-screen map with host pins, draggable bottom sheet list, "Search this area", "Use my location". Use Mapbox GL via env token (lazy loaded). If the token is missing, show a clear list-only fallback. Never crash without a token.
19. `/host/[id]` Host profile: photo carousel, verified badge, bio, categories, languages, price, rating, About / Availability / Reviews tabs, Save, Message, Report/Block menu, sticky Book now bar.
20. `/host/[id]/reviews` Full reviews list with rating breakdown.
21. `/saved` Saved hosts (favorites) with remove and empty state.
22. `/notifications` Notification center: unread/read, tap to open the related booking/chat, mark all read.

## GROUP D: Bookings
23. `/bookings` Tabs: Upcoming / Past / Cancelled, status chips, countdown to the next meetup, swipe actions.
24. `/bookings/[id]` Booking detail: status timeline, host/booker info, date, time, place, price breakdown (server-computed), cancel with a policy explanation sheet, message button, Share my trip, SOS button (active bookings only), report an issue, add to calendar (.ics download), receipt link.
25. `/bookings/[id]/receipt` Printable receipt page (payment fields show "pending" until Phase 2).
26. `/bookings/[id]/review` Rating plus comment form, with a 7-day window and "review hidden until both submit" logic.
27. `/bookings/[id]/dispute` Open a dispute: reason, description, photo upload, status of an existing dispute.
28. `/bookings/[id]/safety` Share-my-trip setup, emergency contact picker, and the SOS flow: confirmation, shows local emergency numbers by country, notifies the saved contact via a stubbed notification service.
29. `/book/[hostId]/success` Booking-requested confirmation screen, with a clear message that payment comes in the next step (Phase 2 placeholder).

## GROUP E: Chat
30. `/chat` Conversation list with unread badges, last message preview, search, empty state.
31. `/chat/[conversationId]` Real-time chat using Supabase Realtime: message bubbles, timestamps, typing indicator, image sharing, sent/failed states, offline queue with retry, input stays above the keyboard, report/block menu. Chat is created when a booking is requested. Block phone numbers, emails, and external links in messages until the booking is confirmed, and show a short notice explaining why.

## GROUP F: Profile, settings, and account
32. `/profile` Hub: avatar, name, points balance, quick links, "Switch to Hosting" / "Host dashboard", sign out.
33. `/profile/edit` Edit name, photo, bio, birth date (locked after set), city, languages, interests.
34. `/profile/points` Points balance, ledger history, how to earn, how to redeem (applied as discounts in Phase 2).
35. `/profile/notifications` Notification preferences per type and channel (push, email).
36. `/profile/settings` Language, currency, units, time zone, theme (light/dark/system).
37. `/profile/safety` Emergency contacts (add/edit/remove), trusted-contact defaults, safety tips.
38. `/profile/privacy` Privacy settings, data download request (stub that records the request), blocked users link.
39. `/profile/blocked` Blocked users list with unblock.
40. `/profile/payment-methods` UI shell only, with a "Payments arrive soon" state. Never collect or store card numbers in our own database or forms.
41. `/profile/delete-account` Explains consequences, requires typing a confirmation, handles users with active bookings, then soft-deletes and signs out.

## GROUP G: Host experience
42. `/become-host` Multi-step host onboarding: intro and requirements, categories, bio and headline, photos (minimum 3), price per hour, languages, areas covered, weekly availability, safety agreement, submit for review. Saves progress between steps.
43. `/host-dashboard` Overview: pending requests, next meetup, this month's earnings (placeholder until Phase 2), profile completeness, verification status.
44. `/host-dashboard/requests` Incoming requests: accept, decline (with an optional reason), and filters by status.
45. `/host-dashboard/calendar` Availability editor: weekly recurring hours, one-off blocks, vacation mode, and upcoming confirmed bookings overlaid.
46. `/host-dashboard/profile` Edit host profile, photos reorder/remove, categories, price, pause/unpause listing.
47. `/host-dashboard/verification` Verification status screen with steps. The ID check button is a Phase 2 stub: it shows "ID verification coming soon" and does NOT mark the host verified. Include an admin-approved status so verification can be set manually during testing.
48. `/host-dashboard/earnings` Earnings summary and history (stub values from completed bookings, calculated with the 15% commission on the server).
49. `/host-dashboard/payouts` Payout setup screen shell (Stripe Connect arrives in Phase 2), payout history table (empty state).
50. `/host-dashboard/reviews` Reviews received, with an option to respond publicly.

## GROUP H: Admin (desktop friendly, usable on mobile)
Role-gated on the server and by RLS. Every action writes to admin_actions (who, what, when, target).
51. `/admin` Overview cards: new users, active bookings, open reports, open disputes, hosts awaiting verification, revenue placeholder.
52. `/admin/users` Search, view, suspend/unsuspend, ban, view user's bookings and reports.
53. `/admin/hosts` Verification queue: approve/reject with reason, view photos and details.
54. `/admin/bookings` List with filters and a detail view; a manual status override is logged.
55. `/admin/disputes` Queue with evidence from both sides, decision options (refund / release / partial; recorded now, executed in Phase 2).
56. `/admin/reports` Reports queue (users, messages, hosts) with actions: dismiss, warn, suspend.
57. `/admin/categories` Manage categories.
58. `/admin/revenue` Commission and revenue summary (placeholder data until Phase 2).
59. `/admin/audit-log` Read-only audit log.

## Navigation and wiring
- Bottom tab bar (Explore, Map, Bookings, Chat, Profile) with real unread badges from the database (chat messages and notifications).
- Every page has a sensible back behavior. No dead ends; every empty state has a next action.
- Footer links on public pages; a settings list in Profile linking to every account page above.
- Create docs/routes.md: a table of every route, its access level (public / signed-in / host / admin), its data source, and its status (real / stubbed / TODO).

## Quality checks before you say "done"
1. Click-through test: write a script or checklist that visits every route in the table with a normal user, a host, an admin, and a signed-out user, confirming correct access (allowed pages load; forbidden pages redirect).
2. RLS tests: show that user A can't read user B's bookings, messages, reports, emergency contacts, or notifications; that non-admins can't read admin data; and that suspended users are blocked.
3. Mobile pass at 360, 390, and 430px for every page. List any page that still needs work.
4. Lighthouse mobile run on /, /explore, /host/[id], and /bookings/[id], with results reported.
5. `npm run lint` and `npm run build` pass; README updated with new setup steps (Mapbox token, storage buckets, new env vars in .env.example).
6. A final summary: total pages built, what is stubbed and waiting for Phase 2, and known issues.

Begin with the new migrations and shared components, then Group A. Stop after each group and report.
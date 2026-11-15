# Amiora product spec

## Product overview
Amiora is a mobile-first marketplace for booking social time with nearby people. The app helps users discover nearby hosts, request a meetup, and build trust through profile verification, public-meeting rules, and community safety features.

## Core product goals
- Keep the app frictionless on a phone: 360px to 430px support, one-handed interaction, safe-area aware layout, and touch targets that are at least 44 x 44 px.
- Let users browse nearby verified hosts and request a social time booking.
- Keep the experience safety-first: public meeting places only, clear community guidelines, and moderation hooks.
- Defer payments, payouts, and advanced verification to a later phase while leaving clean service boundaries.

## Primary user roles
- Bookers: search, message, save, book, and manage upcoming plans.
- Hosts: create a public profile, list availability, accept or decline bookings, and respond to reviews.
- Admins: review reports, disputes, user suspension, and verification queues.

## Current product constraints
- No payment collection or card storage in the app until Phase 2.
- No fake success states for Phase 2 services. Any payment, ID check, or payout work must remain behind a stub with a clear “coming soon” marker.
- Database access must be governed by Postgres RLS, not by client-only checks.
- Only the smallest runtime-safe, authenticated data should be exposed to the browser.

## Non-goals for this phase
- Stripe, Stripe Identity, Connect, and payment settlement.
- Push notifications or delivery integrations.
- Full real-time chat beyond the UI skeleton and database schema.
- Fine-grained map or geospatial analytics beyond approximate location handling.

## Safety principles
- Public places only for first-time meetups.
- Meeting rules and a reporting flow are part of the product, not an afterthought.
- Suspended accounts must be blocked from normal access paths.
- Host verification is explicit and never auto-marked as approved without an admin or later Phase 2 action.

## Success criteria for Phase 1
- A user can sign up, set a city, browse verified hosts, view a host profile, and create a booking request in under two minutes.
- The app is installable and works offline at the shell level.
- RLS is enabled across the core tables, and test queries prove a user cannot access another user’s private data.
- `npm run lint` and `npm run build` pass for the app shell.

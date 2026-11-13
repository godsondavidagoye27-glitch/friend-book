# FriendBook

FriendBook is a mobile-first marketplace for booking social time with nearby people.

## Local setup

1. Copy `.env.example` to `.env.local` and fill in your values.
2. Install dependencies with `npm install`.
3. Run the app with `npm run dev -- --hostname 0.0.0.0 --port 3000`.
4. Open the app in a browser or on your phone using the local network address.

## Required environment variables

```bash
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_NAME=FriendBook
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

## Project notes

- Public pages are implemented in the Next.js app router and mobile-first styling is kept in Tailwind.
- The app uses a warm orange visual identity with bottom navigation, safe-area spacing, and touch-friendly controls.
- Phase 2 payment and verification integrations are intentionally stubbed behind clear service boundaries.
- The database migration and seed files live under `supabase/migrations` and `supabase/seed.sql`.

## Next steps

- Create a Supabase project and run the SQL migrations.
- Add the app to a real storage bucket for profile photos.
- Wire Mapbox and future payment / verification services in Phase 2.

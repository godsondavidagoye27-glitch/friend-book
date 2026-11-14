# FriendBook

FriendBook is a mobile-first marketplace for booking social time with nearby people.

## Local setup

1. Copy `.env.example` to `.env.local` and fill in your values.
2. Install dependencies with `npm install`.
3. Create a Supabase project and run the migrations from `supabase/migrations`.
4. Run the app with `npm run dev -- --hostname 0.0.0.0 --port 3000`.
5. Open the app in a browser or on your phone using the local network address.

## Required environment variables

```bash
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_NAME=FriendBook
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
NEXT_PUBLIC_SUPPORT_EMAIL=support@friendbook.example
```

## Supabase setup checklist

1. Create a new project in Supabase.
2. In Project Settings > API, copy the Project URL and anon key into the env file.
3. In Project Settings > Database, enable Row Level Security if needed and run the SQL files under `supabase/migrations` in order.
4. Configure the Auth redirect URL in Supabase to include:
   - `http://localhost:3000/auth/callback`
   - `http://127.0.0.1:3000/auth/callback`
5. Add a storage bucket for profile and host photos if you plan to upload media in later phases.
6. Create the app URLs for your local and production environment before enabling social login.

## Project notes

- Public pages are implemented in the Next.js app router and mobile-first styling is kept in Tailwind.
- The app uses a warm orange visual identity with bottom navigation, safe-area spacing, and touch-friendly controls.
- Phase 2 payment and verification integrations are intentionally stubbed behind clear service boundaries.
- The database migration and seed files live under `supabase/migrations` and `supabase/seed.sql`.
- Server-side Supabase session management and route protection are now wired through the app middleware and auth callback.

## Next steps

- Apply the hardened SQL migration once it is approved.
- Add real auth flows and profile creation after the session foundation is in place.
- Wire Mapbox and future payment / verification services in Phase 2.

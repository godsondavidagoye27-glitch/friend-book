# Route inventory

| Route | Access | Data source | Status |
| --- | --- | --- | --- |
| `/` | Public | Static mock data | Real UI |
| `/how-it-works` | Public | Static mock content | Real UI |
| `/safety` | Public | Static content | Real UI |
| `/community-guidelines` | Public | Static content | Real UI |
| `/terms` | Public | Static content | Real UI |
| `/privacy` | Public | Static content | Real UI |
| `/cookies` | Public | Static content | Real UI |
| `/help` | Public | Static FAQ data | Real UI |
| `/help/[slug]` | Public | Static article data | Real UI |
| `/contact` | Public | Staged support form stub | Stubbed |
| `/install` | Public | Static guide | Real UI |
| `/offline` | Public | Offline fallback page | Real UI |
| `/maintenance` | Public | Static notice | Real UI |
| `/404` | Public | Next.js default | Real UI |
| `/login` | Public | Auth stub | TODO |
| `/auth/callback` | Public | Auth callback stub | TODO |
| `/auth/check-email` | Public | Auth stub | TODO |
| `/onboarding` | Signed in | Profile onboarding | TODO |
| `/explore` | Signed in | Host data | Live Supabase-backed |
| `/map` | Signed in | Map data | Live Supabase-backed |
| `/host/[id]` | Signed in | Host profile data | TODO |
| `/saved` | Signed in | Favorites | TODO |
| `/notifications` | Signed in | Notifications | TODO |
| `/bookings` | Signed in | Booking data | TODO |
| `/chat` | Signed in | Conversations | TODO |
| `/profile` | Signed in | User profile | TODO |
| `/become-host` | Signed in | Host onboarding | TODO |
| `/host-dashboard` | Host | Host dashboard | TODO |
| `/admin` | Admin | Admin metrics | TODO |

The public sitemap is in place and the next phases will add the authenticated routes and the real database-backed data model.

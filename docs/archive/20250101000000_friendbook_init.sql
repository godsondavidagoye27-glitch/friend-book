create extension if not exists "pgcrypto";

create type user_role as enum ('user', 'host', 'admin');
create type booking_status as enum ('requested', 'accepted', 'declined', 'confirmed', 'completed', 'cancelled', 'disputed');
create type verification_status as enum ('pending', 'approved', 'rejected', 'needs_more_info');
create type report_status as enum ('open', 'reviewing', 'resolved');

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text not null,
  username text,
  avatar_url text,
  city text,
  bio text,
  birth_date date,
  role user_role not null default 'user',
  accepted_terms_at timestamptz,
  is_suspended boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists host_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references profiles(id) on delete cascade,
  headline text,
  bio text,
  price_per_hour integer not null default 25,
  verified boolean not null default false,
  is_hidden boolean not null default false,
  city text not null,
  latitude double precision,
  longitude double precision,
  public_area text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists host_profiles_verified_idx on host_profiles (verified, is_hidden);
create index if not exists host_profiles_location_idx on host_profiles (city, latitude, longitude);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists host_categories (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references host_profiles(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(host_id, category_id)
);

create table if not exists availability_slots (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references host_profiles(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_blocked boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists availability_slots_host_time_idx on availability_slots (host_id, starts_at, ends_at);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  booker_id uuid not null references profiles(id) on delete cascade,
  host_id uuid not null references host_profiles(id) on delete cascade,
  starts_at timestamptz not null,
  duration_hours integer not null check (duration_hours > 0),
  place_name text not null,
  status booking_status not null default 'requested',
  price_cents integer not null default 0,
  service_fee_cents integer not null default 0,
  currency text not null default 'USD',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_booker_idx on bookings (booker_id, starts_at);
create index if not exists bookings_host_idx on bookings (host_id, starts_at);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_one uuid not null references profiles(id) on delete cascade,
  user_two uuid not null references profiles(id) on delete cascade,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  unique(user_one, user_two)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  body text,
  image_url text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  host_id uuid not null references host_profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  host_id uuid not null references host_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, host_id)
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles(id) on delete cascade,
  reported_user_id uuid references profiles(id) on delete set null,
  reported_host_id uuid references host_profiles(id) on delete set null,
  reason text not null,
  description text,
  status report_status not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references profiles(id) on delete cascade,
  blocked_user_id uuid references profiles(id) on delete set null,
  blocked_host_id uuid references host_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists points_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  delta integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  kind text not null,
  title text not null,
  body text,
  is_read boolean not null default false,
  target_route text,
  created_at timestamptz not null default now()
);

create table if not exists notification_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  push_enabled boolean not null default true,
  email_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  phone text not null,
  relationship text,
  created_at timestamptz not null default now()
);

create table if not exists disputes (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  opened_by uuid not null references profiles(id) on delete cascade,
  reason text not null,
  description text,
  status report_status not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists host_verifications (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null unique references host_profiles(id) on delete cascade,
  status verification_status not null default 'pending',
  notes text,
  reviewed_by uuid references profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admin_actions (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references profiles(id) on delete cascade,
  action text not null,
  target_type text,
  target_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);

create table if not exists payment_methods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  brand text,
  last4 text,
  country text,
  status text not null default 'stubbed',
  created_at timestamptz not null default now()
);

create table if not exists payouts (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references host_profiles(id) on delete cascade,
  amount_cents integer not null default 0,
  status text not null default 'pending',
  destination text,
  created_at timestamptz not null default now()
);

create table if not exists support_requests (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table host_profiles enable row level security;
alter table categories enable row level security;
alter table host_categories enable row level security;
alter table availability_slots enable row level security;
alter table bookings enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table reviews enable row level security;
alter table favorites enable row level security;
alter table reports enable row level security;
alter table blocks enable row level security;
alter table points_ledger enable row level security;
alter table notifications enable row level security;
alter table notification_preferences enable row level security;
alter table emergency_contacts enable row level security;
alter table disputes enable row level security;
alter table host_verifications enable row level security;
alter table admin_actions enable row level security;
alter table payment_methods enable row level security;
alter table payouts enable row level security;
alter table support_requests enable row level security;

create policy "profiles_select_public_and_own" on profiles for select using (auth.uid() = id or true);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);

create policy "host_profiles_select_verified" on host_profiles for select using (verified = true or auth.uid() = profile_id);
create policy "host_profiles_update_own" on host_profiles for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "host_profiles_insert_own" on host_profiles for insert with check (auth.uid() = profile_id);

create policy "categories_public_read" on categories for select using (true);
create policy "categories_admin_only" on categories for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin')) with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "host_categories_public_read" on host_categories for select using (true);
create policy "host_categories_manage_own" on host_categories for all using (
  exists (select 1 from host_profiles hp where hp.id = host_categories.host_id and hp.profile_id = auth.uid())
) with check (
  exists (select 1 from host_profiles hp where hp.id = host_categories.host_id and hp.profile_id = auth.uid())
);

create policy "availability_public_read" on availability_slots for select using (true);
create policy "availability_manage_own" on availability_slots for all using (
  exists (select 1 from host_profiles hp where hp.id = availability_slots.host_id and hp.profile_id = auth.uid())
) with check (
  exists (select 1 from host_profiles hp where hp.id = availability_slots.host_id and hp.profile_id = auth.uid())
);

create policy "bookings_read_own" on bookings for select using (
  booker_id = auth.uid() or host_id in (select id from host_profiles where profile_id = auth.uid())
);
create policy "bookings_insert_own" on bookings for insert with check (booker_id = auth.uid());
create policy "bookings_update_own_or_host" on bookings for update using (
  booker_id = auth.uid() or host_id in (select id from host_profiles where profile_id = auth.uid())
) with check (
  booker_id = auth.uid() or host_id in (select id from host_profiles where profile_id = auth.uid())
);

create policy "conversations_own_read" on conversations for select using (
  user_one = auth.uid() or user_two = auth.uid()
);
create policy "conversations_own_manage" on conversations for all using (
  user_one = auth.uid() or user_two = auth.uid()
) with check (
  user_one = auth.uid() or user_two = auth.uid()
);

create policy "messages_own_read" on messages for select using (
  exists (
    select 1 from conversations c
    where c.id = messages.conversation_id and (c.user_one = auth.uid() or c.user_two = auth.uid())
  )
);
create policy "messages_manage_own" on messages for all using (
  sender_id = auth.uid()
) with check (
  sender_id = auth.uid()
);

create policy "reviews_public_read" on reviews for select using (true);
create policy "reviews_manage_own" on reviews for all using (
  author_id = auth.uid() or host_id in (select id from host_profiles where profile_id = auth.uid())
) with check (
  author_id = auth.uid() or host_id in (select id from host_profiles where profile_id = auth.uid())
);

create policy "favorites_own_manage" on favorites for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "reports_own_manage" on reports for all using (reporter_id = auth.uid()) with check (reporter_id = auth.uid());
create policy "blocks_own_manage" on blocks for all using (blocker_id = auth.uid()) with check (blocker_id = auth.uid());
create policy "points_own_read" on points_ledger for select using (user_id = auth.uid());
create policy "notifications_own_read" on notifications for select using (user_id = auth.uid());
create policy "notification_preferences_own_manage" on notification_preferences for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "emergency_contacts_own_manage" on emergency_contacts for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "disputes_own_read" on disputes for select using (opened_by = auth.uid() or exists (select 1 from bookings b where b.id = disputes.booking_id and b.host_id in (select id from host_profiles where profile_id = auth.uid())));
create policy "disputes_own_manage" on disputes for all using (opened_by = auth.uid()) with check (opened_by = auth.uid());
create policy "host_verifications_manage_admin_or_own" on host_verifications for all using (
  exists (select 1 from host_profiles hp where hp.id = host_verifications.host_id and hp.profile_id = auth.uid()) or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
) with check (
  exists (select 1 from host_profiles hp where hp.id = host_verifications.host_id and hp.profile_id = auth.uid()) or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "admin_actions_admin_only" on admin_actions for select using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "payment_methods_own_manage" on payment_methods for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "payouts_host_manage" on payouts for all using (
  exists (select 1 from host_profiles hp where hp.id = payouts.host_id and hp.profile_id = auth.uid())
) with check (
  exists (select 1 from host_profiles hp where hp.id = payouts.host_id and hp.profile_id = auth.uid())
);
create policy "support_requests_insert_public" on support_requests for insert with check (true);
create policy "support_requests_admin_read" on support_requests for select using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_set_updated_at before update on profiles for each row execute procedure set_updated_at();
create trigger host_profiles_set_updated_at before update on host_profiles for each row execute procedure set_updated_at();
create trigger notification_preferences_set_updated_at before update on notification_preferences for each row execute procedure set_updated_at();
create trigger host_verifications_set_updated_at before update on host_verifications for each row execute procedure set_updated_at();
create trigger bookings_set_updated_at before update on bookings for each row execute procedure set_updated_at();

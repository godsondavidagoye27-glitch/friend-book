BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE public.user_role AS ENUM ('user', 'host', 'admin');
CREATE TYPE public.booking_status AS ENUM ('requested', 'accepted', 'declined', 'confirmed', 'completed', 'cancelled', 'disputed');
CREATE TYPE public.verification_status AS ENUM ('pending', 'approved', 'rejected', 'needs_more_info');
CREATE TYPE public.report_status AS ENUM ('open', 'reviewing', 'resolved');

CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE,
    full_name text NOT NULL CHECK (btrim(full_name) <> ''),
    username text UNIQUE,
    avatar_url text,
    city text,
    bio text CHECK (bio IS NULL OR char_length(bio) <= 500),
    birth_date date,
    role public.user_role NOT NULL DEFAULT 'user',
    accepted_terms_at timestamptz,
    is_suspended boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (email IS NULL OR btrim(email) <> '')
);

CREATE TABLE public.host_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    headline text,
    bio text CHECK (bio IS NULL OR char_length(bio) <= 500),
    price_per_hour integer NOT NULL DEFAULT 25 CHECK (price_per_hour BETWEEN 10 AND 1000),
    verified boolean NOT NULL DEFAULT false,
    is_hidden boolean NOT NULL DEFAULT false,
    city text NOT NULL CHECK (btrim(city) <> ''),
    latitude double precision CHECK (latitude IS NULL OR (latitude BETWEEN -90 AND 90)),
    longitude double precision CHECK (longitude IS NULL OR (longitude BETWEEN -180 AND 180)),
    public_area text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text NOT NULL UNIQUE CHECK (btrim(slug) <> ''),
    name text NOT NULL CHECK (btrim(name) <> ''),
    description text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.host_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id uuid NOT NULL REFERENCES public.host_profiles(id) ON DELETE CASCADE,
    category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (host_id, category_id)
);

CREATE TABLE public.availability_slots (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id uuid NOT NULL REFERENCES public.host_profiles(id) ON DELETE CASCADE,
    starts_at timestamptz NOT NULL,
    ends_at timestamptz NOT NULL,
    is_blocked boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    CHECK (ends_at > starts_at)
);

CREATE TABLE public.bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    booker_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    host_id uuid NOT NULL REFERENCES public.host_profiles(id) ON DELETE CASCADE,
    starts_at timestamptz NOT NULL,
    duration_hours integer NOT NULL CHECK (duration_hours BETWEEN 1 AND 8),
    place_name text NOT NULL CHECK (btrim(place_name) <> ''),
    status public.booking_status NOT NULL DEFAULT 'requested',
    price_cents integer NOT NULL DEFAULT 0 CHECK (price_cents >= 0),
    service_fee_cents integer NOT NULL DEFAULT 0 CHECK (service_fee_cents >= 0),
    currency text NOT NULL DEFAULT 'USD' CHECK (btrim(currency) <> ''),
    notes text CHECK (notes IS NULL OR char_length(notes) <= 1000),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (booker_id <> host_id)
);

CREATE TABLE public.conversations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_one uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_two uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    last_message_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_one, user_two),
    CHECK (user_one <> user_two)
);

CREATE TABLE public.messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    body text CHECK (body IS NULL OR char_length(body) BETWEEN 1 AND 5000),
    image_url text,
    is_read boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    host_id uuid NOT NULL REFERENCES public.host_profiles(id) ON DELETE CASCADE,
    rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment text CHECK (comment IS NULL OR char_length(comment) <= 1000),
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (booking_id, author_id)
);

CREATE TABLE public.favorites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    host_id uuid NOT NULL REFERENCES public.host_profiles(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, host_id)
);

CREATE TABLE public.reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    reported_host_id uuid REFERENCES public.host_profiles(id) ON DELETE SET NULL,
    reason text NOT NULL CHECK (btrim(reason) <> ''),
    description text CHECK (description IS NULL OR char_length(description) <= 2000),
    status public.report_status NOT NULL DEFAULT 'open',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.blocks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    blocker_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    blocked_user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    blocked_host_id uuid REFERENCES public.host_profiles(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    CHECK (COALESCE(blocked_user_id::text, '') <> '' OR COALESCE(blocked_host_id::text, '') <> '')
);

CREATE TABLE public.points_ledger (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    delta integer NOT NULL,
    reason text NOT NULL CHECK (btrim(reason) <> ''),
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    kind text NOT NULL CHECK (btrim(kind) <> ''),
    title text NOT NULL CHECK (btrim(title) <> ''),
    body text CHECK (body IS NULL OR char_length(body) <= 500),
    is_read boolean NOT NULL DEFAULT false,
    target_route text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.notification_preferences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    push_enabled boolean NOT NULL DEFAULT true,
    email_enabled boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.emergency_contacts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name text NOT NULL CHECK (btrim(name) <> ''),
    phone text NOT NULL CHECK (btrim(phone) <> ''),
    relationship text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.disputes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    opened_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason text NOT NULL CHECK (btrim(reason) <> ''),
    description text CHECK (description IS NULL OR char_length(description) <= 2000),
    status public.report_status NOT NULL DEFAULT 'open',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.host_verifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id uuid NOT NULL UNIQUE REFERENCES public.host_profiles(id) ON DELETE CASCADE,
    status public.verification_status NOT NULL DEFAULT 'pending',
    notes text CHECK (notes IS NULL OR char_length(notes) <= 1000),
    reviewed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.admin_actions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action text NOT NULL CHECK (btrim(action) <> ''),
    target_type text,
    target_id uuid,
    details jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.payment_methods (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    brand text,
    last4 text,
    country text,
    status text NOT NULL DEFAULT 'stubbed',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.payouts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id uuid NOT NULL REFERENCES public.host_profiles(id) ON DELETE CASCADE,
    amount_cents integer NOT NULL DEFAULT 0 CHECK (amount_cents >= 0),
    status text NOT NULL DEFAULT 'pending',
    destination text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.support_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text CHECK (name IS NULL OR btrim(name) <> ''),
    email text CHECK (email IS NULL OR btrim(email) <> ''),
    message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 5000),
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE VIEW public.public_profiles AS
SELECT p.id,
       p.full_name,
       p.avatar_url,
       p.city,
       p.bio
FROM public.profiles p
WHERE p.is_suspended = false;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = auth.uid()
          AND p.role = 'admin'
    );
$$;

CREATE OR REPLACE FUNCTION public.is_booking_party(p_booking_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.bookings b
        WHERE b.id = p_booking_id
          AND (b.booker_id = auth.uid() OR public.is_host_of(b.host_id))
    );
$$;

CREATE OR REPLACE FUNCTION public.is_host_of(p_host_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.host_profiles hp
        WHERE hp.id = p_host_id
          AND hp.profile_id = auth.uid()
    );
$$;

CREATE OR REPLACE FUNCTION public.profiles_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        NEW.email := lower(trim(NEW.email));
        NEW.role := COALESCE(NEW.role, 'user');
        NEW.is_suspended := COALESCE(NEW.is_suspended, false);
    END IF;

    IF TG_OP = 'UPDATE' THEN
        IF NEW.role IS DISTINCT FROM OLD.role
           AND NOT (current_user = 'postgres' OR current_setting('role', true) = 'service_role' OR public.is_admin()) THEN
            RAISE EXCEPTION 'role changes are restricted';
        END IF;

        IF NEW.is_suspended IS DISTINCT FROM OLD.is_suspended
           AND NOT (current_user = 'postgres' OR current_setting('role', true) = 'service_role' OR public.is_admin()) THEN
            RAISE EXCEPTION 'suspension changes are restricted';
        END IF;

        IF NEW.email IS DISTINCT FROM OLD.email
           AND NOT (current_user = 'postgres' OR current_setting('role', true) = 'service_role' OR public.is_admin()) THEN
            RAISE EXCEPTION 'email changes are restricted';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_guard
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.profiles_guard();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, username, role, is_suspended)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NULL,
        'user',
        false
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.notification_preferences (user_id, push_enabled, email_enabled)
    VALUES (NEW.id, true, true)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.host_profiles_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        NEW.verified := false;
    END IF;

    IF TG_OP = 'UPDATE' THEN
        IF NEW.verified IS DISTINCT FROM OLD.verified
           AND NOT (current_user = 'postgres' OR current_setting('role', true) = 'service_role' OR public.is_admin()) THEN
            RAISE EXCEPTION 'verified status is restricted';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER host_profiles_guard
BEFORE INSERT OR UPDATE ON public.host_profiles
FOR EACH ROW EXECUTE FUNCTION public.host_profiles_guard();

CREATE OR REPLACE FUNCTION public.set_host_verification_status(p_host_verification_id uuid, p_status public.verification_status, p_notes text DEFAULT NULL)
RETURNS public.host_verifications
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_row public.host_verifications;
BEGIN
    IF NOT (current_user = 'postgres' OR current_setting('role', true) = 'service_role' OR public.is_admin()) THEN
        RAISE EXCEPTION 'Only admins or the service role may review host verifications';
    END IF;

    UPDATE public.host_verifications
    SET status = p_status,
        notes = COALESCE(p_notes, notes),
        reviewed_by = auth.uid(),
        reviewed_at = now(),
        updated_at = now()
    WHERE id = p_host_verification_id
    RETURNING * INTO v_row;

    IF v_row IS NULL THEN
        RAISE EXCEPTION 'Host verification not found';
    END IF;

    IF p_status = 'approved' THEN
        UPDATE public.host_profiles
        SET verified = true,
            updated_at = now()
        WHERE id = v_row.host_id;
    ELSIF p_status IN ('rejected', 'needs_more_info') THEN
        UPDATE public.host_profiles
        SET verified = false,
            updated_at = now()
        WHERE id = v_row.host_id;
    END IF;

    INSERT INTO public.admin_actions (actor_id, action, target_type, target_id, details)
    VALUES (auth.uid(), 'host_verification_status', 'host_verification', v_row.id, jsonb_build_object('status', p_status, 'host_id', v_row.host_id));

    RETURN v_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_booking_request(
    p_host_id uuid,
    p_starts_at timestamptz,
    p_duration_hours integer,
    p_place_name text,
    p_notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_booker_id uuid := auth.uid();
    v_host public.host_profiles%ROWTYPE;
    v_end_at timestamptz;
    v_host_profile public.profiles%ROWTYPE;
    v_booking_id uuid;
    v_conversation_id uuid;
BEGIN
    IF v_booker_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    SELECT * INTO v_host_profile
    FROM public.profiles
    WHERE id = v_booker_id;

    IF v_host_profile.is_suspended THEN
        RAISE EXCEPTION 'Suspended users cannot create bookings';
    END IF;

    SELECT * INTO v_host
    FROM public.host_profiles
    WHERE id = p_host_id;

    IF v_host.id IS NULL THEN
        RAISE EXCEPTION 'Host not found';
    END IF;

    IF v_host.profile_id = v_booker_id THEN
        RAISE EXCEPTION 'You cannot book your own profile';
    END IF;

    IF NOT v_host.verified OR v_host.is_hidden THEN
        RAISE EXCEPTION 'Host is not available for booking';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.availability_slots s
        WHERE s.host_id = p_host_id
          AND s.is_blocked = false
          AND s.starts_at <= p_starts_at
          AND s.ends_at >= p_starts_at + make_interval(hours => p_duration_hours)
    ) = false THEN
        RAISE EXCEPTION 'Selected slot is not available';
    END IF;

    v_end_at := p_starts_at + make_interval(hours => p_duration_hours);

    IF EXISTS (
        SELECT 1
        FROM public.bookings b
        WHERE b.host_id = p_host_id
          AND b.status IN ('accepted', 'confirmed')
          AND b.starts_at < v_end_at
          AND b.starts_at + make_interval(hours => b.duration_hours) > p_starts_at
    ) THEN
        RAISE EXCEPTION 'This time overlaps with an existing accepted or confirmed booking';
    END IF;

    INSERT INTO public.bookings (
        booker_id,
        host_id,
        starts_at,
        duration_hours,
        place_name,
        status,
        price_cents,
        service_fee_cents,
        currency,
        notes
    )
    VALUES (
        v_booker_id,
        p_host_id,
        p_starts_at,
        p_duration_hours,
        p_place_name,
        'requested',
        v_host.price_per_hour * p_duration_hours * 100,
        ((v_host.price_per_hour * p_duration_hours * 100) * 15) / 100,
        'USD',
        p_notes
    )
    RETURNING id INTO v_booking_id;

    INSERT INTO public.conversations (user_one, user_two)
    SELECT LEAST(v_booker_id, v_host.profile_id), GREATEST(v_booker_id, v_host.profile_id)
    WHERE NOT EXISTS (
        SELECT 1
        FROM public.conversations c
        WHERE c.user_one = LEAST(v_booker_id, v_host.profile_id)
          AND c.user_two = GREATEST(v_booker_id, v_host.profile_id)
    )
    RETURNING id INTO v_conversation_id;

    IF v_conversation_id IS NULL THEN
        SELECT c.id INTO v_conversation_id
        FROM public.conversations c
        WHERE c.user_one = LEAST(v_booker_id, v_host.profile_id)
          AND c.user_two = GREATEST(v_booker_id, v_host.profile_id);
    END IF;

    INSERT INTO public.notifications (user_id, kind, title, body, target_route)
    VALUES (
        v_host.profile_id,
        'booking_request',
        'New booking request',
        'A guest requested a booking with you.',
        '/bookings'
    );

    RETURN v_booking_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.respond_to_booking(p_booking_id uuid, p_action text)
RETURNS public.bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_booking public.bookings%ROWTYPE;
BEGIN
    IF p_action NOT IN ('accept', 'decline') THEN
        RAISE EXCEPTION 'Unsupported action';
    END IF;

    SELECT * INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id;

    IF v_booking.id IS NULL THEN
        RAISE EXCEPTION 'Booking not found';
    END IF;

    IF NOT public.is_host_of(v_booking.host_id) THEN
        RAISE EXCEPTION 'Only the host may respond to this booking';
    END IF;

    IF v_booking.status <> 'requested' THEN
        RAISE EXCEPTION 'Only requested bookings may be accepted or declined';
    END IF;

    UPDATE public.bookings
    SET status = CASE WHEN p_action = 'accept' THEN 'accepted' ELSE 'declined' END,
        updated_at = now()
    WHERE id = p_booking_id
    RETURNING * INTO v_booking;

    INSERT INTO public.notifications (user_id, kind, title, body, target_route)
    VALUES (
        v_booking.booker_id,
        CASE WHEN p_action = 'accept' THEN 'booking_accepted' ELSE 'booking_declined' END,
        CASE WHEN p_action = 'accept' THEN 'Booking accepted' ELSE 'Booking declined' END,
        CASE WHEN p_action = 'accept' THEN 'Your booking request was accepted by the host.' ELSE 'Your booking request was declined by the host.' END,
        '/bookings'
    );

    RETURN v_booking;
END;
$$;

CREATE OR REPLACE FUNCTION public.confirm_booking(p_booking_id uuid)
RETURNS public.bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_booking public.bookings%ROWTYPE;
BEGIN
    SELECT * INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id;

    IF v_booking.id IS NULL THEN
        RAISE EXCEPTION 'Booking not found';
    END IF;

    IF NOT (public.is_host_of(v_booking.host_id) OR public.is_admin()) THEN
        RAISE EXCEPTION 'Only the host or an admin may confirm this booking';
    END IF;

    IF v_booking.status <> 'accepted' THEN
        RAISE EXCEPTION 'Only accepted bookings may be confirmed';
    END IF;

    UPDATE public.bookings
    SET status = 'confirmed',
        updated_at = now()
    WHERE id = p_booking_id
    RETURNING * INTO v_booking;

    INSERT INTO public.notifications (user_id, kind, title, body, target_route)
    VALUES (
        v_booking.booker_id,
        'booking_confirmed',
        'Booking confirmed',
        'Your booking has been confirmed by the host.',
        '/bookings'
    );

    RETURN v_booking;
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_booking(p_booking_id uuid)
RETURNS public.bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_booking public.bookings%ROWTYPE;
BEGIN
    SELECT * INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id;

    IF v_booking.id IS NULL THEN
        RAISE EXCEPTION 'Booking not found';
    END IF;

    IF NOT (v_booking.booker_id = auth.uid() OR public.is_host_of(v_booking.host_id) OR public.is_admin()) THEN
        RAISE EXCEPTION 'Only the booking parties or an admin may cancel';
    END IF;

    IF v_booking.status NOT IN ('requested', 'accepted', 'confirmed') THEN
        RAISE EXCEPTION 'This booking cannot be cancelled in its current state';
    END IF;

    UPDATE public.bookings
    SET status = 'cancelled', updated_at = now()
    WHERE id = p_booking_id
    RETURNING * INTO v_booking;

    RETURN v_booking;
END;
$$;

CREATE OR REPLACE FUNCTION public.booking_transition_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.status = OLD.status THEN
        RETURN NEW;
    END IF;

    IF OLD.status = 'requested' AND NEW.status IN ('accepted', 'declined', 'cancelled') THEN
        RETURN NEW;
    END IF;

    IF OLD.status = 'accepted' AND NEW.status IN ('confirmed', 'cancelled') THEN
        IF NEW.status = 'confirmed' AND NOT (current_user = 'postgres' OR current_setting('role', true) = 'service_role' OR public.is_admin()) THEN
            RAISE EXCEPTION 'confirmed status can only be set by admins or the service role';
        END IF;
        RETURN NEW;
    END IF;

    IF OLD.status = 'confirmed' AND NEW.status IN ('completed', 'cancelled', 'disputed') THEN
        IF NEW.status = 'completed' AND NOT (current_user = 'postgres' OR current_setting('role', true) = 'service_role' OR public.is_admin()) THEN
            RAISE EXCEPTION 'completed status can only be set by admins or the service role';
        END IF;
        RETURN NEW;
    END IF;

    IF OLD.status = 'completed' AND NEW.status = 'disputed' THEN
        RETURN NEW;
    END IF;

    RAISE EXCEPTION 'Invalid booking status transition from % to %', OLD.status, NEW.status;
END;
$$;

CREATE OR REPLACE FUNCTION public.bookings_immutability_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        IF NEW.booker_id IS DISTINCT FROM OLD.booker_id OR
           NEW.host_id IS DISTINCT FROM OLD.host_id OR
           NEW.price_cents IS DISTINCT FROM OLD.price_cents OR
           NEW.service_fee_cents IS DISTINCT FROM OLD.service_fee_cents THEN
            RAISE EXCEPTION 'booking money and party fields are immutable after creation';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER booking_transition_guard
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.booking_transition_guard();

CREATE TRIGGER booking_immutability_guard
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.bookings_immutability_guard();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER host_profiles_updated_at BEFORE UPDATE ON public.host_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER notification_preferences_updated_at BEFORE UPDATE ON public.notification_preferences FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER host_verifications_updated_at BEFORE UPDATE ON public.host_verifications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.public_reviews_filter()
RETURNS TABLE (
    id uuid,
    booking_id uuid,
    author_id uuid,
    host_id uuid,
    rating integer,
    comment text,
    created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT r.id, r.booking_id, r.author_id, r.host_id, r.rating, r.comment, r.created_at
    FROM public.reviews r
    JOIN public.bookings b ON b.id = r.booking_id
    WHERE b.status = 'completed'
      AND (
          EXISTS (
              SELECT 1
              FROM public.reviews r2
              WHERE r2.booking_id = r.booking_id
                AND r2.author_id <> r.author_id
          )
          OR b.updated_at < now() - interval '7 days'
      );
$$;

CREATE VIEW public.public_reviews AS
SELECT *
FROM public.public_reviews_filter();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_select_own_admin ON public.profiles
FOR SELECT
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY profiles_insert_own ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id AND current_setting('role', true) <> 'anon');

CREATE POLICY profiles_update_own ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY public_profiles_select_authenticated ON public.public_profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY host_profiles_select_public_or_own ON public.host_profiles
FOR SELECT
USING (
    (verified = true AND is_hidden = false)
    OR public.is_host_of(id)
    OR public.is_admin()
);

CREATE POLICY host_profiles_insert_own ON public.host_profiles
FOR INSERT
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY host_profiles_update_own ON public.host_profiles
FOR UPDATE
USING (public.is_host_of(id))
WITH CHECK (public.is_host_of(id));

CREATE POLICY categories_select_all ON public.categories
FOR SELECT USING (true);
CREATE POLICY host_categories_select_all ON public.host_categories
FOR SELECT USING (true);

CREATE POLICY availability_slots_select_all ON public.availability_slots
FOR SELECT USING (true);

CREATE POLICY bookings_select_own_or_admin ON public.bookings
FOR SELECT
USING (
    booker_id = auth.uid()
    OR public.is_host_of(host_id)
    OR public.is_admin()
);

CREATE POLICY conversations_select_own ON public.conversations
FOR SELECT
USING (
    user_one = auth.uid() OR user_two = auth.uid() OR public.is_admin()
);

CREATE POLICY messages_select_own ON public.messages
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM public.conversations c
        WHERE c.id = messages.conversation_id
          AND (c.user_one = auth.uid() OR c.user_two = auth.uid())
    )
    OR public.is_admin()
);

CREATE POLICY messages_insert_participant ON public.messages
FOR INSERT
WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
        SELECT 1
        FROM public.conversations c
        WHERE c.id = messages.conversation_id
          AND (c.user_one = auth.uid() OR c.user_two = auth.uid())
    )
    AND NOT EXISTS (
        SELECT 1
        FROM public.blocks b
        WHERE (
            (b.blocker_id = auth.uid() AND b.blocked_user_id = (
                SELECT CASE
                    WHEN c.user_one = auth.uid() THEN c.user_two
                    ELSE c.user_one
                END
                FROM public.conversations c
                WHERE c.id = messages.conversation_id
            ))
            OR (b.blocker_id = auth.uid() AND b.blocked_host_id = (
                SELECT hp.id
                FROM public.host_profiles hp
                JOIN public.conversations c ON c.id = messages.conversation_id
                WHERE hp.profile_id = CASE WHEN c.user_one = auth.uid() THEN c.user_two ELSE c.user_one END
            ))
        )
    )
);

CREATE POLICY reviews_select_public ON public.reviews
FOR SELECT
USING (
    public.is_admin()
    OR auth.uid() = author_id
    OR public.is_host_of(host_id)
    OR EXISTS (
        SELECT 1
        FROM public.public_reviews pr
        WHERE pr.id = reviews.id
    )
);

CREATE POLICY reviews_insert_party ON public.reviews
FOR INSERT
WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (
        SELECT 1
        FROM public.bookings b
        WHERE b.id = reviews.booking_id
          AND b.status = 'completed'
          AND (b.booker_id = auth.uid() OR public.is_host_of(b.host_id))
    )
);

CREATE POLICY favorites_own ON public.favorites
FOR ALL
USING (user_id = auth.uid() OR public.is_admin())
WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY reports_own_admin ON public.reports
FOR SELECT
USING (reporter_id = auth.uid() OR public.is_admin());

CREATE POLICY reports_insert_own ON public.reports
FOR INSERT
WITH CHECK (reporter_id = auth.uid());

CREATE POLICY reports_update_admin ON public.reports
FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY blocks_own ON public.blocks
FOR ALL
USING (blocker_id = auth.uid() OR public.is_admin())
WITH CHECK (blocker_id = auth.uid() OR public.is_admin());

CREATE POLICY points_ledger_select_own ON public.points_ledger
FOR SELECT
USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY notifications_select_own ON public.notifications
FOR SELECT
USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY notification_preferences_own ON public.notification_preferences
FOR ALL
USING (user_id = auth.uid() OR public.is_admin())
WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY emergency_contacts_own ON public.emergency_contacts
FOR ALL
USING (user_id = auth.uid() OR public.is_admin())
WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY disputes_select_own_or_admin ON public.disputes
FOR SELECT
USING (
    opened_by = auth.uid() OR public.is_admin() OR EXISTS (
        SELECT 1
        FROM public.bookings b
        WHERE b.id = disputes.booking_id
          AND public.is_host_of(b.host_id)
    )
);

CREATE POLICY disputes_insert_own ON public.disputes
FOR INSERT
WITH CHECK (opened_by = auth.uid() AND status = 'open');

CREATE POLICY disputes_update_admin ON public.disputes
FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY host_verifications_select_own_or_admin ON public.host_verifications
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM public.host_profiles hp
        WHERE hp.id = host_verifications.host_id
          AND hp.profile_id = auth.uid()
    ) OR public.is_admin()
);

CREATE POLICY host_verifications_insert_own_pending ON public.host_verifications
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.host_profiles hp
        WHERE hp.id = host_verifications.host_id
          AND hp.profile_id = auth.uid()
    )
    AND status = 'pending'
);

CREATE POLICY host_verifications_update_admin ON public.host_verifications
FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY admin_actions_select_admin ON public.admin_actions
FOR SELECT USING (public.is_admin());

CREATE POLICY payment_methods_select_own ON public.payment_methods
FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY payouts_select_own ON public.payouts
FOR SELECT USING (
    EXISTS (
        SELECT 1
        FROM public.host_profiles hp
        WHERE hp.id = payouts.host_id
          AND hp.profile_id = auth.uid()
    ) OR public.is_admin()
);

CREATE POLICY support_requests_select_admin ON public.support_requests
FOR SELECT USING (public.is_admin());

CREATE POLICY support_requests_insert_anon ON public.support_requests
FOR INSERT
WITH CHECK (char_length(message) BETWEEN 10 AND 5000);

CREATE INDEX idx_profiles_email ON public.profiles (email);
CREATE INDEX idx_profiles_username ON public.profiles (username);
CREATE INDEX idx_profiles_role ON public.profiles (role);
CREATE INDEX idx_host_profiles_profile ON public.host_profiles (profile_id);
CREATE INDEX idx_host_profiles_verified_hidden_city ON public.host_profiles (verified, is_hidden, city);
CREATE INDEX idx_host_profiles_location ON public.host_profiles (city, latitude, longitude);
CREATE INDEX idx_host_categories_host ON public.host_categories (host_id);
CREATE INDEX idx_host_categories_category ON public.host_categories (category_id);
CREATE INDEX idx_availability_slots_host_starts ON public.availability_slots (host_id, starts_at, ends_at);
CREATE INDEX idx_bookings_booker_starts ON public.bookings (booker_id, starts_at);
CREATE INDEX idx_bookings_host_starts ON public.bookings (host_id, starts_at);
CREATE INDEX idx_messages_conversation_created ON public.messages (conversation_id, created_at DESC);
CREATE INDEX idx_notifications_user_read ON public.notifications (user_id, is_read, created_at DESC);
CREATE INDEX idx_reports_reporter ON public.reports (reporter_id, created_at DESC);
CREATE INDEX idx_disputes_booking ON public.disputes (booking_id);
CREATE INDEX idx_host_verifications_host ON public.host_verifications (host_id);
CREATE INDEX idx_support_requests_created ON public.support_requests (created_at DESC);

COMMIT;

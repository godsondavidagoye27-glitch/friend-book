insert into categories (id, slug, name, description) values
  ('11111111-1111-4111-8111-111111111111', 'conversation', 'Conversation', 'Casual conversation and social energy'),
  ('11111111-1111-4111-8111-111111111112', 'walking', 'Walking', 'City walks and neighborhood exploration'),
  ('11111111-1111-4111-8111-111111111113', 'fitness', 'Fitness', 'Workout buddies and active plans'),
  ('11111111-1111-4111-8111-111111111114', 'language', 'Language', 'Conversation practice and learning'),
  ('11111111-1111-4111-8111-111111111115', 'coffee', 'Coffee', 'Casual coffee chats and meetups'),
  ('11111111-1111-4111-8111-111111111116', 'city-guide', 'City Guide', 'Local recommendations in the neighborhood')
on conflict do nothing;

insert into profiles (id, email, full_name, username, city, bio, role, accepted_terms_at, is_suspended) values
  ('00000000-0000-4000-8000-000000000001', 'maya@example.com', 'Maya Lee', 'maya', 'San Francisco', 'A foodie who loves easy conversation and city walks.', 'host', now(), false),
  ('00000000-0000-4000-8000-000000000002', 'daniel@example.com', 'Daniel Cruz', 'daniel', 'San Francisco', 'I play football and love social plans outdoors.', 'host', now(), false),
  ('00000000-0000-4000-8000-000000000003', 'noor@example.com', 'Noor Hassan', 'noor', 'New York', 'I help people practice language and enjoy coffee chats.', 'host', now(), false),
  ('00000000-0000-4000-8000-000000000004', 'sara@example.com', 'Sara Nguyen', 'sara', 'Austin', 'Walking buddy and local culture enthusiast.', 'host', now(), false),
  ('00000000-0000-4000-8000-000000000005', 'leo@example.com', 'Leo Martin', 'leo', 'Seattle', 'I host casual city guides and conversation meetups.', 'host', now(), false),
  ('00000000-0000-4000-8000-000000000006', 'jordan@example.com', 'Jordan Miles', 'jordan', 'San Francisco', 'Looking for friendly plans and easygoing conversation.', 'user', now(), false),
  ('00000000-0000-4000-8000-000000000007', 'admin@example.com', 'Amiora Admin', 'amiora_admin', 'Remote', 'Platform admin support.', 'admin', now(), false)
on conflict do nothing;

insert into host_profiles (id, profile_id, headline, bio, price_per_hour, verified, is_hidden, city, latitude, longitude, public_area) values
  ('22222222-2222-4222-8222-222222222221', '00000000-0000-4000-8000-000000000001', 'Conversation guide', 'I love meeting new people and showing them the best of the city.', 28, true, false, 'San Francisco', 37.7749, -122.4194, 'Mission District'),
  ('22222222-2222-4222-8222-222222222222', '00000000-0000-4000-8000-000000000002', 'Visible and active', 'I organize easy social plans for football fans and curious locals.', 35, true, false, 'San Francisco', 37.7893, -122.4222, 'SoMa'),
  ('22222222-2222-4222-8222-222222222223', '00000000-0000-4000-8000-000000000003', 'Language and coffee sessions', 'I help people relax, practice speaking, and meet people in a casual setting.', 24, true, false, 'New York', 40.7128, -74.0060, 'Lower East Side'),
  ('22222222-2222-4222-8222-222222222224', '00000000-0000-4000-8000-000000000004', 'Neighborhood walk host', 'I know the local hotspots and love conversation-friendly city walks.', 30, true, false, 'Austin', 30.2672, -97.7431, 'South Congress'),
  ('22222222-2222-4222-8222-222222222225', '00000000-0000-4000-8000-000000000005', 'Explorer and host', 'I welcome curious travelers and local residents who enjoy easy plans.', 32, true, false, 'Seattle', 47.6062, -122.3321, 'Capitol Hill')
on conflict do nothing;

insert into host_categories (host_id, category_id) values
  ('22222222-2222-4222-8222-222222222221', '11111111-1111-4111-8111-111111111111'),
  ('22222222-2222-4222-8222-222222222221', '11111111-1111-4111-8111-111111111116'),
  ('22222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111112'),
  ('22222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111113'),
  ('22222222-2222-4222-8222-222222222223', '11111111-1111-4111-8111-111111111114'),
  ('22222222-2222-4222-8222-222222222223', '11111111-1111-4111-8111-111111111115'),
  ('22222222-2222-4222-8222-222222222224', '11111111-1111-4111-8111-111111111112'),
  ('22222222-2222-4222-8222-222222222224', '11111111-1111-4111-8111-111111111116'),
  ('22222222-2222-4222-8222-222222222225', '11111111-1111-4111-8111-111111111111'),
  ('22222222-2222-4222-8222-222222222225', '11111111-1111-4111-8111-111111111116')
on conflict do nothing;

insert into availability_slots (host_id, starts_at, ends_at, is_blocked) values
  ('22222222-2222-4222-8222-222222222221', now() + interval '1 day', now() + interval '1 day 2 hours', false),
  ('22222222-2222-4222-8222-222222222222', now() + interval '2 days', now() + interval '2 days 2 hours', false),
  ('22222222-2222-4222-8222-222222222223', now() + interval '3 days', now() + interval '3 days 1 hour', false),
  ('22222222-2222-4222-8222-222222222224', now() + interval '4 days', now() + interval '4 days 2 hours', false),
  ('22222222-2222-4222-8222-222222222225', now() + interval '5 days', now() + interval '5 days 3 hours', false)
on conflict do nothing;



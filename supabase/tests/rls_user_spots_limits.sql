begin;

select plan(5);

select tests.create_test_user('limit_user1', 'limit_user1', 'Limit User One', 'active');

insert into public.maps (id, user_id, name, is_public)
values ('70000000-0000-0000-0000-000000000001', tests.get_supabase_uid('limit_user1'), 'Limit Map', true);

select tests.authenticate_as('limit_user1');

-- Insert 30 spots (non-premium default)
insert into public.user_spots (id, user_id, map_id, description, latitude, longitude, is_public)
select
  gen_random_uuid(),
  tests.get_supabase_uid('limit_user1'),
  '70000000-0000-0000-0000-000000000001',
  'spot ' || gs::text,
  35.0 + (gs::double precision / 1000.0),
  139.0 + (gs::double precision / 1000.0),
  true
from generate_series(1, 30) as gs;

select is(
  (select count(*) from public.user_spots where map_id = '70000000-0000-0000-0000-000000000001')::bigint,
  30::bigint,
  'non-premium can insert up to 30 spots'
);

select throws_ok($$
  insert into public.user_spots (id, user_id, map_id, description, latitude, longitude, is_public)
  values ('71000000-0000-0000-0000-000000000031', tests.get_supabase_uid('limit_user1'), '70000000-0000-0000-0000-000000000001', 'spot 31', 35.5, 139.5, true)
$$, '42501', null, 'non-premium cannot insert 31st spot');

select is(
  (select count(*) from public.user_spots where map_id = '70000000-0000-0000-0000-000000000001')::bigint,
  30::bigint,
  'spot count remains 30 after failed insert'
);
reset role;

-- Upgrade to premium (admin/service role)
update public.users set is_premium = true
where id = tests.get_supabase_uid('limit_user1');

select tests.authenticate_as('limit_user1');
select lives_ok($$
  insert into public.user_spots (id, user_id, map_id, description, latitude, longitude, is_public)
  values ('71000000-0000-0000-0000-000000000032', tests.get_supabase_uid('limit_user1'), '70000000-0000-0000-0000-000000000001', 'spot 31 premium', 35.6, 139.6, true)
$$, 'premium can insert beyond 30');
reset role;

select is(
  (select count(*) from public.user_spots where map_id = '70000000-0000-0000-0000-000000000001')::bigint,
  31::bigint,
  'spot count becomes 31 after premium insert'
);

select * from finish();
rollback;

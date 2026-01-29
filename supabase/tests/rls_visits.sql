begin;

select plan(6);

select tests.create_test_user('vis_user1', 'vis_user1', 'Visit User One', 'active');
select tests.create_test_user('vis_user2', 'vis_user2', 'Visit User Two', 'active');

-- マスタデータ: continents → countries → regions → prefectures → machi
insert into public.continents (id, name, display_order, latitude, longitude)
values ('test_asia', 'Test Asia', 1, 35.0, 135.0);

insert into public.countries (id, name, latitude, longitude, continent_id)
values ('test_jp', 'Test Japan', 35.0, 135.0, 'test_asia');

insert into public.regions (id, name, display_order, latitude, longitude, country_id)
values ('test_kanto', 'Test Kanto', 1, 35.0, 139.0, 'test_jp');

insert into public.prefectures (id, name, region_id, latitude, longitude)
values ('test_tokyo', 'Test Tokyo', 'test_kanto', 35.6, 139.7);

insert into public.machi (id, name, prefecture_id, prefecture_name)
values
  ('machi_001', 'Test Machi 1', 'test_tokyo', 'Test Tokyo'),
  ('machi_002', 'Test Machi 2', 'test_tokyo', 'Test Tokyo'),
  ('machi_003', 'Test Machi 3', 'test_tokyo', 'Test Tokyo');

insert into public.visits (id, user_id, machi_id, visited_at)
values ('c0000000-0000-0000-0000-000000000001', tests.get_supabase_uid('vis_user1'), 'machi_001', now());

-- user1 sees own visits
select tests.authenticate_as('vis_user1');
select is(
  (select count(*) from public.visits)::bigint,
  1::bigint,
  'user1 sees own visits'
);
reset role;

-- user2 cannot see user1 visits
select tests.authenticate_as('vis_user2');
select is(
  (select count(*) from public.visits)::bigint,
  0::bigint,
  'user2 cannot see user1 visits'
);
reset role;

-- user1 can insert own visit
select tests.authenticate_as('vis_user1');
select lives_ok($$
  insert into public.visits (id, user_id, machi_id, visited_at)
  values ('c0000000-0000-0000-0000-000000000002', tests.get_supabase_uid('vis_user1'), 'machi_002', now())
$$, 'user1 can insert own visit');
reset role;

-- user2 cannot insert for user1
select tests.authenticate_as('vis_user2');
select throws_ok($$
  insert into public.visits (id, user_id, machi_id, visited_at)
  values ('c0000000-0000-0000-0000-000000000003', tests.get_supabase_uid('vis_user1'), 'machi_003', now())
$$, '42501', null, 'user2 cannot insert for user1');
reset role;

-- user1 can update own visit
select tests.authenticate_as('vis_user1');
select lives_ok($$
  update public.visits set visited_at = now()
  where id = 'c0000000-0000-0000-0000-000000000001'
$$, 'user1 can update own visit');
reset role;

-- user2 cannot update user1 visit (row remains unchanged)
select tests.authenticate_as('vis_user2');
update public.visits set machi_id = 'machi_999'
where id = 'c0000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select machi_id from public.visits where id = 'c0000000-0000-0000-0000-000000000001'),
  'machi_001',
  'user2 cannot update user1 visit'
);

select * from finish();
rollback;

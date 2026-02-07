begin;

select plan(6);

select tests.create_test_user('sch_user1', 'sch_user1', 'Sch User One', 'active');
select tests.create_test_user('sch_user2', 'sch_user2', 'Sch User Two', 'active');

-- Setup: insert prerequisite master data chain (continent → country → region → prefecture → machi)
insert into public.continents (id, name, latitude, longitude) values ('sch_cont', 'テスト大陸', 35.0, 139.0)
on conflict (id) do nothing;
insert into public.countries (id, name, latitude, longitude, continent_id)
values ('sch_country', 'テスト国', 35.0, 139.0, 'sch_cont')
on conflict (id) do nothing;
insert into public.regions (id, name, display_order, latitude, longitude, country_id)
values ('sch_region', 'テスト地方', 1, 35.0, 139.0, 'sch_country')
on conflict (id) do nothing;
insert into public.prefectures (id, name, region_id, latitude, longitude)
values ('sch_pref', 'テスト県', 'sch_region', 35.0, 139.0)
on conflict (id) do nothing;
insert into public.machi (id, name, prefecture_id, prefecture_name)
values ('sch_machi_01', 'テスト街', 'sch_pref', 'テスト県');

-- user1 can insert own schedule
select tests.authenticate_as('sch_user1');
select lives_ok($$
  insert into public.schedules (id, user_id, machi_id, scheduled_at, title)
  values ('d2000000-0000-0000-0000-000000000001', tests.get_supabase_uid('sch_user1'), 'sch_machi_01', now() + interval '1 day', 'My Schedule')
$$, 'user1 can insert own schedule');

-- user1 cannot insert schedule for another user
select throws_ok($$
  insert into public.schedules (id, user_id, machi_id, scheduled_at, title)
  values ('d2000000-0000-0000-0000-000000000002', tests.get_supabase_uid('sch_user2'), 'sch_machi_01', now() + interval '1 day', 'Fake')
$$, null, null, 'user1 cannot insert schedule for another user');

-- user1 can see own schedules
select is(
  (select count(*) from public.schedules)::bigint,
  1::bigint,
  'user1 can see own schedules'
);
reset role;

-- user2 cannot see user1 schedules
select tests.authenticate_as('sch_user2');
select is(
  (select count(*) from public.schedules)::bigint,
  0::bigint,
  'user2 cannot see user1 schedules'
);
reset role;

-- user1 can update own schedule
select tests.authenticate_as('sch_user1');
select lives_ok($$
  update public.schedules set title = 'Updated'
  where id = 'd2000000-0000-0000-0000-000000000001'
$$, 'user1 can update own schedule');

-- user1 can delete own schedule
select lives_ok($$
  delete from public.schedules
  where id = 'd2000000-0000-0000-0000-000000000001'
$$, 'user1 can delete own schedule');
reset role;

select * from finish();
rollback;

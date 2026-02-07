begin;

select plan(6);

select tests.create_test_user('ss_user1', 'ss_user1', 'SS User One', 'active');
select tests.create_test_user('ss_user2', 'ss_user2', 'SS User Two', 'active');

-- Setup: map + spot
insert into public.maps (id, user_id, name, is_public)
values ('d6000000-0000-0000-0000-000000000001', tests.get_supabase_uid('ss_user1'), 'SS Map', true);

insert into public.user_spots (id, user_id, map_id, description, latitude, longitude, is_public)
values ('d6100000-0000-0000-0000-000000000001', tests.get_supabase_uid('ss_user1'), 'd6000000-0000-0000-0000-000000000001', 'SS Spot', 35.0, 139.0, true);

-- user1 can insert own spot short
select tests.authenticate_as('ss_user1');
select lives_ok($$
  insert into public.spot_shorts (id, spot_id, user_id, video_url)
  values ('d6200000-0000-0000-0000-000000000001', 'd6100000-0000-0000-0000-000000000001', tests.get_supabase_uid('ss_user1'), 'https://example.com/video.mp4')
$$, 'user1 can insert own spot short');

-- user1 cannot insert spot short as another user
select throws_ok($$
  insert into public.spot_shorts (id, spot_id, user_id, video_url)
  values ('d6200000-0000-0000-0000-000000000002', 'd6100000-0000-0000-0000-000000000001', tests.get_supabase_uid('ss_user2'), 'https://example.com/video2.mp4')
$$, null, null, 'user1 cannot insert spot short as another user');
reset role;

-- user2 can see public spot shorts (via public spot + map)
select tests.authenticate_as('ss_user2');
select is(
  (select count(*) from public.spot_shorts where id = 'd6200000-0000-0000-0000-000000000001')::bigint,
  1::bigint,
  'user2 can see public spot shorts'
);
reset role;

-- user1 can update own spot short
select tests.authenticate_as('ss_user1');
select lives_ok($$
  update public.spot_shorts set video_url = 'https://example.com/updated.mp4'
  where id = 'd6200000-0000-0000-0000-000000000001'
$$, 'user1 can update own spot short');

-- user1 can delete own spot short
select lives_ok($$
  delete from public.spot_shorts
  where id = 'd6200000-0000-0000-0000-000000000001'
$$, 'user1 can delete own spot short');
reset role;

-- anon cannot insert spot short
select tests.clear_authentication();
select throws_ok($$
  insert into public.spot_shorts (id, spot_id, user_id, video_url)
  values ('d6200000-0000-0000-0000-000000000003', 'd6100000-0000-0000-0000-000000000001', tests.get_supabase_uid('ss_user1'), 'https://example.com/video3.mp4')
$$, '42501', null, 'anon cannot insert spot short');
reset role;

select * from finish();
rollback;

begin;

select plan(9);

select tests.create_test_user('spot_user1', 'spot_user1', 'Spot User One', 'active');
select tests.create_test_user('spot_user2', 'spot_user2', 'Spot User Two', 'active');
select tests.create_test_user('spot_user3', 'spot_user3', 'Spot User Three', 'suspended');

insert into public.maps (id, user_id, name, is_public)
values
  ('20000000-0000-0000-0000-000000000001', tests.get_supabase_uid('spot_user1'), 'User1 Public Map', true),
  ('20000000-0000-0000-0000-000000000002', tests.get_supabase_uid('spot_user1'), 'User1 Private Map', false),
  ('20000000-0000-0000-0000-000000000003', tests.get_supabase_uid('spot_user2'), 'User2 Public Map', true);

insert into public.user_spots (
  id, user_id, map_id, description, latitude, longitude, is_public
) values
  ('21000000-0000-0000-0000-000000000001', tests.get_supabase_uid('spot_user1'), '20000000-0000-0000-0000-000000000001', 'Public spot', 35.0, 139.0, true),
  ('21000000-0000-0000-0000-000000000002', tests.get_supabase_uid('spot_user1'), '20000000-0000-0000-0000-000000000001', 'Private spot in public map', 35.1, 139.1, false),
  ('21000000-0000-0000-0000-000000000003', tests.get_supabase_uid('spot_user1'), '20000000-0000-0000-0000-000000000002', 'Private spot in private map', 35.2, 139.2, false),
  ('21000000-0000-0000-0000-000000000004', tests.get_supabase_uid('spot_user2'), '20000000-0000-0000-0000-000000000003', 'User2 public spot', 36.0, 140.0, true);

-- anon only sees public spots in public maps
select tests.clear_authentication();
select is((select count(*) from public.user_spots)::bigint, 2::bigint, 'anon sees only public spots');
reset role;

-- user1 sees own spots + public spots from others
select tests.authenticate_as('spot_user1');
select is((select count(*) from public.user_spots)::bigint, 4::bigint, 'user1 sees own + public spots');
reset role;

-- user2 sees own + public spots
select tests.authenticate_as('spot_user2');
select is((select count(*) from public.user_spots)::bigint, 2::bigint, 'user2 sees own + public spots');
reset role;

-- user1 can insert into own map
select tests.authenticate_as('spot_user1');
select lives_ok($$
  insert into public.user_spots (id, user_id, map_id, description, latitude, longitude, is_public)
  values ('21000000-0000-0000-0000-000000000005', tests.get_supabase_uid('spot_user1'), '20000000-0000-0000-0000-000000000001', 'New spot', 35.3, 139.3, true)
$$, 'user1 can insert into own map');
reset role;

-- user2 cannot insert into user1 map
select tests.authenticate_as('spot_user2');
select throws_ok($$
  insert into public.user_spots (id, user_id, map_id, description, latitude, longitude, is_public)
  values ('21000000-0000-0000-0000-000000000006', tests.get_supabase_uid('spot_user2'), '20000000-0000-0000-0000-000000000001', 'Bad spot', 35.4, 139.4, true)
$$, '42501', null, 'user2 cannot insert into user1 map');
reset role;

-- suspended user cannot insert even into own map
insert into public.maps (id, user_id, name, is_public)
values ('20000000-0000-0000-0000-000000000004', tests.get_supabase_uid('spot_user3'), 'User3 Map', true);
select tests.authenticate_as('spot_user3');
select throws_ok($$
  insert into public.user_spots (id, user_id, map_id, description, latitude, longitude, is_public)
  values ('21000000-0000-0000-0000-000000000007', tests.get_supabase_uid('spot_user3'), '20000000-0000-0000-0000-000000000004', 'Suspended spot', 35.5, 139.5, true)
$$, '42501', null, 'suspended user cannot insert');
reset role;

-- user1 cannot update user2 spot
select tests.authenticate_as('spot_user1');
update public.user_spots set description = 'Hacked'
where id = '21000000-0000-0000-0000-000000000004';
reset role;
select is(
  (select description from public.user_spots where id = '21000000-0000-0000-0000-000000000004'),
  'User2 public spot',
  'user1 cannot update user2 spot'
);

-- user1 can delete own spot
select tests.authenticate_as('spot_user1');
select lives_ok($$
  delete from public.user_spots where id = '21000000-0000-0000-0000-000000000003'
$$, 'user1 can delete own spot');
reset role;
select is(
  (select count(*) from public.user_spots where id = '21000000-0000-0000-0000-000000000003')::bigint,
  0::bigint,
  'spot deleted'
);

select * from finish();
rollback;

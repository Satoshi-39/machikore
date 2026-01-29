begin;

select plan(9);

select tests.create_test_user('map_user1', 'map_user1', 'Map User One', 'active');
select tests.create_test_user('map_user2', 'map_user2', 'Map User Two', 'active');
select tests.create_test_user('map_user3', 'map_user3', 'Map User Three', 'suspended');

insert into public.maps (id, user_id, name, is_public)
values
  ('10000000-0000-0000-0000-000000000001', tests.get_supabase_uid('map_user1'), 'User1 Public', true),
  ('10000000-0000-0000-0000-000000000002', tests.get_supabase_uid('map_user1'), 'User1 Private', false),
  ('10000000-0000-0000-0000-000000000003', tests.get_supabase_uid('map_user2'), 'User2 Private', false);

-- anon only sees public maps
select tests.clear_authentication();
select is(
  (select count(*) from public.maps)::bigint,
  1::bigint,
  'anon sees only public maps'
);
reset role;

-- authenticated user1 sees own + public
select tests.authenticate_as('map_user1');
select is(
  (select count(*) from public.maps)::bigint,
  2::bigint,
  'user1 sees public + own private'
);
reset role;

-- authenticated user2 sees own private + public
select tests.authenticate_as('map_user2');
select is(
  (select count(*) from public.maps)::bigint,
  2::bigint,
  'user2 sees public + own private'
);
reset role;

-- user1 can insert own map
select tests.authenticate_as('map_user1');
select lives_ok($$
  insert into public.maps (id, user_id, name, is_public)
  values ('10000000-0000-0000-0000-000000000004', tests.get_supabase_uid('map_user1'), 'User1 New', false)
$$, 'user1 can insert own map');

-- user1 cannot insert for another user
select throws_ok($$
  insert into public.maps (id, user_id, name, is_public)
  values ('10000000-0000-0000-0000-000000000005', tests.get_supabase_uid('map_user2'), 'Bad Insert', false)
$$, '42501', null, 'user1 cannot insert map for another user');
reset role;

-- suspended user cannot insert
select tests.authenticate_as('map_user3');
select throws_ok($$
  insert into public.maps (id, user_id, name, is_public)
  values ('10000000-0000-0000-0000-000000000006', tests.get_supabase_uid('map_user3'), 'Suspended Insert', false)
$$, '42501', null, 'suspended user cannot insert');
reset role;

-- user1 cannot update user2 map
select tests.authenticate_as('map_user1');
update public.maps set name = 'Hacked' where id = '10000000-0000-0000-0000-000000000003';
reset role;
select is(
  (select name from public.maps where id = '10000000-0000-0000-0000-000000000003'),
  'User2 Private',
  'user1 cannot update user2 map'
);

-- user1 can delete own map
select tests.authenticate_as('map_user1');
select lives_ok($$
  delete from public.maps where id = '10000000-0000-0000-0000-000000000002'
$$, 'user1 can delete own map');
reset role;
select is(
  (select count(*) from public.maps where id = '10000000-0000-0000-0000-000000000002')::bigint,
  0::bigint,
  'map deleted'
);

select * from finish();
rollback;

begin;

select plan(7);

select tests.create_test_user('col_user1', 'col_user1', 'Collection User One', 'active');
select tests.create_test_user('col_user2', 'col_user2', 'Collection User Two', 'active');

insert into public.maps (id, user_id, name, is_public)
values
  ('c0000000-0000-0000-0000-000000000001', tests.get_supabase_uid('col_user1'), 'Col Map 1', true),
  ('c0000000-0000-0000-0000-000000000002', tests.get_supabase_uid('col_user1'), 'Col Map 2', true);

insert into public.collections (id, user_id, name, is_public)
values
  ('c1000000-0000-0000-0000-000000000001', tests.get_supabase_uid('col_user1'), 'Public Collection', true),
  ('c1000000-0000-0000-0000-000000000002', tests.get_supabase_uid('col_user1'), 'Private Collection', false);

-- anon sees only public collections
select tests.clear_authentication();
select is(
  (select count(*) from public.collections)::bigint,
  1::bigint,
  'anon sees only public collections'
);
reset role;

-- user2 sees public + own (none) => 1
select tests.authenticate_as('col_user2');
select is(
  (select count(*) from public.collections)::bigint,
  1::bigint,
  'user2 sees only public collections'
);
reset role;

-- user1 sees own public + private => 2
select tests.authenticate_as('col_user1');
select is(
  (select count(*) from public.collections)::bigint,
  2::bigint,
  'user1 sees own public + private'
);
reset role;

-- user1 can insert own collection
select tests.authenticate_as('col_user1');
select lives_ok($$
  insert into public.collections (id, user_id, name, is_public)
  values ('c1000000-0000-0000-0000-000000000003', tests.get_supabase_uid('col_user1'), 'User1 Collection', false)
$$, 'user1 can insert own collection');
reset role;

-- user2 cannot insert for user1
select tests.authenticate_as('col_user2');
select throws_ok($$
  insert into public.collections (id, user_id, name, is_public)
  values ('c1000000-0000-0000-0000-000000000004', tests.get_supabase_uid('col_user1'), 'Bad Collection', false)
$$, '42501', null, 'user2 cannot insert for user1');
reset role;

-- collection_maps: owner can insert; non-owner cannot
select tests.authenticate_as('col_user1');
select lives_ok($$
  insert into public.collection_maps (id, collection_id, map_id)
  values ('c2000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001')
$$, 'owner can insert collection_map');
reset role;

select tests.authenticate_as('col_user2');
select throws_ok($$
  insert into public.collection_maps (id, collection_id, map_id)
  values ('c2000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002')
$$, '42501', null, 'non-owner cannot insert collection_map');
reset role;

select * from finish();
rollback;

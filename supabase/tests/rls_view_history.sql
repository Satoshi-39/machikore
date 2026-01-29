begin;

select plan(6);

select tests.create_test_user('vh_user1', 'vh_user1', 'View User One', 'active');
select tests.create_test_user('vh_user2', 'vh_user2', 'View User Two', 'active');

insert into public.maps (id, user_id, name, is_public)
values
  ('b0000000-0000-0000-0000-000000000001', tests.get_supabase_uid('vh_user1'), 'View Map 1', true),
  ('b0000000-0000-0000-0000-000000000002', tests.get_supabase_uid('vh_user1'), 'View Map 2', true),
  ('b0000000-0000-0000-0000-000000000003', tests.get_supabase_uid('vh_user1'), 'View Map 3', true);

insert into public.view_history (id, user_id, map_id)
values ('b1000000-0000-0000-0000-000000000001', tests.get_supabase_uid('vh_user1'), 'b0000000-0000-0000-0000-000000000001');

-- user1 sees own history
select tests.authenticate_as('vh_user1');
select is(
  (select count(*) from public.view_history)::bigint,
  1::bigint,
  'user1 sees own history'
);
reset role;

-- user2 cannot see user1 history
select tests.authenticate_as('vh_user2');
select is(
  (select count(*) from public.view_history)::bigint,
  0::bigint,
  'user2 cannot see user1 history'
);
reset role;

-- user1 can insert own history
select tests.authenticate_as('vh_user1');
select lives_ok($$
  insert into public.view_history (id, user_id, map_id)
  values ('b1000000-0000-0000-0000-000000000002', tests.get_supabase_uid('vh_user1'), 'b0000000-0000-0000-0000-000000000002')
$$, 'user1 can insert own history');
reset role;

-- user2 cannot insert for user1
select tests.authenticate_as('vh_user2');
select throws_ok($$
  insert into public.view_history (id, user_id, map_id)
  values ('b1000000-0000-0000-0000-000000000003', tests.get_supabase_uid('vh_user1'), 'b0000000-0000-0000-0000-000000000003')
$$, '42501', null, 'user2 cannot insert for user1');
reset role;

-- user1 can update own history
select tests.authenticate_as('vh_user1');
select lives_ok($$
  update public.view_history set view_count = 5
  where id = 'b1000000-0000-0000-0000-000000000001'
$$, 'user1 can update own history');
reset role;

-- user2 cannot update user1 history (row remains unchanged)
select tests.authenticate_as('vh_user2');
update public.view_history set view_count = 99
where id = 'b1000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select view_count from public.view_history where id = 'b1000000-0000-0000-0000-000000000001'),
  5,
  'user2 cannot update user1 history'
);

select * from finish();
rollback;

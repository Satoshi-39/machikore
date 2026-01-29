begin;

select plan(5);

select tests.create_test_user('sh_user1', 'sh_user1', 'Search User One', 'active');
select tests.create_test_user('sh_user2', 'sh_user2', 'Search User Two', 'active');

-- user1 can insert own search history
select tests.authenticate_as('sh_user1');
select lives_ok($$
  insert into public.search_history (id, user_id, query, search_type)
  values ('c1000000-0000-0000-0000-100000000001', tests.get_supabase_uid('sh_user1'), 'cafe', 'discover')
$$, 'user1 can insert own search history');
reset role;

-- user2 cannot insert for user1
select tests.authenticate_as('sh_user2');
select throws_ok($$
  insert into public.search_history (id, user_id, query, search_type)
  values ('c1000000-0000-0000-0000-100000000002', tests.get_supabase_uid('sh_user1'), 'park', 'discover')
$$, '42501', null, 'user2 cannot insert for user1');
reset role;

-- user1 can read own search history
select tests.authenticate_as('sh_user1');
select is(
  (select count(*) from public.search_history)::bigint,
  1::bigint,
  'user1 sees own search history'
);
reset role;

-- user2 cannot read user1 search history
select tests.authenticate_as('sh_user2');
select is(
  (select count(*) from public.search_history)::bigint,
  0::bigint,
  'user2 cannot see user1 search history'
);
reset role;

-- user2 cannot delete user1 search history (row remains)
select tests.authenticate_as('sh_user2');
delete from public.search_history where id = 'c1000000-0000-0000-0000-100000000001';
reset role;
select is(
  (select count(*) from public.search_history where id = 'c1000000-0000-0000-0000-100000000001')::bigint,
  1::bigint,
  'user2 cannot delete user1 search history'
);

select * from finish();
rollback;

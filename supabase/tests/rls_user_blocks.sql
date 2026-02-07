begin;

select plan(7);

select tests.create_test_user('blk_user1', 'blk_user1', 'Block User One', 'active');
select tests.create_test_user('blk_user2', 'blk_user2', 'Block User Two', 'active');
select tests.create_test_user('blk_user3', 'blk_user3', 'Block User Three', 'active');

-- user1 can block user2
select tests.authenticate_as('blk_user1');
select lives_ok($$
  insert into public.user_blocks (blocker_id, blocked_id)
  values (tests.get_supabase_uid('blk_user1'), tests.get_supabase_uid('blk_user2'))
$$, 'user1 can block user2');

-- user1 cannot create block on behalf of user3
select throws_ok($$
  insert into public.user_blocks (blocker_id, blocked_id)
  values (tests.get_supabase_uid('blk_user3'), tests.get_supabase_uid('blk_user2'))
$$, null, null, 'user1 cannot block on behalf of another user');
reset role;

-- user1 can see own blocks
select tests.authenticate_as('blk_user1');
select is(
  (select count(*) from public.user_blocks)::bigint,
  1::bigint,
  'user1 can see own blocks'
);
reset role;

-- user2 (the blocked user) cannot see user1 blocks
select tests.authenticate_as('blk_user2');
select is(
  (select count(*) from public.user_blocks)::bigint,
  0::bigint,
  'blocked user cannot see blocker blocks'
);
reset role;

-- anon cannot see blocks
select tests.clear_authentication();
select is(
  (select count(*) from public.user_blocks)::bigint,
  0::bigint,
  'anon cannot see blocks'
);
reset role;

-- user1 can delete own block (unblock)
select tests.authenticate_as('blk_user1');
select lives_ok($$
  delete from public.user_blocks
  where blocker_id = tests.get_supabase_uid('blk_user1')
    and blocked_id = tests.get_supabase_uid('blk_user2')
$$, 'user1 can unblock user2');
reset role;

select is(
  (select count(*) from public.user_blocks)::bigint,
  0::bigint,
  'block is removed after unblock'
);

select * from finish();
rollback;

begin;

select plan(4);

select tests.create_test_user('trg_user1', 'trg_user1', 'Trigger User One', 'active');
select tests.create_test_user('trg_user2', 'trg_user2', 'Trigger User Two', 'active');
select tests.create_test_user('trg_user3', 'trg_user3', 'Trigger User Three', 'active');

-- Setup: user1 and user2 follow each other
insert into public.follows (follower_id, followee_id)
values (tests.get_supabase_uid('trg_user1'), tests.get_supabase_uid('trg_user2'));
insert into public.follows (follower_id, followee_id)
values (tests.get_supabase_uid('trg_user2'), tests.get_supabase_uid('trg_user1'));

-- Verify follows exist
select is(
  (select count(*) from public.follows
   where (follower_id = tests.get_supabase_uid('trg_user1') and followee_id = tests.get_supabase_uid('trg_user2'))
      or (follower_id = tests.get_supabase_uid('trg_user2') and followee_id = tests.get_supabase_uid('trg_user1'))
  )::bigint,
  2::bigint,
  'mutual follows exist before block'
);

-- handle_user_block trigger: blocking removes mutual follows
select tests.authenticate_as('trg_user1');
insert into public.user_blocks (blocker_id, blocked_id)
values (tests.get_supabase_uid('trg_user1'), tests.get_supabase_uid('trg_user2'));
reset role;

select is(
  (select count(*) from public.follows
   where (follower_id = tests.get_supabase_uid('trg_user1') and followee_id = tests.get_supabase_uid('trg_user2'))
      or (follower_id = tests.get_supabase_uid('trg_user2') and followee_id = tests.get_supabase_uid('trg_user1'))
  )::bigint,
  0::bigint,
  'handle_user_block removes mutual follows'
);

-- prevent_blocked_follow trigger: cannot follow while blocked
select tests.authenticate_as('trg_user2');
select throws_ok($$
  insert into public.follows (follower_id, followee_id)
  values (tests.get_supabase_uid('trg_user2'), tests.get_supabase_uid('trg_user1'))
$$, 'P0001', null, 'blocked user cannot follow blocker');
reset role;

select tests.authenticate_as('trg_user1');
select throws_ok($$
  insert into public.follows (follower_id, followee_id)
  values (tests.get_supabase_uid('trg_user1'), tests.get_supabase_uid('trg_user2'))
$$, 'P0001', null, 'blocker cannot follow blocked user');
reset role;

select * from finish();
rollback;

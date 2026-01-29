begin;

select plan(6);

select tests.create_test_user('fl_user1', 'follow_user1', 'Follow User One', 'active');
select tests.create_test_user('fl_user2', 'follow_user2', 'Follow User Two', 'active');
select tests.create_test_user('fl_user3', 'follow_user3', 'Follow User Three', 'active');

insert into public.follows (id, follower_id, followee_id)
values ('61000000-0000-0000-0000-000000000001', tests.get_supabase_uid('fl_user1'), tests.get_supabase_uid('fl_user2'));

-- anon can read follows
select tests.clear_authentication();
select is(
  (select count(*) from public.follows)::bigint,
  1::bigint,
  'anon can read follows'
);
reset role;

-- user1 can insert own follow
select tests.authenticate_as('fl_user1');
select lives_ok($$
  insert into public.follows (id, follower_id, followee_id)
  values ('61000000-0000-0000-0000-000000000002', tests.get_supabase_uid('fl_user1'), tests.get_supabase_uid('fl_user3'))
$$, 'user1 can insert own follow');

-- user1 cannot insert follow for another follower
select throws_ok($$
  insert into public.follows (id, follower_id, followee_id)
  values ('61000000-0000-0000-0000-000000000003', tests.get_supabase_uid('fl_user2'), tests.get_supabase_uid('fl_user3'))
$$, '42501', null, 'user1 cannot insert follow for another user');
reset role;

-- user2 cannot delete user1 follow (row remains)
select tests.authenticate_as('fl_user2');
delete from public.follows where id = '61000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select count(*) from public.follows where id = '61000000-0000-0000-0000-000000000001')::bigint,
  1::bigint,
  'user2 cannot delete user1 follow'
);

-- user1 can delete own follow
select tests.authenticate_as('fl_user1');
select lives_ok($$
  delete from public.follows where id = '61000000-0000-0000-0000-000000000001'
$$, 'user1 can delete own follow');
reset role;
select is(
  (select count(*) from public.follows where id = '61000000-0000-0000-0000-000000000001')::bigint,
  0::bigint,
  'follow deleted'
);

select * from finish();
rollback;

begin;

select plan(6);

select tests.create_test_user('lk_user1', 'like_user1', 'Like User One', 'active');
select tests.create_test_user('lk_user2', 'like_user2', 'Like User Two', 'active');

insert into public.maps (id, user_id, name, is_public)
values ('40000000-0000-0000-0000-000000000001', tests.get_supabase_uid('lk_user1'), 'Map For Likes', true);

insert into public.likes (id, user_id, map_id)
values ('41000000-0000-0000-0000-000000000001', tests.get_supabase_uid('lk_user1'), '40000000-0000-0000-0000-000000000001');

-- anon can read likes
select tests.clear_authentication();
select is(
  (select count(*) from public.likes)::bigint,
  1::bigint,
  'anon can read likes'
);
reset role;

-- user2 can insert own like
select tests.authenticate_as('lk_user2');
select lives_ok($$
  insert into public.likes (id, user_id, map_id)
  values ('41000000-0000-0000-0000-000000000002', tests.get_supabase_uid('lk_user2'), '40000000-0000-0000-0000-000000000001')
$$, 'user2 can insert own like');

-- user2 cannot insert like for another user
select throws_ok($$
  insert into public.likes (id, user_id, map_id)
  values ('41000000-0000-0000-0000-000000000003', tests.get_supabase_uid('lk_user1'), '40000000-0000-0000-0000-000000000001')
$$, '42501', null, 'user2 cannot insert like for another user');
reset role;

-- user2 cannot delete user1 like (row remains)
select tests.authenticate_as('lk_user2');
delete from public.likes where id = '41000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select count(*) from public.likes where id = '41000000-0000-0000-0000-000000000001')::bigint,
  1::bigint,
  'user2 cannot delete user1 like'
);

-- user1 can delete own like
select tests.authenticate_as('lk_user1');
select lives_ok($$
  delete from public.likes where id = '41000000-0000-0000-0000-000000000001'
$$, 'user1 can delete own like');
reset role;
select is(
  (select count(*) from public.likes where id = '41000000-0000-0000-0000-000000000001')::bigint,
  0::bigint,
  'like deleted'
);

select * from finish();
rollback;

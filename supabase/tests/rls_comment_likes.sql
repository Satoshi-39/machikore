begin;

select plan(6);

select tests.create_test_user('cl_user1', 'cl_user1', 'CL User One', 'active');
select tests.create_test_user('cl_user2', 'cl_user2', 'CL User Two', 'active');

-- Setup: map + comment
insert into public.maps (id, user_id, name, is_public)
values ('c0a00000-0000-0000-0000-000000000001', tests.get_supabase_uid('cl_user1'), 'CL Map', true);

insert into public.comments (id, user_id, map_id, content)
values ('c0b00000-0000-0000-0000-000000000001', tests.get_supabase_uid('cl_user1'), 'c0a00000-0000-0000-0000-000000000001', 'A comment');

-- user2 can like a comment
select tests.authenticate_as('cl_user2');
select lives_ok($$
  insert into public.comment_likes (id, user_id, comment_id)
  values ('c0c00000-0000-0000-0000-000000000001', tests.get_supabase_uid('cl_user2'), 'c0b00000-0000-0000-0000-000000000001')
$$, 'user2 can like a comment');

-- user2 cannot like as another user
select throws_ok($$
  insert into public.comment_likes (id, user_id, comment_id)
  values ('c0c00000-0000-0000-0000-000000000002', tests.get_supabase_uid('cl_user1'), 'c0b00000-0000-0000-0000-000000000001')
$$, null, null, 'user2 cannot like as another user');
reset role;

-- anyone can see comment likes
select tests.clear_authentication();
select is(
  (select count(*) from public.comment_likes)::bigint,
  1::bigint,
  'anon can see comment likes'
);
reset role;

select tests.authenticate_as('cl_user1');
select is(
  (select count(*) from public.comment_likes)::bigint,
  1::bigint,
  'authenticated can see comment likes'
);
reset role;

-- user2 can delete own like
select tests.authenticate_as('cl_user2');
select lives_ok($$
  delete from public.comment_likes
  where id = 'c0c00000-0000-0000-0000-000000000001'
$$, 'user2 can delete own like');
reset role;

-- user1 cannot delete user2 like (re-insert for test)
insert into public.comment_likes (id, user_id, comment_id)
values ('c0c00000-0000-0000-0000-000000000003', tests.get_supabase_uid('cl_user2'), 'c0b00000-0000-0000-0000-000000000001');

select tests.authenticate_as('cl_user1');
delete from public.comment_likes where id = 'c0c00000-0000-0000-0000-000000000003';
reset role;
select is(
  (select count(*) from public.comment_likes where id = 'c0c00000-0000-0000-0000-000000000003')::bigint,
  1::bigint,
  'user1 cannot delete user2 like'
);

select * from finish();
rollback;

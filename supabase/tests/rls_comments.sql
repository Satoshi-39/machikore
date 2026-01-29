begin;

select plan(6);

select tests.create_test_user('cmt_user1', 'comment_user1', 'Comment User One', 'active');
select tests.create_test_user('cmt_user2', 'comment_user2', 'Comment User Two', 'active');

insert into public.maps (id, user_id, name, is_public)
values ('30000000-0000-0000-0000-000000000001', tests.get_supabase_uid('cmt_user1'), 'Map For Comments', true);

insert into public.comments (id, user_id, map_id, content)
values ('31000000-0000-0000-0000-000000000001', tests.get_supabase_uid('cmt_user1'), '30000000-0000-0000-0000-000000000001', 'First comment');

-- authenticated user can read comments (comments_select_all is TO authenticated)
select tests.authenticate_as('cmt_user2');
select is(
  (select count(*) from public.comments)::bigint,
  1::bigint,
  'authenticated can read comments'
);
reset role;

-- user1 can insert own comment
select tests.authenticate_as('cmt_user1');
select lives_ok($$
  insert into public.comments (id, user_id, map_id, content)
  values ('31000000-0000-0000-0000-000000000002', tests.get_supabase_uid('cmt_user1'), '30000000-0000-0000-0000-000000000001', 'Second comment')
$$, 'user1 can insert own comment');

-- user1 cannot insert as another user
select throws_ok($$
  insert into public.comments (id, user_id, map_id, content)
  values ('31000000-0000-0000-0000-000000000003', tests.get_supabase_uid('cmt_user2'), '30000000-0000-0000-0000-000000000001', 'Bad comment')
$$, '42501', null, 'user1 cannot insert for another user');
reset role;

-- user1 can update own comment
select tests.authenticate_as('cmt_user1');
select lives_ok($$
  update public.comments set content = 'Updated comment'
  where id = '31000000-0000-0000-0000-000000000001'
$$, 'user1 can update own comment');
reset role;

-- user2 cannot update user1 comment
select tests.authenticate_as('cmt_user2');
update public.comments set content = 'Hacked'
where id = '31000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select content from public.comments where id = '31000000-0000-0000-0000-000000000001'),
  'Updated comment',
  'user2 cannot update user1 comment'
);

-- user2 cannot delete user1 comment (row remains)
select tests.authenticate_as('cmt_user2');
delete from public.comments where id = '31000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select count(*) from public.comments where id = '31000000-0000-0000-0000-000000000001')::bigint,
  1::bigint,
  'user2 cannot delete user1 comment'
);

select * from finish();
rollback;

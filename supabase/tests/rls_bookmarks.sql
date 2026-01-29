begin;

select plan(6);

select tests.create_test_user('bk_user1', 'bookmark_user1', 'Bookmark User One', 'active');
select tests.create_test_user('bk_user2', 'bookmark_user2', 'Bookmark User Two', 'active');

insert into public.maps (id, user_id, name, is_public)
values
  ('50000000-0000-0000-0000-000000000001', tests.get_supabase_uid('bk_user1'), 'Map For Bookmarks', true),
  ('50000000-0000-0000-0000-000000000002', tests.get_supabase_uid('bk_user1'), 'Map For Bookmarks 2', true);

insert into public.bookmarks (id, user_id, map_id)
values
  ('51000000-0000-0000-0000-000000000001', tests.get_supabase_uid('bk_user1'), '50000000-0000-0000-0000-000000000001'),
  ('51000000-0000-0000-0000-000000000002', tests.get_supabase_uid('bk_user2'), '50000000-0000-0000-0000-000000000001');

-- user1 sees only own bookmarks
select tests.authenticate_as('bk_user1');
select is(
  (select count(*) from public.bookmarks)::bigint,
  1::bigint,
  'user1 sees only own bookmarks'
);
reset role;

-- user2 can insert own bookmark (different map to avoid unique constraint)
select tests.authenticate_as('bk_user2');
select lives_ok($$
  insert into public.bookmarks (id, user_id, map_id)
  values ('51000000-0000-0000-0000-000000000003', tests.get_supabase_uid('bk_user2'), '50000000-0000-0000-0000-000000000002')
$$, 'user2 can insert own bookmark');

-- user2 cannot insert bookmark for another user
select throws_ok($$
  insert into public.bookmarks (id, user_id, map_id)
  values ('51000000-0000-0000-0000-000000000004', tests.get_supabase_uid('bk_user1'), '50000000-0000-0000-0000-000000000001')
$$, '42501', null, 'user2 cannot insert for another user');
reset role;

-- user2 cannot delete user1 bookmark (row remains)
select tests.authenticate_as('bk_user2');
delete from public.bookmarks where id = '51000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select count(*) from public.bookmarks where id = '51000000-0000-0000-0000-000000000001')::bigint,
  1::bigint,
  'user2 cannot delete user1 bookmark'
);

-- user1 can delete own bookmark
select tests.authenticate_as('bk_user1');
select lives_ok($$
  delete from public.bookmarks where id = '51000000-0000-0000-0000-000000000001'
$$, 'user1 can delete own bookmark');
reset role;
select is(
  (select count(*) from public.bookmarks where id = '51000000-0000-0000-0000-000000000001')::bigint,
  0::bigint,
  'bookmark deleted'
);

select * from finish();
rollback;

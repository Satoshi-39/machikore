begin;

select plan(8);

select tests.create_test_user('bf_user1', 'bf_user1', 'BF User One', 'active');
select tests.create_test_user('bf_user2', 'bf_user2', 'BF User Two', 'active');

-- user1 can insert own folder
select tests.authenticate_as('bf_user1');
select lives_ok($$
  insert into public.bookmark_folders (id, user_id, name, folder_type)
  values ('b0000000-0000-0000-0000-000000000001', tests.get_supabase_uid('bf_user1'), 'My Folder', 'spots')
$$, 'user1 can insert own folder');

-- user1 cannot insert folder for another user
select throws_ok($$
  insert into public.bookmark_folders (id, user_id, name, folder_type)
  values ('b0000000-0000-0000-0000-000000000002', tests.get_supabase_uid('bf_user2'), 'Fake Folder', 'spots')
$$, null, null, 'user1 cannot insert folder for another user');
reset role;

-- user1 can select own folders
select tests.authenticate_as('bf_user1');
select is(
  (select count(*) from public.bookmark_folders)::bigint,
  1::bigint,
  'user1 can see own folders'
);
reset role;

-- user2 cannot see user1 folders
select tests.authenticate_as('bf_user2');
select is(
  (select count(*) from public.bookmark_folders)::bigint,
  0::bigint,
  'user2 cannot see user1 folders'
);
reset role;

-- anon cannot see any folders
select tests.clear_authentication();
select is(
  (select count(*) from public.bookmark_folders)::bigint,
  0::bigint,
  'anon cannot see folders'
);
reset role;

-- user1 can update own folder
select tests.authenticate_as('bf_user1');
select lives_ok($$
  update public.bookmark_folders set name = 'Renamed Folder'
  where id = 'b0000000-0000-0000-0000-000000000001'
$$, 'user1 can update own folder');
reset role;

-- user2 cannot update user1 folder
select tests.authenticate_as('bf_user2');
update public.bookmark_folders set name = 'Hacked'
where id = 'b0000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select name from public.bookmark_folders where id = 'b0000000-0000-0000-0000-000000000001'),
  'Renamed Folder',
  'user2 cannot update user1 folder'
);

-- user1 can delete own folder
select tests.authenticate_as('bf_user1');
select lives_ok($$
  delete from public.bookmark_folders
  where id = 'b0000000-0000-0000-0000-000000000001'
$$, 'user1 can delete own folder');
reset role;

select * from finish();
rollback;

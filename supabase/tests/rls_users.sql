begin;

select plan(6);

-- Seed users
select tests.create_test_user('usr_user1', 'user1', 'User One', 'active');
select tests.create_test_user('usr_user2', 'user2', 'User Two', 'active');
select tests.create_test_user('usr_user3', 'user3', 'User Three', 'suspended');

-- anon can read all users (select policy is true)
select tests.clear_authentication();
select is(
  (select count(*) from public.users)::bigint,
  3::bigint,
  'anon can select all users'
);
reset role;

-- Create only an auth user (not public.users) for insert test
select tests.create_supabase_user('usr_user4');
select tests.authenticate_as('usr_user4');
select lives_ok($$
  insert into public.users (id, email, username, display_name, status)
  values (tests.get_supabase_uid('usr_user4'), 'usr_user4@test.com', 'user4', 'User Four', 'active')
$$, 'authenticated can insert own user');

-- authenticated user cannot insert for another user_id
select throws_ok($$
  insert into public.users (id, email, username, display_name, status)
  values (extensions.uuid_generate_v4(), 'u5@example.com', 'user5', 'User Five', 'active')
$$, '42501', null, 'authenticated cannot insert another user');
reset role;

-- authenticated user can update own row when active
select tests.authenticate_as('usr_user1');
select lives_ok($$
  update public.users set display_name = 'User One Updated'
  where id = tests.get_supabase_uid('usr_user1')
$$, 'active user can update own row');
reset role;

-- suspended user cannot update own row (row remains)
select tests.authenticate_as('usr_user3');
update public.users set display_name = 'Should Fail'
where id = tests.get_supabase_uid('usr_user3');
reset role;
select is(
  (select display_name from public.users where id = tests.get_supabase_uid('usr_user3')),
  'User Three',
  'suspended user cannot update own row'
);

-- user cannot update someone else
select tests.authenticate_as('usr_user2');
update public.users set display_name = 'Hacked'
where id = tests.get_supabase_uid('usr_user1');
reset role;
select is(
  (select display_name from public.users where id = tests.get_supabase_uid('usr_user1')),
  'User One Updated',
  'user cannot update another user'
);

select * from finish();
rollback;

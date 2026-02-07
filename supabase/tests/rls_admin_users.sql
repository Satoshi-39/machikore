begin;

select plan(4);

select tests.create_test_user('adm_user1', 'adm_user1', 'Admin User One', 'active');
select tests.create_test_user('adm_user2', 'adm_user2', 'Regular User', 'active');

-- Setup: make user1 an admin owner (as superuser)
insert into public.admin_users (id, user_id, role)
values ('e0000000-0000-0000-0000-000000000001', tests.get_supabase_uid('adm_user1'), 'owner');

-- admin can see admin_users
select tests.authenticate_as('adm_user1');
select is(
  (select count(*) from public.admin_users)::bigint,
  1::bigint,
  'admin can see admin_users'
);
reset role;

-- non-admin cannot see admin_users
select tests.authenticate_as('adm_user2');
select is(
  (select count(*) from public.admin_users)::bigint,
  0::bigint,
  'non-admin cannot see admin_users'
);
reset role;

-- anon cannot see admin_users
select tests.clear_authentication();
select is(
  (select count(*) from public.admin_users)::bigint,
  0::bigint,
  'anon cannot see admin_users'
);
reset role;

-- non-admin cannot insert admin_users
select tests.authenticate_as('adm_user2');
select throws_ok($$
  insert into public.admin_users (id, user_id, role)
  values ('e0000000-0000-0000-0000-000000000002', tests.get_supabase_uid('adm_user2'), 'editor')
$$, '42501', null, 'non-admin cannot insert admin_users');
reset role;

select * from finish();
rollback;

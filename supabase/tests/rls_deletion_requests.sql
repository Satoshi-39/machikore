begin;

select plan(3);

select tests.create_test_user('del_user1', 'del_user1', 'Del User One', 'active');

-- Service role can insert (simulate server-side operation)
insert into public.deletion_requests (id, user_id, email, status, scheduled_at)
values ('de000000-0000-0000-0000-000000000001', tests.get_supabase_uid('del_user1'), 'del_user1@test.com', 'pending', now() + interval '30 days');

-- authenticated user cannot see deletion_requests (no SELECT policy)
select tests.authenticate_as('del_user1');
select is(
  (select count(*) from public.deletion_requests)::bigint,
  0::bigint,
  'authenticated user cannot see deletion_requests'
);
reset role;

-- anon cannot see deletion_requests
select tests.clear_authentication();
select is(
  (select count(*) from public.deletion_requests)::bigint,
  0::bigint,
  'anon cannot see deletion_requests'
);
reset role;

-- authenticated user cannot insert deletion_requests
select tests.authenticate_as('del_user1');
select throws_ok($$
  insert into public.deletion_requests (id, user_id, email, status, scheduled_at)
  values ('de000000-0000-0000-0000-000000000002', tests.get_supabase_uid('del_user1'), 'del_user1@test.com', 'pending', now() + interval '30 days')
$$, '42501', null, 'authenticated user cannot insert deletion_requests');
reset role;

select * from finish();
rollback;

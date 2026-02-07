begin;

select plan(5);

select tests.create_test_user('rpt_user1', 'rpt_user1', 'Report User One', 'active');
select tests.create_test_user('rpt_user2', 'rpt_user2', 'Report User Two', 'active');

-- Setup: map to report
insert into public.maps (id, user_id, name, is_public)
values ('a0e00000-0000-0000-0000-000000000001', tests.get_supabase_uid('rpt_user1'), 'Report Map', true);

-- user2 can submit a report
select tests.authenticate_as('rpt_user2');
select lives_ok($$
  insert into public.reports (id, reporter_id, target_type, target_id, reason)
  values ('a0f00000-0000-0000-0000-000000000001', tests.get_supabase_uid('rpt_user2'), 'map', 'a0e00000-0000-0000-0000-000000000001', 'spam')
$$, 'user2 can submit a report');

-- user2 cannot report as another user
select throws_ok($$
  insert into public.reports (id, reporter_id, target_type, target_id, reason)
  values ('a0f00000-0000-0000-0000-000000000002', tests.get_supabase_uid('rpt_user1'), 'map', 'a0e00000-0000-0000-0000-000000000001', 'spam')
$$, null, null, 'user2 cannot report as another user');

-- user2 can see own reports
select is(
  (select count(*) from public.reports)::bigint,
  1::bigint,
  'user2 can see own reports'
);
reset role;

-- user1 cannot see user2 reports
select tests.authenticate_as('rpt_user1');
select is(
  (select count(*) from public.reports)::bigint,
  0::bigint,
  'user1 cannot see user2 reports'
);
reset role;

-- anon cannot see reports
select tests.clear_authentication();
select is(
  (select count(*) from public.reports)::bigint,
  0::bigint,
  'anon cannot see reports'
);
reset role;

select * from finish();
rollback;

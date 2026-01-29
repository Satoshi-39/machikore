begin;

select plan(4);

select tests.create_test_user('ta_user1', 'ta_user1', 'TA User One', 'active');
select tests.create_test_user('ta_user2', 'ta_user2', 'TA User Two', 'active');

-- Use valid hex UUIDs (a-f, 0-9 only)
insert into public.terms_versions (id, type, version, content, effective_at)
values
  ('ac000000-0000-0000-0000-000000000001', 'terms_of_service', '1.0.0', 'tos', now()),
  ('ac000000-0000-0000-0000-000000000002', 'privacy_policy', '1.0.0', 'pp', now());

-- user1 can insert own agreement
select tests.authenticate_as('ta_user1');
select lives_ok($$
  insert into public.terms_agreements (id, user_id, terms_version_id, privacy_version_id)
  values ('ad000000-0000-0000-0000-000000000001', tests.get_supabase_uid('ta_user1'), 'ac000000-0000-0000-0000-000000000001', 'ac000000-0000-0000-0000-000000000002')
$$, 'user1 can insert own agreement');
reset role;

-- user2 cannot insert for user1
select tests.authenticate_as('ta_user2');
select throws_ok($$
  insert into public.terms_agreements (id, user_id, terms_version_id, privacy_version_id)
  values ('ad000000-0000-0000-0000-000000000002', tests.get_supabase_uid('ta_user1'), 'ac000000-0000-0000-0000-000000000001', 'ac000000-0000-0000-0000-000000000002')
$$, '42501', null, 'user2 cannot insert for user1');
reset role;

-- user1 can select own agreements
select tests.authenticate_as('ta_user1');
select is(
  (select count(*) from public.terms_agreements)::bigint,
  1::bigint,
  'user1 sees own agreements'
);
reset role;

-- user2 cannot see user1 agreements
select tests.authenticate_as('ta_user2');
select is(
  (select count(*) from public.terms_agreements)::bigint,
  0::bigint,
  'user2 cannot see user1 agreements'
);
reset role;

select * from finish();
rollback;

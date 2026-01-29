begin;

select plan(6);

select tests.create_test_user('sar_user1', 'sar_user1', 'SAR User One', 'active');
select tests.create_test_user('sar_user2', 'sar_user2', 'SAR User Two', 'active');

-- Use valid hex UUIDs (a-f, 0-9 only)
insert into public.system_announcements (id, title, content, is_active)
values ('aa000000-0000-0000-0000-000000000001', 'Notice', 'Hello', true);

-- user1 can insert own read
select tests.authenticate_as('sar_user1');
select lives_ok($$
  insert into public.system_announcement_reads (id, user_id, announcement_id)
  values ('ab000000-0000-0000-0000-000000000001', tests.get_supabase_uid('sar_user1'), 'aa000000-0000-0000-0000-000000000001')
$$, 'user1 can insert own read');
reset role;

-- user2 cannot insert for user1
select tests.authenticate_as('sar_user2');
select throws_ok($$
  insert into public.system_announcement_reads (id, user_id, announcement_id)
  values ('ab000000-0000-0000-0000-000000000002', tests.get_supabase_uid('sar_user1'), 'aa000000-0000-0000-0000-000000000001')
$$, '42501', null, 'user2 cannot insert for user1');
reset role;

-- user1 can select own reads
select tests.authenticate_as('sar_user1');
select is(
  (select count(*) from public.system_announcement_reads)::bigint,
  1::bigint,
  'user1 sees own reads'
);
reset role;

-- user2 cannot see user1 reads
select tests.authenticate_as('sar_user2');
select is(
  (select count(*) from public.system_announcement_reads)::bigint,
  0::bigint,
  'user2 cannot see user1 reads'
);
reset role;

-- user2 cannot delete user1 read (row remains)
select tests.authenticate_as('sar_user2');
delete from public.system_announcement_reads where id = 'ab000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select count(*) from public.system_announcement_reads where id = 'ab000000-0000-0000-0000-000000000001')::bigint,
  1::bigint,
  'user2 cannot delete user1 read'
);

-- user1 can delete own read
select tests.authenticate_as('sar_user1');
select lives_ok($$
  delete from public.system_announcement_reads where id = 'ab000000-0000-0000-0000-000000000001'
$$, 'user1 can delete own read');
reset role;

select * from finish();
rollback;

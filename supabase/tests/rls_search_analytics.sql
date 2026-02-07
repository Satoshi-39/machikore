-- search_analytics: RLS有効、ポリシーなし（サーバーサイドのみ操作）

begin;

select plan(3);

select tests.create_test_user('sa_user1', 'sa_user1', 'SA User One', 'active');

-- Setup: insert as superuser
insert into public.search_analytics (id, query, search_type, search_count)
values ('e1000000-0000-0000-0000-000000000001', 'tokyo', 'discover', 10);

-- authenticated cannot see search_analytics
select tests.authenticate_as('sa_user1');
select is(
  (select count(*) from public.search_analytics)::bigint,
  0::bigint,
  'authenticated cannot see search_analytics'
);
reset role;

-- anon cannot see search_analytics
select tests.clear_authentication();
select is(
  (select count(*) from public.search_analytics)::bigint,
  0::bigint,
  'anon cannot see search_analytics'
);
reset role;

-- authenticated cannot insert search_analytics
select tests.authenticate_as('sa_user1');
select throws_ok($$
  insert into public.search_analytics (id, query, search_type, search_count)
  values ('e1000000-0000-0000-0000-000000000002', 'osaka', 'discover', 5)
$$, '42501', null, 'authenticated cannot insert search_analytics');
reset role;

select * from finish();
rollback;

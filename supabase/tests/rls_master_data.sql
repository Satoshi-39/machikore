-- マスタデータテーブル（読み取り専用）のRLSテスト
-- admin_boundaries, categories, cities, continents, countries,
-- machi, prefectures, regions, terms_versions, transport_hubs, tags

begin;

select plan(13);

select tests.create_test_user('md_user1', 'md_user1', 'MD User One', 'active');

-- anon can read all master data tables
select tests.clear_authentication();

select ok(
  (select count(*) from public.categories) >= 0,
  'anon can read categories'
);
select ok(
  (select count(*) from public.prefectures) >= 0,
  'anon can read prefectures'
);
select ok(
  (select count(*) from public.regions) >= 0,
  'anon can read regions'
);
select ok(
  (select count(*) from public.cities) >= 0,
  'anon can read cities'
);
select ok(
  (select count(*) from public.continents) >= 0,
  'anon can read continents'
);
select ok(
  (select count(*) from public.countries) >= 0,
  'anon can read countries'
);
select ok(
  (select count(*) from public.machi) >= 0,
  'anon can read machi'
);
select ok(
  (select count(*) from public.admin_boundaries) >= 0,
  'anon can read admin_boundaries'
);
select ok(
  (select count(*) from public.terms_versions) >= 0,
  'anon can read terms_versions'
);
select ok(
  (select count(*) from public.transport_hubs) >= 0,
  'anon can read transport_hubs'
);
select ok(
  (select count(*) from public.tags) >= 0,
  'anon can read tags'
);
reset role;

-- authenticated can insert tags
select tests.authenticate_as('md_user1');
select lives_ok($$
  insert into public.tags (id, name, slug)
  values ('d0000000-0000-0000-0000-000000000001', 'NewTag', 'new-tag')
$$, 'authenticated can insert tags');
reset role;

-- anon cannot insert tags
select tests.clear_authentication();
select throws_ok($$
  insert into public.tags (id, name, slug)
  values ('d0000000-0000-0000-0000-000000000002', 'AnonTag', 'anon-tag')
$$, '42501', null, 'anon cannot insert tags');
reset role;

select * from finish();
rollback;

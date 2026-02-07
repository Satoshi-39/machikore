begin;

select plan(4);

select tests.create_test_user('ms_user1', 'ms_user1', 'MS User One', 'active');

-- Setup: insert master spot as superuser
insert into public.master_spots (id, name, latitude, longitude)
values ('d1000000-0000-0000-0000-000000000001', '{"ja": "テスト場所"}'::jsonb, 35.6812, 139.7671);

-- anon can read master_spots
select tests.clear_authentication();
select is(
  (select count(*) from public.master_spots where id = 'd1000000-0000-0000-0000-000000000001')::bigint,
  1::bigint,
  'anon can read master_spots'
);
reset role;

-- authenticated can read master_spots
select tests.authenticate_as('ms_user1');
select is(
  (select count(*) from public.master_spots where id = 'd1000000-0000-0000-0000-000000000001')::bigint,
  1::bigint,
  'authenticated can read master_spots'
);

-- authenticated can insert master_spots
select lives_ok($$
  insert into public.master_spots (id, name, latitude, longitude)
  values ('d1000000-0000-0000-0000-000000000002', '{"ja": "新しい場所"}'::jsonb, 35.69, 139.70)
$$, 'authenticated can insert master_spots');
reset role;

-- anon cannot insert master_spots
select tests.clear_authentication();
select throws_ok($$
  insert into public.master_spots (id, name, latitude, longitude)
  values ('d1000000-0000-0000-0000-000000000003', '{"ja": "匿名場所"}'::jsonb, 35.70, 139.71)
$$, '42501', null, 'anon cannot insert master_spots');
reset role;

select * from finish();
rollback;

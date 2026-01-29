begin;

select plan(5);

select tests.create_test_user('msf_user1', 'msf_user1', 'MSF User One', 'active');
select tests.create_test_user('msf_user2', 'msf_user2', 'MSF User Two', 'active');

insert into public.master_spots (id, name, latitude, longitude)
values ('d0000000-0000-0000-0000-000000000001', '{"ja": "Spot"}', 35.0, 139.0);

insert into public.master_spot_favorites (id, user_id, master_spot_id)
values ('d1000000-0000-0000-0000-000000000001', tests.get_supabase_uid('msf_user1'), 'd0000000-0000-0000-0000-000000000001');

-- user1 sees own favorites
select tests.authenticate_as('msf_user1');
select is(
  (select count(*) from public.master_spot_favorites)::bigint,
  1::bigint,
  'user1 sees own favorites'
);
reset role;

-- user2 sees none
select tests.authenticate_as('msf_user2');
select is(
  (select count(*) from public.master_spot_favorites)::bigint,
  0::bigint,
  'user2 sees no favorites'
);
reset role;

-- user2 can insert own favorite
select tests.authenticate_as('msf_user2');
select lives_ok($$
  insert into public.master_spot_favorites (id, user_id, master_spot_id)
  values ('d1000000-0000-0000-0000-000000000002', tests.get_supabase_uid('msf_user2'), 'd0000000-0000-0000-0000-000000000001')
$$, 'user2 can insert own favorite');
reset role;

-- user2 cannot delete user1 favorite (row remains)
select tests.authenticate_as('msf_user2');
delete from public.master_spot_favorites where id = 'd1000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select count(*) from public.master_spot_favorites where id = 'd1000000-0000-0000-0000-000000000001')::bigint,
  1::bigint,
  'user2 cannot delete user1 favorite'
);

-- user1 can delete own favorite
select tests.authenticate_as('msf_user1');
select lives_ok($$
  delete from public.master_spot_favorites where id = 'd1000000-0000-0000-0000-000000000001'
$$, 'user1 can delete own favorite');
reset role;

select * from finish();
rollback;

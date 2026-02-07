begin;

select plan(6);

select tests.create_test_user('st_user1', 'st_user1', 'ST User One', 'active');
select tests.create_test_user('st_user2', 'st_user2', 'ST User Two', 'active');

-- Setup: map, spot, tag
insert into public.maps (id, user_id, name, is_public)
values ('a0000000-0000-0000-0000-000000000001', tests.get_supabase_uid('st_user1'), 'ST Map', true);

insert into public.user_spots (id, user_id, map_id, description, latitude, longitude, is_public)
values ('a1000000-0000-0000-0000-000000000001', tests.get_supabase_uid('st_user1'), 'a0000000-0000-0000-0000-000000000001', 'ST Spot', 35.0, 139.0, true);

insert into public.tags (id, name, slug)
values ('a2000000-0000-0000-0000-000000000001', 'TestTag', 'test-tag');

-- user1 can add tag to own spot
select tests.authenticate_as('st_user1');
select lives_ok($$
  insert into public.spot_tags (id, user_spot_id, tag_id)
  values ('a3000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000001')
$$, 'user1 can tag own spot');
reset role;

-- user2 cannot add tag to user1 spot
select tests.authenticate_as('st_user2');
select throws_ok($$
  insert into public.spot_tags (id, user_spot_id, tag_id)
  values ('a3000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000001')
$$, null, null, 'user2 cannot tag user1 spot');
reset role;

-- anyone can see spot tags
select tests.clear_authentication();
select is(
  (select count(*) from public.spot_tags)::bigint,
  1::bigint,
  'anon can see spot tags'
);
reset role;

select tests.authenticate_as('st_user2');
select is(
  (select count(*) from public.spot_tags)::bigint,
  1::bigint,
  'authenticated can see spot tags'
);
reset role;

-- user1 can delete tag from own spot
select tests.authenticate_as('st_user1');
select lives_ok($$
  delete from public.spot_tags
  where id = 'a3000000-0000-0000-0000-000000000001'
$$, 'user1 can remove tag from own spot');
reset role;

-- user2 cannot delete tag from user1 spot (re-insert for test)
insert into public.spot_tags (id, user_spot_id, tag_id)
values ('a3000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000001');

select tests.authenticate_as('st_user2');
delete from public.spot_tags where id = 'a3000000-0000-0000-0000-000000000003';
reset role;
select is(
  (select count(*) from public.spot_tags where id = 'a3000000-0000-0000-0000-000000000003')::bigint,
  1::bigint,
  'user2 cannot delete tag from user1 spot'
);

select * from finish();
rollback;

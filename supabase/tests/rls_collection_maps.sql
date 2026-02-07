begin;

select plan(8);

select tests.create_test_user('cm_user1', 'cm_user1', 'CM User One', 'active');
select tests.create_test_user('cm_user2', 'cm_user2', 'CM User Two', 'active');

-- Create maps owned by user1
insert into public.maps (id, user_id, name, is_public)
values ('c1000000-0000-0000-0000-000000000001', tests.get_supabase_uid('cm_user1'), 'Map One', true);

-- Create a public collection by user1
insert into public.collections (id, user_id, name, is_public)
values ('c2000000-0000-0000-0000-000000000001', tests.get_supabase_uid('cm_user1'), 'Public Collection', true);

-- Create a private collection by user1
insert into public.collections (id, user_id, name, is_public)
values ('c2000000-0000-0000-0000-000000000002', tests.get_supabase_uid('cm_user1'), 'Private Collection', false);

-- user1 can add map to own collection
select tests.authenticate_as('cm_user1');
select lives_ok($$
  insert into public.collection_maps (id, collection_id, map_id)
  values ('c3000000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001')
$$, 'user1 can add map to own public collection');

select lives_ok($$
  insert into public.collection_maps (id, collection_id, map_id)
  values ('c3000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001')
$$, 'user1 can add map to own private collection');
reset role;

-- user2 cannot add map to user1 collection
select tests.authenticate_as('cm_user2');
select throws_ok($$
  insert into public.collection_maps (id, collection_id, map_id)
  values ('c3000000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001')
$$, null, null, 'user2 cannot add map to user1 collection');
reset role;

-- user2 can see collection_maps of public collection
select tests.authenticate_as('cm_user2');
select is(
  (select count(*) from public.collection_maps where collection_id = 'c2000000-0000-0000-0000-000000000001')::bigint,
  1::bigint,
  'user2 can see public collection maps'
);

-- user2 cannot see collection_maps of private collection
select is(
  (select count(*) from public.collection_maps where collection_id = 'c2000000-0000-0000-0000-000000000002')::bigint,
  0::bigint,
  'user2 cannot see private collection maps'
);
reset role;

-- anon can see public collection maps
select tests.clear_authentication();
select is(
  (select count(*) from public.collection_maps where collection_id = 'c2000000-0000-0000-0000-000000000001')::bigint,
  1::bigint,
  'anon can see public collection maps'
);
reset role;

-- user2 cannot delete from user1 collection
select tests.authenticate_as('cm_user2');
delete from public.collection_maps where id = 'c3000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select count(*) from public.collection_maps where id = 'c3000000-0000-0000-0000-000000000001')::bigint,
  1::bigint,
  'user2 cannot delete from user1 collection'
);

-- user1 can delete from own collection
select tests.authenticate_as('cm_user1');
select lives_ok($$
  delete from public.collection_maps where id = 'c3000000-0000-0000-0000-000000000001'
$$, 'user1 can delete from own collection');
reset role;

select * from finish();
rollback;

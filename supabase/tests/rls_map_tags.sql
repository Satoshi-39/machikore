begin;

select plan(5);

select tests.create_test_user('tag_user1', 'tag_user1', 'Tag User One', 'active');
select tests.create_test_user('tag_user2', 'tag_user2', 'Tag User Two', 'active');

insert into public.maps (id, user_id, name, is_public)
values ('a0000000-0000-0000-0000-000000000001', tests.get_supabase_uid('tag_user1'), 'Tag Map', true);

insert into public.tags (id, name, slug)
values
  ('a1000000-0000-0000-0000-000000000001', 'Food', 'food'),
  ('a1000000-0000-0000-0000-000000000002', 'Cafe', 'cafe'),
  ('a1000000-0000-0000-0000-000000000003', 'Park', 'park');

insert into public.map_tags (id, map_id, tag_id)
values ('a2000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001');

-- anon can read map_tags
select tests.clear_authentication();
select is(
  (select count(*) from public.map_tags)::bigint,
  1::bigint,
  'anon can read map_tags'
);
reset role;

-- owner can insert map_tags
select tests.authenticate_as('tag_user1');
select lives_ok($$
  insert into public.map_tags (id, map_id, tag_id)
  values ('a2000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002')
$$, 'owner can insert map_tags');
reset role;

-- non-owner cannot insert map_tags
select tests.authenticate_as('tag_user2');
select throws_ok($$
  insert into public.map_tags (id, map_id, tag_id)
  values ('a2000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003')
$$, '42501', null, 'non-owner cannot insert map_tags');
reset role;

-- non-owner cannot delete map_tags (row remains)
select tests.authenticate_as('tag_user2');
delete from public.map_tags where id = 'a2000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select count(*) from public.map_tags where id = 'a2000000-0000-0000-0000-000000000001')::bigint,
  1::bigint,
  'non-owner cannot delete map_tags'
);

-- owner can delete map_tags
select tests.authenticate_as('tag_user1');
select lives_ok($$
  delete from public.map_tags where id = 'a2000000-0000-0000-0000-000000000001'
$$, 'owner can delete map_tags');
reset role;

select * from finish();
rollback;

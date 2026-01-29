begin;

select plan(4);

select tests.create_test_user('lbl_user1', 'label_user1', 'Label User One', 'active');
select tests.create_test_user('lbl_user2', 'label_user2', 'Label User Two', 'active');

insert into public.maps (id, user_id, name, is_public)
values ('90000000-0000-0000-0000-000000000001', tests.get_supabase_uid('lbl_user1'), 'Label Map', true);

insert into public.map_labels (id, map_id, name, color)
values ('91000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000001', 'Cafe', 'blue');

-- anon cannot see labels (policy is authenticated only)
select tests.clear_authentication();
select is(
  (select count(*) from public.map_labels)::bigint,
  0::bigint,
  'anon cannot read labels'
);
reset role;

-- authenticated non-owner can read labels for public map
select tests.authenticate_as('lbl_user2');
select is(
  (select count(*) from public.map_labels)::bigint,
  1::bigint,
  'authenticated can read labels for public map'
);
reset role;

-- non-owner cannot insert label
select tests.authenticate_as('lbl_user2');
select throws_ok($$
  insert into public.map_labels (id, map_id, name, color)
  values ('91000000-0000-0000-0000-000000000002', '90000000-0000-0000-0000-000000000001', 'Bar', 'red')
$$, '42501', null, 'non-owner cannot insert label');
reset role;

-- owner can insert label
select tests.authenticate_as('lbl_user1');
select lives_ok($$
  insert into public.map_labels (id, map_id, name, color)
  values ('91000000-0000-0000-0000-000000000003', '90000000-0000-0000-0000-000000000001', 'Park', 'green')
$$, 'owner can insert label');
reset role;

select * from finish();
rollback;

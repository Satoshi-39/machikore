begin;

select plan(6);

select tests.create_test_user('img_user1', 'image_user1', 'Image User One', 'active');
select tests.create_test_user('img_user2', 'image_user2', 'Image User Two', 'active');

insert into public.maps (id, user_id, name, is_public)
values ('80000000-0000-0000-0000-000000000001', tests.get_supabase_uid('img_user1'), 'Image Map', true);

insert into public.user_spots (id, user_id, map_id, description, latitude, longitude, is_public)
values
  ('81000000-0000-0000-0000-000000000001', tests.get_supabase_uid('img_user1'), '80000000-0000-0000-0000-000000000001', 'Public spot', 35.0, 139.0, true),
  ('81000000-0000-0000-0000-000000000002', tests.get_supabase_uid('img_user1'), '80000000-0000-0000-0000-000000000001', 'Private spot', 35.1, 139.1, false);

insert into public.images (id, user_spot_id, cloud_path)
values
  ('82000000-0000-0000-0000-000000000001', '81000000-0000-0000-0000-000000000001', 'public-1.jpg'),
  ('82000000-0000-0000-0000-000000000002', '81000000-0000-0000-0000-000000000001', 'public-2.jpg'),
  ('82000000-0000-0000-0000-000000000003', '81000000-0000-0000-0000-000000000002', 'private-1.jpg');

-- anon sees only images for public spots
select tests.clear_authentication();
select is(
  (select count(*) from public.images)::bigint,
  2::bigint,
  'anon sees only public spot images'
);
reset role;

-- authenticated non-owner sees only public images
select tests.authenticate_as('img_user2');
select is(
  (select count(*) from public.images)::bigint,
  2::bigint,
  'non-owner sees only public spot images'
);
reset role;

-- owner sees all images
select tests.authenticate_as('img_user1');
select is(
  (select count(*) from public.images)::bigint,
  3::bigint,
  'owner sees all images'
);
reset role;

-- image insert limit (max 4 per spot)
insert into public.user_spots (id, user_id, map_id, description, latitude, longitude, is_public)
values ('81000000-0000-0000-0000-000000000003', tests.get_supabase_uid('img_user1'), '80000000-0000-0000-0000-000000000001', 'Limit spot', 35.2, 139.2, true);

select tests.authenticate_as('img_user1');
insert into public.images (id, user_spot_id, cloud_path)
select gen_random_uuid(), '81000000-0000-0000-0000-000000000003', 'limit-' || gs::text || '.jpg'
from generate_series(1, 4) as gs;
select is(
  (select count(*) from public.images where user_spot_id = '81000000-0000-0000-0000-000000000003')::bigint,
  4::bigint,
  'owner can insert 4 images'
);

select throws_ok($$
  insert into public.images (id, user_spot_id, cloud_path)
  values ('82000000-0000-0000-0000-000000000004', '81000000-0000-0000-0000-000000000003', 'limit-5.jpg')
$$, '42501', null, 'cannot insert 5th image');
reset role;

select is(
  (select count(*) from public.images where user_spot_id = '81000000-0000-0000-0000-000000000003')::bigint,
  4::bigint,
  'image count remains 4'
);

select * from finish();
rollback;

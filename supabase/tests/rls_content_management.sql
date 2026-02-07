-- コンテンツ管理テーブルのRLSテスト
-- featured_items, magazines, magazine_sections, magazine_maps, system_announcements

begin;

select plan(8);

-- Setup: insert test data as superuser
insert into public.featured_items (id, title, image_url, link_type, link_value, is_active, starts_at, ends_at)
values
  ('d3000000-0000-0000-0000-000000000001', 'Active Item', 'https://example.com/img.jpg', 'url', 'https://example.com', true, now() - interval '1 day', now() + interval '1 day'),
  ('d3000000-0000-0000-0000-000000000002', 'Inactive Item', 'https://example.com/img.jpg', 'url', 'https://example.com', false, null, null),
  ('d3000000-0000-0000-0000-000000000003', 'Expired Item', 'https://example.com/img.jpg', 'url', 'https://example.com', true, now() - interval '2 days', now() - interval '1 day');

insert into public.magazines (id, title, name, is_active)
values
  ('d4000000-0000-0000-0000-000000000001', 'Active Magazine', 'active-magazine', true),
  ('d4000000-0000-0000-0000-000000000002', 'Draft Magazine', 'draft-magazine', false);

insert into public.system_announcements (id, title, content, type, is_active, expires_at)
values
  ('d5000000-0000-0000-0000-000000000001', 'Active Announcement', 'Content', 'info', true, now() + interval '7 days'),
  ('d5000000-0000-0000-0000-000000000002', 'Expired Announcement', 'Content', 'info', true, now() - interval '1 day'),
  ('d5000000-0000-0000-0000-000000000003', 'Inactive Announcement', 'Content', 'info', false, null);

-- anon can see only active featured_items within date range
select tests.clear_authentication();
select is(
  (select count(*) from public.featured_items)::bigint,
  1::bigint,
  'anon sees only active featured_items within date range'
);

-- anon can see only active magazines
select is(
  (select count(*) from public.magazines)::bigint,
  1::bigint,
  'anon sees only active magazines'
);

-- anon can see only active non-expired announcements
select is(
  (select count(*) from public.system_announcements)::bigint,
  1::bigint,
  'anon sees only active non-expired announcements'
);
reset role;

-- authenticated sees same filtered results
select tests.create_test_user('cm_user1', 'cm_user1', 'CM User One', 'active');
select tests.authenticate_as('cm_user1');

select is(
  (select count(*) from public.featured_items)::bigint,
  1::bigint,
  'authenticated sees only active featured_items'
);

select is(
  (select count(*) from public.magazines)::bigint,
  1::bigint,
  'authenticated sees only active magazines'
);

select is(
  (select count(*) from public.system_announcements)::bigint,
  1::bigint,
  'authenticated sees only active non-expired announcements'
);
reset role;

-- anon cannot insert featured_items
select tests.clear_authentication();
select throws_ok($$
  insert into public.featured_items (id, title, link_type, link_value, is_active)
  values ('d3000000-0000-0000-0000-000000000099', 'Hacked', 'url', 'https://evil.com', true)
$$, '42501', null, 'anon cannot insert featured_items');
reset role;

-- authenticated cannot insert featured_items
select tests.authenticate_as('cm_user1');
select throws_ok($$
  insert into public.featured_items (id, title, link_type, link_value, is_active)
  values ('d3000000-0000-0000-0000-000000000099', 'Hacked', 'url', 'https://evil.com', true)
$$, '42501', null, 'authenticated cannot insert featured_items');
reset role;

select * from finish();
rollback;

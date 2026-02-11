-- system_announcements: 管理者のみが管理し、一般ユーザーには読み取り専用のテーブル
-- RLSポリシー: SELECT (active + 未期限切れ) のみ。INSERT/UPDATE/DELETE ポリシーなし。

begin;

select plan(7);

select tests.create_test_user('sa_user1', 'sa_user1', 'SA User One', 'active');

-- Setup: superuser としてテストデータを挿入
insert into public.system_announcements (id, title, content, type, is_active, expires_at)
values
  ('ae000000-0000-0000-0000-000000000001', 'Active Notice', 'Active content', 'info', true, now() + interval '7 days'),
  ('ae000000-0000-0000-0000-000000000002', 'Expired Notice', 'Expired content', 'info', true, now() - interval '1 day'),
  ('ae000000-0000-0000-0000-000000000003', 'Inactive Notice', 'Inactive content', 'info', false, null);

-- authenticated はアクティブかつ未期限切れのお知らせのみ閲覧可能
select tests.authenticate_as('sa_user1');
select is(
  (select count(*) from public.system_announcements)::bigint,
  1::bigint,
  'authenticated sees only active non-expired announcements'
);
reset role;

-- authenticated はお知らせを作成できない
select tests.authenticate_as('sa_user1');
select throws_ok($$
  insert into public.system_announcements (id, title, content, type, is_active)
  values ('ae000000-0000-0000-0000-000000000099', 'Injected', 'Malicious', 'info', true)
$$, '42501', null, 'authenticated cannot insert system_announcements');
reset role;

-- authenticated はお知らせを更新できない（例：非アクティブ化の試行）
select tests.authenticate_as('sa_user1');
update public.system_announcements set is_active = false where id = 'ae000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select is_active from public.system_announcements where id = 'ae000000-0000-0000-0000-000000000001'),
  true,
  'authenticated cannot update system_announcements'
);

-- authenticated はお知らせを削除できない
select tests.authenticate_as('sa_user1');
delete from public.system_announcements where id = 'ae000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select count(*) from public.system_announcements where id = 'ae000000-0000-0000-0000-000000000001')::bigint,
  1::bigint,
  'authenticated cannot delete system_announcements'
);

-- anon はアクティブかつ未期限切れのお知らせのみ閲覧可能
select tests.clear_authentication();
select is(
  (select count(*) from public.system_announcements)::bigint,
  1::bigint,
  'anon sees only active non-expired announcements'
);

-- anon はお知らせを作成できない
select throws_ok($$
  insert into public.system_announcements (id, title, content, type, is_active)
  values ('ae000000-0000-0000-0000-000000000098', 'Injected', 'Malicious', 'info', true)
$$, '42501', null, 'anon cannot insert system_announcements');
reset role;

-- anon はお知らせを削除できない
select tests.clear_authentication();
delete from public.system_announcements where id = 'ae000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select count(*) from public.system_announcements where id = 'ae000000-0000-0000-0000-000000000001')::bigint,
  1::bigint,
  'anon cannot delete system_announcements'
);

select * from finish();
rollback;

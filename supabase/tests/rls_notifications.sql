begin;

select plan(6);

select tests.create_test_user('noti_user1', 'noti_user1', 'Noti User One', 'active');
select tests.create_test_user('noti_user2', 'noti_user2', 'Noti User Two', 'active');

insert into public.notifications (id, user_id, type, content)
values
  ('e1000000-0000-0000-0000-000000000001', tests.get_supabase_uid('noti_user1'), 'system', 'Hello 1'),
  ('e1000000-0000-0000-0000-000000000002', tests.get_supabase_uid('noti_user2'), 'system', 'Hello 2');

-- user1 sees only own notifications
select tests.authenticate_as('noti_user1');
select is(
  (select count(*) from public.notifications)::bigint,
  1::bigint,
  'user1 sees own notifications'
);
reset role;

-- user2 sees only own notifications
select tests.authenticate_as('noti_user2');
select is(
  (select count(*) from public.notifications)::bigint,
  1::bigint,
  'user2 sees own notifications'
);
reset role;

-- user1 can update own notification
select tests.authenticate_as('noti_user1');
select lives_ok($$
  update public.notifications set is_read = true
  where id = 'e1000000-0000-0000-0000-000000000001'
$$, 'user1 can update own notification');
reset role;
select is(
  (select is_read from public.notifications where id = 'e1000000-0000-0000-0000-000000000001'),
  true,
  'notification marked read'
);

-- user2 cannot update user1 notification (row remains unchanged)
select tests.authenticate_as('noti_user2');
update public.notifications set is_read = false
where id = 'e1000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select is_read from public.notifications where id = 'e1000000-0000-0000-0000-000000000001'),
  true,
  'user2 cannot update user1 notification'
);

-- user2 cannot delete user1 notification (row remains)
select tests.authenticate_as('noti_user2');
delete from public.notifications where id = 'e1000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select count(*) from public.notifications where id = 'e1000000-0000-0000-0000-000000000001')::bigint,
  1::bigint,
  'user2 cannot delete user1 notification'
);

select * from finish();
rollback;

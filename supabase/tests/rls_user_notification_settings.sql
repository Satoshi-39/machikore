begin;

select plan(5);

select tests.create_test_user('uns_user1', 'uns_user1', 'UNS User One', 'active');
select tests.create_test_user('uns_user2', 'uns_user2', 'UNS User Two', 'active');

-- Note: trigger_create_default_notification_settings auto-creates a row
-- when public.users is inserted. So uns_user1 already has settings.

-- user1 can update own settings (auto-created by trigger)
select tests.authenticate_as('uns_user1');
select lives_ok($$
  update public.user_notification_settings set push_enabled = true
  where user_id = tests.get_supabase_uid('uns_user1')
$$, 'user1 can update own settings');
reset role;

-- user2 cannot insert for user1 (already exists, and RLS blocks anyway)
select tests.authenticate_as('uns_user2');
select throws_ok($$
  insert into public.user_notification_settings (id, user_id, push_enabled)
  values (gen_random_uuid(), tests.get_supabase_uid('uns_user1'), false)
$$, '42501', null, 'user2 cannot insert for user1');
reset role;

-- user1 can select own settings
select tests.authenticate_as('uns_user1');
select is(
  (select count(*) from public.user_notification_settings)::bigint,
  1::bigint,
  'user1 can select own settings'
);
reset role;

-- user2 cannot see user1 settings
select tests.authenticate_as('uns_user2');
select is(
  (select count(*) from public.user_notification_settings where user_id = tests.get_supabase_uid('uns_user1'))::bigint,
  0::bigint,
  'user2 cannot see user1 settings'
);
reset role;

-- user2 cannot update user1 settings (row remains unchanged)
select tests.authenticate_as('uns_user2');
update public.user_notification_settings set push_enabled = false
where user_id = tests.get_supabase_uid('uns_user1');
reset role;
select is(
  (select push_enabled from public.user_notification_settings where user_id = tests.get_supabase_uid('uns_user1')),
  true,
  'user2 cannot update user1 settings'
);

select * from finish();
rollback;

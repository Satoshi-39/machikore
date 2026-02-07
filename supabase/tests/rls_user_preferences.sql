begin;

select plan(6);

select tests.create_test_user('pref_user1', 'pref_user1', 'Pref User One', 'active');
select tests.create_test_user('pref_user2', 'pref_user2', 'Pref User Two', 'active');

-- user1 can insert own preferences
select tests.authenticate_as('pref_user1');
select lives_ok($$
  insert into public.user_preferences (user_id, theme, locale)
  values (tests.get_supabase_uid('pref_user1'), 'dark', 'ja')
$$, 'user1 can insert own preferences');

-- user1 cannot insert preferences for another user
select throws_ok($$
  insert into public.user_preferences (user_id, theme, locale)
  values (tests.get_supabase_uid('pref_user2'), 'dark', 'ja')
$$, null, null, 'user1 cannot insert preferences for another user');

-- user1 can see own preferences
select is(
  (select count(*) from public.user_preferences)::bigint,
  1::bigint,
  'user1 can see own preferences'
);
reset role;

-- user2 cannot see user1 preferences
select tests.authenticate_as('pref_user2');
select is(
  (select count(*) from public.user_preferences)::bigint,
  0::bigint,
  'user2 cannot see user1 preferences'
);
reset role;

-- user1 can update own preferences
select tests.authenticate_as('pref_user1');
select lives_ok($$
  update public.user_preferences set theme = 'light'
  where user_id = tests.get_supabase_uid('pref_user1')
$$, 'user1 can update own preferences');
reset role;

-- user2 cannot update user1 preferences
select tests.authenticate_as('pref_user2');
update public.user_preferences set theme = 'hacked'
where user_id = tests.get_supabase_uid('pref_user1');
reset role;
select is(
  (select theme from public.user_preferences where user_id = tests.get_supabase_uid('pref_user1')),
  'light',
  'user2 cannot update user1 preferences'
);

select * from finish();
rollback;

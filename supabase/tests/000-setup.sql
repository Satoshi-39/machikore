-- =============================================================================
-- Test Setup: pgTAP + supabase-test-helpers + project-specific helpers
-- =============================================================================
-- This file is NOT a pgTAP test. It runs as plain SQL to install helper
-- functions that subsequent test files rely on.
-- Source: https://github.com/usebasejump/supabase-test-helpers (v0.0.6)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgtap;

-- We want to store all of this in the tests schema to keep it
-- separate from any application data
CREATE SCHEMA IF NOT EXISTS tests;

--- Create a specific schema for override functions
CREATE SCHEMA IF NOT EXISTS test_overrides;

-- anon, authenticated, and service_role should have access to tests schema
GRANT USAGE ON SCHEMA tests TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA tests REVOKE EXECUTE ON FUNCTIONS FROM public;
ALTER DEFAULT PRIVILEGES IN SCHEMA tests GRANT EXECUTE ON FUNCTIONS TO anon, authenticated, service_role;

GRANT USAGE ON SCHEMA test_overrides TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA test_overrides REVOKE EXECUTE ON FUNCTIONS FROM public;
ALTER DEFAULT PRIVILEGES IN SCHEMA test_overrides GRANT EXECUTE ON FUNCTIONS TO anon, authenticated, service_role;

-- =============================================================================
-- supabase-test-helpers functions
-- =============================================================================

/**
 * tests.create_supabase_user(identifier text, email text, phone text, metadata jsonb)
 * Creates a new user in auth.users and returns the user_id.
 */
CREATE OR REPLACE FUNCTION tests.create_supabase_user(
  identifier text,
  email text default null,
  phone text default null,
  metadata jsonb default null
)
RETURNS uuid
  SECURITY DEFINER
  SET search_path = auth, pg_temp
AS $$
DECLARE
  user_id uuid;
BEGIN
  user_id := extensions.uuid_generate_v4();
  INSERT INTO auth.users (id, email, phone, raw_user_meta_data, raw_app_meta_data, created_at, updated_at)
  VALUES (
    user_id,
    coalesce(email, concat(user_id, '@test.com')),
    phone,
    jsonb_build_object('test_identifier', identifier) || coalesce(metadata, '{}'::jsonb),
    '{}'::jsonb,
    now(),
    now()
  )
  RETURNING id INTO user_id;

  RETURN user_id;
END;
$$ LANGUAGE plpgsql;

/**
 * tests.get_supabase_user(identifier text)
 * Returns user info as JSON for a user created with tests.create_supabase_user.
 */
CREATE OR REPLACE FUNCTION tests.get_supabase_user(identifier text)
RETURNS json
  SECURITY DEFINER
  SET search_path = auth, pg_temp
AS $$
DECLARE
  supabase_user json;
BEGIN
  SELECT json_build_object(
    'id', id,
    'email', email,
    'phone', phone,
    'raw_user_meta_data', raw_user_meta_data,
    'raw_app_meta_data', raw_app_meta_data
  ) INTO supabase_user
  FROM auth.users
  WHERE raw_user_meta_data ->> 'test_identifier' = identifier
  LIMIT 1;

  IF supabase_user IS NULL OR supabase_user -> 'id' IS NULL THEN
    RAISE EXCEPTION 'User with identifier % not found', identifier;
  END IF;

  RETURN supabase_user;
END;
$$ LANGUAGE plpgsql;

/**
 * tests.get_supabase_uid(identifier text)
 * Returns UUID for a user created with tests.create_supabase_user.
 */
CREATE OR REPLACE FUNCTION tests.get_supabase_uid(identifier text)
RETURNS uuid
  SECURITY DEFINER
  SET search_path = auth, pg_temp
AS $$
DECLARE
  supabase_user uuid;
BEGIN
  SELECT id INTO supabase_user
  FROM auth.users
  WHERE raw_user_meta_data ->> 'test_identifier' = identifier
  LIMIT 1;

  IF supabase_user IS NULL THEN
    RAISE EXCEPTION 'User with identifier % not found', identifier;
  END IF;

  RETURN supabase_user;
END;
$$ LANGUAGE plpgsql;

/**
 * tests.authenticate_as(identifier text)
 * Sets role to authenticated and configures JWT claims for the given user.
 */
CREATE OR REPLACE FUNCTION tests.authenticate_as(identifier text)
RETURNS void
AS $$
DECLARE
  user_data json;
BEGIN
  user_data := tests.get_supabase_user(identifier);

  IF user_data IS NULL OR user_data ->> 'id' IS NULL THEN
    RAISE EXCEPTION 'User with identifier % not found', identifier;
  END IF;

  -- Set role and JWT claims
  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('request.jwt.claim.sub', user_data ->> 'id', true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', json_build_object(
    'sub', user_data ->> 'id',
    'email', user_data ->> 'email',
    'phone', user_data ->> 'phone',
    'role', 'authenticated',
    'user_metadata', user_data -> 'raw_user_meta_data',
    'app_metadata', user_data -> 'raw_app_meta_data'
  )::text, true);
END
$$ LANGUAGE plpgsql;

/**
 * tests.clear_authentication()
 * Resets role to anon and clears JWT claims.
 */
CREATE OR REPLACE FUNCTION tests.clear_authentication()
RETURNS void AS $$
BEGIN
  EXECUTE 'SET LOCAL ROLE anon';
  PERFORM set_config('request.jwt.claim.sub', '', true);
  PERFORM set_config('request.jwt.claim.role', 'anon', true);
  PERFORM set_config('request.jwt.claims', null, true);
END
$$ LANGUAGE plpgsql;

/**
 * tests.rls_enabled(testing_schema text)
 * pgTAP assertion: all tables in the given schema have RLS enabled.
 */
CREATE OR REPLACE FUNCTION tests.rls_enabled(testing_schema text)
RETURNS text AS $$
  SELECT is(
    (SELECT count(pc.relname)::integer
     FROM pg_class pc
     JOIN pg_namespace pn ON pn.oid = pc.relnamespace AND pn.nspname = rls_enabled.testing_schema
     WHERE pc.relkind = 'r' AND relrowsecurity = FALSE
       AND pc.relname NOT IN ('spatial_ref_sys')),
    0,
    'All tables in the ' || testing_schema || ' schema should have row level security enabled'
  );
$$ LANGUAGE sql;

/**
 * tests.rls_enabled(testing_schema text, testing_table text)
 * pgTAP assertion: a specific table has RLS enabled.
 */
CREATE OR REPLACE FUNCTION tests.rls_enabled(testing_schema text, testing_table text)
RETURNS text AS $$
  SELECT is(
    (SELECT count(*)::integer
     FROM pg_class pc
     JOIN pg_namespace pn ON pn.oid = pc.relnamespace AND pn.nspname = rls_enabled.testing_schema AND pc.relname = rls_enabled.testing_table
     WHERE pc.relkind = 'r' AND relrowsecurity = TRUE),
    1,
    testing_table || ' table in the ' || testing_schema || ' schema should have row level security enabled'
  );
$$ LANGUAGE sql;

-- =============================================================================
-- Project-specific helpers
-- =============================================================================

/**
 * tests.create_test_user(identifier, username, display_name, status, is_premium)
 * Creates an auth.users entry AND a public.users entry in one call.
 * Returns the user UUID.
 */
CREATE OR REPLACE FUNCTION tests.create_test_user(
  identifier text,
  username text DEFAULT null,
  display_name text DEFAULT null,
  status text DEFAULT 'active',
  is_premium boolean DEFAULT false
)
RETURNS uuid
  SECURITY DEFINER
  SET search_path = public, auth, pg_temp
AS $$
DECLARE
  user_id uuid;
  _email text;
  _username text;
  _display_name text;
BEGIN
  -- Create auth user
  user_id := tests.create_supabase_user(identifier, identifier || '@test.com');

  _username := coalesce(username, identifier);
  _display_name := coalesce(display_name, identifier);
  _email := identifier || '@test.com';

  -- Create public user
  INSERT INTO public.users (id, email, username, display_name, status, is_premium)
  VALUES (user_id, _email, _username, _display_name, status, is_premium);

  RETURN user_id;
END;
$$ LANGUAGE plpgsql;

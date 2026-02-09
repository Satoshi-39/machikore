-- admin_usersのINSERT/UPDATE/DELETEポリシーがadmin_usersを直接サブクエリし、
-- SELECTポリシーとの間で無限再帰（42P17）が発生する問題を修正。
-- SECURITY DEFINER関数を使用してRLSをバイパスする。
-- また、is_admin_user/is_admin_ownerのEXECUTE権限をanonから除外（最小権限の原則）。

-- owner判定用のSECURITY DEFINER関数を作成
CREATE OR REPLACE FUNCTION public.is_admin_owner(check_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = check_user_id AND role = 'owner'
    );
$$;

-- is_admin_owner: authenticated と service_role のみに実行権限を付与
REVOKE EXECUTE ON FUNCTION public.is_admin_owner(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin_owner(uuid) TO authenticated, service_role;

-- is_admin_user: anon から実行権限を除外
REVOKE EXECUTE ON FUNCTION public.is_admin_user(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.is_admin_user(uuid) TO authenticated, service_role;

-- SELECT ポリシーを TO authenticated に制限して再作成
DROP POLICY IF EXISTS admin_users_select_admin ON public.admin_users;
CREATE POLICY admin_users_select_admin ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (is_admin_user((SELECT auth.uid())));

-- INSERT ポリシーを TO authenticated に制限して再作成
DROP POLICY IF EXISTS admin_users_insert_owner ON public.admin_users;
CREATE POLICY admin_users_insert_owner ON public.admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_owner((SELECT auth.uid())));

-- UPDATE ポリシーを TO authenticated に制限して再作成
DROP POLICY IF EXISTS admin_users_update_owner ON public.admin_users;
CREATE POLICY admin_users_update_owner ON public.admin_users
  FOR UPDATE
  TO authenticated
  USING (is_admin_owner((SELECT auth.uid())))
  WITH CHECK (is_admin_owner((SELECT auth.uid())));

-- DELETE ポリシーを TO authenticated に制限して再作成
DROP POLICY IF EXISTS admin_users_delete_owner ON public.admin_users;
CREATE POLICY admin_users_delete_owner ON public.admin_users
  FOR DELETE
  TO authenticated
  USING (is_admin_owner((SELECT auth.uid())));

-- 管理者ユーザーテーブル
-- 管理画面にアクセスできるユーザーを管理する

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('moderator', 'admin', 'owner')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id)
);

-- RLSを有効化
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- インデックス
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);

-- RLSをバイパスして管理者かどうかをチェックする関数
CREATE OR REPLACE FUNCTION public.is_admin_user(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = check_user_id
  );
$$;

-- RLSをバイパスしてownerかどうかをチェックする関数
CREATE OR REPLACE FUNCTION public.is_admin_owner(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = check_user_id AND role = 'owner'
  );
$$;

-- 管理者のみが管理者一覧を閲覧可能
CREATE POLICY admin_users_select_admin ON public.admin_users
  FOR SELECT TO authenticated
  USING (
    public.is_admin_user(auth.uid())
  );

-- ownerのみが管理者を追加可能
CREATE POLICY admin_users_insert_owner ON public.admin_users
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin_owner(auth.uid())
  );

-- ownerのみが管理者を更新可能
CREATE POLICY admin_users_update_owner ON public.admin_users
  FOR UPDATE TO authenticated
  USING (
    public.is_admin_owner(auth.uid())
  )
  WITH CHECK (
    public.is_admin_owner(auth.uid())
  );

-- ownerのみが管理者を削除可能
CREATE POLICY admin_users_delete_owner ON public.admin_users
  FOR DELETE TO authenticated
  USING (
    public.is_admin_owner(auth.uid())
  );

-- updated_atを自動更新するトリガー（共通関数を使用）
CREATE TRIGGER trigger_update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- コメント
COMMENT ON TABLE public.admin_users IS '管理画面にアクセス可能なユーザー一覧';
COMMENT ON COLUMN public.admin_users.role IS 'moderator: コンテンツ管理, admin: システム設定変更, owner: 管理者の追加削除も可能';
COMMENT ON FUNCTION public.is_admin_user(UUID) IS '指定されたユーザーが管理者かどうかをチェック（RLSバイパス）';
COMMENT ON FUNCTION public.is_admin_owner(UUID) IS '指定されたユーザーがownerかどうかをチェック（RLSバイパス）';

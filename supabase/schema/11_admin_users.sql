-- ============================================================
-- 管理者ユーザー（admin_users）
-- ============================================================
-- 管理画面にアクセスできるユーザーを管理する
-- 最終更新: 2026-01-02

-- ============================================================
-- admin_users（管理者ユーザー）
-- ============================================================

CREATE TABLE public.admin_users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role text DEFAULT 'admin'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    CONSTRAINT admin_users_role_check CHECK (role IN ('moderator', 'admin', 'owner'))
);

COMMENT ON TABLE public.admin_users IS '管理画面にアクセス可能なユーザー一覧';
COMMENT ON COLUMN public.admin_users.user_id IS '対象ユーザーのID';
COMMENT ON COLUMN public.admin_users.role IS '権限レベル（moderator: コンテンツ管理, admin: システム設定変更, owner: 管理者の追加削除も可能）';
COMMENT ON COLUMN public.admin_users.created_by IS 'この管理者を追加したユーザーのID';

ALTER TABLE ONLY public.admin_users ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.admin_users ADD CONSTRAINT admin_users_user_id_key UNIQUE (user_id);
ALTER TABLE ONLY public.admin_users ADD CONSTRAINT admin_users_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.admin_users ADD CONSTRAINT admin_users_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX idx_admin_users_user_id ON public.admin_users USING btree (user_id);
CREATE INDEX idx_admin_users_role ON public.admin_users USING btree (role);

CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLSバイパス用関数
-- ============================================================

-- 管理者かどうかをチェックする関数（RLSバイパス）
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

-- ownerかどうかをチェックする関数（RLSバイパス）
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

COMMENT ON FUNCTION public.is_admin_user(UUID) IS '指定されたユーザーが管理者かどうかをチェック（RLSバイパス）';
COMMENT ON FUNCTION public.is_admin_owner(UUID) IS '指定されたユーザーがownerかどうかをチェック（RLSバイパス）';

-- ============================================================
-- RLSポリシー
-- ============================================================

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

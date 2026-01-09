-- ============================================================
-- admin_usersにpublic.usersへの外部キーを追加
-- ============================================================
-- admin_usersからpublic.usersをJOINできるようにするため
-- 最終更新: 2026-01-03

-- public.usersへの外部キーを追加
-- ※ auth.usersへの外部キーは既存のまま維持
ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_user_id_public_users_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

COMMENT ON CONSTRAINT admin_users_user_id_public_users_fkey ON public.admin_users
    IS 'public.usersへの外部キー（JOINクエリ用）';

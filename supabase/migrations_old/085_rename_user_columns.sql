-- ユーザーテーブルのカラム名変更
-- username → user_id (ユーザーID、@で表示)
-- display_name → username (ユーザー名、表示用の名前)

-- 1. カラム名の変更
ALTER TABLE public.users RENAME COLUMN username TO user_id;
ALTER TABLE public.users RENAME COLUMN display_name TO username;

-- 2. インデックスの再作成（名前も変更）
DROP INDEX IF EXISTS users_username_idx;
CREATE UNIQUE INDEX users_user_id_idx ON public.users(user_id);

-- 3. コメントの更新
COMMENT ON COLUMN public.users.user_id IS 'ユーザーID（@で表示される識別子）';
COMMENT ON COLUMN public.users.username IS 'ユーザー名（表示用の名前）';

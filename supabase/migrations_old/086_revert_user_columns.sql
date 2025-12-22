-- 085_rename_user_columns.sql を取り消し
-- 現在: user_id（@表示）, username（表示名）
-- 目標: username（@表示）, display_name（表示名）

-- 1. 一時的な名前を使ってカラム名を変更
-- まず username(表示名) → display_name に変更
ALTER TABLE public.users RENAME COLUMN username TO display_name;
-- 次に user_id(@表示) → username に変更
ALTER TABLE public.users RENAME COLUMN user_id TO username;

-- 2. インデックスを元に戻す
DROP INDEX IF EXISTS users_user_id_idx;
CREATE UNIQUE INDEX users_username_idx ON public.users(username);

-- 3. コメントを更新
COMMENT ON COLUMN public.users.username IS 'ユーザー名（@で表示される識別子）';
COMMENT ON COLUMN public.users.display_name IS '表示名（自由に設定できる名前）';

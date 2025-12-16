-- usersテーブルから誤って追加した規約関連カラムを削除
-- 規約の同意情報は terms_agreements テーブルで管理するため不要

-- インデックスを削除
DROP INDEX IF EXISTS idx_users_agreed_terms_version;
DROP INDEX IF EXISTS idx_users_agreed_at;

-- カラムを削除
ALTER TABLE public.users
DROP COLUMN IF EXISTS agreed_terms_version,
DROP COLUMN IF EXISTS agreed_privacy_version,
DROP COLUMN IF EXISTS agreed_at;

-- usersテーブルに国カラムを追加

ALTER TABLE public.users ADD COLUMN country text;

COMMENT ON COLUMN public.users.country IS '居住国（ISO 3166-1 alpha-2）: jp, us, kr, etc.';

-- prefectureカラムのコメントを更新（地域として汎用的に使用）
COMMENT ON COLUMN public.users.prefecture IS '居住地域（日本の場合は都道府県、他国の場合は州など）';

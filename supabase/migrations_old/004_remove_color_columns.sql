-- 未使用のcolorカラムを削除

-- bookmark_foldersテーブル
ALTER TABLE public.bookmark_folders DROP COLUMN color;

-- collectionsテーブル
ALTER TABLE public.collections DROP COLUMN color;

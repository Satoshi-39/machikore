-- user_spotsテーブルから未使用のcolorカラムを削除
-- spot_colorカラムが使用されており、colorは使用されていない

ALTER TABLE public.user_spots DROP COLUMN IF EXISTS color;

-- avatar_crop列をusersテーブルに追加
-- アバター画像のクロップ座標をJSON形式で保存する
ALTER TABLE public.users
ADD COLUMN avatar_crop JSONB DEFAULT NULL;

COMMENT ON COLUMN public.users.avatar_crop IS 'アバター画像のクロップ座標（JSON: originX, originY, width, height, imageWidth, imageHeight）';

-- maps.theme_color を削除し、user_spots.spot_color を追加するマイグレーション
-- スポットごとに色分けできるようにする

-- ===============================
-- 1. user_spots に spot_color カラムを追加
-- ===============================

ALTER TABLE user_spots
ADD COLUMN spot_color TEXT NULL DEFAULT 'blue';

COMMENT ON COLUMN user_spots.spot_color IS 'スポットの色（pink, red, orange, yellow, green, blue, purple, gray, white）';

-- ===============================
-- 2. 既存スポットにマップのtheme_colorを移行
-- ===============================

-- 既存のスポットはマップの theme_color を引き継ぐ
UPDATE user_spots us
SET spot_color = m.theme_color
FROM maps m
WHERE us.map_id = m.id
  AND m.theme_color IS NOT NULL;

-- ===============================
-- 3. maps から theme_color を削除
-- ===============================

ALTER TABLE maps
DROP COLUMN IF EXISTS theme_color;

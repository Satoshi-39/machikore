-- ===============================
-- user_spots テーブルの正規化
-- ===============================
-- 1. 緯度経度を NOT NULL に変更（地図表示に必須）
-- 2. city_id を追加（machi_id, prefecture_id との一貫性）
-- 3. 非正規化カラムを追加（詳細カード表示用、JOINなしで高速表示）

-- ===============================
-- 1. 緯度経度を NOT NULL に変更
-- ===============================
-- 緯度経度がNULLのレコードは削除するか、master_spotから取得して埋める
UPDATE user_spots us
SET
  latitude = ms.latitude,
  longitude = ms.longitude
FROM master_spots ms
WHERE us.master_spot_id = ms.id
  AND (us.latitude IS NULL OR us.longitude IS NULL);

-- それでもNULLのレコードがある場合は削除（地図表示できないため）
DELETE FROM user_spots WHERE latitude IS NULL OR longitude IS NULL;

ALTER TABLE user_spots ALTER COLUMN latitude SET NOT NULL;
ALTER TABLE user_spots ALTER COLUMN longitude SET NOT NULL;

-- ===============================
-- 2. city_id を追加
-- ===============================
ALTER TABLE user_spots ADD COLUMN IF NOT EXISTS city_id text;

-- ===============================
-- 3. 非正規化カラムを追加
-- ===============================
ALTER TABLE user_spots ADD COLUMN IF NOT EXISTS prefecture_name text;
ALTER TABLE user_spots ADD COLUMN IF NOT EXISTS city_name text;
ALTER TABLE user_spots ADD COLUMN IF NOT EXISTS machi_name text;

-- 既存データの非正規化カラムを埋める
UPDATE user_spots us
SET prefecture_name = p.name
FROM prefectures p
WHERE us.prefecture_id = p.id AND us.prefecture_name IS NULL;

UPDATE user_spots us
SET
  city_id = m.city_id,
  city_name = c.name,
  machi_name = m.name
FROM machi m
LEFT JOIN cities c ON m.city_id = c.id
WHERE us.machi_id = m.id AND us.machi_name IS NULL;

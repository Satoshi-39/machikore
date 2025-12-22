-- ===============================
-- 地理テーブル正規化マイグレーション
-- ===============================
-- 1. continents.name_translations を追加
-- 2. countries.id を ISO 2文字コードに変更、country_code を削除
-- 3. regions に country_id を追加（外部キー）、country_code を削除
-- 4. prefectures から country_code を削除
-- 5. cities から country_code を削除
-- 6. machi から country_code を削除
-- ===============================

-- ===============================
-- 1. continents に name_translations を追加
-- ===============================
ALTER TABLE continents ADD COLUMN IF NOT EXISTS name_translations JSONB;

-- ===============================
-- 2. countries.id を ISO 2文字コードに変更
-- ===============================
-- 外部キー制約がまだないので、直接 id を更新

UPDATE countries SET id = country_code WHERE id != country_code;

-- country_code カラムを削除
ALTER TABLE countries DROP COLUMN IF EXISTS country_code;

-- ===============================
-- 3. regions に country_id を追加（外部キー）
-- ===============================
-- country_id カラムを追加
ALTER TABLE regions ADD COLUMN IF NOT EXISTS country_id TEXT;

-- 既存データを移行（country_code → country_id）
UPDATE regions SET country_id = country_code WHERE country_id IS NULL;

-- 外部キー制約を追加
ALTER TABLE regions
  ADD CONSTRAINT fk_regions_country
  FOREIGN KEY (country_id) REFERENCES countries(id);

-- country_code カラムを削除
ALTER TABLE regions DROP COLUMN IF EXISTS country_code;

-- ===============================
-- 4. prefectures から country_code を削除
-- ===============================
ALTER TABLE prefectures DROP COLUMN IF EXISTS country_code;

-- ===============================
-- 5. cities から country_code を削除
-- ===============================
ALTER TABLE cities DROP COLUMN IF EXISTS country_code;

-- ===============================
-- 6. machi から country_code を削除（country_id は追加しない）
-- ===============================
-- 理由: machiで国別フィルタは使用しない。prefecture_id → regions.country_id で辿れる
ALTER TABLE machi DROP COLUMN IF EXISTS country_code;

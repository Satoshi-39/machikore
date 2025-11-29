-- スキーマ修正: Google Places API対応 & machi.lines配列対応
-- 現在のSupabaseスキーマを本来の設計に合わせて修正

-- ===============================
-- 1. machi テーブルの修正
-- ===============================

-- 現在の構造:
--   line_name TEXT (単一路線のみ)
--   prefecture TEXT
--
-- 正しい構造:
--   lines JSONB (複数路線対応)
--   prefecture_name TEXT
--   city_name TEXT

-- 既存データを一時保存
CREATE TABLE IF NOT EXISTS machi_backup AS SELECT * FROM machi;

-- 古いカラムを削除して新しいカラムを追加
ALTER TABLE machi DROP COLUMN IF EXISTS line_name;
ALTER TABLE machi DROP COLUMN IF EXISTS prefecture;

-- 新しいカラムを追加（存在しない場合のみ）
DO $$
BEGIN
  -- lines カラム (JSONB配列)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'machi' AND column_name = 'lines') THEN
    ALTER TABLE machi ADD COLUMN lines JSONB;
  END IF;

  -- name_kana カラム
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'machi' AND column_name = 'name_kana') THEN
    ALTER TABLE machi ADD COLUMN name_kana TEXT DEFAULT '';
  END IF;

  -- name_translations カラム
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'machi' AND column_name = 'name_translations') THEN
    ALTER TABLE machi ADD COLUMN name_translations JSONB;
  END IF;

  -- country_code カラム
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'machi' AND column_name = 'country_code') THEN
    ALTER TABLE machi ADD COLUMN country_code TEXT DEFAULT 'jp';
  END IF;

  -- prefecture_name カラム
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'machi' AND column_name = 'prefecture_name') THEN
    ALTER TABLE machi ADD COLUMN prefecture_name TEXT DEFAULT '';
  END IF;

  -- prefecture_name_translations カラム
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'machi' AND column_name = 'prefecture_name_translations') THEN
    ALTER TABLE machi ADD COLUMN prefecture_name_translations JSONB;
  END IF;

  -- city_name カラム
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'machi' AND column_name = 'city_name') THEN
    ALTER TABLE machi ADD COLUMN city_name TEXT;
  END IF;

  -- city_name_translations カラム
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'machi' AND column_name = 'city_name_translations') THEN
    ALTER TABLE machi ADD COLUMN city_name_translations JSONB;
  END IF;

  -- created_at カラム
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'machi' AND column_name = 'created_at') THEN
    ALTER TABLE machi ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  -- updated_at カラム
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'machi' AND column_name = 'updated_at') THEN
    ALTER TABLE machi ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- バックアップテーブルから prefecture_name を復元
UPDATE machi m
SET prefecture_name = COALESCE(b.prefecture, '')
FROM machi_backup b
WHERE m.id = b.id AND b.prefecture IS NOT NULL;

-- バックアップテーブルから lines を復元（単一路線をJSONB配列に変換）
UPDATE machi m
SET lines = CASE
  WHEN b.line_name IS NOT NULL AND b.line_name != ''
  THEN jsonb_build_array(jsonb_build_object('ja', b.line_name))
  ELSE '[]'::jsonb
END
FROM machi_backup b
WHERE m.id = b.id;

-- バックアップテーブルを削除
DROP TABLE IF EXISTS machi_backup;

-- ===============================
-- 2. cities テーブルの修正
-- ===============================

-- name_translations カラムを追加（存在しない場合のみ）
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cities' AND column_name = 'name_translations') THEN
    ALTER TABLE cities ADD COLUMN name_translations JSONB;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cities' AND column_name = 'country_code') THEN
    ALTER TABLE cities ADD COLUMN country_code TEXT DEFAULT 'jp';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cities' AND column_name = 'latitude') THEN
    ALTER TABLE cities ADD COLUMN latitude DOUBLE PRECISION;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cities' AND column_name = 'longitude') THEN
    ALTER TABLE cities ADD COLUMN longitude DOUBLE PRECISION;
  END IF;
END $$;

-- TYPE制約を更新（区・市・町・村のみ許可）
ALTER TABLE cities DROP CONSTRAINT IF EXISTS cities_type_check;
ALTER TABLE cities ADD CONSTRAINT cities_type_check CHECK (type IN ('区', '市', '町', '村'));

-- ===============================
-- 3. master_spots テーブルの修正
-- ===============================

-- Mapbox → Google Places に変更
-- mapbox_* カラムを google_* に改名

DO $$
BEGIN
  -- mapbox_place_id → google_place_id
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'master_spots' AND column_name = 'mapbox_place_id') THEN
    ALTER TABLE master_spots RENAME COLUMN mapbox_place_id TO google_place_id;
  ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'master_spots' AND column_name = 'google_place_id') THEN
    ALTER TABLE master_spots ADD COLUMN google_place_id TEXT UNIQUE;
  END IF;

  -- mapbox_place_name → google_formatted_address
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'master_spots' AND column_name = 'mapbox_place_name') THEN
    ALTER TABLE master_spots RENAME COLUMN mapbox_place_name TO google_formatted_address;
  ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'master_spots' AND column_name = 'google_formatted_address') THEN
    ALTER TABLE master_spots ADD COLUMN google_formatted_address TEXT;
  END IF;

  -- mapbox_category → google_types
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'master_spots' AND column_name = 'mapbox_category') THEN
    ALTER TABLE master_spots RENAME COLUMN mapbox_category TO google_types;
  ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'master_spots' AND column_name = 'google_types') THEN
    ALTER TABLE master_spots ADD COLUMN google_types TEXT[];
  END IF;

  -- mapbox_address → 削除（google_formatted_addressに統合）
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'master_spots' AND column_name = 'mapbox_address') THEN
    ALTER TABLE master_spots DROP COLUMN mapbox_address;
  END IF;

  -- mapbox_context → google_data (その他のGoogle Places情報)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'master_spots' AND column_name = 'mapbox_context') THEN
    ALTER TABLE master_spots RENAME COLUMN mapbox_context TO google_data;
  ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'master_spots' AND column_name = 'google_data') THEN
    ALTER TABLE master_spots ADD COLUMN google_data JSONB;
  END IF;
END $$;

-- インデックス更新
DROP INDEX IF EXISTS idx_master_spots_mapbox_place_id;
CREATE INDEX IF NOT EXISTS idx_master_spots_google_place_id ON master_spots(google_place_id);

-- ユニーク制約更新
ALTER TABLE master_spots DROP CONSTRAINT IF EXISTS master_spots_mapbox_place_id_key;
-- google_place_id のユニーク制約は上でADD COLUMN時に追加済み

-- ===============================
-- 4. spots テーブルを user_spots にリネーム（まだの場合）
-- ===============================

-- spots テーブルが存在し、user_spots が存在しない場合はリネーム
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'spots')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_spots') THEN
    ALTER TABLE spots RENAME TO user_spots;
  END IF;
END $$;

-- ===============================
-- 5. 更新日時トリガーの追加（machiテーブル用）
-- ===============================

DROP TRIGGER IF EXISTS update_machi_updated_at ON machi;
CREATE TRIGGER update_machi_updated_at BEFORE UPDATE ON machi
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

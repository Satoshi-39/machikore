-- =============================================
-- machi/citiesテーブルにtile_idカラムを追加
-- タイルサイズ: 0.25度 (約25km四方)
-- =============================================

BEGIN;

-- =============================================
-- machiテーブルにtile_idカラム追加
-- =============================================

ALTER TABLE machi ADD COLUMN IF NOT EXISTS tile_id TEXT;

-- 既存データのtile_idを計算して更新
UPDATE machi
SET tile_id = CONCAT(
  FLOOR(longitude / 0.25)::TEXT,
  '_',
  FLOOR(latitude / 0.25)::TEXT
)
WHERE tile_id IS NULL AND latitude IS NOT NULL AND longitude IS NOT NULL;

-- tile_idにインデックスを作成（タイル単位での検索を高速化）
CREATE INDEX IF NOT EXISTS idx_machi_tile_id ON machi(tile_id);

-- =============================================
-- citiesテーブルにtile_idカラム追加
-- =============================================

ALTER TABLE cities ADD COLUMN IF NOT EXISTS tile_id TEXT;

-- 既存データのtile_idを計算して更新
UPDATE cities
SET tile_id = CONCAT(
  FLOOR(longitude / 0.25)::TEXT,
  '_',
  FLOOR(latitude / 0.25)::TEXT
)
WHERE tile_id IS NULL AND latitude IS NOT NULL AND longitude IS NOT NULL;

-- tile_idにインデックスを作成
CREATE INDEX IF NOT EXISTS idx_cities_tile_id ON cities(tile_id);

COMMIT;

-- master_spots テーブルに machi_id カラムを追加
-- 街ごとのスポットランキング表示のため

-- ===============================
-- 1. machi_id カラムを追加
-- ===============================

ALTER TABLE master_spots ADD COLUMN IF NOT EXISTS machi_id TEXT REFERENCES machi(id);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_master_spots_machi_id ON master_spots(machi_id);

-- ===============================
-- 2. 既存データに最寄りの街を割り当て
-- ===============================

UPDATE master_spots
SET machi_id = (
  SELECT m.id FROM machi m
  ORDER BY (
    (m.latitude - master_spots.latitude) * (m.latitude - master_spots.latitude) +
    (m.longitude - master_spots.longitude) * (m.longitude - master_spots.longitude)
  )
  LIMIT 1
)
WHERE machi_id IS NULL;

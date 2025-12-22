-- =============================================
-- machiテーブルにOSM関連カラムを追加
-- =============================================

-- osm_id: OpenStreetMapのノードID（データの出典確認・更新時の照合用）
ALTER TABLE machi ADD COLUMN IF NOT EXISTS osm_id BIGINT;

-- place_type: OSMのplaceタグの値（quarter, locality等）
ALTER TABLE machi ADD COLUMN IF NOT EXISTS place_type TEXT;

-- インデックス追加（検索・フィルタリング用）
CREATE INDEX IF NOT EXISTS idx_machi_osm_id ON machi(osm_id);
CREATE INDEX IF NOT EXISTS idx_machi_place_type ON machi(place_type);

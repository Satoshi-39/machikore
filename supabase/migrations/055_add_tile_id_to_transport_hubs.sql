-- =============================================
-- transport_hubsテーブルにtile_idカラムを追加
-- タイルベースのデータ取得とキャッシュ管理用
-- =============================================

BEGIN;

-- tile_idカラムを追加
ALTER TABLE transport_hubs ADD COLUMN IF NOT EXISTS tile_id TEXT;

-- tile_idの計算と更新
-- tile_id = floor(longitude / 0.25) || '_' || floor(latitude / 0.25)
-- 例: 東京駅 (139.7671, 35.6812) -> "559_142"
UPDATE transport_hubs
SET tile_id = CONCAT(
  FLOOR(longitude / 0.25)::TEXT,
  '_',
  FLOOR(latitude / 0.25)::TEXT
)
WHERE tile_id IS NULL;

-- tile_idにインデックスを作成
CREATE INDEX IF NOT EXISTS idx_transport_hubs_tile_id ON transport_hubs(tile_id);

-- tile_idをNOT NULLに変更（既存データが更新された後）
ALTER TABLE transport_hubs ALTER COLUMN tile_id SET NOT NULL;

-- コメント追加
COMMENT ON COLUMN transport_hubs.tile_id IS 'タイルID（0.25度グリッド、例: "559_142"）';

COMMIT;

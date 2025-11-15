-- マイグレーション002: マップフラグとスポット街ID追加
-- デフォルトマップ・公式マップ機能、スポットの街紐付け機能を追加

-- ===============================
-- 1. maps テーブルに is_default, is_official 追加
-- ===============================

ALTER TABLE maps
ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT FALSE;

ALTER TABLE maps
ADD COLUMN IF NOT EXISTS is_official BOOLEAN DEFAULT FALSE;

-- ===============================
-- 2. spots テーブルに machi_id 追加
-- ===============================

ALTER TABLE spots
ADD COLUMN IF NOT EXISTS machi_id TEXT REFERENCES machi(id);

-- 既存データに対してはNULLを許容するが、今後はNOT NULLにする予定
-- （マスターデータ投入後にNOT NULL制約を追加する）

-- インデックス追加
CREATE INDEX IF NOT EXISTS idx_spots_machi_id ON spots(machi_id);

-- ===============================
-- コメント
-- ===============================

COMMENT ON COLUMN maps.is_default IS 'デフォルトマップ（全国の街コレクション）かどうか';
COMMENT ON COLUMN maps.is_official IS '公式アカウントが作成したマップかどうか';
COMMENT ON COLUMN spots.machi_id IS 'スポットが属する街（駅）のID';

-- マスタースポットのいいね機能を追加

-- likesテーブルにmaster_spot_idカラムを追加
ALTER TABLE likes ADD COLUMN IF NOT EXISTS master_spot_id UUID REFERENCES master_spots(id) ON DELETE CASCADE;

-- 既存のCHECK制約を削除して、master_spot_idを含む新しい制約を作成
ALTER TABLE likes DROP CONSTRAINT IF EXISTS likes_check;
ALTER TABLE likes ADD CONSTRAINT likes_check CHECK (
  (map_id IS NOT NULL AND spot_id IS NULL AND master_spot_id IS NULL) OR
  (map_id IS NULL AND spot_id IS NOT NULL AND master_spot_id IS NULL) OR
  (map_id IS NULL AND spot_id IS NULL AND master_spot_id IS NOT NULL)
);

-- 外部キー制約のインデックス
CREATE INDEX IF NOT EXISTS idx_likes_master_spot_id ON likes(master_spot_id);

-- master_spotsにlikes_countカラムを追加
ALTER TABLE master_spots ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- マスタースポットのいいね数インクリメント関数
CREATE OR REPLACE FUNCTION increment_master_spot_likes_count(p_master_spot_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE master_spots
  SET likes_count = COALESCE(likes_count, 0) + 1
  WHERE id = p_master_spot_id;
END;
$$ LANGUAGE plpgsql;

-- マスタースポットのいいね数デクリメント関数
CREATE OR REPLACE FUNCTION decrement_master_spot_likes_count(p_master_spot_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE master_spots
  SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0)
  WHERE id = p_master_spot_id;
END;
$$ LANGUAGE plpgsql;

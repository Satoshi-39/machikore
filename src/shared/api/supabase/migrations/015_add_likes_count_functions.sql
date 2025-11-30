-- =============================================
-- likes_count のインクリメント/デクリメント関数
-- =============================================

-- スポットのいいね数をインクリメント
CREATE OR REPLACE FUNCTION increment_spot_likes_count(spot_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_spots
  SET likes_count = likes_count + 1
  WHERE id = spot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- スポットのいいね数をデクリメント
CREATE OR REPLACE FUNCTION decrement_spot_likes_count(spot_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_spots
  SET likes_count = GREATEST(0, likes_count - 1)
  WHERE id = spot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- マップのいいね数をインクリメント
CREATE OR REPLACE FUNCTION increment_map_likes_count(map_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE maps
  SET likes_count = likes_count + 1
  WHERE id = map_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- マップのいいね数をデクリメント
CREATE OR REPLACE FUNCTION decrement_map_likes_count(map_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE maps
  SET likes_count = GREATEST(0, likes_count - 1)
  WHERE id = map_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- likes テーブルのRLSポリシー
-- =============================================

-- RLSを有効化（まだの場合）
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- 誰でも閲覧可能
DROP POLICY IF EXISTS "likes_select_policy" ON likes;
CREATE POLICY "likes_select_policy" ON likes
  FOR SELECT USING (true);

-- 自分のいいねのみ追加可能
DROP POLICY IF EXISTS "likes_insert_policy" ON likes;
CREATE POLICY "likes_insert_policy" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 自分のいいねのみ削除可能
DROP POLICY IF EXISTS "likes_delete_policy" ON likes;
CREATE POLICY "likes_delete_policy" ON likes
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- likes テーブルにユニーク制約を追加（重複いいね防止）
-- =============================================

-- スポットいいねのユニーク制約
DROP INDEX IF EXISTS likes_user_spot_unique;
CREATE UNIQUE INDEX likes_user_spot_unique
  ON likes (user_id, spot_id)
  WHERE spot_id IS NOT NULL;

-- マップいいねのユニーク制約
DROP INDEX IF EXISTS likes_user_map_unique;
CREATE UNIQUE INDEX likes_user_map_unique
  ON likes (user_id, map_id)
  WHERE map_id IS NOT NULL;

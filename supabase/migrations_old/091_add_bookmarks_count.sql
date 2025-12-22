-- =============================================
-- bookmarks_count カラムの追加
-- =============================================

-- mapsテーブルにbookmarks_countカラムを追加
ALTER TABLE maps ADD COLUMN IF NOT EXISTS bookmarks_count INTEGER DEFAULT 0;

-- user_spotsテーブルにbookmarks_countカラムを追加
ALTER TABLE user_spots ADD COLUMN IF NOT EXISTS bookmarks_count INTEGER DEFAULT 0;

-- =============================================
-- 既存データのbookmarks_countを集計して更新
-- =============================================

-- マップのブックマーク数を更新
UPDATE maps m
SET bookmarks_count = (
  SELECT COUNT(*)
  FROM bookmarks b
  WHERE b.map_id = m.id
);

-- スポットのブックマーク数を更新
UPDATE user_spots us
SET bookmarks_count = (
  SELECT COUNT(*)
  FROM bookmarks b
  WHERE b.spot_id = us.id
);

-- =============================================
-- bookmarks_count のインクリメント/デクリメント関数
-- =============================================

-- マップのブックマーク数をインクリメント
CREATE OR REPLACE FUNCTION increment_map_bookmarks_count(p_map_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE maps
  SET bookmarks_count = bookmarks_count + 1
  WHERE id = p_map_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- マップのブックマーク数をデクリメント
CREATE OR REPLACE FUNCTION decrement_map_bookmarks_count(p_map_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE maps
  SET bookmarks_count = GREATEST(0, bookmarks_count - 1)
  WHERE id = p_map_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- スポットのブックマーク数をインクリメント
CREATE OR REPLACE FUNCTION increment_spot_bookmarks_count(p_spot_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_spots
  SET bookmarks_count = bookmarks_count + 1
  WHERE id = p_spot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- スポットのブックマーク数をデクリメント
CREATE OR REPLACE FUNCTION decrement_spot_bookmarks_count(p_spot_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_spots
  SET bookmarks_count = GREATEST(0, bookmarks_count - 1)
  WHERE id = p_spot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- インデックス追加（ブックマーク数でのソート用）
-- =============================================

CREATE INDEX IF NOT EXISTS idx_maps_bookmarks_count ON maps(bookmarks_count DESC);
CREATE INDEX IF NOT EXISTS idx_user_spots_bookmarks_count ON user_spots(bookmarks_count DESC);

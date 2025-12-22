-- コメント数のインクリメント/デクリメント関数

-- スポットのコメント数をインクリメント
CREATE OR REPLACE FUNCTION increment_spot_comments_count(spot_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_spots
  SET comments_count = COALESCE(comments_count, 0) + 1
  WHERE id = spot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- スポットのコメント数をデクリメント
CREATE OR REPLACE FUNCTION decrement_spot_comments_count(spot_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_spots
  SET comments_count = GREATEST(COALESCE(comments_count, 0) - 1, 0)
  WHERE id = spot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- マップのコメント数をインクリメント
CREATE OR REPLACE FUNCTION increment_map_comments_count(map_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE maps
  SET comments_count = COALESCE(comments_count, 0) + 1
  WHERE id = map_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- マップのコメント数をデクリメント
CREATE OR REPLACE FUNCTION decrement_map_comments_count(map_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE maps
  SET comments_count = GREATEST(COALESCE(comments_count, 0) - 1, 0)
  WHERE id = map_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

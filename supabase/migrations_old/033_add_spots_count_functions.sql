-- =============================================
-- spots_count のインクリメント/デクリメント関数
-- マップにスポットが追加/削除された時に呼び出す
-- SECURITY DEFINER でRLSをバイパスし、他ユーザーのマップでも更新可能
-- =============================================

-- マップのスポット数をインクリメント
CREATE OR REPLACE FUNCTION increment_map_spots_count(map_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE maps
  SET spots_count = spots_count + 1
  WHERE id = map_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- マップのスポット数をデクリメント
CREATE OR REPLACE FUNCTION decrement_map_spots_count(map_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE maps
  SET spots_count = GREATEST(0, spots_count - 1)
  WHERE id = map_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

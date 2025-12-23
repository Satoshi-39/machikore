-- ============================================================
-- RPC関数のリネーム: map_spots → user_spots
-- ============================================================
-- increment_map_spots_count → increment_user_spots_count
-- decrement_map_spots_count → decrement_user_spots_count
--
-- 理由: テーブル名 user_spots との整合性を取るため

-- 新しい関数を作成
CREATE OR REPLACE FUNCTION public.increment_user_spots_count(map_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE maps
  SET spots_count = spots_count + 1
  WHERE id = map_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_user_spots_count(map_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE maps
  SET spots_count = GREATEST(0, spots_count - 1)
  WHERE id = map_id;
END;
$$;

-- 旧関数を削除
DROP FUNCTION IF EXISTS public.increment_map_spots_count(uuid);
DROP FUNCTION IF EXISTS public.decrement_map_spots_count(uuid);

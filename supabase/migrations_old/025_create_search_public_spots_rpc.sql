-- 公開スポット検索のRPC関数
-- 検索対象:
--   1. user_spots.description
--   2. master_spots.name (Google検索経由のスポット)
--   3. user_spots.name (現在地/ピン刺し登録のスポット、JSONB形式)

CREATE OR REPLACE FUNCTION public.search_public_spots(
  search_query TEXT,
  result_limit INTEGER DEFAULT 30
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  map_id UUID,
  master_spot_id UUID,
  machi_id TEXT,
  name JSONB,
  description TEXT,
  spot_color TEXT,
  label_id UUID,
  images_count INTEGER,
  likes_count INTEGER,
  comments_count INTEGER,
  order_index INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  google_formatted_address JSONB,
  google_short_address JSONB,
  -- master_spot fields
  master_spot_name JSONB,
  master_spot_latitude DOUBLE PRECISION,
  master_spot_longitude DOUBLE PRECISION,
  master_spot_google_place_id TEXT,
  master_spot_google_formatted_address JSONB,
  master_spot_google_short_address JSONB,
  master_spot_google_types TEXT[],
  -- map_label fields
  label_name TEXT,
  label_color TEXT,
  -- user fields
  user_username TEXT,
  user_display_name TEXT,
  user_avatar_url TEXT,
  -- map fields
  map_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (us.id)
    us.id,
    us.user_id,
    us.map_id,
    us.master_spot_id,
    us.machi_id,
    us.name,
    us.description,
    us.spot_color,
    us.label_id,
    us.images_count,
    us.likes_count,
    us.comments_count,
    us.order_index,
    us.created_at,
    us.updated_at,
    us.latitude,
    us.longitude,
    us.google_formatted_address,
    us.google_short_address,
    -- master_spot
    ms.name AS master_spot_name,
    ms.latitude AS master_spot_latitude,
    ms.longitude AS master_spot_longitude,
    ms.google_place_id AS master_spot_google_place_id,
    ms.google_formatted_address AS master_spot_google_formatted_address,
    ms.google_short_address AS master_spot_google_short_address,
    ms.google_types AS master_spot_google_types,
    -- map_label
    ml.name AS label_name,
    ml.color AS label_color,
    -- user
    u.username AS user_username,
    u.display_name AS user_display_name,
    u.avatar_url AS user_avatar_url,
    -- map
    m.name AS map_name
  FROM user_spots us
  INNER JOIN maps m ON m.id = us.map_id AND m.is_public = true
  LEFT JOIN master_spots ms ON ms.id = us.master_spot_id
  LEFT JOIN map_labels ml ON ml.id = us.label_id
  LEFT JOIN users u ON u.id = us.user_id
  WHERE
    -- 1. description検索
    us.description ILIKE '%' || search_query || '%'
    -- 2. master_spots.name検索 (Google検索経由のスポット)
    OR (ms.name IS NOT NULL AND ms.name::text ILIKE '%' || search_query || '%')
    -- 3. user_spots.name検索 (現在地/ピン刺し登録のスポット)
    OR (us.master_spot_id IS NULL AND us.name IS NOT NULL AND us.name::text ILIKE '%' || search_query || '%')
  ORDER BY us.id, us.created_at DESC
  LIMIT result_limit;
END;
$$;

COMMENT ON FUNCTION public.search_public_spots IS '公開スポットをキーワードで検索。description、master_spots.name、user_spots.name（現在地/ピン刺し登録）を検索対象とする';

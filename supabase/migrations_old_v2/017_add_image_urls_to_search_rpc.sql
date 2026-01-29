-- search_public_spots RPCに画像URLを追加
--
-- 変更内容:
-- - image_urlsを戻り値に追加（spot_imagesをJOINして取得）
-- - tags, article_contentも復元（016で削除されていた）
--
-- これにより、検索結果表示時にN+1クエリを回避できる

-- ============================================
-- 既存関数の削除（戻り値の型が変わる場合は必須）
-- ============================================
DROP FUNCTION IF EXISTS public.search_public_spots(TEXT, INTEGER);

-- ============================================
-- スポット検索RPC（image_urls追加版）
-- ============================================
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
  is_public BOOLEAN,
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
  map_name TEXT,
  -- tags (JSON array)
  tags JSONB,
  -- article content (JSON)
  article_content JSONB,
  -- image URLs (TEXT array) - 新規追加
  image_urls TEXT[]
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
    us.is_public,
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
    m.name AS map_name,
    -- tags as JSON array
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug)
        )
        FROM spot_tags st
        INNER JOIN tags t ON t.id = st.tag_id
        WHERE st.user_spot_id = us.id
      ),
      '[]'::jsonb
    ) AS tags,
    -- article content
    us.article_content,
    -- image URLs (sorted by order_index)
    COALESCE(
      (
        SELECT ARRAY_AGG(si.cloud_path ORDER BY si.order_index)
        FROM spot_images si
        WHERE si.user_spot_id = us.id
          AND si.cloud_path IS NOT NULL
      ),
      ARRAY[]::TEXT[]
    ) AS image_urls
  FROM user_spots us
  INNER JOIN maps m ON m.id = us.map_id AND m.is_public = true
  LEFT JOIN master_spots ms ON ms.id = us.master_spot_id
  LEFT JOIN map_labels ml ON ml.id = us.label_id
  LEFT JOIN users u ON u.id = us.user_id
  WHERE
    -- 公開スポットのみ検索対象
    us.is_public = true
    AND (
      -- 1. description検索
      us.description ILIKE '%' || search_query || '%'
      -- 2. master_spots.name検索 (Google検索経由のスポット)
      OR (ms.name IS NOT NULL AND ms.name::text ILIKE '%' || search_query || '%')
      -- 3. user_spots.name検索 (現在地/ピン刺し登録のスポット)
      OR (us.master_spot_id IS NULL AND us.name IS NOT NULL AND us.name::text ILIKE '%' || search_query || '%')
    )
  ORDER BY us.id, us.created_at DESC
  LIMIT result_limit;
END;
$$;

COMMENT ON FUNCTION public.search_public_spots IS '公開スポットをキーワードで検索。マップが公開かつスポットが公開のもののみ対象。description、master_spots.name、user_spots.name（現在地/ピン刺し登録）を検索対象とし、タグ情報・article_content・画像URLも含めて返す';

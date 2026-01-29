-- search_public_spots RPCにフィルター機能を追加
--
-- 変更内容:
-- - prefecture_id: 都道府県でフィルター
-- - city_id: 市区町村でフィルター
-- - tag_ids: タグでフィルター（複数選択対応）
-- - sort_by: 並び替え（created_at / likes_count）
-- - public_spots_countを各マップから取得

-- ============================================
-- 既存関数の削除（戻り値の型が変わる場合は必須）
-- ============================================
DROP FUNCTION IF EXISTS public.search_public_spots(TEXT, INTEGER);

-- ============================================
-- スポット検索RPC（フィルター機能追加版）
-- ============================================
CREATE OR REPLACE FUNCTION public.search_public_spots(
  search_query TEXT DEFAULT NULL,
  result_limit INTEGER DEFAULT 30,
  prefecture_id_filter TEXT DEFAULT NULL,
  city_id_filter TEXT DEFAULT NULL,
  tag_ids_filter UUID[] DEFAULT NULL,
  sort_by TEXT DEFAULT 'created_at'
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
  prefecture_id TEXT,
  city_id TEXT,
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
  map_public_spots_count INTEGER,
  -- tags (JSON array)
  tags JSONB,
  -- article content (JSON)
  article_content JSONB,
  -- image URLs (TEXT array)
  image_urls TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH filtered_spots AS (
    SELECT
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
      us.prefecture_id,
      us.city_id,
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
      m.public_spots_count AS map_public_spots_count,
      -- article content
      us.article_content
    FROM user_spots us
    INNER JOIN maps m ON m.id = us.map_id AND m.is_public = true
    LEFT JOIN master_spots ms ON ms.id = us.master_spot_id
    LEFT JOIN map_labels ml ON ml.id = us.label_id
    LEFT JOIN users u ON u.id = us.user_id
    WHERE
      -- 公開スポットのみ検索対象
      us.is_public = true
      -- キーワード検索（NULLまたは空文字の場合はスキップ）
      AND (
        search_query IS NULL
        OR search_query = ''
        OR (
          us.description ILIKE '%' || search_query || '%'
          OR (ms.name IS NOT NULL AND ms.name::text ILIKE '%' || search_query || '%')
          OR (us.master_spot_id IS NULL AND us.name IS NOT NULL AND us.name::text ILIKE '%' || search_query || '%')
        )
      )
      -- 都道府県フィルター
      AND (prefecture_id_filter IS NULL OR us.prefecture_id = prefecture_id_filter)
      -- 市区町村フィルター
      AND (city_id_filter IS NULL OR us.city_id = city_id_filter)
      -- タグフィルター（指定したタグのいずれかを持つスポット）
      AND (
        tag_ids_filter IS NULL
        OR EXISTS (
          SELECT 1 FROM spot_tags st
          WHERE st.user_spot_id = us.id
            AND st.tag_id = ANY(tag_ids_filter)
        )
      )
    ORDER BY
      CASE WHEN sort_by = 'likes_count' THEN us.likes_count ELSE 0 END DESC,
      us.created_at DESC
    LIMIT result_limit
  )
  SELECT
    fs.id,
    fs.user_id,
    fs.map_id,
    fs.master_spot_id,
    fs.machi_id,
    fs.name,
    fs.description,
    fs.spot_color,
    fs.label_id,
    fs.images_count,
    fs.likes_count,
    fs.comments_count,
    fs.order_index,
    fs.created_at,
    fs.updated_at,
    fs.latitude,
    fs.longitude,
    fs.google_formatted_address,
    fs.google_short_address,
    fs.is_public,
    fs.prefecture_id,
    fs.city_id,
    fs.master_spot_name,
    fs.master_spot_latitude,
    fs.master_spot_longitude,
    fs.master_spot_google_place_id,
    fs.master_spot_google_formatted_address,
    fs.master_spot_google_short_address,
    fs.master_spot_google_types,
    fs.label_name,
    fs.label_color,
    fs.user_username,
    fs.user_display_name,
    fs.user_avatar_url,
    fs.map_name,
    fs.map_public_spots_count,
    -- tags as JSON array
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug)
        )
        FROM spot_tags st
        INNER JOIN tags t ON t.id = st.tag_id
        WHERE st.user_spot_id = fs.id
      ),
      '[]'::jsonb
    ) AS tags,
    fs.article_content,
    -- image URLs (sorted by order_index)
    COALESCE(
      (
        SELECT ARRAY_AGG(si.cloud_path ORDER BY si.order_index)
        FROM spot_images si
        WHERE si.user_spot_id = fs.id
          AND si.cloud_path IS NOT NULL
      ),
      ARRAY[]::TEXT[]
    ) AS image_urls
  FROM filtered_spots fs;
END;
$$;

COMMENT ON FUNCTION public.search_public_spots IS '公開スポットをキーワード・フィルターで検索。都道府県、市区町村、タグでフィルタリング可能。並び替えは created_at（新着順）または likes_count（人気順）';

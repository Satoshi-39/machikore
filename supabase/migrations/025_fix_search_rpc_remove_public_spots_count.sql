-- search_public_spots と search_public_maps から m.public_spots_count の参照を削除
--
-- 変更内容:
-- - public_spots_count をサブクエリで計算するように変更
-- - mapsテーブルには public_spots_count カラムが存在しないため

-- ============================================
-- search_public_spots 更新
-- ============================================
DROP FUNCTION IF EXISTS public.search_public_spots(TEXT, INTEGER, TEXT, TEXT, UUID[], TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.search_public_spots(
  search_query TEXT DEFAULT NULL,
  result_limit INTEGER DEFAULT 30,
  prefecture_id_filter TEXT DEFAULT NULL,
  city_id_filter TEXT DEFAULT NULL,
  tag_ids_filter UUID[] DEFAULT NULL,
  sort_by TEXT DEFAULT 'created_at',
  date_range TEXT DEFAULT 'all'
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
  master_spot_name JSONB,
  master_spot_latitude DOUBLE PRECISION,
  master_spot_longitude DOUBLE PRECISION,
  master_spot_google_place_id TEXT,
  master_spot_google_formatted_address JSONB,
  master_spot_google_short_address JSONB,
  master_spot_google_types TEXT[],
  label_name TEXT,
  label_color TEXT,
  user_username TEXT,
  user_display_name TEXT,
  user_avatar_url TEXT,
  map_name TEXT,
  map_public_spots_count INTEGER,
  tags JSONB,
  article_content JSONB,
  image_urls TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  date_filter TIMESTAMPTZ;
BEGIN
  -- 期間フィルターの計算
  date_filter := CASE date_range
    WHEN 'day' THEN now() - INTERVAL '1 day'
    WHEN 'week' THEN now() - INTERVAL '7 days'
    WHEN 'month' THEN now() - INTERVAL '30 days'
    ELSE NULL
  END;

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
      ms.name AS master_spot_name,
      ms.latitude AS master_spot_latitude,
      ms.longitude AS master_spot_longitude,
      ms.google_place_id AS master_spot_google_place_id,
      ms.google_formatted_address AS master_spot_google_formatted_address,
      ms.google_short_address AS master_spot_google_short_address,
      ms.google_types AS master_spot_google_types,
      ml.name AS label_name,
      ml.color AS label_color,
      u.username AS user_username,
      u.display_name AS user_display_name,
      u.avatar_url AS user_avatar_url,
      m.name AS map_name,
      -- public_spots_count をサブクエリで計算
      (SELECT COUNT(*)::INTEGER FROM user_spots sub_us WHERE sub_us.map_id = m.id AND sub_us.is_public = true) AS map_public_spots_count,
      us.article_content
    FROM user_spots us
    INNER JOIN maps m ON m.id = us.map_id AND m.is_public = true
    LEFT JOIN master_spots ms ON ms.id = us.master_spot_id
    LEFT JOIN map_labels ml ON ml.id = us.label_id
    LEFT JOIN users u ON u.id = us.user_id
    WHERE
      us.is_public = true
      -- キーワード検索
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
      -- タグフィルター
      AND (
        tag_ids_filter IS NULL
        OR EXISTS (
          SELECT 1 FROM spot_tags st
          WHERE st.user_spot_id = us.id
            AND st.tag_id = ANY(tag_ids_filter)
        )
      )
      -- 期間フィルター
      AND (date_filter IS NULL OR us.created_at >= date_filter)
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
    COALESCE(
      (
        SELECT jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
        FROM spot_tags st
        INNER JOIN tags t ON t.id = st.tag_id
        WHERE st.user_spot_id = fs.id
      ),
      '[]'::jsonb
    ) AS tags,
    fs.article_content,
    COALESCE(
      (
        SELECT ARRAY_AGG(img.cloud_path ORDER BY img.order_index)
        FROM images img
        WHERE img.user_spot_id = fs.id AND img.cloud_path IS NOT NULL
      ),
      ARRAY[]::TEXT[]
    ) AS image_urls
  FROM filtered_spots fs;
END;
$$;

COMMENT ON FUNCTION public.search_public_spots IS '公開スポット検索。フィルター: 都道府県、市区町村、タグ、期間。並び替え: created_at / likes_count';

-- ============================================
-- search_public_maps 更新
-- ============================================
DROP FUNCTION IF EXISTS search_public_maps(text, integer, uuid[], text, text, text);

CREATE OR REPLACE FUNCTION search_public_maps(
  search_query TEXT DEFAULT NULL,
  result_limit INT DEFAULT 30,
  tag_ids_filter UUID[] DEFAULT NULL,
  sort_by TEXT DEFAULT 'created_at',
  date_range TEXT DEFAULT 'all',
  region_text TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  description TEXT,
  thumbnail_url TEXT,
  is_public BOOLEAN,
  is_official BOOLEAN,
  is_article_public BOOLEAN,
  show_label_chips BOOLEAN,
  category_id TEXT,
  language VARCHAR(10),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  spots_count INT,
  public_spots_count INT,
  likes_count INT,
  comments_count INT,
  bookmarks_count INT,
  article_intro JSONB,
  article_outro JSONB,
  user_username TEXT,
  user_display_name TEXT,
  user_avatar_url TEXT,
  tags JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  date_filter TIMESTAMPTZ;
BEGIN
  -- 期間フィルターの計算
  date_filter := CASE date_range
    WHEN 'day' THEN now() - INTERVAL '1 day'
    WHEN 'week' THEN now() - INTERVAL '7 days'
    WHEN 'month' THEN now() - INTERVAL '30 days'
    ELSE NULL
  END;

  RETURN QUERY
  SELECT
    m.id,
    m.user_id,
    m.name,
    m.description,
    m.thumbnail_url,
    m.is_public,
    m.is_official,
    m.is_article_public,
    m.show_label_chips,
    m.category_id,
    m.language,
    m.created_at,
    m.updated_at,
    m.spots_count,
    -- public_spots_count をサブクエリで計算
    (SELECT COUNT(*)::INT FROM user_spots us WHERE us.map_id = m.id AND us.is_public = true) AS public_spots_count,
    m.likes_count,
    m.comments_count,
    m.bookmarks_count,
    m.article_intro,
    m.article_outro,
    u.username AS user_username,
    u.display_name AS user_display_name,
    u.avatar_url AS user_avatar_url,
    COALESCE(
      (
        SELECT jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
        FROM map_tags mt
        JOIN tags t ON t.id = mt.tag_id
        WHERE mt.map_id = m.id
      ),
      '[]'::jsonb
    ) AS tags
  FROM maps m
  JOIN users u ON u.id = m.user_id
  WHERE m.is_public = true
    -- キーワード検索
    AND (
      search_query IS NULL
      OR search_query = ''
      OR (
        m.name ILIKE '%' || search_query || '%'
        OR m.description ILIKE '%' || search_query || '%'
        OR EXISTS (
          SELECT 1 FROM map_tags mt
          JOIN tags t ON t.id = mt.tag_id
          WHERE mt.map_id = m.id AND t.name ILIKE '%' || search_query || '%'
        )
      )
    )
    -- タグフィルター
    AND (
      tag_ids_filter IS NULL
      OR EXISTS (
        SELECT 1 FROM map_tags mt
        WHERE mt.map_id = m.id AND mt.tag_id = ANY(tag_ids_filter)
      )
    )
    -- 期間フィルター
    AND (date_filter IS NULL OR m.created_at >= date_filter)
    -- 地域テキスト検索（都道府県名などがマップ名・説明・タグに含まれているか）
    AND (
      region_text IS NULL
      OR region_text = ''
      OR m.name ILIKE '%' || region_text || '%'
      OR m.description ILIKE '%' || region_text || '%'
      OR EXISTS (
        SELECT 1 FROM map_tags mt
        JOIN tags t ON t.id = mt.tag_id
        WHERE mt.map_id = m.id AND t.name ILIKE '%' || region_text || '%'
      )
    )
  ORDER BY
    CASE WHEN sort_by = 'likes_count' THEN m.likes_count ELSE 0 END DESC,
    m.created_at DESC
  LIMIT result_limit;
END;
$$;

COMMENT ON FUNCTION public.search_public_maps IS '公開マップ検索。フィルター: タグ、期間、地域テキスト。並び替え: created_at / likes_count';

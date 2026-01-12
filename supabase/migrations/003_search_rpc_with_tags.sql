-- マップ検索RPC作成 & スポット検索RPCにタグ追加
--
-- 変更内容:
-- 1. search_public_maps: 新規作成（マップのキーワード検索）
-- 2. search_public_spots: タグ情報を追加（戻り値の型が変わるためDROP→CREATE）

-- ============================================
-- 0. 既存関数の削除（戻り値の型が変わる場合は必須）
-- ============================================
DROP FUNCTION IF EXISTS public.search_public_spots(text, integer);

-- ============================================
-- 1. マップ検索RPC
-- ============================================
CREATE OR REPLACE FUNCTION public.search_public_maps(
  search_query TEXT,
  result_limit INTEGER DEFAULT 30
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  description TEXT,
  category_id UUID,
  is_public BOOLEAN,
  is_official BOOLEAN,
  thumbnail_url TEXT,
  spots_count INTEGER,
  likes_count INTEGER,
  bookmarks_count INTEGER,
  comments_count INTEGER,
  is_article_public BOOLEAN,
  article_intro TEXT,
  article_outro TEXT,
  show_label_chips BOOLEAN,
  language TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  -- user fields
  user_username TEXT,
  user_display_name TEXT,
  user_avatar_url TEXT,
  -- tags (JSON array)
  tags JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.user_id,
    m.name,
    m.description,
    m.category_id,
    m.is_public,
    m.is_official,
    m.thumbnail_url,
    m.spots_count,
    m.likes_count,
    m.bookmarks_count,
    m.comments_count,
    m.is_article_public,
    m.article_intro,
    m.article_outro,
    m.show_label_chips,
    m.language,
    m.created_at,
    m.updated_at,
    -- user
    u.username AS user_username,
    u.display_name AS user_display_name,
    u.avatar_url AS user_avatar_url,
    -- tags as JSON array
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug)
        )
        FROM map_tags mt
        INNER JOIN tags t ON t.id = mt.tag_id
        WHERE mt.map_id = m.id
      ),
      '[]'::jsonb
    ) AS tags
  FROM maps m
  LEFT JOIN users u ON u.id = m.user_id
  WHERE
    m.is_public = true
    AND (
      m.name ILIKE '%' || search_query || '%'
      OR m.description ILIKE '%' || search_query || '%'
    )
  ORDER BY m.created_at DESC
  LIMIT result_limit;
END;
$$;

COMMENT ON FUNCTION public.search_public_maps IS '公開マップをキーワードで検索。name、descriptionを検索対象とし、タグ情報も含めて返す';

-- ============================================
-- 2. スポット検索RPC（タグ追加版）
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
  -- tags (JSON array) - 新規追加
  tags JSONB
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
    ) AS tags
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

COMMENT ON FUNCTION public.search_public_spots IS '公開スポットをキーワードで検索。description、master_spots.name、user_spots.name（現在地/ピン刺し登録）を検索対象とし、タグ情報も含めて返す';

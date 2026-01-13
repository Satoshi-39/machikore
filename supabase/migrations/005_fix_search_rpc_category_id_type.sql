-- search_public_maps RPC型修正
--
-- 修正内容:
-- 1. category_id: UUID → TEXT（mapsテーブルの実際の型に合わせる）
-- 2. article_intro: TEXT → JSONB（mapsテーブルの実際の型に合わせる）
-- 3. article_outro: TEXT → JSONB（mapsテーブルの実際の型に合わせる）

-- 既存関数を削除（戻り値の型が変わるため必須）
DROP FUNCTION IF EXISTS public.search_public_maps(text, integer);

-- 修正版
CREATE OR REPLACE FUNCTION public.search_public_maps(
  search_query TEXT,
  result_limit INTEGER DEFAULT 30
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  description TEXT,
  category_id TEXT,  -- UUID → TEXT に修正
  is_public BOOLEAN,
  is_official BOOLEAN,
  thumbnail_url TEXT,
  spots_count INTEGER,
  likes_count INTEGER,
  bookmarks_count INTEGER,
  comments_count INTEGER,
  is_article_public BOOLEAN,
  article_intro JSONB,  -- TEXT → JSONB に修正
  article_outro JSONB,  -- TEXT → JSONB に修正
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

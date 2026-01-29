-- search_public_maps RPC関数のlanguage型をvarchar(10)に修正
-- エラー: "structure of query does not match function result type"
-- 原因: maps.languageがvarchar型だが、RPC関数の戻り値がtextとして定義されていた

-- 既存の関数を削除
DROP FUNCTION IF EXISTS search_public_maps(text, integer);

-- 関数を再作成
CREATE OR REPLACE FUNCTION search_public_maps(
  search_query TEXT,
  result_limit INT DEFAULT 30
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
  language VARCHAR(10),  -- text から varchar(10) に変更
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  spots_count INT,
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
BEGIN
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
    AND (
      m.name ILIKE '%' || search_query || '%'
      OR m.description ILIKE '%' || search_query || '%'
      OR EXISTS (
        SELECT 1 FROM map_tags mt
        JOIN tags t ON t.id = mt.tag_id
        WHERE mt.map_id = m.id AND t.name ILIKE '%' || search_query || '%'
      )
    )
  ORDER BY m.created_at DESC
  LIMIT result_limit;
END;
$$;

-- ============================================================
-- search_public_maps から is_article_public を削除
-- ============================================================
-- maps.is_article_public カラムが削除されたため、
-- search_public_maps RPC関数からも参照を削除する

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

COMMENT ON FUNCTION public.search_public_maps IS '公開マップ検索。フィルター: タグ、期間、地域テキスト。並び替え: created_at / likes_count（is_article_public削除済み）';

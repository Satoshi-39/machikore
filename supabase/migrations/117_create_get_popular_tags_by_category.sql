-- =============================================
-- Migration: カテゴリ別人気タグ取得RPC関数
-- =============================================
-- カテゴリに属するマップで多く使われているタグを集計して返す
-- =============================================

CREATE OR REPLACE FUNCTION get_popular_tags_by_category(
  p_category_id UUID,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  name_translations JSONB,
  is_official BOOLEAN,
  usage_count BIGINT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.name,
    t.name_translations,
    t.is_official,
    COUNT(mt.id) AS usage_count,
    t.created_at,
    t.updated_at
  FROM tags t
  INNER JOIN map_tags mt ON mt.tag_id = t.id
  INNER JOIN maps m ON m.id = mt.map_id
  WHERE m.category_id = p_category_id
    AND m.is_public = true
  GROUP BY t.id, t.name, t.name_translations, t.is_official, t.created_at, t.updated_at
  ORDER BY usage_count DESC, t.name ASC
  LIMIT p_limit;
END;
$$;

-- RPC関数の実行権限を付与
GRANT EXECUTE ON FUNCTION get_popular_tags_by_category(UUID, INTEGER) TO anon, authenticated;

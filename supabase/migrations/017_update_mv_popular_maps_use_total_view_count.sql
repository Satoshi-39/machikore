-- mv_popular_maps を maps.total_view_count を参照するように更新
-- view_history は古いレコードが削除されるため、正確な閲覧数にならない

-- 既存のマテリアライズドビューを削除（インデックスも自動削除）
DROP MATERIALIZED VIEW IF EXISTS mv_popular_maps;

-- maps.total_view_count を直接参照する新しいマテリアライズドビュー
CREATE MATERIALIZED VIEW mv_popular_maps AS
WITH map_scores AS (
  SELECT
    m.id,
    m.user_id,
    m.name,
    m.description,
    m.category_id,
    m.is_public,
    m.is_official,
    m.thumbnail_url,
    (
      SELECT COUNT(*)::integer
      FROM user_spots us
      WHERE us.map_id = m.id AND us.is_public = true
    ) AS spots_count,
    m.likes_count,
    m.bookmarks_count,
    m.comments_count,
    m.article_intro,
    m.article_outro,
    m.show_label_chips,
    m.language,
    m.created_at,
    m.updated_at,
    -- ユーザー情報
    u.username AS user_username,
    u.display_name AS user_display_name,
    u.avatar_url AS user_avatar_url,
    -- タグ情報（JSONB集約）
    COALESCE(
      (
        SELECT jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
        FROM map_tags mt
        JOIN tags t ON t.id = mt.tag_id
        WHERE mt.map_id = m.id
      ),
      '[]'::jsonb
    ) AS tags,
    -- スコア計算（view_history の SUM ではなく maps.total_view_count を使用）
    (
      m.likes_count * 0.4
      + m.total_view_count * 0.3
      + CASE
          WHEN m.created_at >= NOW() - INTERVAL '30 days' THEN 1.0
          WHEN m.created_at >= NOW() - INTERVAL '90 days' THEN 0.5
          ELSE 0.2
        END * 30
    ) AS popularity_score
  FROM maps m
  JOIN users u ON u.id = m.user_id
  WHERE m.is_public = true
)
SELECT
  id,
  user_id,
  name,
  description,
  category_id,
  is_public,
  is_official,
  thumbnail_url,
  spots_count,
  likes_count,
  bookmarks_count,
  comments_count,
  article_intro,
  article_outro,
  show_label_chips,
  language,
  created_at,
  updated_at,
  user_username,
  user_display_name,
  user_avatar_url,
  tags,
  popularity_score
FROM map_scores
ORDER BY popularity_score DESC
LIMIT 100;

-- ユニークインデックス（CONCURRENTLY リフレッシュに必要）
CREATE UNIQUE INDEX idx_mv_popular_maps_id ON mv_popular_maps (id);

-- SELECT権限付与
GRANT SELECT ON mv_popular_maps TO anon, authenticated, service_role;

-- mv_popular_maps / mv_today_picks_maps に thumbnail_crop, user_avatar_crop カラムを追加
-- Web版で画像cropデータを適用するために必要

-- ============================================================
-- 1. mv_popular_maps を再作成
-- ============================================================
DROP MATERIALIZED VIEW IF EXISTS mv_popular_maps;

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
    m.thumbnail_crop,
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
    u.username AS user_username,
    u.display_name AS user_display_name,
    u.avatar_url AS user_avatar_url,
    u.avatar_crop AS user_avatar_crop,
    COALESCE(
      (
        SELECT jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
        FROM map_tags mt
        JOIN tags t ON t.id = mt.tag_id
        WHERE mt.map_id = m.id
      ),
      '[]'::jsonb
    ) AS tags,
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
  thumbnail_crop,
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
  user_avatar_crop,
  tags,
  popularity_score
FROM map_scores
ORDER BY popularity_score DESC
LIMIT 100;

CREATE UNIQUE INDEX idx_mv_popular_maps_id ON mv_popular_maps (id);
GRANT SELECT ON mv_popular_maps TO anon, authenticated, service_role;

-- ============================================================
-- 2. mv_today_picks_maps を再作成
-- ============================================================
DROP MATERIALIZED VIEW IF EXISTS mv_today_picks_maps;

CREATE MATERIALIZED VIEW mv_today_picks_maps AS
WITH recent_likes AS (
  SELECT
    map_id,
    COUNT(*) AS recent_likes_count
  FROM likes
  WHERE map_id IS NOT NULL
    AND created_at >= NOW() - INTERVAL '7 days'
  GROUP BY map_id
),
picked_maps AS (
  SELECT
    m.id,
    m.user_id,
    m.name,
    m.description,
    m.category_id,
    m.is_public,
    m.is_official,
    m.thumbnail_url,
    m.thumbnail_crop,
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
    u.username AS user_username,
    u.display_name AS user_display_name,
    u.avatar_url AS user_avatar_url,
    u.avatar_crop AS user_avatar_crop,
    COALESCE(
      (
        SELECT jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
        FROM map_tags mt
        JOIN tags t ON t.id = mt.tag_id
        WHERE mt.map_id = m.id
      ),
      '[]'::jsonb
    ) AS tags,
    rl.recent_likes_count AS sort_score
  FROM maps m
  JOIN users u ON u.id = m.user_id
  JOIN recent_likes rl ON rl.map_id = m.id
  WHERE m.is_public = true
),
fallback_maps AS (
  SELECT
    m.id,
    m.user_id,
    m.name,
    m.description,
    m.category_id,
    m.is_public,
    m.is_official,
    m.thumbnail_url,
    m.thumbnail_crop,
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
    u.username AS user_username,
    u.display_name AS user_display_name,
    u.avatar_url AS user_avatar_url,
    u.avatar_crop AS user_avatar_crop,
    COALESCE(
      (
        SELECT jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
        FROM map_tags mt
        JOIN tags t ON t.id = mt.tag_id
        WHERE mt.map_id = m.id
      ),
      '[]'::jsonb
    ) AS tags,
    m.likes_count AS sort_score
  FROM maps m
  JOIN users u ON u.id = m.user_id
  WHERE m.is_public = true
    AND NOT EXISTS (SELECT 1 FROM picked_maps)
)
SELECT * FROM (
  SELECT * FROM picked_maps
  UNION ALL
  SELECT * FROM fallback_maps
) combined
ORDER BY sort_score DESC
LIMIT 100;

CREATE UNIQUE INDEX idx_mv_today_picks_maps_id ON mv_today_picks_maps (id);
GRANT SELECT ON mv_today_picks_maps TO anon, authenticated, service_role;

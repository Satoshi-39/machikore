-- =============================================
-- 人気マップランキング マテリアライズドビュー + pg_cron
-- =============================================

-- Step 1: pg_cron 有効化
-- ※ Supabaseダッシュボードの Extensions で事前に有効化が必要な場合あり
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Step 2: マテリアライズドビュー mv_popular_maps
-- スコア計算: likes_count * 0.4 + views_count * 0.3 + recency_score * 30
-- recency_score: 30日以内=1.0, 90日以内=0.5, それ以上=0.2
CREATE MATERIALIZED VIEW mv_popular_maps AS
WITH view_counts AS (
  SELECT
    map_id,
    SUM(view_count) AS total_views
  FROM view_history
  GROUP BY map_id
),
map_scores AS (
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
    -- スコア計算
    (
      m.likes_count * 0.4
      + COALESCE(vc.total_views, 0) * 0.3
      + CASE
          WHEN m.created_at >= NOW() - INTERVAL '30 days' THEN 1.0
          WHEN m.created_at >= NOW() - INTERVAL '90 days' THEN 0.5
          ELSE 0.2
        END * 30
    ) AS popularity_score
  FROM maps m
  JOIN users u ON u.id = m.user_id
  LEFT JOIN view_counts vc ON vc.map_id = m.id
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

-- Step 3: マテリアライズドビュー mv_today_picks_maps
-- 過去7日間のいいね数が多い順。フォールバック: 累計likes_count順
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
-- 過去7日間にいいねがあるマップ
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
-- フォールバック: 過去7日間にいいねがない場合、累計likes_count順
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

-- Step 4: ユニークインデックス（CONCURRENTLY リフレッシュに必要）
CREATE UNIQUE INDEX idx_mv_popular_maps_id ON mv_popular_maps (id);
CREATE UNIQUE INDEX idx_mv_today_picks_maps_id ON mv_today_picks_maps (id);

-- Step 5: SELECT権限付与
GRANT SELECT ON mv_popular_maps TO anon, authenticated, service_role;
GRANT SELECT ON mv_today_picks_maps TO anon, authenticated, service_role;

-- Step 6: リフレッシュ関数
CREATE OR REPLACE FUNCTION refresh_ranking_views()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_popular_maps;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_today_picks_maps;
END;
$$;

-- Step 7: pg_cron ジョブ（毎日15:00 UTC = 日本時間24:00）
SELECT cron.schedule(
  'refresh-ranking-views',
  '0 15 * * *',
  $$SELECT refresh_ranking_views()$$
);

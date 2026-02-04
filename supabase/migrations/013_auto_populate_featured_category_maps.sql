-- ============================================================
-- 013: featured_category_maps → mv_recommend_maps マテリアライズドビュー化
-- テーブルを廃止し、カテゴリ別おすすめマップをMVで自動算出する
-- ============================================================

-- Step 1: 既存の featured_category_maps テーブルを削除
-- （RLSポリシー、インデックス、トリガー、FK等は CASCADE で自動削除）
DROP TABLE IF EXISTS featured_category_maps CASCADE;

-- Step 2: mv_recommend_maps マテリアライズドビューを作成
-- 各カテゴリからスコア上位30件を選出
-- スコア: bookmarks_count * 0.4 + likes_count * 0.3 + recency_score * 0.3
CREATE MATERIALIZED VIEW mv_recommend_maps AS
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
    -- ユーザー情報
    u.username AS user_username,
    u.display_name AS user_display_name,
    u.avatar_url AS user_avatar_url,
    u.avatar_crop AS user_avatar_crop,
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
    -- スコア算出
    (
      m.bookmarks_count * 0.4
      + m.likes_count * 0.3
      + CASE
          WHEN m.created_at >= NOW() - INTERVAL '30 days' THEN 1.0
          WHEN m.created_at >= NOW() - INTERVAL '90 days' THEN 0.5
          ELSE 0.2
        END * 0.3
    ) AS recommend_score,
    -- カテゴリ内の順位
    ROW_NUMBER() OVER (
      PARTITION BY m.category_id
      ORDER BY (
        m.bookmarks_count * 0.4
        + m.likes_count * 0.3
        + CASE
            WHEN m.created_at >= NOW() - INTERVAL '30 days' THEN 1.0
            WHEN m.created_at >= NOW() - INTERVAL '90 days' THEN 0.5
            ELSE 0.2
          END * 0.3
      ) DESC,
      m.created_at DESC
    ) AS display_order
  FROM maps m
  JOIN users u ON u.id = m.user_id
  WHERE m.is_public = true
    AND m.category_id IS NOT NULL
    -- 公開スポットが3件以上
    AND (
      SELECT COUNT(*)
      FROM user_spots us
      WHERE us.map_id = m.id AND us.is_public = true
    ) >= 3
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
  recommend_score,
  display_order
FROM map_scores
WHERE display_order <= 30
ORDER BY category_id, display_order;

-- Step 3: CONCURRENTLY リフレッシュ用のユニークインデックス
CREATE UNIQUE INDEX idx_mv_recommend_maps_id ON mv_recommend_maps (id);

-- Step 4: カテゴリ検索用インデックス
CREATE INDEX idx_mv_recommend_maps_category ON mv_recommend_maps (category_id, display_order);

-- Step 5: SELECT権限付与
GRANT SELECT ON mv_recommend_maps TO anon, authenticated, service_role;

-- Step 6: refresh_ranking_views() を更新して mv_recommend_maps を組み込む
CREATE OR REPLACE FUNCTION refresh_ranking_views()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_popular_maps;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_today_picks_maps;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_recommend_maps;
END;
$$;

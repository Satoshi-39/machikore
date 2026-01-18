-- ============================================================
-- 混合フィードにいいね・ブックマーク状態を追加
-- ============================================================
-- N+1問題を解消するため、マップとスポットのいいね・ブックマーク状態を追加
-- 最終更新: 2026-01-18

-- ===============================
-- 型定義の更新
-- ===============================

-- 既存の型を削除して再作成
DROP TYPE IF EXISTS public.mixed_feed_item CASCADE;

CREATE TYPE public.mixed_feed_item AS (
  -- 共通フィールド
  item_type TEXT,              -- 'map' or 'spot'
  item_id UUID,
  created_at TIMESTAMPTZ,

  -- マップ用フィールド
  map_id UUID,
  map_name TEXT,
  map_description TEXT,
  map_thumbnail_url TEXT,
  map_is_public BOOLEAN,
  map_is_article_public BOOLEAN,
  map_spots_count INT,
  map_likes_count INT,
  map_bookmarks_count INT,
  map_comments_count INT,
  map_category_id TEXT,
  map_language VARCHAR(10),
  map_user_id UUID,
  map_user_username TEXT,
  map_user_display_name TEXT,
  map_user_avatar_url TEXT,
  map_tags JSONB,
  -- マップのいいね・ブックマーク状態（追加）
  map_is_liked BOOLEAN,
  map_is_bookmarked BOOLEAN,

  -- スポット用フィールド
  spot_id UUID,
  spot_user_id UUID,
  spot_map_id UUID,
  spot_master_spot_id UUID,
  spot_machi_id TEXT,
  spot_description TEXT,
  spot_spot_color TEXT,
  spot_label_id UUID,
  spot_name JSONB,
  spot_images_count INT,
  spot_likes_count INT,
  spot_bookmarks_count INT,
  spot_comments_count INT,
  spot_order_index INT,
  spot_latitude DOUBLE PRECISION,
  spot_longitude DOUBLE PRECISION,
  spot_google_formatted_address JSONB,
  spot_google_short_address JSONB,
  spot_is_public BOOLEAN,
  spot_article_content JSONB,
  -- スポットのマスタースポット情報
  spot_master_spot_name JSONB,
  spot_master_spot_latitude DOUBLE PRECISION,
  spot_master_spot_longitude DOUBLE PRECISION,
  spot_master_spot_google_place_id TEXT,
  spot_master_spot_google_formatted_address JSONB,
  spot_master_spot_google_short_address JSONB,
  spot_master_spot_google_types TEXT[],
  -- スポットのユーザー情報
  spot_user_username TEXT,
  spot_user_display_name TEXT,
  spot_user_avatar_url TEXT,
  -- スポットのマップ情報
  spot_map_name TEXT,
  spot_map_is_public BOOLEAN,
  -- スポットの画像URL
  spot_image_urls JSONB,
  -- スポットのタグ情報
  spot_tags JSONB,
  -- スポットのいいね・ブックマーク状態（追加）
  spot_is_liked BOOLEAN,
  spot_is_bookmarked BOOLEAN
);

-- ===============================
-- RPC関数の更新
-- ===============================

CREATE OR REPLACE FUNCTION public.get_mixed_feed(
  p_limit INT DEFAULT 10,
  p_cursor TIMESTAMPTZ DEFAULT NULL,
  p_current_user_id UUID DEFAULT NULL
)
RETURNS SETOF public.mixed_feed_item
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH
  -- 公開マップを取得
  maps_cte AS (
    SELECT
      'map'::TEXT AS item_type,
      m.id AS item_id,
      m.created_at,
      -- マップフィールド
      m.id AS map_id,
      m.name AS map_name,
      m.description AS map_description,
      m.thumbnail_url AS map_thumbnail_url,
      m.is_public AS map_is_public,
      m.is_article_public AS map_is_article_public,
      m.spots_count AS map_spots_count,
      m.likes_count AS map_likes_count,
      m.bookmarks_count AS map_bookmarks_count,
      m.comments_count AS map_comments_count,
      m.category_id AS map_category_id,
      m.language AS map_language,
      m.user_id AS map_user_id,
      u.username AS map_user_username,
      u.display_name AS map_user_display_name,
      u.avatar_url AS map_user_avatar_url,
      -- タグ情報をJSONB配列で取得
      COALESCE(
        (SELECT jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
         FROM map_tags mt
         JOIN tags t ON t.id = mt.tag_id
         WHERE mt.map_id = m.id),
        '[]'::jsonb
      ) AS map_tags,
      -- マップのいいね状態
      CASE WHEN p_current_user_id IS NOT NULL THEN
        EXISTS (SELECT 1 FROM likes l WHERE l.map_id = m.id AND l.user_id = p_current_user_id)
      ELSE false END AS map_is_liked,
      -- マップのブックマーク状態
      CASE WHEN p_current_user_id IS NOT NULL THEN
        EXISTS (SELECT 1 FROM bookmarks b WHERE b.map_id = m.id AND b.user_id = p_current_user_id)
      ELSE false END AS map_is_bookmarked,
      -- スポット用フィールドはNULL
      NULL::UUID, NULL::UUID, NULL::UUID, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT,
      NULL::UUID, NULL::JSONB, NULL::INT, NULL::INT, NULL::INT, NULL::INT, NULL::INT,
      NULL::DOUBLE PRECISION, NULL::DOUBLE PRECISION, NULL::JSONB, NULL::JSONB,
      NULL::BOOLEAN, NULL::JSONB,
      NULL::JSONB, NULL::DOUBLE PRECISION, NULL::DOUBLE PRECISION, NULL::TEXT,
      NULL::JSONB, NULL::JSONB, NULL::TEXT[],
      NULL::TEXT, NULL::TEXT, NULL::TEXT,
      NULL::TEXT, NULL::BOOLEAN,
      NULL::JSONB,
      NULL::JSONB,  -- spot_tags
      NULL::BOOLEAN, NULL::BOOLEAN  -- spot_is_liked, spot_is_bookmarked
    FROM maps_public m
    LEFT JOIN users u ON u.id = m.user_id
    WHERE (p_cursor IS NULL OR m.created_at < p_cursor)
  ),

  -- 公開スポットを取得
  spots_cte AS (
    SELECT
      'spot'::TEXT AS item_type,
      s.id AS item_id,
      s.created_at,
      -- マップ用フィールドはNULL
      NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::BOOLEAN, NULL::BOOLEAN,
      NULL::INT, NULL::INT, NULL::INT, NULL::INT, NULL::TEXT, NULL::VARCHAR(10),
      NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::JSONB,
      NULL::BOOLEAN, NULL::BOOLEAN,  -- map_is_liked, map_is_bookmarked
      -- スポットフィールド
      s.id AS spot_id,
      s.user_id AS spot_user_id,
      s.map_id AS spot_map_id,
      s.master_spot_id AS spot_master_spot_id,
      s.machi_id AS spot_machi_id,
      s.description AS spot_description,
      s.spot_color AS spot_spot_color,
      s.label_id AS spot_label_id,
      s.name AS spot_name,
      s.images_count AS spot_images_count,
      s.likes_count AS spot_likes_count,
      s.bookmarks_count AS spot_bookmarks_count,
      s.comments_count AS spot_comments_count,
      s.order_index AS spot_order_index,
      s.latitude AS spot_latitude,
      s.longitude AS spot_longitude,
      s.google_formatted_address AS spot_google_formatted_address,
      s.google_short_address AS spot_google_short_address,
      s.is_public AS spot_is_public,
      s.article_content AS spot_article_content,
      -- マスタースポット情報
      ms.name AS spot_master_spot_name,
      ms.latitude AS spot_master_spot_latitude,
      ms.longitude AS spot_master_spot_longitude,
      ms.google_place_id AS spot_master_spot_google_place_id,
      ms.google_formatted_address AS spot_master_spot_google_formatted_address,
      ms.google_short_address AS spot_master_spot_google_short_address,
      ms.google_types AS spot_master_spot_google_types,
      -- ユーザー情報
      u.username AS spot_user_username,
      u.display_name AS spot_user_display_name,
      u.avatar_url AS spot_user_avatar_url,
      -- マップ情報
      m.name AS spot_map_name,
      m.is_public AS spot_map_is_public,
      -- 画像URL（order_indexでソートして取得）
      COALESCE(
        (SELECT jsonb_agg(i.cloud_path ORDER BY i.order_index)
         FROM images i
         WHERE i.user_spot_id = s.id),
        '[]'::jsonb
      ) AS spot_image_urls,
      -- タグ情報をJSONB配列で取得
      COALESCE(
        (SELECT jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
         FROM spot_tags st
         JOIN tags t ON t.id = st.tag_id
         WHERE st.user_spot_id = s.id),
        '[]'::jsonb
      ) AS spot_tags,
      -- スポットのいいね状態
      CASE WHEN p_current_user_id IS NOT NULL THEN
        EXISTS (SELECT 1 FROM likes l WHERE l.user_spot_id = s.id AND l.user_id = p_current_user_id)
      ELSE false END AS spot_is_liked,
      -- スポットのブックマーク状態
      CASE WHEN p_current_user_id IS NOT NULL THEN
        EXISTS (SELECT 1 FROM bookmarks b WHERE b.user_spot_id = s.id AND b.user_id = p_current_user_id)
      ELSE false END AS spot_is_bookmarked
    FROM user_spots s
    INNER JOIN maps m ON m.id = s.map_id AND m.is_public = true
    LEFT JOIN master_spots ms ON ms.id = s.master_spot_id
    LEFT JOIN users u ON u.id = s.user_id
    WHERE s.is_public = true
      AND (p_cursor IS NULL OR s.created_at < p_cursor)
  ),

  -- マップとスポットを結合してソート
  combined AS (
    SELECT * FROM maps_cte
    UNION ALL
    SELECT * FROM spots_cte
  )

  SELECT * FROM combined
  ORDER BY created_at DESC
  LIMIT p_limit;
END;
$$;

COMMENT ON FUNCTION public.get_mixed_feed IS '混合フィード取得（マップ+スポット、cursor方式ページネーション対応）- いいね・ブックマーク状態追加';

-- ===============================
-- フォロー中ユーザーの混合フィードも更新
-- ===============================

CREATE OR REPLACE FUNCTION public.get_following_mixed_feed(
  p_user_id UUID,
  p_limit INT DEFAULT 10,
  p_cursor TIMESTAMPTZ DEFAULT NULL
)
RETURNS SETOF public.mixed_feed_item
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH
  -- フォロー中ユーザーIDを取得
  following_ids AS (
    SELECT followee_id FROM follows WHERE follower_id = p_user_id
  ),

  -- フォロー中ユーザーの公開マップを取得
  maps_cte AS (
    SELECT
      'map'::TEXT AS item_type,
      m.id AS item_id,
      m.created_at,
      -- マップフィールド
      m.id AS map_id,
      m.name AS map_name,
      m.description AS map_description,
      m.thumbnail_url AS map_thumbnail_url,
      m.is_public AS map_is_public,
      m.is_article_public AS map_is_article_public,
      m.spots_count AS map_spots_count,
      m.likes_count AS map_likes_count,
      m.bookmarks_count AS map_bookmarks_count,
      m.comments_count AS map_comments_count,
      m.category_id AS map_category_id,
      m.language AS map_language,
      m.user_id AS map_user_id,
      u.username AS map_user_username,
      u.display_name AS map_user_display_name,
      u.avatar_url AS map_user_avatar_url,
      -- タグ情報をJSONB配列で取得
      COALESCE(
        (SELECT jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
         FROM map_tags mt
         JOIN tags t ON t.id = mt.tag_id
         WHERE mt.map_id = m.id),
        '[]'::jsonb
      ) AS map_tags,
      -- マップのいいね状態
      EXISTS (SELECT 1 FROM likes l WHERE l.map_id = m.id AND l.user_id = p_user_id) AS map_is_liked,
      -- マップのブックマーク状態
      EXISTS (SELECT 1 FROM bookmarks b WHERE b.map_id = m.id AND b.user_id = p_user_id) AS map_is_bookmarked,
      -- スポット用フィールドはNULL
      NULL::UUID, NULL::UUID, NULL::UUID, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT,
      NULL::UUID, NULL::JSONB, NULL::INT, NULL::INT, NULL::INT, NULL::INT, NULL::INT,
      NULL::DOUBLE PRECISION, NULL::DOUBLE PRECISION, NULL::JSONB, NULL::JSONB,
      NULL::BOOLEAN, NULL::JSONB,
      NULL::JSONB, NULL::DOUBLE PRECISION, NULL::DOUBLE PRECISION, NULL::TEXT,
      NULL::JSONB, NULL::JSONB, NULL::TEXT[],
      NULL::TEXT, NULL::TEXT, NULL::TEXT,
      NULL::TEXT, NULL::BOOLEAN,
      NULL::JSONB,
      NULL::JSONB,  -- spot_tags
      NULL::BOOLEAN, NULL::BOOLEAN  -- spot_is_liked, spot_is_bookmarked
    FROM maps_public m
    INNER JOIN following_ids f ON f.followee_id = m.user_id
    LEFT JOIN users u ON u.id = m.user_id
    WHERE (p_cursor IS NULL OR m.created_at < p_cursor)
  ),

  -- フォロー中ユーザーの公開スポットを取得
  spots_cte AS (
    SELECT
      'spot'::TEXT AS item_type,
      s.id AS item_id,
      s.created_at,
      -- マップ用フィールドはNULL
      NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::BOOLEAN, NULL::BOOLEAN,
      NULL::INT, NULL::INT, NULL::INT, NULL::INT, NULL::TEXT, NULL::VARCHAR(10),
      NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::JSONB,
      NULL::BOOLEAN, NULL::BOOLEAN,  -- map_is_liked, map_is_bookmarked
      -- スポットフィールド
      s.id AS spot_id,
      s.user_id AS spot_user_id,
      s.map_id AS spot_map_id,
      s.master_spot_id AS spot_master_spot_id,
      s.machi_id AS spot_machi_id,
      s.description AS spot_description,
      s.spot_color AS spot_spot_color,
      s.label_id AS spot_label_id,
      s.name AS spot_name,
      s.images_count AS spot_images_count,
      s.likes_count AS spot_likes_count,
      s.bookmarks_count AS spot_bookmarks_count,
      s.comments_count AS spot_comments_count,
      s.order_index AS spot_order_index,
      s.latitude AS spot_latitude,
      s.longitude AS spot_longitude,
      s.google_formatted_address AS spot_google_formatted_address,
      s.google_short_address AS spot_google_short_address,
      s.is_public AS spot_is_public,
      s.article_content AS spot_article_content,
      -- マスタースポット情報
      ms.name AS spot_master_spot_name,
      ms.latitude AS spot_master_spot_latitude,
      ms.longitude AS spot_master_spot_longitude,
      ms.google_place_id AS spot_master_spot_google_place_id,
      ms.google_formatted_address AS spot_master_spot_google_formatted_address,
      ms.google_short_address AS spot_master_spot_google_short_address,
      ms.google_types AS spot_master_spot_google_types,
      -- ユーザー情報
      u.username AS spot_user_username,
      u.display_name AS spot_user_display_name,
      u.avatar_url AS spot_user_avatar_url,
      -- マップ情報
      m.name AS spot_map_name,
      m.is_public AS spot_map_is_public,
      -- 画像URL（order_indexでソートして取得）
      COALESCE(
        (SELECT jsonb_agg(i.cloud_path ORDER BY i.order_index)
         FROM images i
         WHERE i.user_spot_id = s.id),
        '[]'::jsonb
      ) AS spot_image_urls,
      -- タグ情報をJSONB配列で取得
      COALESCE(
        (SELECT jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
         FROM spot_tags st
         JOIN tags t ON t.id = st.tag_id
         WHERE st.user_spot_id = s.id),
        '[]'::jsonb
      ) AS spot_tags,
      -- スポットのいいね状態
      EXISTS (SELECT 1 FROM likes l WHERE l.user_spot_id = s.id AND l.user_id = p_user_id) AS spot_is_liked,
      -- スポットのブックマーク状態
      EXISTS (SELECT 1 FROM bookmarks b WHERE b.user_spot_id = s.id AND b.user_id = p_user_id) AS spot_is_bookmarked
    FROM user_spots s
    INNER JOIN following_ids f ON f.followee_id = s.user_id
    INNER JOIN maps m ON m.id = s.map_id AND m.is_public = true
    LEFT JOIN master_spots ms ON ms.id = s.master_spot_id
    LEFT JOIN users u ON u.id = s.user_id
    WHERE s.is_public = true
      AND (p_cursor IS NULL OR s.created_at < p_cursor)
  ),

  -- マップとスポットを結合してソート
  combined AS (
    SELECT * FROM maps_cte
    UNION ALL
    SELECT * FROM spots_cte
  )

  SELECT * FROM combined
  ORDER BY created_at DESC
  LIMIT p_limit;
END;
$$;

COMMENT ON FUNCTION public.get_following_mixed_feed IS 'フォロー中ユーザーの混合フィード取得 - いいね・ブックマーク状態追加';

-- 実行権限を付与
GRANT EXECUTE ON FUNCTION public.get_mixed_feed TO anon;
GRANT EXECUTE ON FUNCTION public.get_mixed_feed TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_following_mixed_feed TO authenticated;

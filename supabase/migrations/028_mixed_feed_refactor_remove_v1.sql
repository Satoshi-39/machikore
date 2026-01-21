-- ============================================================
-- 混合フィード リファクタリング: V1削除 + V2をデフォルトに
-- ============================================================
-- - V1のRPC関数・型を削除
-- - V2の関数名からバージョン表記を削除
-- - spot_display_typeをサーバー側で決定（short→card→short→card...交互）
-- - p_spot_display_typeパラメータを削除
-- 最終更新: 2026-01-20

-- ===============================
-- V1の削除
-- ===============================

-- V1のRPC関数を削除
DROP FUNCTION IF EXISTS public.get_mixed_feed(INT, INT, TIMESTAMPTZ, TIMESTAMPTZ, UUID, BOOLEAN, INT) CASCADE;
DROP FUNCTION IF EXISTS public.get_following_mixed_feed(UUID, INT, INT, TIMESTAMPTZ, TIMESTAMPTZ, BOOLEAN, INT) CASCADE;
DROP FUNCTION IF EXISTS public.generate_feed_ad_slots(INT, INT) CASCADE;

-- V1の型を削除
DROP TYPE IF EXISTS public.mixed_feed_item CASCADE;

-- ===============================
-- V2の関数をリネーム（バージョン表記を削除）
-- ===============================

-- 既存のV2関数を削除（新しい名前で再作成するため）
DROP FUNCTION IF EXISTS public.get_mixed_feed_v2(INT, INT, TIMESTAMPTZ, TIMESTAMPTZ, UUID, BOOLEAN, INT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.get_following_mixed_feed_v2(UUID, INT, INT, TIMESTAMPTZ, TIMESTAMPTZ, BOOLEAN, INT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.generate_feed_ad_slots_v2(INT, INT) CASCADE;

-- V2の型をリネーム（既に存在する場合のみ）
-- mixed_feed_itemが既に存在する場合はスキップ
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mixed_feed_item_v2') THEN
    ALTER TYPE public.mixed_feed_item_v2 RENAME TO mixed_feed_item;
  ELSIF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mixed_feed_item') THEN
    -- どちらも存在しない場合は新規作成
    CREATE TYPE public.mixed_feed_item AS (
      item_type TEXT,
      item_id UUID,
      created_at TIMESTAMPTZ,
      feed_position INT,
      ad_slot TEXT,
      spot_display_type TEXT,
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
      map_is_liked BOOLEAN,
      map_is_bookmarked BOOLEAN,
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
      spot_master_spot_name JSONB,
      spot_master_spot_latitude DOUBLE PRECISION,
      spot_master_spot_longitude DOUBLE PRECISION,
      spot_master_spot_google_place_id TEXT,
      spot_master_spot_google_formatted_address JSONB,
      spot_master_spot_google_short_address JSONB,
      spot_master_spot_google_types TEXT[],
      spot_user_username TEXT,
      spot_user_display_name TEXT,
      spot_user_avatar_url TEXT,
      spot_map_name TEXT,
      spot_map_is_public BOOLEAN,
      spot_image_urls JSONB,
      spot_tags JSONB,
      spot_is_liked BOOLEAN,
      spot_is_bookmarked BOOLEAN
    );
  END IF;
END $$;

-- ===============================
-- 広告スロット生成用ヘルパー関数（バージョン表記なし）
-- ===============================

CREATE OR REPLACE FUNCTION public.generate_feed_ad_slots(
  p_start_position INT,
  p_block_count INT
)
RETURNS SETOF public.mixed_feed_item
LANGUAGE sql
STABLE
AS $$
  -- feed_native広告（各ブロックの位置3: map2枚の後、真ん中）
  SELECT
    'ad'::TEXT AS item_type,
    NULL::UUID AS item_id,
    NULL::TIMESTAMPTZ AS created_at,
    (p_start_position + n * 10 + 3)::INT AS feed_position,
    'feed_native'::TEXT AS ad_slot,
    NULL::TEXT AS spot_display_type,
    -- マップフィールド
    NULL::UUID AS map_id,
    NULL::TEXT AS map_name,
    NULL::TEXT AS map_description,
    NULL::TEXT AS map_thumbnail_url,
    NULL::BOOLEAN AS map_is_public,
    NULL::BOOLEAN AS map_is_article_public,
    NULL::INT AS map_spots_count,
    NULL::INT AS map_likes_count,
    NULL::INT AS map_bookmarks_count,
    NULL::INT AS map_comments_count,
    NULL::TEXT AS map_category_id,
    NULL::VARCHAR(10) AS map_language,
    NULL::UUID AS map_user_id,
    NULL::TEXT AS map_user_username,
    NULL::TEXT AS map_user_display_name,
    NULL::TEXT AS map_user_avatar_url,
    NULL::JSONB AS map_tags,
    NULL::BOOLEAN AS map_is_liked,
    NULL::BOOLEAN AS map_is_bookmarked,
    -- スポットフィールド
    NULL::UUID AS spot_id,
    NULL::UUID AS spot_user_id,
    NULL::UUID AS spot_map_id,
    NULL::UUID AS spot_master_spot_id,
    NULL::TEXT AS spot_machi_id,
    NULL::TEXT AS spot_description,
    NULL::TEXT AS spot_spot_color,
    NULL::UUID AS spot_label_id,
    NULL::JSONB AS spot_name,
    NULL::INT AS spot_images_count,
    NULL::INT AS spot_likes_count,
    NULL::INT AS spot_bookmarks_count,
    NULL::INT AS spot_comments_count,
    NULL::INT AS spot_order_index,
    NULL::DOUBLE PRECISION AS spot_latitude,
    NULL::DOUBLE PRECISION AS spot_longitude,
    NULL::JSONB AS spot_google_formatted_address,
    NULL::JSONB AS spot_google_short_address,
    NULL::BOOLEAN AS spot_is_public,
    NULL::JSONB AS spot_article_content,
    NULL::JSONB AS spot_master_spot_name,
    NULL::DOUBLE PRECISION AS spot_master_spot_latitude,
    NULL::DOUBLE PRECISION AS spot_master_spot_longitude,
    NULL::TEXT AS spot_master_spot_google_place_id,
    NULL::JSONB AS spot_master_spot_google_formatted_address,
    NULL::JSONB AS spot_master_spot_google_short_address,
    NULL::TEXT[] AS spot_master_spot_google_types,
    NULL::TEXT AS spot_user_username,
    NULL::TEXT AS spot_user_display_name,
    NULL::TEXT AS spot_user_avatar_url,
    NULL::TEXT AS spot_map_name,
    NULL::BOOLEAN AS spot_map_is_public,
    NULL::JSONB AS spot_image_urls,
    NULL::JSONB AS spot_tags,
    NULL::BOOLEAN AS spot_is_liked,
    NULL::BOOLEAN AS spot_is_bookmarked
  FROM generate_series(0, GREATEST(p_block_count - 1, 0)) AS n

  UNION ALL

  -- carousel_video広告（各ブロックの位置8: spot2枚の後、真ん中）
  SELECT
    'ad'::TEXT AS item_type,
    NULL::UUID AS item_id,
    NULL::TIMESTAMPTZ AS created_at,
    (p_start_position + n * 10 + 8)::INT AS feed_position,
    'carousel_video'::TEXT AS ad_slot,
    NULL::TEXT AS spot_display_type,
    -- マップフィールド
    NULL::UUID AS map_id,
    NULL::TEXT AS map_name,
    NULL::TEXT AS map_description,
    NULL::TEXT AS map_thumbnail_url,
    NULL::BOOLEAN AS map_is_public,
    NULL::BOOLEAN AS map_is_article_public,
    NULL::INT AS map_spots_count,
    NULL::INT AS map_likes_count,
    NULL::INT AS map_bookmarks_count,
    NULL::INT AS map_comments_count,
    NULL::TEXT AS map_category_id,
    NULL::VARCHAR(10) AS map_language,
    NULL::UUID AS map_user_id,
    NULL::TEXT AS map_user_username,
    NULL::TEXT AS map_user_display_name,
    NULL::TEXT AS map_user_avatar_url,
    NULL::JSONB AS map_tags,
    NULL::BOOLEAN AS map_is_liked,
    NULL::BOOLEAN AS map_is_bookmarked,
    -- スポットフィールド
    NULL::UUID AS spot_id,
    NULL::UUID AS spot_user_id,
    NULL::UUID AS spot_map_id,
    NULL::UUID AS spot_master_spot_id,
    NULL::TEXT AS spot_machi_id,
    NULL::TEXT AS spot_description,
    NULL::TEXT AS spot_spot_color,
    NULL::UUID AS spot_label_id,
    NULL::JSONB AS spot_name,
    NULL::INT AS spot_images_count,
    NULL::INT AS spot_likes_count,
    NULL::INT AS spot_bookmarks_count,
    NULL::INT AS spot_comments_count,
    NULL::INT AS spot_order_index,
    NULL::DOUBLE PRECISION AS spot_latitude,
    NULL::DOUBLE PRECISION AS spot_longitude,
    NULL::JSONB AS spot_google_formatted_address,
    NULL::JSONB AS spot_google_short_address,
    NULL::BOOLEAN AS spot_is_public,
    NULL::JSONB AS spot_article_content,
    NULL::JSONB AS spot_master_spot_name,
    NULL::DOUBLE PRECISION AS spot_master_spot_latitude,
    NULL::DOUBLE PRECISION AS spot_master_spot_longitude,
    NULL::TEXT AS spot_master_spot_google_place_id,
    NULL::JSONB AS spot_master_spot_google_formatted_address,
    NULL::JSONB AS spot_master_spot_google_short_address,
    NULL::TEXT[] AS spot_master_spot_google_types,
    NULL::TEXT AS spot_user_username,
    NULL::TEXT AS spot_user_display_name,
    NULL::TEXT AS spot_user_avatar_url,
    NULL::TEXT AS spot_map_name,
    NULL::BOOLEAN AS spot_map_is_public,
    NULL::JSONB AS spot_image_urls,
    NULL::JSONB AS spot_tags,
    NULL::BOOLEAN AS spot_is_liked,
    NULL::BOOLEAN AS spot_is_bookmarked
  FROM generate_series(0, GREATEST(p_block_count - 1, 0)) AS n;
$$;

COMMENT ON FUNCTION public.generate_feed_ad_slots IS '混合フィード用広告スロット生成（feed_native + carousel_video）';

-- ===============================
-- RPC関数（おすすめ用）
-- ===============================
-- 配置: map1-2 → feed_native → map3-4 → spot1-4(short) → map1-2 → feed_native → map3-4 → spot1-4(card) → 繰り返し
-- spot_display_type: ブロックごとに short → card → short → card... と交互に切り替え

CREATE OR REPLACE FUNCTION public.get_mixed_feed(
  p_map_limit INT DEFAULT 4,
  p_spot_limit INT DEFAULT 4,
  p_map_cursor TIMESTAMPTZ DEFAULT NULL,
  p_spot_cursor TIMESTAMPTZ DEFAULT NULL,
  p_current_user_id UUID DEFAULT NULL,
  p_show_ads BOOLEAN DEFAULT TRUE,
  p_start_position INT DEFAULT 0
)
RETURNS SETOF public.mixed_feed_item
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_maps_per_block INT := 4;
  v_spots_per_block INT := 4;
  v_items_per_block INT := 10;
  v_items_per_block_no_ads INT := 8;
BEGIN
  RETURN QUERY
  WITH
  -- 公開マップを取得
  maps_cte AS (
    SELECT
      'map'::TEXT AS item_type,
      m.id AS item_id,
      m.created_at,
      ROW_NUMBER() OVER (ORDER BY m.created_at DESC) AS row_num,
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
      COALESCE(
        (SELECT jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
         FROM map_tags mt
         JOIN tags t ON t.id = mt.tag_id
         WHERE mt.map_id = m.id),
        '[]'::jsonb
      ) AS map_tags,
      CASE WHEN p_current_user_id IS NOT NULL THEN
        EXISTS (SELECT 1 FROM likes l WHERE l.map_id = m.id AND l.user_id = p_current_user_id)
      ELSE false END AS map_is_liked,
      CASE WHEN p_current_user_id IS NOT NULL THEN
        EXISTS (SELECT 1 FROM bookmarks b WHERE b.map_id = m.id AND b.user_id = p_current_user_id)
      ELSE false END AS map_is_bookmarked
    FROM maps_public m
    LEFT JOIN users u ON u.id = m.user_id
    WHERE (p_map_cursor IS NULL OR m.created_at < p_map_cursor)
    ORDER BY m.created_at DESC
    LIMIT p_map_limit
  ),

  -- 公開スポットを取得
  spots_cte AS (
    SELECT
      'spot'::TEXT AS item_type,
      s.id AS item_id,
      s.created_at,
      ROW_NUMBER() OVER (ORDER BY s.created_at DESC) AS row_num,
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
      ms.name AS spot_master_spot_name,
      ms.latitude AS spot_master_spot_latitude,
      ms.longitude AS spot_master_spot_longitude,
      ms.google_place_id AS spot_master_spot_google_place_id,
      ms.google_formatted_address AS spot_master_spot_google_formatted_address,
      ms.google_short_address AS spot_master_spot_google_short_address,
      ms.google_types AS spot_master_spot_google_types,
      u.username AS spot_user_username,
      u.display_name AS spot_user_display_name,
      u.avatar_url AS spot_user_avatar_url,
      mp.name AS spot_map_name,
      mp.is_public AS spot_map_is_public,
      COALESCE(
        (SELECT jsonb_agg(i.cloud_path ORDER BY i.order_index)
         FROM images i
         WHERE i.user_spot_id = s.id),
        '[]'::jsonb
      ) AS spot_image_urls,
      COALESCE(
        (SELECT jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
         FROM spot_tags st
         JOIN tags t ON t.id = st.tag_id
         WHERE st.user_spot_id = s.id),
        '[]'::jsonb
      ) AS spot_tags,
      CASE WHEN p_current_user_id IS NOT NULL THEN
        EXISTS (SELECT 1 FROM likes l WHERE l.user_spot_id = s.id AND l.user_id = p_current_user_id)
      ELSE false END AS spot_is_liked,
      CASE WHEN p_current_user_id IS NOT NULL THEN
        EXISTS (SELECT 1 FROM bookmarks b WHERE b.user_spot_id = s.id AND b.user_id = p_current_user_id)
      ELSE false END AS spot_is_bookmarked
    FROM user_spots s
    INNER JOIN maps mp ON mp.id = s.map_id AND mp.is_public = true
    LEFT JOIN master_spots ms ON ms.id = s.master_spot_id
    LEFT JOIN users u ON u.id = s.user_id
    WHERE s.is_public = true
      AND (p_spot_cursor IS NULL OR s.created_at < p_spot_cursor)
    ORDER BY s.created_at DESC
    LIMIT p_spot_limit
  ),

  -- マップに位置番号を付与
  maps_with_position AS (
    SELECT
      item_type, item_id, created_at,
      NULL::TEXT AS spot_display_type,
      ((row_num - 1) / v_maps_per_block)::INT AS block_num,
      ((row_num - 1) % v_maps_per_block)::INT AS pos_in_block,
      CASE WHEN p_show_ads THEN
        p_start_position +
        ((row_num - 1) / v_maps_per_block)::INT * v_items_per_block +
        ((row_num - 1) % v_maps_per_block)::INT + 1 +
        CASE WHEN ((row_num - 1) % v_maps_per_block)::INT >= 2 THEN 1 ELSE 0 END
      ELSE
        p_start_position +
        ((row_num - 1) / v_maps_per_block)::INT * v_items_per_block_no_ads +
        ((row_num - 1) % v_maps_per_block)::INT + 1
      END AS feed_position,
      NULL::TEXT AS ad_slot,
      map_id, map_name, map_description, map_thumbnail_url, map_is_public, map_is_article_public,
      map_spots_count, map_likes_count, map_bookmarks_count, map_comments_count, map_category_id,
      map_language, map_user_id, map_user_username, map_user_display_name, map_user_avatar_url,
      map_tags, map_is_liked, map_is_bookmarked,
      NULL::UUID AS spot_id, NULL::UUID AS spot_user_id, NULL::UUID AS spot_map_id,
      NULL::UUID AS spot_master_spot_id, NULL::TEXT AS spot_machi_id,
      NULL::TEXT AS spot_description, NULL::TEXT AS spot_spot_color, NULL::UUID AS spot_label_id,
      NULL::JSONB AS spot_name, NULL::INT AS spot_images_count, NULL::INT AS spot_likes_count,
      NULL::INT AS spot_bookmarks_count, NULL::INT AS spot_comments_count, NULL::INT AS spot_order_index,
      NULL::DOUBLE PRECISION AS spot_latitude, NULL::DOUBLE PRECISION AS spot_longitude,
      NULL::JSONB AS spot_google_formatted_address, NULL::JSONB AS spot_google_short_address,
      NULL::BOOLEAN AS spot_is_public, NULL::JSONB AS spot_article_content,
      NULL::JSONB AS spot_master_spot_name, NULL::DOUBLE PRECISION AS spot_master_spot_latitude,
      NULL::DOUBLE PRECISION AS spot_master_spot_longitude, NULL::TEXT AS spot_master_spot_google_place_id,
      NULL::JSONB AS spot_master_spot_google_formatted_address, NULL::JSONB AS spot_master_spot_google_short_address,
      NULL::TEXT[] AS spot_master_spot_google_types,
      NULL::TEXT AS spot_user_username, NULL::TEXT AS spot_user_display_name, NULL::TEXT AS spot_user_avatar_url,
      NULL::TEXT AS spot_map_name, NULL::BOOLEAN AS spot_map_is_public,
      NULL::JSONB AS spot_image_urls, NULL::JSONB AS spot_tags,
      NULL::BOOLEAN AS spot_is_liked, NULL::BOOLEAN AS spot_is_bookmarked
    FROM maps_cte
  ),

  -- スポットに位置番号を付与
  -- spot_display_type: ブロック番号が奇数(1,3,5...)→short、偶数(0,2,4...)→card
  -- p_start_positionも考慮して、累積ブロック番号を計算
  spots_with_position AS (
    SELECT
      item_type, item_id, created_at,
      -- 累積ブロック番号を計算: (p_start_position / v_items_per_block) + 現在のブロック番号
      -- 最初のspot5はshort、次はcard、その次はshort...
      CASE WHEN ((p_start_position / v_items_per_block) + ((row_num - 1) / v_spots_per_block)::INT) % 2 = 0
        THEN 'short'::TEXT
        ELSE 'card'::TEXT
      END AS spot_display_type,
      ((row_num - 1) / v_spots_per_block)::INT AS block_num,
      ((row_num - 1) % v_spots_per_block)::INT AS pos_in_block,
      CASE WHEN p_show_ads THEN
        p_start_position +
        ((row_num - 1) / v_spots_per_block)::INT * v_items_per_block +
        5 +
        ((row_num - 1) % v_spots_per_block)::INT + 1 +
        CASE WHEN ((row_num - 1) % v_spots_per_block)::INT >= 2 THEN 1 ELSE 0 END
      ELSE
        p_start_position +
        ((row_num - 1) / v_spots_per_block)::INT * v_items_per_block_no_ads +
        4 +
        ((row_num - 1) % v_spots_per_block)::INT + 1
      END AS feed_position,
      NULL::TEXT AS ad_slot,
      NULL::UUID AS map_id, NULL::TEXT AS map_name, NULL::TEXT AS map_description,
      NULL::TEXT AS map_thumbnail_url, NULL::BOOLEAN AS map_is_public, NULL::BOOLEAN AS map_is_article_public,
      NULL::INT AS map_spots_count, NULL::INT AS map_likes_count, NULL::INT AS map_bookmarks_count,
      NULL::INT AS map_comments_count, NULL::TEXT AS map_category_id, NULL::VARCHAR(10) AS map_language,
      NULL::UUID AS map_user_id, NULL::TEXT AS map_user_username, NULL::TEXT AS map_user_display_name,
      NULL::TEXT AS map_user_avatar_url, NULL::JSONB AS map_tags,
      NULL::BOOLEAN AS map_is_liked, NULL::BOOLEAN AS map_is_bookmarked,
      spot_id, spot_user_id, spot_map_id, spot_master_spot_id, spot_machi_id, spot_description,
      spot_spot_color, spot_label_id, spot_name, spot_images_count, spot_likes_count,
      spot_bookmarks_count, spot_comments_count, spot_order_index, spot_latitude, spot_longitude,
      spot_google_formatted_address, spot_google_short_address, spot_is_public, spot_article_content,
      spot_master_spot_name, spot_master_spot_latitude, spot_master_spot_longitude,
      spot_master_spot_google_place_id, spot_master_spot_google_formatted_address,
      spot_master_spot_google_short_address, spot_master_spot_google_types,
      spot_user_username, spot_user_display_name, spot_user_avatar_url,
      spot_map_name, spot_map_is_public, spot_image_urls, spot_tags, spot_is_liked, spot_is_bookmarked
    FROM spots_cte
  ),

  -- 広告スロットを生成
  ad_slots AS (
    SELECT * FROM generate_feed_ad_slots(
      p_start_position,
      GREATEST((p_map_limit / v_maps_per_block), 1)
    )
    WHERE p_show_ads = TRUE
  ),

  -- 結合
  combined AS (
    SELECT item_type, item_id, created_at, feed_position, ad_slot, spot_display_type,
           map_id, map_name, map_description, map_thumbnail_url, map_is_public, map_is_article_public,
           map_spots_count, map_likes_count, map_bookmarks_count, map_comments_count, map_category_id,
           map_language, map_user_id, map_user_username, map_user_display_name, map_user_avatar_url,
           map_tags, map_is_liked, map_is_bookmarked,
           spot_id, spot_user_id, spot_map_id, spot_master_spot_id, spot_machi_id, spot_description,
           spot_spot_color, spot_label_id, spot_name, spot_images_count, spot_likes_count,
           spot_bookmarks_count, spot_comments_count, spot_order_index, spot_latitude, spot_longitude,
           spot_google_formatted_address, spot_google_short_address, spot_is_public, spot_article_content,
           spot_master_spot_name, spot_master_spot_latitude, spot_master_spot_longitude,
           spot_master_spot_google_place_id, spot_master_spot_google_formatted_address,
           spot_master_spot_google_short_address, spot_master_spot_google_types,
           spot_user_username, spot_user_display_name, spot_user_avatar_url,
           spot_map_name, spot_map_is_public, spot_image_urls, spot_tags, spot_is_liked, spot_is_bookmarked
    FROM maps_with_position
    UNION ALL
    SELECT item_type, item_id, created_at, feed_position, ad_slot, spot_display_type,
           map_id, map_name, map_description, map_thumbnail_url, map_is_public, map_is_article_public,
           map_spots_count, map_likes_count, map_bookmarks_count, map_comments_count, map_category_id,
           map_language, map_user_id, map_user_username, map_user_display_name, map_user_avatar_url,
           map_tags, map_is_liked, map_is_bookmarked,
           spot_id, spot_user_id, spot_map_id, spot_master_spot_id, spot_machi_id, spot_description,
           spot_spot_color, spot_label_id, spot_name, spot_images_count, spot_likes_count,
           spot_bookmarks_count, spot_comments_count, spot_order_index, spot_latitude, spot_longitude,
           spot_google_formatted_address, spot_google_short_address, spot_is_public, spot_article_content,
           spot_master_spot_name, spot_master_spot_latitude, spot_master_spot_longitude,
           spot_master_spot_google_place_id, spot_master_spot_google_formatted_address,
           spot_master_spot_google_short_address, spot_master_spot_google_types,
           spot_user_username, spot_user_display_name, spot_user_avatar_url,
           spot_map_name, spot_map_is_public, spot_image_urls, spot_tags, spot_is_liked, spot_is_bookmarked
    FROM spots_with_position
    UNION ALL
    SELECT * FROM ad_slots
  )

  SELECT
    item_type, item_id, created_at, feed_position, ad_slot, spot_display_type,
    map_id, map_name, map_description, map_thumbnail_url, map_is_public, map_is_article_public,
    map_spots_count, map_likes_count, map_bookmarks_count, map_comments_count, map_category_id,
    map_language, map_user_id, map_user_username, map_user_display_name, map_user_avatar_url,
    map_tags, map_is_liked, map_is_bookmarked,
    spot_id, spot_user_id, spot_map_id, spot_master_spot_id, spot_machi_id, spot_description,
    spot_spot_color, spot_label_id, spot_name, spot_images_count, spot_likes_count,
    spot_bookmarks_count, spot_comments_count, spot_order_index, spot_latitude, spot_longitude,
    spot_google_formatted_address, spot_google_short_address, spot_is_public, spot_article_content,
    spot_master_spot_name, spot_master_spot_latitude, spot_master_spot_longitude,
    spot_master_spot_google_place_id, spot_master_spot_google_formatted_address,
    spot_master_spot_google_short_address, spot_master_spot_google_types,
    spot_user_username, spot_user_display_name, spot_user_avatar_url,
    spot_map_name, spot_map_is_public, spot_image_urls, spot_tags, spot_is_liked, spot_is_bookmarked
  FROM combined
  ORDER BY feed_position;
END;
$$;

COMMENT ON FUNCTION public.get_mixed_feed IS '混合フィード - 配置: map4 → spot4 繰り返し。spot_display_type はブロックごとに short → card と交互に切り替え';

-- ===============================
-- RPC関数（フォロー中用）
-- ===============================

CREATE OR REPLACE FUNCTION public.get_following_mixed_feed(
  p_user_id UUID,
  p_map_limit INT DEFAULT 4,
  p_spot_limit INT DEFAULT 4,
  p_map_cursor TIMESTAMPTZ DEFAULT NULL,
  p_spot_cursor TIMESTAMPTZ DEFAULT NULL,
  p_show_ads BOOLEAN DEFAULT TRUE,
  p_start_position INT DEFAULT 0
)
RETURNS SETOF public.mixed_feed_item
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_maps_per_block INT := 4;
  v_spots_per_block INT := 4;
  v_items_per_block INT := 10;
  v_items_per_block_no_ads INT := 8;
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
      ROW_NUMBER() OVER (ORDER BY m.created_at DESC) AS row_num,
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
      COALESCE(
        (SELECT jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
         FROM map_tags mt
         JOIN tags t ON t.id = mt.tag_id
         WHERE mt.map_id = m.id),
        '[]'::jsonb
      ) AS map_tags,
      EXISTS (SELECT 1 FROM likes l WHERE l.map_id = m.id AND l.user_id = p_user_id) AS map_is_liked,
      EXISTS (SELECT 1 FROM bookmarks b WHERE b.map_id = m.id AND b.user_id = p_user_id) AS map_is_bookmarked
    FROM maps_public m
    INNER JOIN following_ids f ON f.followee_id = m.user_id
    LEFT JOIN users u ON u.id = m.user_id
    WHERE (p_map_cursor IS NULL OR m.created_at < p_map_cursor)
    ORDER BY m.created_at DESC
    LIMIT p_map_limit
  ),

  -- フォロー中ユーザーの公開スポットを取得
  spots_cte AS (
    SELECT
      'spot'::TEXT AS item_type,
      s.id AS item_id,
      s.created_at,
      ROW_NUMBER() OVER (ORDER BY s.created_at DESC) AS row_num,
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
      ms.name AS spot_master_spot_name,
      ms.latitude AS spot_master_spot_latitude,
      ms.longitude AS spot_master_spot_longitude,
      ms.google_place_id AS spot_master_spot_google_place_id,
      ms.google_formatted_address AS spot_master_spot_google_formatted_address,
      ms.google_short_address AS spot_master_spot_google_short_address,
      ms.google_types AS spot_master_spot_google_types,
      u.username AS spot_user_username,
      u.display_name AS spot_user_display_name,
      u.avatar_url AS spot_user_avatar_url,
      mp.name AS spot_map_name,
      mp.is_public AS spot_map_is_public,
      COALESCE(
        (SELECT jsonb_agg(i.cloud_path ORDER BY i.order_index)
         FROM images i
         WHERE i.user_spot_id = s.id),
        '[]'::jsonb
      ) AS spot_image_urls,
      COALESCE(
        (SELECT jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
         FROM spot_tags st
         JOIN tags t ON t.id = st.tag_id
         WHERE st.user_spot_id = s.id),
        '[]'::jsonb
      ) AS spot_tags,
      EXISTS (SELECT 1 FROM likes l WHERE l.user_spot_id = s.id AND l.user_id = p_user_id) AS spot_is_liked,
      EXISTS (SELECT 1 FROM bookmarks b WHERE b.user_spot_id = s.id AND b.user_id = p_user_id) AS spot_is_bookmarked
    FROM user_spots s
    INNER JOIN following_ids f ON f.followee_id = s.user_id
    INNER JOIN maps mp ON mp.id = s.map_id AND mp.is_public = true
    LEFT JOIN master_spots ms ON ms.id = s.master_spot_id
    LEFT JOIN users u ON u.id = s.user_id
    WHERE s.is_public = true
      AND (p_spot_cursor IS NULL OR s.created_at < p_spot_cursor)
    ORDER BY s.created_at DESC
    LIMIT p_spot_limit
  ),

  -- マップに位置番号を付与
  maps_with_position AS (
    SELECT
      item_type, item_id, created_at,
      NULL::TEXT AS spot_display_type,
      ((row_num - 1) / v_maps_per_block)::INT AS block_num,
      ((row_num - 1) % v_maps_per_block)::INT AS pos_in_block,
      CASE WHEN p_show_ads THEN
        p_start_position +
        ((row_num - 1) / v_maps_per_block)::INT * v_items_per_block +
        ((row_num - 1) % v_maps_per_block)::INT + 1 +
        CASE WHEN ((row_num - 1) % v_maps_per_block)::INT >= 2 THEN 1 ELSE 0 END
      ELSE
        p_start_position +
        ((row_num - 1) / v_maps_per_block)::INT * v_items_per_block_no_ads +
        ((row_num - 1) % v_maps_per_block)::INT + 1
      END AS feed_position,
      NULL::TEXT AS ad_slot,
      map_id, map_name, map_description, map_thumbnail_url, map_is_public, map_is_article_public,
      map_spots_count, map_likes_count, map_bookmarks_count, map_comments_count, map_category_id,
      map_language, map_user_id, map_user_username, map_user_display_name, map_user_avatar_url,
      map_tags, map_is_liked, map_is_bookmarked,
      NULL::UUID AS spot_id, NULL::UUID AS spot_user_id, NULL::UUID AS spot_map_id,
      NULL::UUID AS spot_master_spot_id, NULL::TEXT AS spot_machi_id,
      NULL::TEXT AS spot_description, NULL::TEXT AS spot_spot_color, NULL::UUID AS spot_label_id,
      NULL::JSONB AS spot_name, NULL::INT AS spot_images_count, NULL::INT AS spot_likes_count,
      NULL::INT AS spot_bookmarks_count, NULL::INT AS spot_comments_count, NULL::INT AS spot_order_index,
      NULL::DOUBLE PRECISION AS spot_latitude, NULL::DOUBLE PRECISION AS spot_longitude,
      NULL::JSONB AS spot_google_formatted_address, NULL::JSONB AS spot_google_short_address,
      NULL::BOOLEAN AS spot_is_public, NULL::JSONB AS spot_article_content,
      NULL::JSONB AS spot_master_spot_name, NULL::DOUBLE PRECISION AS spot_master_spot_latitude,
      NULL::DOUBLE PRECISION AS spot_master_spot_longitude, NULL::TEXT AS spot_master_spot_google_place_id,
      NULL::JSONB AS spot_master_spot_google_formatted_address, NULL::JSONB AS spot_master_spot_google_short_address,
      NULL::TEXT[] AS spot_master_spot_google_types,
      NULL::TEXT AS spot_user_username, NULL::TEXT AS spot_user_display_name, NULL::TEXT AS spot_user_avatar_url,
      NULL::TEXT AS spot_map_name, NULL::BOOLEAN AS spot_map_is_public,
      NULL::JSONB AS spot_image_urls, NULL::JSONB AS spot_tags,
      NULL::BOOLEAN AS spot_is_liked, NULL::BOOLEAN AS spot_is_bookmarked
    FROM maps_cte
  ),

  -- スポットに位置番号を付与
  spots_with_position AS (
    SELECT
      item_type, item_id, created_at,
      -- 累積ブロック番号で short/card を交互に切り替え
      CASE WHEN ((p_start_position / v_items_per_block) + ((row_num - 1) / v_spots_per_block)::INT) % 2 = 0
        THEN 'short'::TEXT
        ELSE 'card'::TEXT
      END AS spot_display_type,
      ((row_num - 1) / v_spots_per_block)::INT AS block_num,
      ((row_num - 1) % v_spots_per_block)::INT AS pos_in_block,
      CASE WHEN p_show_ads THEN
        p_start_position +
        ((row_num - 1) / v_spots_per_block)::INT * v_items_per_block +
        5 +
        ((row_num - 1) % v_spots_per_block)::INT + 1 +
        CASE WHEN ((row_num - 1) % v_spots_per_block)::INT >= 2 THEN 1 ELSE 0 END
      ELSE
        p_start_position +
        ((row_num - 1) / v_spots_per_block)::INT * v_items_per_block_no_ads +
        4 +
        ((row_num - 1) % v_spots_per_block)::INT + 1
      END AS feed_position,
      NULL::TEXT AS ad_slot,
      NULL::UUID AS map_id, NULL::TEXT AS map_name, NULL::TEXT AS map_description,
      NULL::TEXT AS map_thumbnail_url, NULL::BOOLEAN AS map_is_public, NULL::BOOLEAN AS map_is_article_public,
      NULL::INT AS map_spots_count, NULL::INT AS map_likes_count, NULL::INT AS map_bookmarks_count,
      NULL::INT AS map_comments_count, NULL::TEXT AS map_category_id, NULL::VARCHAR(10) AS map_language,
      NULL::UUID AS map_user_id, NULL::TEXT AS map_user_username, NULL::TEXT AS map_user_display_name,
      NULL::TEXT AS map_user_avatar_url, NULL::JSONB AS map_tags,
      NULL::BOOLEAN AS map_is_liked, NULL::BOOLEAN AS map_is_bookmarked,
      spot_id, spot_user_id, spot_map_id, spot_master_spot_id, spot_machi_id, spot_description,
      spot_spot_color, spot_label_id, spot_name, spot_images_count, spot_likes_count,
      spot_bookmarks_count, spot_comments_count, spot_order_index, spot_latitude, spot_longitude,
      spot_google_formatted_address, spot_google_short_address, spot_is_public, spot_article_content,
      spot_master_spot_name, spot_master_spot_latitude, spot_master_spot_longitude,
      spot_master_spot_google_place_id, spot_master_spot_google_formatted_address,
      spot_master_spot_google_short_address, spot_master_spot_google_types,
      spot_user_username, spot_user_display_name, spot_user_avatar_url,
      spot_map_name, spot_map_is_public, spot_image_urls, spot_tags, spot_is_liked, spot_is_bookmarked
    FROM spots_cte
  ),

  -- 広告スロットを生成
  ad_slots AS (
    SELECT * FROM generate_feed_ad_slots(
      p_start_position,
      GREATEST((p_map_limit / v_maps_per_block), 1)
    )
    WHERE p_show_ads = TRUE
  ),

  -- 結合
  combined AS (
    SELECT item_type, item_id, created_at, feed_position, ad_slot, spot_display_type,
           map_id, map_name, map_description, map_thumbnail_url, map_is_public, map_is_article_public,
           map_spots_count, map_likes_count, map_bookmarks_count, map_comments_count, map_category_id,
           map_language, map_user_id, map_user_username, map_user_display_name, map_user_avatar_url,
           map_tags, map_is_liked, map_is_bookmarked,
           spot_id, spot_user_id, spot_map_id, spot_master_spot_id, spot_machi_id, spot_description,
           spot_spot_color, spot_label_id, spot_name, spot_images_count, spot_likes_count,
           spot_bookmarks_count, spot_comments_count, spot_order_index, spot_latitude, spot_longitude,
           spot_google_formatted_address, spot_google_short_address, spot_is_public, spot_article_content,
           spot_master_spot_name, spot_master_spot_latitude, spot_master_spot_longitude,
           spot_master_spot_google_place_id, spot_master_spot_google_formatted_address,
           spot_master_spot_google_short_address, spot_master_spot_google_types,
           spot_user_username, spot_user_display_name, spot_user_avatar_url,
           spot_map_name, spot_map_is_public, spot_image_urls, spot_tags, spot_is_liked, spot_is_bookmarked
    FROM maps_with_position
    UNION ALL
    SELECT item_type, item_id, created_at, feed_position, ad_slot, spot_display_type,
           map_id, map_name, map_description, map_thumbnail_url, map_is_public, map_is_article_public,
           map_spots_count, map_likes_count, map_bookmarks_count, map_comments_count, map_category_id,
           map_language, map_user_id, map_user_username, map_user_display_name, map_user_avatar_url,
           map_tags, map_is_liked, map_is_bookmarked,
           spot_id, spot_user_id, spot_map_id, spot_master_spot_id, spot_machi_id, spot_description,
           spot_spot_color, spot_label_id, spot_name, spot_images_count, spot_likes_count,
           spot_bookmarks_count, spot_comments_count, spot_order_index, spot_latitude, spot_longitude,
           spot_google_formatted_address, spot_google_short_address, spot_is_public, spot_article_content,
           spot_master_spot_name, spot_master_spot_latitude, spot_master_spot_longitude,
           spot_master_spot_google_place_id, spot_master_spot_google_formatted_address,
           spot_master_spot_google_short_address, spot_master_spot_google_types,
           spot_user_username, spot_user_display_name, spot_user_avatar_url,
           spot_map_name, spot_map_is_public, spot_image_urls, spot_tags, spot_is_liked, spot_is_bookmarked
    FROM spots_with_position
    UNION ALL
    SELECT * FROM ad_slots
  )

  SELECT
    item_type, item_id, created_at, feed_position, ad_slot, spot_display_type,
    map_id, map_name, map_description, map_thumbnail_url, map_is_public, map_is_article_public,
    map_spots_count, map_likes_count, map_bookmarks_count, map_comments_count, map_category_id,
    map_language, map_user_id, map_user_username, map_user_display_name, map_user_avatar_url,
    map_tags, map_is_liked, map_is_bookmarked,
    spot_id, spot_user_id, spot_map_id, spot_master_spot_id, spot_machi_id, spot_description,
    spot_spot_color, spot_label_id, spot_name, spot_images_count, spot_likes_count,
    spot_bookmarks_count, spot_comments_count, spot_order_index, spot_latitude, spot_longitude,
    spot_google_formatted_address, spot_google_short_address, spot_is_public, spot_article_content,
    spot_master_spot_name, spot_master_spot_latitude, spot_master_spot_longitude,
    spot_master_spot_google_place_id, spot_master_spot_google_formatted_address,
    spot_master_spot_google_short_address, spot_master_spot_google_types,
    spot_user_username, spot_user_display_name, spot_user_avatar_url,
    spot_map_name, spot_map_is_public, spot_image_urls, spot_tags, spot_is_liked, spot_is_bookmarked
  FROM combined
  ORDER BY feed_position;
END;
$$;

COMMENT ON FUNCTION public.get_following_mixed_feed IS 'フォロー中ユーザーの混合フィード - 配置: map4 → spot4 繰り返し。spot_display_type はブロックごとに short → card と交互に切り替え';

-- 実行権限を付与
GRANT EXECUTE ON FUNCTION public.generate_feed_ad_slots TO anon;
GRANT EXECUTE ON FUNCTION public.generate_feed_ad_slots TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_mixed_feed TO anon;
GRANT EXECUTE ON FUNCTION public.get_mixed_feed TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_following_mixed_feed TO authenticated;

-- ============================================================
-- 混合フィードV2: map5 → spot5 配置 + SpotShort対応
-- ============================================================
-- 配置パターン（1ブロック = 10アイテム）:
--   map1-2 → feed_native広告 → map3-4 → spot1-2 → carousel_video広告 → spot3-4
-- feed_positionでフィード全体の順序を管理（無限スクロール対応）
-- 広告スロット: feed_native（ネイティブ広告）、carousel_video（カルーセル内動画広告）
-- spot_display_type: 'card'（通常SpotCard）または 'short'（SpotShortCard）
-- ABテスト対応: RPCパラメータでspot_display_typeを切り替え可能
-- 各spot5枚セクションは全て同じdisplay_type（混在なし）
-- 最終更新: 2026-01-20

-- ===============================
-- 型定義の更新（spot_display_type追加）
-- ===============================

-- 既存の型を削除して再作成
DROP TYPE IF EXISTS public.mixed_feed_item_v2 CASCADE;

CREATE TYPE public.mixed_feed_item_v2 AS (
  -- 共通フィールド
  item_type TEXT,              -- 'map', 'spot', 'ad'
  item_id UUID,
  created_at TIMESTAMPTZ,
  feed_position INT,           -- フィード内での位置（累積、無限スクロール対応）

  -- 広告用フィールド
  ad_slot TEXT,                -- 広告スロット名: 'feed_native', 'carousel_video'

  -- スポット表示タイプ（ABテスト用）
  spot_display_type TEXT,      -- 'card' または 'short'

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

-- ===============================
-- 広告スロット生成用ヘルパー関数 V2
-- ===============================
-- 配置: map1-2 → [feed_native] → map3-4 → spot1-2 → [carousel_video] → spot3-4
-- 1ブロック = 10アイテム
-- 位置: map1=1, map2=2, feed_native=3, map3=4, map4=5, spot1=6, spot2=7, carousel_video=8, spot3=9, spot4=10

DROP FUNCTION IF EXISTS public.generate_feed_ad_slots_v2(INT, INT);

CREATE OR REPLACE FUNCTION public.generate_feed_ad_slots_v2(
  p_start_position INT,
  p_block_count INT
)
RETURNS SETOF public.mixed_feed_item_v2
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

COMMENT ON FUNCTION public.generate_feed_ad_slots_v2 IS '混合フィードV2用広告スロット生成（feed_native + carousel_video）';

-- ===============================
-- RPC関数V2（おすすめ用）
-- ===============================
-- 配置: map1-2 → feed_native → map3-4 → spot1-2 → carousel_video → spot3-4 → 繰り返し
-- 1ブロック = 10アイテム（map4 + ad1 + spot4 + ad1）

DROP FUNCTION IF EXISTS public.get_mixed_feed_v2(INT, INT, TIMESTAMPTZ, TIMESTAMPTZ, UUID, BOOLEAN, INT, TEXT);

CREATE OR REPLACE FUNCTION public.get_mixed_feed_v2(
  p_map_limit INT DEFAULT 4,
  p_spot_limit INT DEFAULT 4,
  p_map_cursor TIMESTAMPTZ DEFAULT NULL,
  p_spot_cursor TIMESTAMPTZ DEFAULT NULL,
  p_current_user_id UUID DEFAULT NULL,
  p_show_ads BOOLEAN DEFAULT TRUE,
  p_start_position INT DEFAULT 0,
  p_spot_display_type TEXT DEFAULT 'card'  -- 'card' または 'short'
)
RETURNS SETOF public.mixed_feed_item_v2
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  -- 1ブロック = map4 + spot4 (+ 広告2)
  v_maps_per_block INT := 4;
  v_spots_per_block INT := 4;
  v_items_per_block INT := 10;  -- 広告込み
  v_items_per_block_no_ads INT := 8;  -- 広告なし
BEGIN
  RETURN QUERY
  WITH
  -- 公開マップを取得（p_map_limit件）
  maps_cte AS (
    SELECT
      'map'::TEXT AS item_type,
      m.id AS item_id,
      m.created_at,
      ROW_NUMBER() OVER (ORDER BY m.created_at DESC) AS row_num,
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

  -- 公開スポットを取得（p_spot_limit件）
  spots_cte AS (
    SELECT
      'spot'::TEXT AS item_type,
      s.id AS item_id,
      s.created_at,
      ROW_NUMBER() OVER (ORDER BY s.created_at DESC) AS row_num,
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
  -- 配置: map1=1, map2=2, [feed_native=3], map3=4, map4=5, spot1=6, spot2=7, [carousel_video=8], spot3=9, spot4=10
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
        -- map3,map4(pos_in_block >= 2)はfeed_native広告の後なので+1
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
      -- スポット用フィールドはNULL
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
  -- 配置: spot1=6, spot2=7, [carousel_video=8], spot3=9, spot4=10
  spots_with_position AS (
    SELECT
      item_type, item_id, created_at,
      p_spot_display_type AS spot_display_type,
      ((row_num - 1) / v_spots_per_block)::INT AS block_num,
      ((row_num - 1) % v_spots_per_block)::INT AS pos_in_block,
      CASE WHEN p_show_ads THEN
        p_start_position +
        ((row_num - 1) / v_spots_per_block)::INT * v_items_per_block +
        5 +  -- map4 + feed_native の後
        ((row_num - 1) % v_spots_per_block)::INT + 1 +
        -- spot3,spot4(pos_in_block >= 2)はcarousel_video広告の後なので+1
        CASE WHEN ((row_num - 1) % v_spots_per_block)::INT >= 2 THEN 1 ELSE 0 END
      ELSE
        p_start_position +
        ((row_num - 1) / v_spots_per_block)::INT * v_items_per_block_no_ads +
        4 +  -- map4 の後
        ((row_num - 1) % v_spots_per_block)::INT + 1
      END AS feed_position,
      NULL::TEXT AS ad_slot,
      -- マップ用フィールドはNULL
      NULL::UUID AS map_id, NULL::TEXT AS map_name, NULL::TEXT AS map_description,
      NULL::TEXT AS map_thumbnail_url, NULL::BOOLEAN AS map_is_public, NULL::BOOLEAN AS map_is_article_public,
      NULL::INT AS map_spots_count, NULL::INT AS map_likes_count, NULL::INT AS map_bookmarks_count,
      NULL::INT AS map_comments_count, NULL::TEXT AS map_category_id, NULL::VARCHAR(10) AS map_language,
      NULL::UUID AS map_user_id, NULL::TEXT AS map_user_username, NULL::TEXT AS map_user_display_name,
      NULL::TEXT AS map_user_avatar_url, NULL::JSONB AS map_tags,
      NULL::BOOLEAN AS map_is_liked, NULL::BOOLEAN AS map_is_bookmarked,
      -- スポットフィールド
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

  -- 広告スロットを生成（ヘルパー関数を使用）
  ad_slots AS (
    SELECT * FROM generate_feed_ad_slots_v2(
      p_start_position,
      GREATEST((p_map_limit / v_maps_per_block), 1)
    )
    WHERE p_show_ads = TRUE
  ),

  -- 全て結合
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

COMMENT ON FUNCTION public.get_mixed_feed_v2 IS '混合フィードV2 - 配置: map2 → feed_native → map2 → spot2 → carousel_video → spot2 → 繰り返し。p_spot_display_type で card/short 切り替え可能（ABテスト対応）';

-- ===============================
-- RPC関数V2（フォロー中用）
-- ===============================

DROP FUNCTION IF EXISTS public.get_following_mixed_feed_v2(UUID, INT, INT, TIMESTAMPTZ, TIMESTAMPTZ, BOOLEAN, INT, TEXT);

CREATE OR REPLACE FUNCTION public.get_following_mixed_feed_v2(
  p_user_id UUID,
  p_map_limit INT DEFAULT 4,
  p_spot_limit INT DEFAULT 4,
  p_map_cursor TIMESTAMPTZ DEFAULT NULL,
  p_spot_cursor TIMESTAMPTZ DEFAULT NULL,
  p_show_ads BOOLEAN DEFAULT TRUE,
  p_start_position INT DEFAULT 0,
  p_spot_display_type TEXT DEFAULT 'card'
)
RETURNS SETOF public.mixed_feed_item_v2
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
      p_spot_display_type AS spot_display_type,
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
    SELECT * FROM generate_feed_ad_slots_v2(
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

COMMENT ON FUNCTION public.get_following_mixed_feed_v2 IS 'フォロー中ユーザーの混合フィードV2 - 配置: map2 → feed_native → map2 → spot2 → carousel_video → spot2 → 繰り返し。p_spot_display_type で card/short 切り替え可能（ABテスト対応）';

-- 実行権限を付与
GRANT EXECUTE ON FUNCTION public.generate_feed_ad_slots_v2 TO anon;
GRANT EXECUTE ON FUNCTION public.generate_feed_ad_slots_v2 TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_mixed_feed_v2 TO anon;
GRANT EXECUTE ON FUNCTION public.get_mixed_feed_v2 TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_following_mixed_feed_v2 TO authenticated;

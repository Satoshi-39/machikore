-- RPC関数にthumbnail_crop関連フィールドを追加
-- 非破壊クロップのサムネイル表示に対応
--
-- 対象:
-- 1. mixed_feed_item composite type: map_thumbnail_crop, spot_thumbnail_image_id, spot_thumbnail_crop
-- 2. generate_feed_ad_slots: 新フィールド分のNULL追加
-- 3. get_mixed_feed: 新フィールドをSELECT
-- 4. get_following_mixed_feed: 新フィールドをSELECT
-- 5. search_public_maps: thumbnail_crop追加
-- 6. search_public_spots: thumbnail_image_id, thumbnail_crop追加

-- ============================================================
-- 0a. maps_public VIEWにthumbnail_cropを追加
--     get_mixed_feedがこのVIEW経由でmapsを参照するため必要
-- ============================================================

DROP VIEW IF EXISTS "public"."maps_public";

CREATE VIEW "public"."maps_public" AS
SELECT "id",
    "user_id",
    "name",
    "description",
    "thumbnail_url",
    "thumbnail_crop",
    "is_public",
    "is_official",
    "show_label_chips",
    "category_id",
    "language",
    "created_at",
    "updated_at",
    "likes_count",
    "comments_count",
    "bookmarks_count",
    "article_intro",
    "article_outro",
    ( SELECT ("count"(*))::integer AS "count"
           FROM "public"."user_spots" "us"
          WHERE (("us"."map_id" = "m"."id") AND ("us"."is_public" = true))) AS "spots_count"
   FROM "public"."maps" "m"
  WHERE ("is_public" = true);

ALTER VIEW "public"."maps_public" OWNER TO "postgres";

COMMENT ON VIEW "public"."maps_public" IS '公開マップ一覧（spots_countは公開スポット数のみ）';

-- ============================================================
-- 0b. RETURNS TABLEが変わる関数は先にDROPが必要
-- ============================================================

DROP FUNCTION IF EXISTS "public"."search_public_spots"("text", integer, "text", "text", "uuid"[], "text", "text");
DROP FUNCTION IF EXISTS "public"."search_public_maps"("text", integer, "uuid"[], "text", "text", "text");

-- ============================================================
-- 1. mixed_feed_item composite type に3属性を追加
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_attribute a
    JOIN pg_type t ON a.attrelid = t.typrelid
    WHERE t.typname = 'mixed_feed_item' AND a.attname = 'map_thumbnail_crop'
  ) THEN
    ALTER TYPE "public"."mixed_feed_item" ADD ATTRIBUTE "map_thumbnail_crop" jsonb;
    ALTER TYPE "public"."mixed_feed_item" ADD ATTRIBUTE "spot_thumbnail_image_id" uuid;
    ALTER TYPE "public"."mixed_feed_item" ADD ATTRIBUTE "spot_thumbnail_crop" jsonb;
  END IF;
END $$;

-- ============================================================
-- 2. generate_feed_ad_slots: 新フィールド分のNULL追加
-- ============================================================

CREATE OR REPLACE FUNCTION "public"."generate_feed_ad_slots"("p_start_position" integer DEFAULT 0, "p_num_blocks" integer DEFAULT 1) RETURNS SETOF "public"."mixed_feed_item"
    LANGUAGE "plpgsql" STABLE
    AS $$
DECLARE
  v_items_per_block INT := 10;
  v_block INT;
  v_ad_position_1 INT;
  v_ad_position_2 INT;
BEGIN
  FOR v_block IN 0..(p_num_blocks - 1) LOOP
    v_ad_position_1 := p_start_position + v_block * v_items_per_block + 3;
    v_ad_position_2 := p_start_position + v_block * v_items_per_block + 8;

    -- マップの後に表示するネイティブ広告
    RETURN NEXT (
      'ad'::TEXT,
      NULL::UUID,
      NULL::TIMESTAMPTZ,
      v_ad_position_1,
      'feed_native',
      NULL::TEXT,
      NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::BOOLEAN,
      NULL::INT, NULL::INT, NULL::INT, NULL::INT, NULL::TEXT, NULL::VARCHAR(10),
      NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::JSONB,
      NULL::BOOLEAN, NULL::BOOLEAN,
      NULL::UUID, NULL::UUID, NULL::UUID, NULL::UUID, NULL::TEXT, NULL::TEXT,
      NULL::TEXT, NULL::UUID, NULL::JSONB, NULL::INT, NULL::INT, NULL::INT,
      NULL::INT, NULL::INT, NULL::DOUBLE PRECISION, NULL::DOUBLE PRECISION,
      NULL::JSONB, NULL::JSONB, NULL::BOOLEAN, NULL::JSONB,
      NULL::JSONB, NULL::DOUBLE PRECISION, NULL::DOUBLE PRECISION, NULL::TEXT,
      NULL::JSONB, NULL::JSONB, NULL::TEXT[],
      NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::BOOLEAN,
      NULL::JSONB, NULL::JSONB, NULL::BOOLEAN, NULL::BOOLEAN,
      NULL::TEXT,
      NULL::JSONB, NULL::UUID, NULL::JSONB
    )::public.mixed_feed_item;

    -- スポットカルーセル内に表示する動画広告
    RETURN NEXT (
      'ad'::TEXT,
      NULL::UUID,
      NULL::TIMESTAMPTZ,
      v_ad_position_2,
      'carousel_video',
      NULL::TEXT,
      NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::BOOLEAN,
      NULL::INT, NULL::INT, NULL::INT, NULL::INT, NULL::TEXT, NULL::VARCHAR(10),
      NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::JSONB,
      NULL::BOOLEAN, NULL::BOOLEAN,
      NULL::UUID, NULL::UUID, NULL::UUID, NULL::UUID, NULL::TEXT, NULL::TEXT,
      NULL::TEXT, NULL::UUID, NULL::JSONB, NULL::INT, NULL::INT, NULL::INT,
      NULL::INT, NULL::INT, NULL::DOUBLE PRECISION, NULL::DOUBLE PRECISION,
      NULL::JSONB, NULL::JSONB, NULL::BOOLEAN, NULL::JSONB,
      NULL::JSONB, NULL::DOUBLE PRECISION, NULL::DOUBLE PRECISION, NULL::TEXT,
      NULL::JSONB, NULL::JSONB, NULL::TEXT[],
      NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::BOOLEAN,
      NULL::JSONB, NULL::JSONB, NULL::BOOLEAN, NULL::BOOLEAN,
      NULL::TEXT,
      NULL::JSONB, NULL::UUID, NULL::JSONB
    )::public.mixed_feed_item;
  END LOOP;
END;
$$;

-- ============================================================
-- 3. get_following_mixed_feed: 新フィールドをSELECT
-- ============================================================

CREATE OR REPLACE FUNCTION "public"."get_following_mixed_feed"("p_user_id" "uuid", "p_map_limit" integer DEFAULT 20, "p_spot_limit" integer DEFAULT 20, "p_map_cursor" timestamp with time zone DEFAULT NULL::timestamp with time zone, "p_spot_cursor" timestamp with time zone DEFAULT NULL::timestamp with time zone, "p_show_ads" boolean DEFAULT true, "p_start_position" integer DEFAULT 0, "p_enable_shorts" boolean DEFAULT false) RETURNS SETOF "public"."mixed_feed_item"
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
DECLARE
  v_maps_per_block INT := 4;
  v_spots_per_block INT := 4;
  v_items_per_block INT := 10;
  v_items_per_block_no_ads INT := 8;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  WITH
  following_users AS (
    SELECT followee_id FROM follows WHERE follower_id = p_user_id
  ),

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
      EXISTS (SELECT 1 FROM bookmarks b WHERE b.map_id = m.id AND b.user_id = p_user_id) AS map_is_bookmarked,
      m.thumbnail_crop AS map_thumbnail_crop
    FROM maps m
    JOIN following_users fu ON m.user_id = fu.followee_id
    LEFT JOIN users u ON u.id = m.user_id
    WHERE m.is_public = true
      AND (p_map_cursor IS NULL OR m.created_at < p_map_cursor)
    ORDER BY m.created_at DESC
    LIMIT p_map_limit
  ),

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
      EXISTS (SELECT 1 FROM bookmarks b WHERE b.user_spot_id = s.id AND b.user_id = p_user_id) AS spot_is_bookmarked,
      (SELECT sv.video_url
       FROM spot_shorts sv
       WHERE sv.spot_id = s.id
       ORDER BY sv.order_index
       LIMIT 1) AS spot_video_url,
      s.thumbnail_image_id AS spot_thumbnail_image_id,
      s.thumbnail_crop AS spot_thumbnail_crop
    FROM user_spots s
    JOIN following_users fu ON s.user_id = fu.followee_id
    INNER JOIN maps mp ON mp.id = s.map_id AND mp.is_public = true
    LEFT JOIN master_spots ms ON ms.id = s.master_spot_id
    LEFT JOIN users u ON u.id = s.user_id
    WHERE s.is_public = true
      AND (p_spot_cursor IS NULL OR s.created_at < p_spot_cursor)
    ORDER BY s.created_at DESC
    LIMIT p_spot_limit
  ),

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
      map_id, map_name, map_description, map_thumbnail_url, map_is_public,
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
      NULL::BOOLEAN AS spot_is_liked, NULL::BOOLEAN AS spot_is_bookmarked,
      NULL::TEXT AS spot_video_url,
      map_thumbnail_crop,
      NULL::UUID AS spot_thumbnail_image_id, NULL::JSONB AS spot_thumbnail_crop
    FROM maps_cte
  ),

  spots_with_position AS (
    SELECT
      item_type, item_id, created_at,
      CASE WHEN p_enable_shorts THEN
        CASE WHEN ((p_start_position / v_items_per_block) + ((row_num - 1) / v_spots_per_block)::INT) % 2 = 0
          THEN 'short'::TEXT
          ELSE 'card'::TEXT
        END
      ELSE
        'card'::TEXT
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
      NULL::TEXT AS map_thumbnail_url, NULL::BOOLEAN AS map_is_public,
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
      spot_map_name, spot_map_is_public, spot_image_urls, spot_tags, spot_is_liked, spot_is_bookmarked,
      spot_video_url,
      NULL::JSONB AS map_thumbnail_crop,
      spot_thumbnail_image_id, spot_thumbnail_crop
    FROM spots_cte
  ),

  ad_slots AS (
    SELECT * FROM generate_feed_ad_slots(
      p_start_position,
      GREATEST((p_map_limit / v_maps_per_block), 1)
    )
    WHERE p_show_ads = TRUE
  ),

  combined AS (
    SELECT item_type, item_id, created_at, feed_position, ad_slot, spot_display_type,
           map_id, map_name, map_description, map_thumbnail_url, map_is_public,
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
           spot_map_name, spot_map_is_public, spot_image_urls, spot_tags, spot_is_liked, spot_is_bookmarked,
           spot_video_url,
           map_thumbnail_crop, spot_thumbnail_image_id, spot_thumbnail_crop
    FROM maps_with_position
    UNION ALL
    SELECT item_type, item_id, created_at, feed_position, ad_slot, spot_display_type,
           map_id, map_name, map_description, map_thumbnail_url, map_is_public,
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
           spot_map_name, spot_map_is_public, spot_image_urls, spot_tags, spot_is_liked, spot_is_bookmarked,
           spot_video_url,
           map_thumbnail_crop, spot_thumbnail_image_id, spot_thumbnail_crop
    FROM spots_with_position
    UNION ALL
    SELECT * FROM ad_slots
  )

  SELECT
    c.item_type,
    c.item_id,
    c.created_at,
    c.feed_position,
    c.ad_slot,
    c.spot_display_type,
    c.map_id, c.map_name, c.map_description, c.map_thumbnail_url, c.map_is_public,
    c.map_spots_count, c.map_likes_count, c.map_bookmarks_count, c.map_comments_count, c.map_category_id,
    c.map_language, c.map_user_id, c.map_user_username, c.map_user_display_name, c.map_user_avatar_url,
    c.map_tags, c.map_is_liked, c.map_is_bookmarked,
    c.spot_id, c.spot_user_id, c.spot_map_id, c.spot_master_spot_id, c.spot_machi_id, c.spot_description,
    c.spot_spot_color, c.spot_label_id, c.spot_name, c.spot_images_count, c.spot_likes_count,
    c.spot_bookmarks_count, c.spot_comments_count, c.spot_order_index, c.spot_latitude, c.spot_longitude,
    c.spot_google_formatted_address, c.spot_google_short_address, c.spot_is_public, c.spot_article_content,
    c.spot_master_spot_name, c.spot_master_spot_latitude, c.spot_master_spot_longitude,
    c.spot_master_spot_google_place_id, c.spot_master_spot_google_formatted_address,
    c.spot_master_spot_google_short_address, c.spot_master_spot_google_types,
    c.spot_user_username, c.spot_user_display_name, c.spot_user_avatar_url,
    c.spot_map_name, c.spot_map_is_public, c.spot_image_urls, c.spot_tags, c.spot_is_liked, c.spot_is_bookmarked,
    c.spot_video_url,
    c.map_thumbnail_crop, c.spot_thumbnail_image_id, c.spot_thumbnail_crop
  FROM combined c
  ORDER BY c.feed_position;
END;
$$;

-- ============================================================
-- 4. get_mixed_feed: 新フィールドをSELECT
-- ============================================================

CREATE OR REPLACE FUNCTION "public"."get_mixed_feed"("p_map_limit" integer DEFAULT 20, "p_spot_limit" integer DEFAULT 20, "p_map_cursor" timestamp with time zone DEFAULT NULL::timestamp with time zone, "p_spot_cursor" timestamp with time zone DEFAULT NULL::timestamp with time zone, "p_current_user_id" "uuid" DEFAULT NULL::"uuid", "p_show_ads" boolean DEFAULT true, "p_start_position" integer DEFAULT 0, "p_enable_shorts" boolean DEFAULT false) RETURNS SETOF "public"."mixed_feed_item"
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
DECLARE
  v_maps_per_block INT := 4;
  v_spots_per_block INT := 4;
  v_items_per_block INT := 10;
  v_items_per_block_no_ads INT := 8;
BEGIN
  RETURN QUERY
  WITH
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
      ELSE false END AS map_is_bookmarked,
      m.thumbnail_crop AS map_thumbnail_crop
    FROM maps_public m
    LEFT JOIN users u ON u.id = m.user_id
    WHERE (p_map_cursor IS NULL OR m.created_at < p_map_cursor)
    ORDER BY m.created_at DESC
    LIMIT p_map_limit
  ),

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
      ELSE false END AS spot_is_bookmarked,
      (SELECT sv.video_url
       FROM spot_shorts sv
       WHERE sv.spot_id = s.id
       ORDER BY sv.order_index
       LIMIT 1) AS spot_video_url,
      s.thumbnail_image_id AS spot_thumbnail_image_id,
      s.thumbnail_crop AS spot_thumbnail_crop
    FROM user_spots s
    INNER JOIN maps mp ON mp.id = s.map_id AND mp.is_public = true
    LEFT JOIN master_spots ms ON ms.id = s.master_spot_id
    LEFT JOIN users u ON u.id = s.user_id
    WHERE s.is_public = true
      AND (p_spot_cursor IS NULL OR s.created_at < p_spot_cursor)
    ORDER BY s.created_at DESC
    LIMIT p_spot_limit
  ),

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
      map_id, map_name, map_description, map_thumbnail_url, map_is_public,
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
      NULL::BOOLEAN AS spot_is_liked, NULL::BOOLEAN AS spot_is_bookmarked,
      NULL::TEXT AS spot_video_url,
      map_thumbnail_crop,
      NULL::UUID AS spot_thumbnail_image_id, NULL::JSONB AS spot_thumbnail_crop
    FROM maps_cte
  ),

  spots_with_position AS (
    SELECT
      item_type, item_id, created_at,
      CASE WHEN p_enable_shorts THEN
        CASE WHEN ((p_start_position / v_items_per_block) + ((row_num - 1) / v_spots_per_block)::INT) % 2 = 0
          THEN 'short'::TEXT
          ELSE 'card'::TEXT
        END
      ELSE
        'card'::TEXT
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
      NULL::TEXT AS map_thumbnail_url, NULL::BOOLEAN AS map_is_public,
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
      spot_map_name, spot_map_is_public, spot_image_urls, spot_tags, spot_is_liked, spot_is_bookmarked,
      spot_video_url,
      NULL::JSONB AS map_thumbnail_crop,
      spot_thumbnail_image_id, spot_thumbnail_crop
    FROM spots_cte
  ),

  ad_slots AS (
    SELECT * FROM generate_feed_ad_slots(
      p_start_position,
      GREATEST((p_map_limit / v_maps_per_block), 1)
    )
    WHERE p_show_ads = TRUE
  ),

  combined AS (
    SELECT item_type, item_id, created_at, feed_position, ad_slot, spot_display_type,
           map_id, map_name, map_description, map_thumbnail_url, map_is_public,
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
           spot_map_name, spot_map_is_public, spot_image_urls, spot_tags, spot_is_liked, spot_is_bookmarked,
           spot_video_url,
           map_thumbnail_crop, spot_thumbnail_image_id, spot_thumbnail_crop
    FROM maps_with_position
    UNION ALL
    SELECT item_type, item_id, created_at, feed_position, ad_slot, spot_display_type,
           map_id, map_name, map_description, map_thumbnail_url, map_is_public,
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
           spot_map_name, spot_map_is_public, spot_image_urls, spot_tags, spot_is_liked, spot_is_bookmarked,
           spot_video_url,
           map_thumbnail_crop, spot_thumbnail_image_id, spot_thumbnail_crop
    FROM spots_with_position
    UNION ALL
    SELECT * FROM ad_slots
  )

  SELECT
    c.item_type,
    c.item_id,
    c.created_at,
    c.feed_position,
    c.ad_slot,
    c.spot_display_type,
    c.map_id, c.map_name, c.map_description, c.map_thumbnail_url, c.map_is_public,
    c.map_spots_count, c.map_likes_count, c.map_bookmarks_count, c.map_comments_count, c.map_category_id,
    c.map_language, c.map_user_id, c.map_user_username, c.map_user_display_name, c.map_user_avatar_url,
    c.map_tags, c.map_is_liked, c.map_is_bookmarked,
    c.spot_id, c.spot_user_id, c.spot_map_id, c.spot_master_spot_id, c.spot_machi_id, c.spot_description,
    c.spot_spot_color, c.spot_label_id, c.spot_name, c.spot_images_count, c.spot_likes_count,
    c.spot_bookmarks_count, c.spot_comments_count, c.spot_order_index, c.spot_latitude, c.spot_longitude,
    c.spot_google_formatted_address, c.spot_google_short_address, c.spot_is_public, c.spot_article_content,
    c.spot_master_spot_name, c.spot_master_spot_latitude, c.spot_master_spot_longitude,
    c.spot_master_spot_google_place_id, c.spot_master_spot_google_formatted_address,
    c.spot_master_spot_google_short_address, c.spot_master_spot_google_types,
    c.spot_user_username, c.spot_user_display_name, c.spot_user_avatar_url,
    c.spot_map_name, c.spot_map_is_public, c.spot_image_urls, c.spot_tags, c.spot_is_liked, c.spot_is_bookmarked,
    c.spot_video_url,
    c.map_thumbnail_crop, c.spot_thumbnail_image_id, c.spot_thumbnail_crop
  FROM combined c
  ORDER BY c.feed_position;
END;
$$;

-- ============================================================
-- 5. search_public_maps: thumbnail_crop追加
-- ============================================================

CREATE OR REPLACE FUNCTION "public"."search_public_maps"("search_query" "text" DEFAULT NULL::"text", "result_limit" integer DEFAULT 30, "tag_ids_filter" "uuid"[] DEFAULT NULL::"uuid"[], "sort_by" "text" DEFAULT 'created_at'::"text", "date_range" "text" DEFAULT 'all'::"text", "region_text" "text" DEFAULT NULL::"text") RETURNS TABLE("id" "uuid", "user_id" "uuid", "name" "text", "description" "text", "thumbnail_url" "text", "thumbnail_crop" "jsonb", "is_public" boolean, "is_official" boolean, "show_label_chips" boolean, "category_id" "text", "language" character varying, "created_at" timestamp with time zone, "updated_at" timestamp with time zone, "spots_count" integer, "public_spots_count" integer, "likes_count" integer, "comments_count" integer, "bookmarks_count" integer, "article_intro" "jsonb", "article_outro" "jsonb", "user_username" "text", "user_display_name" "text", "user_avatar_url" "text", "tags" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  date_filter TIMESTAMPTZ;
BEGIN
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
    m.thumbnail_crop,
    m.is_public,
    m.is_official,
    m.show_label_chips,
    m.category_id,
    m.language,
    m.created_at,
    m.updated_at,
    m.spots_count,
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
    AND (
      tag_ids_filter IS NULL
      OR EXISTS (
        SELECT 1 FROM map_tags mt
        WHERE mt.map_id = m.id AND mt.tag_id = ANY(tag_ids_filter)
      )
    )
    AND (date_filter IS NULL OR m.created_at >= date_filter)
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

COMMENT ON FUNCTION "public"."search_public_maps" IS '公開マップ検索。フィルター: タグ、期間、地域テキスト。並び替え: created_at / likes_count';

-- ============================================================
-- 6. search_public_spots: thumbnail_image_id, thumbnail_crop追加
-- ============================================================

CREATE OR REPLACE FUNCTION "public"."search_public_spots"(
  "search_query" "text" DEFAULT NULL,
  "result_limit" integer DEFAULT 30,
  "prefecture_id_filter" "text" DEFAULT NULL,
  "city_id_filter" "text" DEFAULT NULL,
  "tag_ids_filter" "uuid"[] DEFAULT NULL,
  "sort_by" "text" DEFAULT 'created_at',
  "date_range" "text" DEFAULT 'all'
)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  map_id uuid,
  master_spot_id uuid,
  machi_id text,
  name jsonb,
  description text,
  spot_color text,
  label_id uuid,
  images_count integer,
  likes_count integer,
  comments_count integer,
  order_index integer,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  latitude double precision,
  longitude double precision,
  google_formatted_address jsonb,
  google_short_address jsonb,
  is_public boolean,
  prefecture_id text,
  city_id text,
  master_spot_name jsonb,
  master_spot_latitude double precision,
  master_spot_longitude double precision,
  master_spot_google_place_id text,
  master_spot_google_formatted_address jsonb,
  master_spot_google_short_address jsonb,
  master_spot_google_types text[],
  label_name text,
  label_color text,
  user_username text,
  user_display_name text,
  user_avatar_url text,
  map_name text,
  map_public_spots_count integer,
  tags jsonb,
  article_content jsonb,
  image_urls text[],
  thumbnail_image_id uuid,
  thumbnail_crop jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  date_filter TIMESTAMPTZ;
BEGIN
  date_filter := CASE date_range
    WHEN 'day' THEN now() - INTERVAL '1 day'
    WHEN 'week' THEN now() - INTERVAL '7 days'
    WHEN 'month' THEN now() - INTERVAL '30 days'
    ELSE NULL
  END;

  RETURN QUERY
  WITH filtered_spots AS (
    SELECT
      us.id,
      us.user_id,
      us.map_id,
      us.master_spot_id,
      us.machi_id,
      us.name,
      us.description,
      us.spot_color,
      us.label_id,
      us.images_count,
      us.likes_count,
      us.comments_count,
      us.order_index,
      us.created_at,
      us.updated_at,
      us.latitude,
      us.longitude,
      us.google_formatted_address,
      us.google_short_address,
      us.is_public,
      us.prefecture_id,
      us.city_id,
      ms.name AS master_spot_name,
      ms.latitude AS master_spot_latitude,
      ms.longitude AS master_spot_longitude,
      ms.google_place_id AS master_spot_google_place_id,
      ms.google_formatted_address AS master_spot_google_formatted_address,
      ms.google_short_address AS master_spot_google_short_address,
      ms.google_types AS master_spot_google_types,
      ml.name AS label_name,
      ml.color AS label_color,
      u.username AS user_username,
      u.display_name AS user_display_name,
      u.avatar_url AS user_avatar_url,
      m.name AS map_name,
      (SELECT COUNT(*)::INTEGER FROM user_spots sub_us WHERE sub_us.map_id = m.id AND sub_us.is_public = true) AS map_public_spots_count,
      us.article_content,
      us.thumbnail_image_id,
      us.thumbnail_crop
    FROM user_spots us
    INNER JOIN maps m ON m.id = us.map_id AND m.is_public = true
    LEFT JOIN master_spots ms ON ms.id = us.master_spot_id
    LEFT JOIN map_labels ml ON ml.id = us.label_id
    LEFT JOIN users u ON u.id = us.user_id
    WHERE
      us.is_public = true
      AND (
        search_query IS NULL
        OR search_query = ''
        OR (
          us.description ILIKE '%' || search_query || '%'
          OR (ms.name IS NOT NULL AND ms.name::text ILIKE '%' || search_query || '%')
          OR (us.master_spot_id IS NULL AND us.name IS NOT NULL AND us.name::text ILIKE '%' || search_query || '%')
        )
      )
      AND (prefecture_id_filter IS NULL OR us.prefecture_id = prefecture_id_filter)
      AND (city_id_filter IS NULL OR us.city_id = city_id_filter)
      AND (
        tag_ids_filter IS NULL
        OR EXISTS (
          SELECT 1 FROM spot_tags st
          WHERE st.user_spot_id = us.id
            AND st.tag_id = ANY(tag_ids_filter)
        )
      )
      AND (date_filter IS NULL OR us.created_at >= date_filter)
    ORDER BY
      CASE WHEN sort_by = 'likes_count' THEN us.likes_count ELSE 0 END DESC,
      us.created_at DESC
    LIMIT result_limit
  )
  SELECT
    fs.id, fs.user_id, fs.map_id, fs.master_spot_id, fs.machi_id, fs.name,
    fs.description, fs.spot_color, fs.label_id, fs.images_count, fs.likes_count,
    fs.comments_count, fs.order_index, fs.created_at, fs.updated_at,
    fs.latitude, fs.longitude, fs.google_formatted_address, fs.google_short_address,
    fs.is_public, fs.prefecture_id, fs.city_id,
    fs.master_spot_name, fs.master_spot_latitude, fs.master_spot_longitude,
    fs.master_spot_google_place_id, fs.master_spot_google_formatted_address,
    fs.master_spot_google_short_address, fs.master_spot_google_types,
    fs.label_name, fs.label_color,
    fs.user_username, fs.user_display_name, fs.user_avatar_url,
    fs.map_name, fs.map_public_spots_count,
    COALESCE(
      (
        SELECT jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
        FROM spot_tags st
        INNER JOIN tags t ON t.id = st.tag_id
        WHERE st.user_spot_id = fs.id
      ),
      '[]'::jsonb
    ) AS tags,
    fs.article_content,
    COALESCE(
      (
        SELECT ARRAY_AGG(img.cloud_path ORDER BY img.order_index)
        FROM images img
        WHERE img.user_spot_id = fs.id AND img.cloud_path IS NOT NULL
      ),
      ARRAY[]::TEXT[]
    ) AS image_urls,
    fs.thumbnail_image_id,
    fs.thumbnail_crop
  FROM filtered_spots fs;
END;
$$;

COMMENT ON FUNCTION "public"."search_public_spots" IS '公開スポット検索。フィルター: 都道府県、市区町村、タグ、期間。並び替え: created_at / likes_count';

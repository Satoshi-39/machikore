-- =============================================
-- 015: ユーザーブロック機能 & フィードフィルタ
-- =============================================
-- ブロック機能の追加と、フィードRPC関数にブロック・通報フィルタを追加

-- =============================================
-- 1. user_blocks テーブル
-- =============================================

CREATE TABLE IF NOT EXISTS "public"."user_blocks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "blocker_id" "uuid" NOT NULL,
    "blocked_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "user_blocks_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "user_blocks_blocker_blocked_unique" UNIQUE ("blocker_id", "blocked_id"),
    CONSTRAINT "user_blocks_no_self_block" CHECK ("blocker_id" <> "blocked_id"),
    CONSTRAINT "user_blocks_blocker_id_fkey" FOREIGN KEY ("blocker_id") REFERENCES "public"."users"("id") ON DELETE CASCADE,
    CONSTRAINT "user_blocks_blocked_id_fkey" FOREIGN KEY ("blocked_id") REFERENCES "public"."users"("id") ON DELETE CASCADE
);

ALTER TABLE "public"."user_blocks" ENABLE ROW LEVEL SECURITY;

-- インデックス
CREATE INDEX "idx_user_blocks_blocker_id" ON "public"."user_blocks" USING "btree" ("blocker_id");
CREATE INDEX "idx_user_blocks_blocked_id" ON "public"."user_blocks" USING "btree" ("blocked_id");

-- RLSポリシー
CREATE POLICY "user_blocks_select_own" ON "public"."user_blocks"
    FOR SELECT TO "authenticated"
    USING ("blocker_id" = (SELECT "auth"."uid"()));

CREATE POLICY "user_blocks_insert_own" ON "public"."user_blocks"
    FOR INSERT TO "authenticated"
    WITH CHECK ("blocker_id" = (SELECT "auth"."uid"()));

CREATE POLICY "user_blocks_delete_own" ON "public"."user_blocks"
    FOR DELETE TO "authenticated"
    USING ("blocker_id" = (SELECT "auth"."uid"()));

-- =============================================
-- 2. ブロック時フォロー自動解除トリガー
-- =============================================

CREATE OR REPLACE FUNCTION "public"."handle_user_block"()
RETURNS TRIGGER
LANGUAGE "plpgsql"
SECURITY DEFINER
AS $$
BEGIN
  -- 双方向のフォロー関係を削除
  DELETE FROM "public"."follows"
  WHERE ("follower_id" = NEW."blocker_id" AND "followee_id" = NEW."blocked_id")
     OR ("follower_id" = NEW."blocked_id" AND "followee_id" = NEW."blocker_id");

  RETURN NEW;
END;
$$;

CREATE TRIGGER "on_user_block"
    AFTER INSERT ON "public"."user_blocks"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."handle_user_block"();

-- =============================================
-- 3. get_following_mixed_feed にブロック・通報フィルタ追加
-- =============================================

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
  -- フォロー中のユーザーID一覧
  following_users AS (
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
    FROM maps m
    JOIN following_users fu ON m.user_id = fu.followee_id
    LEFT JOIN users u ON u.id = m.user_id
    WHERE m.is_public = true
      AND (p_map_cursor IS NULL OR m.created_at < p_map_cursor)
      -- ブロックユーザー除外
      AND NOT EXISTS (
        SELECT 1 FROM user_blocks ub
        WHERE ub.blocker_id = p_user_id AND ub.blocked_id = m.user_id
      )
      -- 通報済みマップ除外
      AND NOT EXISTS (
        SELECT 1 FROM reports r
        WHERE r.reporter_id = p_user_id AND r.target_type = 'map'
          AND r.target_id = m.id AND r.status IN ('pending', 'reviewing')
      )
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
      EXISTS (SELECT 1 FROM bookmarks b WHERE b.user_spot_id = s.id AND b.user_id = p_user_id) AS spot_is_bookmarked,
      (SELECT sv.video_url
       FROM spot_shorts sv
       WHERE sv.spot_id = s.id
       ORDER BY sv.order_index
       LIMIT 1) AS spot_video_url
    FROM user_spots s
    JOIN following_users fu ON s.user_id = fu.followee_id
    INNER JOIN maps mp ON mp.id = s.map_id AND mp.is_public = true
    LEFT JOIN master_spots ms ON ms.id = s.master_spot_id
    LEFT JOIN users u ON u.id = s.user_id
    WHERE s.is_public = true
      AND (p_spot_cursor IS NULL OR s.created_at < p_spot_cursor)
      -- ブロックユーザー除外
      AND NOT EXISTS (
        SELECT 1 FROM user_blocks ub
        WHERE ub.blocker_id = p_user_id AND ub.blocked_id = s.user_id
      )
      -- 通報済みスポット除外
      AND NOT EXISTS (
        SELECT 1 FROM reports r
        WHERE r.reporter_id = p_user_id AND r.target_type = 'spot'
          AND r.target_id = s.id AND r.status IN ('pending', 'reviewing')
      )
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
      NULL::TEXT AS spot_video_url
    FROM maps_cte
  ),

  -- スポットに位置番号を付与
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
      spot_video_url
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
           spot_video_url
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
           spot_video_url
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
    c.spot_video_url
  FROM combined c
  ORDER BY c.feed_position;
END;
$$;

-- =============================================
-- 4. get_mixed_feed にブロック・通報フィルタ追加
-- =============================================

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
      -- ブロックユーザー除外（未ログイン時はスキップ）
      AND (p_current_user_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM user_blocks ub
        WHERE ub.blocker_id = p_current_user_id AND ub.blocked_id = m.user_id
      ))
      -- 通報済みマップ除外（未ログイン時はスキップ）
      AND (p_current_user_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM reports r
        WHERE r.reporter_id = p_current_user_id AND r.target_type = 'map'
          AND r.target_id = m.id AND r.status IN ('pending', 'reviewing')
      ))
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
      ELSE false END AS spot_is_bookmarked,
      (SELECT sv.video_url
       FROM spot_shorts sv
       WHERE sv.spot_id = s.id
       ORDER BY sv.order_index
       LIMIT 1) AS spot_video_url
    FROM user_spots s
    INNER JOIN maps mp ON mp.id = s.map_id AND mp.is_public = true
    LEFT JOIN master_spots ms ON ms.id = s.master_spot_id
    LEFT JOIN users u ON u.id = s.user_id
    WHERE s.is_public = true
      AND (p_spot_cursor IS NULL OR s.created_at < p_spot_cursor)
      -- ブロックユーザー除外（未ログイン時はスキップ）
      AND (p_current_user_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM user_blocks ub
        WHERE ub.blocker_id = p_current_user_id AND ub.blocked_id = s.user_id
      ))
      -- 通報済みスポット除外（未ログイン時はスキップ）
      AND (p_current_user_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM reports r
        WHERE r.reporter_id = p_current_user_id AND r.target_type = 'spot'
          AND r.target_id = s.id AND r.status IN ('pending', 'reviewing')
      ))
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
      NULL::TEXT AS spot_video_url
    FROM maps_cte
  ),

  -- スポットに位置番号を付与
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
      spot_video_url
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
           spot_video_url
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
           spot_video_url
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
    c.spot_video_url
  FROM combined c
  ORDER BY c.feed_position;
END;
$$;

-- ============================================================
-- ブロック関係の強制: フォロー防止トリガー + 検索除外
-- ============================================================

-- ============================================================
-- 1. フォロー防止トリガー
-- follows テーブルに BEFORE INSERT トリガーを追加
-- 双方向のブロック関係をチェックし、存在する場合はINSERTを拒否
-- ============================================================

CREATE OR REPLACE FUNCTION public.prevent_blocked_follow()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.user_blocks
    WHERE (blocker_id = NEW.follower_id AND blocked_id = NEW.followee_id)
       OR (blocker_id = NEW.followee_id AND blocked_id = NEW.follower_id)
  ) THEN
    RAISE EXCEPTION 'Cannot follow: block relationship exists'
      USING ERRCODE = 'P0003';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_blocked_follow ON public.follows;
CREATE TRIGGER trg_prevent_blocked_follow
  BEFORE INSERT ON public.follows
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_blocked_follow();

-- ============================================================
-- 2. search_public_maps に p_current_user_id パラメータ追加
-- ブロック済みユーザーのマップを検索結果から除外
-- ============================================================

DROP FUNCTION IF EXISTS "public"."search_public_maps"("text", integer, "uuid"[], "text", "text", "text");

CREATE OR REPLACE FUNCTION "public"."search_public_maps"(
  "search_query" "text" DEFAULT NULL::"text",
  "result_limit" integer DEFAULT 30,
  "tag_ids_filter" "uuid"[] DEFAULT NULL::"uuid"[],
  "sort_by" "text" DEFAULT 'created_at'::"text",
  "date_range" "text" DEFAULT 'all'::"text",
  "region_text" "text" DEFAULT NULL::"text",
  "p_current_user_id" "uuid" DEFAULT NULL::"uuid"
)
RETURNS TABLE(
  "id" "uuid",
  "user_id" "uuid",
  "name" "text",
  "description" "text",
  "thumbnail_url" "text",
  "thumbnail_crop" "jsonb",
  "is_public" boolean,
  "is_official" boolean,
  "show_label_chips" boolean,
  "category_id" "text",
  "language" character varying,
  "created_at" timestamp with time zone,
  "updated_at" timestamp with time zone,
  "spots_count" integer,
  "public_spots_count" integer,
  "likes_count" integer,
  "comments_count" integer,
  "bookmarks_count" integer,
  "article_intro" "jsonb",
  "article_outro" "jsonb",
  "user_username" "text",
  "user_display_name" "text",
  "user_avatar_url" "text",
  "user_avatar_crop" "jsonb",
  "tags" "jsonb"
)
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
    u.avatar_crop AS user_avatar_crop,
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
    AND (
      p_current_user_id IS NULL
      OR NOT EXISTS (
        SELECT 1 FROM user_blocks ub
        WHERE ub.blocker_id = p_current_user_id AND ub.blocked_id = m.user_id
      )
    )
  ORDER BY
    CASE WHEN sort_by = 'likes_count' THEN m.likes_count ELSE 0 END DESC,
    m.created_at DESC
  LIMIT result_limit;
END;
$$;

COMMENT ON FUNCTION "public"."search_public_maps" IS '公開マップ検索。フィルター: タグ、期間、地域テキスト、ブロックユーザー除外。並び替え: created_at / likes_count';

-- ============================================================
-- 3. search_public_spots に p_current_user_id パラメータ追加
-- ブロック済みユーザーのスポットを検索結果から除外
-- ============================================================

DROP FUNCTION IF EXISTS "public"."search_public_spots"("text", integer, "text", "text", "uuid"[], "text", "text");

CREATE OR REPLACE FUNCTION "public"."search_public_spots"(
  "search_query" "text" DEFAULT NULL,
  "result_limit" integer DEFAULT 30,
  "prefecture_id_filter" "text" DEFAULT NULL,
  "city_id_filter" "text" DEFAULT NULL,
  "tag_ids_filter" "uuid"[] DEFAULT NULL,
  "sort_by" "text" DEFAULT 'created_at',
  "date_range" "text" DEFAULT 'all',
  "p_current_user_id" "uuid" DEFAULT NULL
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
  user_avatar_crop jsonb,
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
      u.avatar_crop AS user_avatar_crop,
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
      AND (
        p_current_user_id IS NULL
        OR NOT EXISTS (
          SELECT 1 FROM user_blocks ub
          WHERE ub.blocker_id = p_current_user_id AND ub.blocked_id = us.user_id
        )
      )
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
    fs.user_username, fs.user_display_name, fs.user_avatar_url, fs.user_avatar_crop,
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

COMMENT ON FUNCTION "public"."search_public_spots" IS '公開スポット検索。フィルター: 都道府県、市区町村、タグ、期間、ブロックユーザー除外。並び替え: created_at / likes_count';

-- ============================================================
-- 4. 権限設定
-- ============================================================

GRANT ALL ON FUNCTION "public"."search_public_maps"("text", integer, "uuid"[], "text", "text", "text", "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."search_public_maps"("text", integer, "uuid"[], "text", "text", "text", "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_public_maps"("text", integer, "uuid"[], "text", "text", "text", "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."search_public_spots"("text", integer, "text", "text", "uuid"[], "text", "text", "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."search_public_spots"("text", integer, "text", "text", "uuid"[], "text", "text", "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_public_spots"("text", integer, "text", "text", "uuid"[], "text", "text", "uuid") TO "service_role";

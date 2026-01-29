


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."featured_link_type" AS ENUM (
    'url',
    'magazine'
);


ALTER TYPE "public"."featured_link_type" OWNER TO "postgres";


CREATE TYPE "public"."featured_source_type" AS ENUM (
    'tag',
    'manual'
);


ALTER TYPE "public"."featured_source_type" OWNER TO "postgres";


CREATE TYPE "public"."mixed_feed_item" AS (
	"item_type" "text",
	"item_id" "uuid",
	"created_at" timestamp with time zone,
	"feed_position" integer,
	"ad_slot" "text",
	"spot_display_type" "text",
	"map_id" "uuid",
	"map_name" "text",
	"map_description" "text",
	"map_thumbnail_url" "text",
	"map_is_public" boolean,
	"map_spots_count" integer,
	"map_likes_count" integer,
	"map_bookmarks_count" integer,
	"map_comments_count" integer,
	"map_category_id" "text",
	"map_language" character varying(10),
	"map_user_id" "uuid",
	"map_user_username" "text",
	"map_user_display_name" "text",
	"map_user_avatar_url" "text",
	"map_tags" "jsonb",
	"map_is_liked" boolean,
	"map_is_bookmarked" boolean,
	"spot_id" "uuid",
	"spot_user_id" "uuid",
	"spot_map_id" "uuid",
	"spot_master_spot_id" "uuid",
	"spot_machi_id" "text",
	"spot_description" "text",
	"spot_spot_color" "text",
	"spot_label_id" "uuid",
	"spot_name" "jsonb",
	"spot_images_count" integer,
	"spot_likes_count" integer,
	"spot_bookmarks_count" integer,
	"spot_comments_count" integer,
	"spot_order_index" integer,
	"spot_latitude" double precision,
	"spot_longitude" double precision,
	"spot_google_formatted_address" "jsonb",
	"spot_google_short_address" "jsonb",
	"spot_is_public" boolean,
	"spot_article_content" "jsonb",
	"spot_master_spot_name" "jsonb",
	"spot_master_spot_latitude" double precision,
	"spot_master_spot_longitude" double precision,
	"spot_master_spot_google_place_id" "text",
	"spot_master_spot_google_formatted_address" "jsonb",
	"spot_master_spot_google_short_address" "jsonb",
	"spot_master_spot_google_types" "text"[],
	"spot_user_username" "text",
	"spot_user_display_name" "text",
	"spot_user_avatar_url" "text",
	"spot_map_name" "text",
	"spot_map_is_public" boolean,
	"spot_image_urls" "jsonb",
	"spot_tags" "jsonb",
	"spot_is_liked" boolean,
	"spot_is_bookmarked" boolean,
	"spot_video_url" "text"
);


ALTER TYPE "public"."mixed_feed_item" OWNER TO "postgres";


CREATE TYPE "public"."report_reason" AS ENUM (
    'spam',
    'inappropriate',
    'harassment',
    'misinformation',
    'copyright',
    'other'
);


ALTER TYPE "public"."report_reason" OWNER TO "postgres";


CREATE TYPE "public"."report_status" AS ENUM (
    'pending',
    'reviewing',
    'resolved',
    'dismissed'
);


ALTER TYPE "public"."report_status" OWNER TO "postgres";


CREATE TYPE "public"."report_target_type" AS ENUM (
    'map',
    'spot',
    'user',
    'comment'
);


ALTER TYPE "public"."report_target_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."add_search_history"("p_query" "text", "p_search_type" "text" DEFAULT 'discover'::"text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_user_id uuid;
    v_new_id uuid;
    v_max_count integer := 20;
    v_gender text;
    v_age_group text;
    v_prefecture text;
    v_country text;
BEGIN
    -- 認証チェック
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    -- 空のクエリはスキップ
    IF p_query IS NULL OR trim(p_query) = '' THEN
        RETURN NULL;
    END IF;

    -- ユーザーのデモグラフィック情報を取得
    SELECT gender, age_group, prefecture, country
    INTO v_gender, v_age_group, v_prefecture, v_country
    FROM public.users WHERE id = v_user_id;

    -- 1. ユーザー用の検索履歴に追加
    -- 同じクエリが既にあれば削除（重複防止）
    DELETE FROM public.search_history
    WHERE user_id = v_user_id
      AND search_type = p_search_type
      AND query = trim(p_query);

    -- 新しい履歴を追加
    INSERT INTO public.search_history (user_id, query, search_type, searched_at)
    VALUES (v_user_id, trim(p_query), p_search_type, now())
    RETURNING id INTO v_new_id;

    -- 古い履歴を削除（最大件数を超えた分）
    DELETE FROM public.search_history
    WHERE id IN (
        SELECT id FROM public.search_history
        WHERE user_id = v_user_id
          AND search_type = p_search_type
        ORDER BY searched_at DESC
        OFFSET v_max_count
    );

    -- 2. 分析用テーブルに追加（匿名、カウントアップ）
    INSERT INTO public.search_analytics (
        query, search_type, gender, age_group, prefecture, country,
        search_count, first_searched_at, last_searched_at
    )
    VALUES (
        trim(p_query), p_search_type, v_gender, v_age_group, v_prefecture, v_country,
        1, now(), now()
    )
    ON CONFLICT (query, search_type, gender, age_group, prefecture, country)
    DO UPDATE SET
        search_count = search_analytics.search_count + 1,
        last_searched_at = now(),
        updated_at = now();

    RETURN v_new_id;
END;
$$;


ALTER FUNCTION "public"."add_search_history"("p_query" "text", "p_search_type" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."add_search_history"("p_query" "text", "p_search_type" "text") IS '検索履歴を追加（ユーザー用 + 分析用の両方に記録、デモグラフィック対応）';



CREATE OR REPLACE FUNCTION "public"."auto_publish_map_on_spot_insert"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- スポットが公開状態で作成された場合
  IF NEW.is_public = true THEN
    -- マップが非公開なら公開に変更
    UPDATE public.maps
    SET is_public = true, updated_at = now()
    WHERE id = NEW.map_id AND is_public = false;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."auto_publish_map_on_spot_insert"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."auto_publish_map_on_spot_insert"() IS 'スポットが公開状態で新規作成されたときにマップも自動的に公開するトリガー関数';



CREATE OR REPLACE FUNCTION "public"."auto_publish_map_on_spot_publish"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- スポットが非公開から公開に変わった場合
  IF OLD.is_public = false AND NEW.is_public = true THEN
    -- マップが非公開なら公開に変更
    UPDATE public.maps
    SET is_public = true, updated_at = now()
    WHERE id = NEW.map_id AND is_public = false;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."auto_publish_map_on_spot_publish"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."auto_publish_map_on_spot_publish"() IS 'スポットが公開されたときにマップも自動的に公開するトリガー関数';



CREATE OR REPLACE FUNCTION "public"."auto_unpublish_map_on_spot_delete"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_public_spot_count INT;
BEGIN
  -- 削除されたスポットが公開だった場合のみチェック
  IF OLD.is_public = true THEN
    -- そのマップの残りの公開スポット数をカウント
    SELECT COUNT(*) INTO v_public_spot_count
    FROM public.user_spots
    WHERE map_id = OLD.map_id
      AND is_public = true;

    -- 公開スポットが0件ならマップを非公開に
    IF v_public_spot_count = 0 THEN
      UPDATE public.maps
      SET is_public = false, updated_at = now()
      WHERE id = OLD.map_id AND is_public = true;
    END IF;
  END IF;

  RETURN OLD;
END;
$$;


ALTER FUNCTION "public"."auto_unpublish_map_on_spot_delete"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."auto_unpublish_map_on_spot_delete"() IS '公開スポットが削除されて0件になったときにマップも自動的に非公開にするトリガー関数';



CREATE OR REPLACE FUNCTION "public"."auto_unpublish_map_when_no_public_spots"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_public_spot_count INT;
BEGIN
  -- スポットが公開から非公開に変わった場合のみチェック
  IF OLD.is_public = true AND NEW.is_public = false THEN
    -- そのマップの公開スポット数をカウント
    SELECT COUNT(*) INTO v_public_spot_count
    FROM public.user_spots
    WHERE map_id = NEW.map_id
      AND is_public = true
      AND id != NEW.id;  -- 今変更中のスポットは除外

    -- 公開スポットが0件ならマップを非公開に
    IF v_public_spot_count = 0 THEN
      UPDATE public.maps
      SET is_public = false, updated_at = now()
      WHERE id = NEW.map_id AND is_public = true;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."auto_unpublish_map_when_no_public_spots"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."auto_unpublish_map_when_no_public_spots"() IS '公開スポットがなくなったときにマップも自動的に非公開にするトリガー関数';



CREATE OR REPLACE FUNCTION "public"."check_email_has_pending_deletion"("check_email" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE LOWER(email) = LOWER(check_email)
    AND status = 'deletion_pending'
  );
END;
$$;


ALTER FUNCTION "public"."check_email_has_pending_deletion"("check_email" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."check_email_has_pending_deletion"("check_email" "text") IS 'メールアドレスが退会手続き中かチェック（users.statusを参照）';



CREATE OR REPLACE FUNCTION "public"."cleanup_old_view_history"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  history_count INTEGER;
BEGIN
  -- 同一ユーザーの履歴件数を取得
  SELECT COUNT(*) INTO history_count
  FROM public.view_history
  WHERE user_id = NEW.user_id;

  -- 110件を超えたら100件まで削除（10件ごとにまとめて削除）
  IF history_count > 110 THEN
    DELETE FROM public.view_history
    WHERE id IN (
      SELECT id FROM public.view_history
      WHERE user_id = NEW.user_id
      ORDER BY viewed_at DESC
      OFFSET 100
    );
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."cleanup_old_view_history"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."cleanup_old_view_history"() IS '閲覧履歴を100件に制限するクリーンアップ関数（閾値方式: 110件超で削除）';



CREATE OR REPLACE FUNCTION "public"."clear_push_token"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE users
  SET
    push_token = NULL,
    push_token_updated_at = NOW()
  WHERE id = auth.uid();
END;
$$;


ALTER FUNCTION "public"."clear_push_token"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."clear_search_history"("p_search_type" "text" DEFAULT 'discover'::"text") RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_user_id uuid;
    v_deleted_count integer;
BEGIN
    -- 認証チェック
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    DELETE FROM public.search_history
    WHERE user_id = v_user_id
      AND search_type = p_search_type;

    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RETURN v_deleted_count;
END;
$$;


ALTER FUNCTION "public"."clear_search_history"("p_search_type" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."clear_search_history"("p_search_type" "text") IS '指定タイプの検索履歴を全削除';



CREATE OR REPLACE FUNCTION "public"."count_images_in_spot"("p_user_spot_id" "uuid") RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
  BEGIN
    RETURN (
      SELECT COUNT(*)::INTEGER
      FROM images
      WHERE user_spot_id = p_user_spot_id
    );
  END;
  $$;


ALTER FUNCTION "public"."count_images_in_spot"("p_user_spot_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."count_user_spots_in_map"("p_user_id" "uuid", "p_map_id" "uuid") RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM user_spots
    WHERE user_id = p_user_id
    AND map_id = p_map_id
  );
END;
$$;


ALTER FUNCTION "public"."count_user_spots_in_map"("p_user_id" "uuid", "p_map_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_comment_map_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  map_owner_id UUID;
BEGIN
  -- マップの所有者を取得
  SELECT user_id INTO map_owner_id FROM maps WHERE id = NEW.map_id;

  -- 自分へのコメントは通知しない
  IF map_owner_id IS NOT NULL AND map_owner_id != NEW.user_id THEN
    INSERT INTO notifications (user_id, actor_id, type, map_id, comment_id)
    VALUES (map_owner_id, NEW.user_id, 'comment_map', NEW.map_id, NEW.id);
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_comment_map_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_comment_spot_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  spot_owner_id UUID;
BEGIN
  -- スポットの所有者を取得
  SELECT user_id INTO spot_owner_id FROM user_spots WHERE id = NEW.user_spot_id;

  -- 自分へのコメントは通知しない
  IF spot_owner_id IS NOT NULL AND spot_owner_id != NEW.user_id THEN
    INSERT INTO notifications (user_id, actor_id, type, user_spot_id, comment_id)
    VALUES (spot_owner_id, NEW.user_id, 'comment_spot', NEW.user_spot_id, NEW.id);
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_comment_spot_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_default_notification_settings"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  INSERT INTO user_notification_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_default_notification_settings"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_follow_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO notifications (user_id, actor_id, type)
  VALUES (NEW.followee_id, NEW.follower_id, 'follow');

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_follow_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_like_map_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  map_owner_id UUID;
BEGIN
  -- マップの所有者を取得
  SELECT user_id INTO map_owner_id FROM maps WHERE id = NEW.map_id;

  -- 自分へのいいねは通知しない
  IF map_owner_id IS NOT NULL AND map_owner_id != NEW.user_id THEN
    INSERT INTO notifications (user_id, actor_id, type, map_id)
    VALUES (map_owner_id, NEW.user_id, 'like_map', NEW.map_id);
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_like_map_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_like_spot_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  spot_owner_id UUID;
BEGIN
  -- スポットの所有者を取得
  SELECT user_id INTO spot_owner_id FROM user_spots WHERE id = NEW.user_spot_id;

  -- 自分へのいいねは通知しない
  IF spot_owner_id IS NOT NULL AND spot_owner_id != NEW.user_id THEN
    INSERT INTO notifications (user_id, actor_id, type, user_spot_id)
    VALUES (spot_owner_id, NEW.user_id, 'like_spot', NEW.user_spot_id);
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_like_spot_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."expire_premium_subscriptions"() RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  UPDATE users
  SET
    is_premium = false,
    updated_at = NOW()
  WHERE
    is_premium = true
    AND premium_expires_at IS NOT NULL
    AND premium_expires_at < NOW();

  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  RETURN affected_rows;
END;
$$;


ALTER FUNCTION "public"."expire_premium_subscriptions"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."expire_premium_subscriptions"() IS 'cronジョブで定期実行し、期限切れユーザーのプレミアムを解除。Service Role 
  Keyで実行するため認証チェック不要。';



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

    -- マップの後に表示するネイティブ広告（フロントエンドのAD_SLOTS.FEED_NATIVEと一致させる）
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
      NULL::TEXT
    )::public.mixed_feed_item;

    -- スポットカルーセル内に表示する動画広告（フロントエンドのAD_SLOTS.CAROUSEL_VIDEOと一致させる）
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
      NULL::TEXT
    )::public.mixed_feed_item;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."generate_feed_ad_slots"("p_start_position" integer, "p_num_blocks" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_city_by_coordinate"("lng" double precision, "lat" double precision) RETURNS TABLE("country_id" "text", "admin_level" integer, "prefecture_id" "text", "city_id" "text")
    LANGUAGE "sql" STABLE
    AS $$
  SELECT
    ab.country_id,
    ab.admin_level,
    ab.prefecture_id,
    ab.city_id
  FROM admin_boundaries ab
  WHERE ST_Contains(ab.geom, ST_SetSRID(ST_Point(lng, lat), 4326))
  ORDER BY ab.admin_level DESC  -- より詳細な行政区画を優先
  LIMIT 1;
$$;


ALTER FUNCTION "public"."get_city_by_coordinate"("lng" double precision, "lat" double precision) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_city_by_coordinate"("lng" double precision, "lat" double precision) IS '座標から行政区画を特定。prefecture_id と city_id を直接返す。';



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


ALTER FUNCTION "public"."get_following_mixed_feed"("p_user_id" "uuid", "p_map_limit" integer, "p_spot_limit" integer, "p_map_cursor" timestamp with time zone, "p_spot_cursor" timestamp with time zone, "p_show_ads" boolean, "p_start_position" integer, "p_enable_shorts" boolean) OWNER TO "postgres";


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


ALTER FUNCTION "public"."get_mixed_feed"("p_map_limit" integer, "p_spot_limit" integer, "p_map_cursor" timestamp with time zone, "p_spot_cursor" timestamp with time zone, "p_current_user_id" "uuid", "p_show_ads" boolean, "p_start_position" integer, "p_enable_shorts" boolean) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."user_notification_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "push_enabled" boolean DEFAULT true NOT NULL,
    "like_enabled" boolean DEFAULT true NOT NULL,
    "comment_enabled" boolean DEFAULT true NOT NULL,
    "follow_enabled" boolean DEFAULT true NOT NULL,
    "system_enabled" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email_enabled" boolean DEFAULT false NOT NULL,
    "email_like_enabled" boolean DEFAULT true NOT NULL,
    "email_comment_enabled" boolean DEFAULT true NOT NULL,
    "email_follow_enabled" boolean DEFAULT true NOT NULL,
    "email_system_enabled" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."user_notification_settings" OWNER TO "postgres";


COMMENT ON COLUMN "public"."user_notification_settings"."email_enabled" IS 'メール通知のマスター設定';



COMMENT ON COLUMN "public"."user_notification_settings"."email_like_enabled" IS 'いいねのメール通知';



COMMENT ON COLUMN "public"."user_notification_settings"."email_comment_enabled" IS 'コメントのメール通知';



COMMENT ON COLUMN "public"."user_notification_settings"."email_follow_enabled" IS 'フォローのメール通知';



COMMENT ON COLUMN "public"."user_notification_settings"."email_system_enabled" IS 'システムのメール通知';



CREATE OR REPLACE FUNCTION "public"."get_notification_settings"() RETURNS "public"."user_notification_settings"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  settings user_notification_settings;
BEGIN
  -- 既存の設定を取得
  SELECT * INTO settings
  FROM user_notification_settings
  WHERE user_id = auth.uid();

  -- なければ作成
  IF settings IS NULL THEN
    INSERT INTO user_notification_settings (user_id)
    VALUES (auth.uid())
    RETURNING * INTO settings;
  END IF;

  RETURN settings;
END;
$$;


ALTER FUNCTION "public"."get_notification_settings"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_popular_searches"("p_search_type" "text" DEFAULT 'discover'::"text", "p_limit" integer DEFAULT 10, "p_prefecture" "text" DEFAULT NULL::"text") RETURNS TABLE("query" "text", "search_count" integer, "last_searched_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        sa.query,
        SUM(sa.search_count)::integer as search_count,
        MAX(sa.last_searched_at) as last_searched_at
    FROM public.search_analytics sa
    WHERE sa.search_type = p_search_type
      AND (p_prefecture IS NULL OR sa.prefecture = p_prefecture)
    GROUP BY sa.query
    ORDER BY search_count DESC
    LIMIT p_limit;
END;
$$;


ALTER FUNCTION "public"."get_popular_searches"("p_search_type" "text", "p_limit" integer, "p_prefecture" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_popular_searches"("p_search_type" "text", "p_limit" integer, "p_prefecture" "text") IS '人気の検索ワードを取得（オプションで都道府県フィルター可）';



CREATE OR REPLACE FUNCTION "public"."get_popular_searches"("p_search_type" "text" DEFAULT 'discover'::"text", "p_limit" integer DEFAULT 10, "p_prefecture" "text" DEFAULT NULL::"text", "p_country" "text" DEFAULT NULL::"text") RETURNS TABLE("query" "text", "search_count" integer, "last_searched_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        sa.query,
        SUM(sa.search_count)::integer as search_count,
        MAX(sa.last_searched_at) as last_searched_at
    FROM public.search_analytics sa
    WHERE sa.search_type = p_search_type
      AND (p_prefecture IS NULL OR sa.prefecture = p_prefecture)
      AND (p_country IS NULL OR sa.country = p_country)
    GROUP BY sa.query
    ORDER BY search_count DESC
    LIMIT p_limit;
END;
$$;


ALTER FUNCTION "public"."get_popular_searches"("p_search_type" "text", "p_limit" integer, "p_prefecture" "text", "p_country" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_popular_searches"("p_search_type" "text", "p_limit" integer, "p_prefecture" "text", "p_country" "text") IS '人気の検索ワードを取得（オプションで都道府県・国フィルター可）';



CREATE OR REPLACE FUNCTION "public"."is_admin_user"("check_user_id" "uuid") RETURNS boolean
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
    SELECT EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = check_user_id
    );
  $$;


ALTER FUNCTION "public"."is_admin_user"("check_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_user_premium"("p_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN (
    SELECT COALESCE(is_premium, false)
    FROM users
    WHERE id = p_user_id
  );
END;
$$;


ALTER FUNCTION "public"."is_user_premium"("p_user_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."is_user_premium"("p_user_id" "uuid") IS 'RLSポリシー内でスポット数制限の判定に使用（user_spots_insert_with_limit）。サーバーサイドから呼び出
  すため認証チェック不要。';



CREATE OR REPLACE FUNCTION "public"."publish_spot"("p_spot_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_article_content JSONB;
  v_user_id UUID;
  v_spot_user_id UUID;
BEGIN
  -- 認証チェック
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- スポットの所有者チェックとarticle_content取得
  SELECT user_id, article_content INTO v_spot_user_id, v_article_content
  FROM public.user_spots
  WHERE id = p_spot_id;

  IF v_spot_user_id IS NULL THEN
    RAISE EXCEPTION 'Spot not found';
  END IF;

  IF v_spot_user_id != v_user_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- article_contentが入力されているかチェック
  IF v_article_content IS NULL OR v_article_content = '{}'::jsonb OR v_article_content = 'null'::jsonb THEN
    RAISE EXCEPTION 'Article content is required to publish';
  END IF;

  -- スポットを公開
  UPDATE public.user_spots
  SET is_public = true, updated_at = now()
  WHERE id = p_spot_id;

  -- トリガーによりマップも自動公開される

  RETURN true;
END;
$$;


ALTER FUNCTION "public"."publish_spot"("p_spot_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."publish_spot"("p_spot_id" "uuid") IS 'スポットを公開する。article_contentが入力されている必要がある。公開時にマップも自動的に公開される';



CREATE OR REPLACE FUNCTION "public"."record_map_view"("p_map_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
  BEGIN
    -- 未認証ユーザーは拒否
    IF auth.uid() IS NULL THEN
      RAISE EXCEPTION 'Authentication required';
    END IF;

    INSERT INTO public.view_history (user_id, map_id, viewed_at, view_count)
    VALUES (auth.uid(), p_map_id, now(), 1)
    ON CONFLICT (user_id, map_id)
    DO UPDATE SET
      viewed_at = now(),
      view_count = view_history.view_count + 1,
      updated_at = now();
  END;
  $$;


ALTER FUNCTION "public"."record_map_view"("p_map_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_public_maps"("search_query" "text" DEFAULT NULL::"text", "result_limit" integer DEFAULT 30, "tag_ids_filter" "uuid"[] DEFAULT NULL::"uuid"[], "sort_by" "text" DEFAULT 'created_at'::"text", "date_range" "text" DEFAULT 'all'::"text", "region_text" "text" DEFAULT NULL::"text") RETURNS TABLE("id" "uuid", "user_id" "uuid", "name" "text", "description" "text", "thumbnail_url" "text", "is_public" boolean, "is_official" boolean, "show_label_chips" boolean, "category_id" "text", "language" character varying, "created_at" timestamp with time zone, "updated_at" timestamp with time zone, "spots_count" integer, "public_spots_count" integer, "likes_count" integer, "comments_count" integer, "bookmarks_count" integer, "article_intro" "jsonb", "article_outro" "jsonb", "user_username" "text", "user_display_name" "text", "user_avatar_url" "text", "tags" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  date_filter TIMESTAMPTZ;
BEGIN
  -- 期間フィルターの計算
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
    m.is_public,
    m.is_official,
    m.show_label_chips,
    m.category_id,
    m.language,
    m.created_at,
    m.updated_at,
    m.spots_count,
    -- public_spots_count をサブクエリで計算
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
    -- キーワード検索
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
    -- タグフィルター
    AND (
      tag_ids_filter IS NULL
      OR EXISTS (
        SELECT 1 FROM map_tags mt
        WHERE mt.map_id = m.id AND mt.tag_id = ANY(tag_ids_filter)
      )
    )
    -- 期間フィルター
    AND (date_filter IS NULL OR m.created_at >= date_filter)
    -- 地域テキスト検索（都道府県名などがマップ名・説明・タグに含まれているか）
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


ALTER FUNCTION "public"."search_public_maps"("search_query" "text", "result_limit" integer, "tag_ids_filter" "uuid"[], "sort_by" "text", "date_range" "text", "region_text" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."search_public_maps"("search_query" "text", "result_limit" integer, "tag_ids_filter" "uuid"[], "sort_by" "text", "date_range" "text", "region_text" "text") IS '公開マップ検索。フィルター: タグ、期間、地域テキスト。並び替え: created_at / likes_count（is_article_public削除済み）';



CREATE OR REPLACE FUNCTION "public"."search_public_spots"("search_query" "text" DEFAULT NULL::"text", "result_limit" integer DEFAULT 30, "prefecture_id_filter" "text" DEFAULT NULL::"text", "city_id_filter" "text" DEFAULT NULL::"text", "tag_ids_filter" "uuid"[] DEFAULT NULL::"uuid"[], "sort_by" "text" DEFAULT 'created_at'::"text", "date_range" "text" DEFAULT 'all'::"text") RETURNS TABLE("id" "uuid", "user_id" "uuid", "map_id" "uuid", "master_spot_id" "uuid", "machi_id" "text", "name" "jsonb", "description" "text", "spot_color" "text", "label_id" "uuid", "images_count" integer, "likes_count" integer, "comments_count" integer, "order_index" integer, "created_at" timestamp with time zone, "updated_at" timestamp with time zone, "latitude" double precision, "longitude" double precision, "google_formatted_address" "jsonb", "google_short_address" "jsonb", "is_public" boolean, "prefecture_id" "text", "city_id" "text", "master_spot_name" "jsonb", "master_spot_latitude" double precision, "master_spot_longitude" double precision, "master_spot_google_place_id" "text", "master_spot_google_formatted_address" "jsonb", "master_spot_google_short_address" "jsonb", "master_spot_google_types" "text"[], "label_name" "text", "label_color" "text", "user_username" "text", "user_display_name" "text", "user_avatar_url" "text", "map_name" "text", "map_public_spots_count" integer, "tags" "jsonb", "article_content" "jsonb", "image_urls" "text"[])
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  date_filter TIMESTAMPTZ;
BEGIN
  -- 期間フィルターの計算
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
      -- public_spots_count をサブクエリで計算
      (SELECT COUNT(*)::INTEGER FROM user_spots sub_us WHERE sub_us.map_id = m.id AND sub_us.is_public = true) AS map_public_spots_count,
      us.article_content
    FROM user_spots us
    INNER JOIN maps m ON m.id = us.map_id AND m.is_public = true
    LEFT JOIN master_spots ms ON ms.id = us.master_spot_id
    LEFT JOIN map_labels ml ON ml.id = us.label_id
    LEFT JOIN users u ON u.id = us.user_id
    WHERE
      us.is_public = true
      -- キーワード検索
      AND (
        search_query IS NULL
        OR search_query = ''
        OR (
          us.description ILIKE '%' || search_query || '%'
          OR (ms.name IS NOT NULL AND ms.name::text ILIKE '%' || search_query || '%')
          OR (us.master_spot_id IS NULL AND us.name IS NOT NULL AND us.name::text ILIKE '%' || search_query || '%')
        )
      )
      -- 都道府県フィルター
      AND (prefecture_id_filter IS NULL OR us.prefecture_id = prefecture_id_filter)
      -- 市区町村フィルター
      AND (city_id_filter IS NULL OR us.city_id = city_id_filter)
      -- タグフィルター
      AND (
        tag_ids_filter IS NULL
        OR EXISTS (
          SELECT 1 FROM spot_tags st
          WHERE st.user_spot_id = us.id
            AND st.tag_id = ANY(tag_ids_filter)
        )
      )
      -- 期間フィルター
      AND (date_filter IS NULL OR us.created_at >= date_filter)
    ORDER BY
      CASE WHEN sort_by = 'likes_count' THEN us.likes_count ELSE 0 END DESC,
      us.created_at DESC
    LIMIT result_limit
  )
  SELECT
    fs.id,
    fs.user_id,
    fs.map_id,
    fs.master_spot_id,
    fs.machi_id,
    fs.name,
    fs.description,
    fs.spot_color,
    fs.label_id,
    fs.images_count,
    fs.likes_count,
    fs.comments_count,
    fs.order_index,
    fs.created_at,
    fs.updated_at,
    fs.latitude,
    fs.longitude,
    fs.google_formatted_address,
    fs.google_short_address,
    fs.is_public,
    fs.prefecture_id,
    fs.city_id,
    fs.master_spot_name,
    fs.master_spot_latitude,
    fs.master_spot_longitude,
    fs.master_spot_google_place_id,
    fs.master_spot_google_formatted_address,
    fs.master_spot_google_short_address,
    fs.master_spot_google_types,
    fs.label_name,
    fs.label_color,
    fs.user_username,
    fs.user_display_name,
    fs.user_avatar_url,
    fs.map_name,
    fs.map_public_spots_count,
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
    ) AS image_urls
  FROM filtered_spots fs;
END;
$$;


ALTER FUNCTION "public"."search_public_spots"("search_query" "text", "result_limit" integer, "prefecture_id_filter" "text", "city_id_filter" "text", "tag_ids_filter" "uuid"[], "sort_by" "text", "date_range" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."search_public_spots"("search_query" "text", "result_limit" integer, "prefecture_id_filter" "text", "city_id_filter" "text", "tag_ids_filter" "uuid"[], "sort_by" "text", "date_range" "text") IS '公開スポット検索。フィルター: 都道府県、市区町村、タグ、期間。並び替え: created_at / likes_count';



CREATE OR REPLACE FUNCTION "public"."send_push_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
  DECLARE
      supabase_url TEXT;
      service_role_key TEXT;
  BEGIN
      -- 環境変数からSupabase URLとService Role Keyを取得
      supabase_url := current_setting('app.settings.supabase_url', true);
      service_role_key := current_setting('app.settings.service_role_key', true);

      -- Edge Functionを非同期で呼び出し
      PERFORM net.http_post(
          url := supabase_url || '/functions/v1/send-notification',
          headers := jsonb_build_object(
              'Content-Type', 'application/json',
              'Authorization', 'Bearer ' || service_role_key
          ),
          body := jsonb_build_object(
              'notification_id', NEW.id,
              'user_id', NEW.user_id,
              'actor_id', NEW.actor_id,
              'type', NEW.type,
              'user_spot_id', NEW.user_spot_id,
              'map_id', NEW.map_id
          )
      );

      RETURN NEW;
  EXCEPTION
      WHEN OTHERS THEN
          -- エラーが発生しても通知の作成は続行
          RAISE WARNING 'Failed to send notification: %', SQLERRM;
          RETURN NEW;
  END;
  $$;


ALTER FUNCTION "public"."send_push_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_spots_language"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.language IS DISTINCT FROM OLD.language THEN
    UPDATE public.user_spots
    SET language = NEW.language
    WHERE map_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_spots_language"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."unpublish_spot"("p_spot_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_user_id UUID;
  v_spot_user_id UUID;
BEGIN
  -- 認証チェック
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- スポットの所有者チェック
  SELECT user_id INTO v_spot_user_id
  FROM public.user_spots
  WHERE id = p_spot_id;

  IF v_spot_user_id IS NULL THEN
    RAISE EXCEPTION 'Spot not found';
  END IF;

  IF v_spot_user_id != v_user_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- スポットを非公開
  UPDATE public.user_spots
  SET is_public = false, updated_at = now()
  WHERE id = p_spot_id;

  RETURN true;
END;
$$;


ALTER FUNCTION "public"."unpublish_spot"("p_spot_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."unpublish_spot"("p_spot_id" "uuid") IS 'スポットを非公開にする';



CREATE OR REPLACE FUNCTION "public"."update_bookmarks_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.map_id IS NOT NULL THEN
      UPDATE maps SET bookmarks_count = bookmarks_count + 1 WHERE id = NEW.map_id;
    ELSIF NEW.user_spot_id IS NOT NULL THEN
      UPDATE user_spots SET bookmarks_count = bookmarks_count + 1 WHERE id = NEW.user_spot_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.map_id IS NOT NULL THEN
      UPDATE maps SET bookmarks_count = GREATEST(0, bookmarks_count - 1) WHERE id = OLD.map_id;
    ELSIF OLD.user_spot_id IS NOT NULL THEN
      UPDATE user_spots SET bookmarks_count = GREATEST(0, bookmarks_count - 1) WHERE id = OLD.user_spot_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_bookmarks_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_collection_maps_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE collections SET maps_count = maps_count + 1, updated_at = NOW() WHERE id = NEW.collection_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE collections SET maps_count = maps_count - 1, updated_at = NOW() WHERE id = OLD.collection_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_collection_maps_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_comment_likes_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
  BEGIN
    IF TG_OP = 'INSERT' THEN
      UPDATE comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
      RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE comments SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.comment_id;
      RETURN OLD;
    END IF;
    RETURN NULL;
  END;
  $$;


ALTER FUNCTION "public"."update_comment_likes_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_comment_replies_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
  BEGIN
    IF TG_OP = 'INSERT' THEN
      IF NEW.parent_id IS NOT NULL THEN
        UPDATE comments SET replies_count = replies_count + 1 WHERE id = NEW.parent_id;
      END IF;
      RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
      IF OLD.parent_id IS NOT NULL THEN
        UPDATE comments SET replies_count = GREATEST(0, replies_count - 1) WHERE id = OLD.parent_id;
      END IF;
      RETURN OLD;
    END IF;
    RETURN NULL;
  END;
  $$;


ALTER FUNCTION "public"."update_comment_replies_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_comments_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- 返信コメント（parent_idがある）はカウントしない
  IF TG_OP = 'INSERT' THEN
    IF NEW.parent_id IS NULL THEN
      IF NEW.map_id IS NOT NULL THEN
        UPDATE maps SET comments_count = comments_count + 1 WHERE id = NEW.map_id;
      ELSIF NEW.user_spot_id IS NOT NULL THEN
        UPDATE user_spots SET comments_count = comments_count + 1 WHERE id = NEW.user_spot_id;
      END IF;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.parent_id IS NULL THEN
      IF OLD.map_id IS NOT NULL THEN
        UPDATE maps SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.map_id;
      ELSIF OLD.user_spot_id IS NOT NULL THEN
        UPDATE user_spots SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.user_spot_id;
      END IF;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_comments_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_images_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE user_spots SET images_count = images_count + 1 WHERE id = NEW.user_spot_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE user_spots SET images_count = GREATEST(0, images_count - 1) WHERE id = OLD.user_spot_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_images_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_likes_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.map_id IS NOT NULL THEN
      UPDATE maps SET likes_count = likes_count + 1 WHERE id = NEW.map_id;
    ELSIF NEW.user_spot_id IS NOT NULL THEN
      UPDATE user_spots SET likes_count = likes_count + 1 WHERE id = NEW.user_spot_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.map_id IS NOT NULL THEN
      UPDATE maps SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.map_id;
    ELSIF OLD.user_spot_id IS NOT NULL THEN
      UPDATE user_spots SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.user_spot_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_likes_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_map_spots_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE maps SET spots_count = spots_count + 1 WHERE id = NEW.map_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE maps SET spots_count = GREATEST(0, spots_count - 1) WHERE id = OLD.map_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_map_spots_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_master_spot_favorites_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE master_spots SET favorites_count = favorites_count + 1 WHERE id = NEW.master_spot_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE master_spots SET favorites_count = GREATEST(0, favorites_count - 1) WHERE id = OLD.master_spot_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_master_spot_favorites_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_notification_settings"("p_push_enabled" boolean DEFAULT NULL::boolean, "p_like_enabled" boolean DEFAULT NULL::boolean, "p_comment_enabled" boolean DEFAULT NULL::boolean, "p_follow_enabled" boolean DEFAULT NULL::boolean, "p_system_enabled" boolean DEFAULT NULL::boolean, "p_email_enabled" boolean DEFAULT NULL::boolean, "p_email_like_enabled" boolean DEFAULT NULL::boolean, "p_email_comment_enabled" boolean DEFAULT NULL::boolean, "p_email_follow_enabled" boolean DEFAULT NULL::boolean, "p_email_system_enabled" boolean DEFAULT NULL::boolean) RETURNS "public"."user_notification_settings"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  settings user_notification_settings;
BEGIN
  -- 設定がなければ作成
  INSERT INTO user_notification_settings (user_id)
  VALUES (auth.uid())
  ON CONFLICT (user_id) DO NOTHING;

  -- 更新（NULLの場合は現在値を維持）
  UPDATE user_notification_settings
  SET
    -- プッシュ通知
    push_enabled = COALESCE(p_push_enabled, push_enabled),
    like_enabled = COALESCE(p_like_enabled, like_enabled),
    comment_enabled = COALESCE(p_comment_enabled, comment_enabled),
    follow_enabled = COALESCE(p_follow_enabled, follow_enabled),
    system_enabled = COALESCE(p_system_enabled, system_enabled),
    -- メール通知
    email_enabled = COALESCE(p_email_enabled, email_enabled),
    email_like_enabled = COALESCE(p_email_like_enabled, email_like_enabled),
    email_comment_enabled = COALESCE(p_email_comment_enabled, email_comment_enabled),
    email_follow_enabled = COALESCE(p_email_follow_enabled, email_follow_enabled),
    email_system_enabled = COALESCE(p_email_system_enabled, email_system_enabled)
  WHERE user_id = auth.uid()
  RETURNING * INTO settings;

  RETURN settings;
END;
$$;


ALTER FUNCTION "public"."update_notification_settings"("p_push_enabled" boolean, "p_like_enabled" boolean, "p_comment_enabled" boolean, "p_follow_enabled" boolean, "p_system_enabled" boolean, "p_email_enabled" boolean, "p_email_like_enabled" boolean, "p_email_comment_enabled" boolean, "p_email_follow_enabled" boolean, "p_email_system_enabled" boolean) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_push_token"("token" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE users
  SET
    push_token = token,
    push_token_updated_at = NOW()
  WHERE id = auth.uid();
END;
$$;


ALTER FUNCTION "public"."update_push_token"("token" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_tag_usage_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_tag_usage_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_tag_usage_count_for_spots"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_tag_usage_count_for_spots"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_user_premium_status"("p_user_id" "uuid", "p_is_premium" boolean, "p_expires_at" timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE users
  SET
    is_premium = p_is_premium,
    premium_expires_at = p_expires_at,
    premium_started_at = CASE
      WHEN p_is_premium = true AND premium_started_at IS NULL
      THEN NOW()
      ELSE premium_started_at
    END,
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$;


ALTER FUNCTION "public"."update_user_premium_status"("p_user_id" "uuid", "p_is_premium" boolean, "p_expires_at" timestamp with time zone) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."update_user_premium_status"("p_user_id" "uuid", "p_is_premium" boolean, "p_expires_at" timestamp with time zone) IS 'RevenueCat Webhook（Edge Function）から課金状態変更時に呼び出し。Service Role 
  Keyで実行するため認証チェック不要。';



CREATE TABLE IF NOT EXISTS "public"."admin_boundaries" (
    "geom" "public"."geometry"(MultiPolygon,4326),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "admin_level" integer,
    "country_id" "text",
    "prefecture_id" "text",
    "city_id" "text",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."admin_boundaries" OWNER TO "postgres";


COMMENT ON TABLE "public"."admin_boundaries" IS '行政区域ポリゴン（国土数値情報N03由来）';



COMMENT ON COLUMN "public"."admin_boundaries"."admin_level" IS 'OSM admin_level (4=都道府県相当, 6-7=市区町村相当)';



COMMENT ON COLUMN "public"."admin_boundaries"."country_id" IS '国ID → countries.id (jp, kr, th, tw, cn)';



COMMENT ON COLUMN "public"."admin_boundaries"."prefecture_id" IS '都道府県ID → prefectures.id';



COMMENT ON COLUMN "public"."admin_boundaries"."city_id" IS '市区町村ID → cities.id';



CREATE TABLE IF NOT EXISTS "public"."admin_users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "text" DEFAULT 'admin'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    CONSTRAINT "admin_users_role_check" CHECK (("role" = ANY (ARRAY['moderator'::"text", 'admin'::"text", 'owner'::"text"])))
);


ALTER TABLE "public"."admin_users" OWNER TO "postgres";


COMMENT ON TABLE "public"."admin_users" IS '管理画面にアクセス可能なユーザー一覧';



COMMENT ON COLUMN "public"."admin_users"."role" IS 'moderator: コンテンツ管理, admin: システム設定変更, owner: 管理者の追加削除も可能';



CREATE TABLE IF NOT EXISTS "public"."bookmark_folders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "order_index" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "folder_type" "text" DEFAULT 'spots'::"text" NOT NULL,
    CONSTRAINT "bookmark_folders_folder_type_check" CHECK (("folder_type" = ANY (ARRAY['spots'::"text", 'maps'::"text"])))
);


ALTER TABLE "public"."bookmark_folders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bookmarks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "map_id" "uuid",
    "user_spot_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "folder_id" "uuid",
    CONSTRAINT "bookmarks_check" CHECK (((("map_id" IS NOT NULL) AND ("user_spot_id" IS NULL)) OR (("map_id" IS NULL) AND ("user_spot_id" IS NOT NULL))))
);


ALTER TABLE "public"."bookmarks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "name_translations" "jsonb",
    "display_order" integer DEFAULT 0 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


COMMENT ON TABLE "public"."categories" IS 'マップカテゴリ（グルメ、旅行など）。idはURL用のslugとしても使用。';



CREATE TABLE IF NOT EXISTS "public"."cities" (
    "id" "text" NOT NULL,
    "prefecture_id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "name_kana" "text",
    "type" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name_translations" "jsonb",
    "latitude" double precision,
    "longitude" double precision,
    "tile_id" "text",
    CONSTRAINT "cities_type_check" CHECK (("type" = ANY (ARRAY['区'::"text", '市'::"text", '町'::"text", '村'::"text"])))
);


ALTER TABLE "public"."cities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."collection_maps" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "collection_id" "uuid" NOT NULL,
    "map_id" "uuid" NOT NULL,
    "order_index" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."collection_maps" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."collections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "thumbnail_url" "text",
    "is_public" boolean DEFAULT false NOT NULL,
    "maps_count" integer DEFAULT 0 NOT NULL,
    "order_index" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."collections" OWNER TO "postgres";


COMMENT ON COLUMN "public"."collections"."is_public" IS 'コレクションが公開されているかどうか（デフォルト: false）';



COMMENT ON COLUMN "public"."collections"."maps_count" IS 'マップ数（デフォルト: 0）';



CREATE TABLE IF NOT EXISTS "public"."comment_likes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "comment_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."comment_likes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "map_id" "uuid",
    "user_spot_id" "uuid",
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "parent_id" "uuid",
    "root_id" "uuid",
    "depth" integer DEFAULT 0 NOT NULL,
    "likes_count" integer DEFAULT 0 NOT NULL,
    "replies_count" integer DEFAULT 0 NOT NULL,
    "reply_to_user_id" "uuid",
    CONSTRAINT "comments_check" CHECK (((("map_id" IS NOT NULL) AND ("user_spot_id" IS NULL)) OR (("map_id" IS NULL) AND ("user_spot_id" IS NOT NULL))))
);


ALTER TABLE "public"."comments" OWNER TO "postgres";


COMMENT ON COLUMN "public"."comments"."reply_to_user_id" IS '返信先のユーザーID（誰への返信かを示す、Instagram方式）';



CREATE TABLE IF NOT EXISTS "public"."continents" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "display_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name_translations" "jsonb",
    "name_kana" "text",
    "latitude" double precision NOT NULL,
    "longitude" double precision NOT NULL
);


ALTER TABLE "public"."continents" OWNER TO "postgres";


COMMENT ON TABLE "public"."continents" IS '大陸マスターテーブル';



COMMENT ON COLUMN "public"."continents"."id" IS '大陸ID (例: east_asia, europe)';



COMMENT ON COLUMN "public"."continents"."name" IS '大陸名（日本語）';



COMMENT ON COLUMN "public"."continents"."display_order" IS '表示順序';



COMMENT ON COLUMN "public"."continents"."latitude" IS '大陸の代表緯度';



COMMENT ON COLUMN "public"."continents"."longitude" IS '大陸の代表経度';



CREATE TABLE IF NOT EXISTS "public"."countries" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "name_kana" "text",
    "latitude" double precision NOT NULL,
    "longitude" double precision NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "continent_id" "text" NOT NULL,
    "name_translations" "jsonb"
);


ALTER TABLE "public"."countries" OWNER TO "postgres";


COMMENT ON COLUMN "public"."countries"."continent_id" IS '大陸ID（外部キー → continents.id）';



CREATE TABLE IF NOT EXISTS "public"."terms_versions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "text" NOT NULL,
    "version" "text" NOT NULL,
    "content" "text" NOT NULL,
    "summary" "text",
    "effective_at" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    "locale" "text" DEFAULT 'ja'::"text" NOT NULL,
    CONSTRAINT "terms_versions_type_check" CHECK (("type" = ANY (ARRAY['terms_of_service'::"text", 'privacy_policy'::"text"])))
);


ALTER TABLE "public"."terms_versions" OWNER TO "postgres";


COMMENT ON TABLE "public"."terms_versions" IS '利用規約・プライバシーポリシーのバージョン管理';



COMMENT ON COLUMN "public"."terms_versions"."type" IS '文書タイプ: terms_of_service（利用規約）, privacy_policy（プライバシーポリシー）';



COMMENT ON COLUMN "public"."terms_versions"."version" IS 'バージョン番号（例: 1.0.0）';



COMMENT ON COLUMN "public"."terms_versions"."content" IS '規約本文（マークダウン形式）';



COMMENT ON COLUMN "public"."terms_versions"."summary" IS '変更概要（更新時のユーザー通知用）';



COMMENT ON COLUMN "public"."terms_versions"."effective_at" IS '施行日時';



COMMENT ON COLUMN "public"."terms_versions"."locale" IS '言語コード（ja, en, cn, tw）';



CREATE OR REPLACE VIEW "public"."current_terms_versions" AS
 SELECT DISTINCT ON ("type", "locale") "id",
    "type",
    "version",
    "content",
    "summary",
    "effective_at",
    "created_at",
    "locale"
   FROM "public"."terms_versions"
  WHERE ("effective_at" <= "now"())
  ORDER BY "type", "locale", "effective_at" DESC;


ALTER VIEW "public"."current_terms_versions" OWNER TO "postgres";


COMMENT ON VIEW "public"."current_terms_versions" IS '現在有効な利用規約・プライバシーポリシーの最新バージョン（言語別）';



CREATE TABLE IF NOT EXISTS "public"."deletion_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "requested_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "scheduled_at" timestamp with time zone DEFAULT ("now"() + '30 days'::interval) NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "cancelled_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email" "text",
    "reason" "text",
    CONSTRAINT "deletion_requests_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'cancelled'::"text", 'completed'::"text"])))
);


ALTER TABLE "public"."deletion_requests" OWNER TO "postgres";


COMMENT ON TABLE "public"."deletion_requests" IS 'アカウント削除リクエスト管理テーブル';



COMMENT ON COLUMN "public"."deletion_requests"."user_id" IS '削除対象のユーザーID（削除完了後はNULL）';



COMMENT ON COLUMN "public"."deletion_requests"."requested_at" IS '削除リクエスト日時';



COMMENT ON COLUMN "public"."deletion_requests"."scheduled_at" IS '削除予定日時（デフォルト: リクエストから30日後）';



COMMENT ON COLUMN "public"."deletion_requests"."status" IS 'ステータス: pending(保留中), cancelled(キャンセル), completed(完了)';



COMMENT ON COLUMN "public"."deletion_requests"."cancelled_at" IS 'キャンセル日時';



COMMENT ON COLUMN "public"."deletion_requests"."completed_at" IS '削除完了日時';



COMMENT ON COLUMN "public"."deletion_requests"."email" IS '削除対象ユーザーのメールアドレス（再登録防止用）';



COMMENT ON COLUMN "public"."deletion_requests"."reason" IS '退会理由（任意）';



CREATE TABLE IF NOT EXISTS "public"."featured_category_maps" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category_id" "text" NOT NULL,
    "map_id" "uuid" NOT NULL,
    "display_order" integer DEFAULT 0 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."featured_category_maps" OWNER TO "postgres";


COMMENT ON TABLE "public"."featured_category_maps" IS 'カテゴリ別おすすめマップ（運営選定）';



COMMENT ON COLUMN "public"."featured_category_maps"."category_id" IS 'カテゴリID';



COMMENT ON COLUMN "public"."featured_category_maps"."map_id" IS 'マップID';



COMMENT ON COLUMN "public"."featured_category_maps"."display_order" IS '表示順序（小さい順）';



COMMENT ON COLUMN "public"."featured_category_maps"."is_active" IS '有効フラグ';



CREATE TABLE IF NOT EXISTS "public"."featured_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "image_url" "text" NOT NULL,
    "link_type" "public"."featured_link_type" DEFAULT 'magazine'::"public"."featured_link_type" NOT NULL,
    "link_value" "text",
    "display_order" integer DEFAULT 0 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "starts_at" timestamp with time zone,
    "ends_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "category_id" "text",
    "magazine_id" "uuid"
);


ALTER TABLE "public"."featured_items" OWNER TO "postgres";


COMMENT ON TABLE "public"."featured_items" IS '特集アイテム（カルーセルバナー等）';



COMMENT ON COLUMN "public"."featured_items"."title" IS '表示タイトル';



COMMENT ON COLUMN "public"."featured_items"."description" IS 'サブタイトル・説明';



COMMENT ON COLUMN "public"."featured_items"."image_url" IS 'バナー画像URL';



COMMENT ON COLUMN "public"."featured_items"."link_type" IS 'リンクタイプ: url=外部リンク, magazine=マガジンページ';



COMMENT ON COLUMN "public"."featured_items"."link_value" IS 'リンク先の値';



COMMENT ON COLUMN "public"."featured_items"."display_order" IS '表示順（小さい順）';



COMMENT ON COLUMN "public"."featured_items"."is_active" IS '公開フラグ';



COMMENT ON COLUMN "public"."featured_items"."starts_at" IS '表示開始日時';



COMMENT ON COLUMN "public"."featured_items"."ends_at" IS '表示終了日時';



COMMENT ON COLUMN "public"."featured_items"."category_id" IS 'カテゴリID（NULLの場合は「すべて」カテゴリで表示）';



COMMENT ON COLUMN "public"."featured_items"."magazine_id" IS 'マガジンID（link_type=magazineの場合）';



CREATE TABLE IF NOT EXISTS "public"."follows" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "follower_id" "uuid" NOT NULL,
    "followee_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."follows" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."images" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_spot_id" "uuid" NOT NULL,
    "local_path" "text",
    "cloud_path" "text",
    "width" integer,
    "height" integer,
    "file_size" integer,
    "order_index" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."images" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."likes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "map_id" "uuid",
    "user_spot_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "likes_check" CHECK (((("map_id" IS NOT NULL) AND ("user_spot_id" IS NULL)) OR (("map_id" IS NULL) AND ("user_spot_id" IS NOT NULL))))
);


ALTER TABLE "public"."likes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."machi" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "latitude" double precision,
    "longitude" double precision,
    "prefecture_id" "text" NOT NULL,
    "city_id" "text",
    "name_kana" "text",
    "name_translations" "jsonb",
    "prefecture_name" "text" NOT NULL,
    "prefecture_name_translations" "jsonb",
    "city_name" "text",
    "city_name_translations" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "osm_id" bigint,
    "place_type" "text",
    "tile_id" "text"
);


ALTER TABLE "public"."machi" OWNER TO "postgres";


COMMENT ON TABLE "public"."machi" IS 'エリア（街）マスター。リリース後に需要のある市から段階的にデータを追加。ポリゴンデータは将来追加予定。';



CREATE TABLE IF NOT EXISTS "public"."magazine_maps" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "magazine_id" "uuid" NOT NULL,
    "map_id" "uuid" NOT NULL,
    "display_order" integer DEFAULT 0 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "source_type" "public"."featured_source_type" DEFAULT 'manual'::"public"."featured_source_type" NOT NULL,
    "source_tag" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "section_id" "uuid"
);


ALTER TABLE "public"."magazine_maps" OWNER TO "postgres";


COMMENT ON TABLE "public"."magazine_maps" IS 'マガジンに紐づくマップ';



COMMENT ON COLUMN "public"."magazine_maps"."magazine_id" IS 'マガジンID';



COMMENT ON COLUMN "public"."magazine_maps"."map_id" IS 'マップID';



COMMENT ON COLUMN "public"."magazine_maps"."display_order" IS '表示順序（小さい順）';



COMMENT ON COLUMN "public"."magazine_maps"."is_active" IS '有効フラグ';



COMMENT ON COLUMN "public"."magazine_maps"."source_type" IS '登録元タイプ: tag=タグ一括登録, manual=手動登録';



COMMENT ON COLUMN "public"."magazine_maps"."source_tag" IS 'タグ一括登録時のタグ名（source_type=tagの場合のみ）';



COMMENT ON COLUMN "public"."magazine_maps"."section_id" IS 'セクションID（NULLの場合はセクションなし）';



CREATE TABLE IF NOT EXISTS "public"."magazine_sections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "magazine_id" "uuid" NOT NULL,
    "title" "text",
    "description" "text",
    "display_order" integer DEFAULT 0 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "thumbnail_url" "text",
    "name" "text" NOT NULL
);


ALTER TABLE "public"."magazine_sections" OWNER TO "postgres";


COMMENT ON TABLE "public"."magazine_sections" IS 'マガジン内のセクション（カテゴリ分け用）';



COMMENT ON COLUMN "public"."magazine_sections"."magazine_id" IS 'マガジンID';



COMMENT ON COLUMN "public"."magazine_sections"."title" IS 'タイトル（大きく表示）';



COMMENT ON COLUMN "public"."magazine_sections"."description" IS '説明文（任意）';



COMMENT ON COLUMN "public"."magazine_sections"."display_order" IS '表示順序（小さい順）';



COMMENT ON COLUMN "public"."magazine_sections"."is_active" IS '有効フラグ';



COMMENT ON COLUMN "public"."magazine_sections"."thumbnail_url" IS 'セクションのサムネイル画像URL';



COMMENT ON COLUMN "public"."magazine_sections"."name" IS 'セクション名（ヘッダー表示用）';



CREATE TABLE IF NOT EXISTS "public"."magazines" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "thumbnail_url" "text",
    "published_at" timestamp with time zone DEFAULT "now"(),
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."magazines" OWNER TO "postgres";


COMMENT ON TABLE "public"."magazines" IS 'マガジン（特集記事）';



COMMENT ON COLUMN "public"."magazines"."title" IS 'タイトル（サムネイル下に大きく表示）';



COMMENT ON COLUMN "public"."magazines"."description" IS '概要・説明文';



COMMENT ON COLUMN "public"."magazines"."thumbnail_url" IS 'サムネイル画像URL';



COMMENT ON COLUMN "public"."magazines"."published_at" IS '公開日時';



COMMENT ON COLUMN "public"."magazines"."is_active" IS '公開フラグ';



COMMENT ON COLUMN "public"."magazines"."name" IS 'マガジン名（ヘッダー表示用）';



CREATE TABLE IF NOT EXISTS "public"."map_labels" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "map_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "color" "text" DEFAULT 'blue'::"text" NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."map_labels" OWNER TO "postgres";


COMMENT ON TABLE "public"."map_labels" IS 'マップごとのラベル定義（スポットの種類分け用）';



COMMENT ON COLUMN "public"."map_labels"."name" IS 'ラベル名（例: ドトール、スタバ）';



COMMENT ON COLUMN "public"."map_labels"."color" IS 'ラベルの色（pink, red, orange, yellow, green, blue, purple, gray, white）';



COMMENT ON COLUMN "public"."map_labels"."sort_order" IS '表示順';



CREATE TABLE IF NOT EXISTS "public"."map_tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "map_id" "uuid" NOT NULL,
    "tag_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."map_tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."maps" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "is_public" boolean DEFAULT false NOT NULL,
    "is_official" boolean DEFAULT false NOT NULL,
    "thumbnail_url" "text",
    "spots_count" integer DEFAULT 0 NOT NULL,
    "likes_count" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "comments_count" integer DEFAULT 0 NOT NULL,
    "bookmarks_count" integer DEFAULT 0 NOT NULL,
    "category_id" "text",
    "article_intro" "jsonb",
    "article_outro" "jsonb",
    "show_label_chips" boolean DEFAULT false,
    "language" character varying(10) DEFAULT NULL::character varying
);


ALTER TABLE "public"."maps" OWNER TO "postgres";


COMMENT ON COLUMN "public"."maps"."is_public" IS 'マップが公開されているかどうか（デフォルト: false）';



COMMENT ON COLUMN "public"."maps"."is_official" IS '公式マップかどうか（デフォルト: false）';



COMMENT ON COLUMN "public"."maps"."spots_count" IS 'スポット数（デフォルト: 0）';



COMMENT ON COLUMN "public"."maps"."likes_count" IS 'いいね数（デフォルト: 0）';



COMMENT ON COLUMN "public"."maps"."comments_count" IS 'コメント数（デフォルト: 0）';



COMMENT ON COLUMN "public"."maps"."bookmarks_count" IS 'ブックマーク数（デフォルト: 0）';



COMMENT ON COLUMN "public"."maps"."category_id" IS 'カテゴリへの外部キー参照';



COMMENT ON COLUMN "public"."maps"."article_intro" IS 'マップ記事のまえがき（ProseMirror JSON形式）';



COMMENT ON COLUMN "public"."maps"."article_outro" IS 'マップ記事のあとがき（ProseMirror JSON形式）';



COMMENT ON COLUMN "public"."maps"."show_label_chips" IS 'ラベルチップをマップ上部に表示するかどうか';



COMMENT ON COLUMN "public"."maps"."language" IS 'Detected language code (ISO 639-1) for content filtering';



CREATE TABLE IF NOT EXISTS "public"."user_spots" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "map_id" "uuid" NOT NULL,
    "master_spot_id" "uuid",
    "machi_id" "text",
    "description" "text" NOT NULL,
    "images_count" integer DEFAULT 0 NOT NULL,
    "likes_count" integer DEFAULT 0 NOT NULL,
    "comments_count" integer DEFAULT 0 NOT NULL,
    "order_index" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "article_content" "jsonb",
    "latitude" double precision NOT NULL,
    "longitude" double precision NOT NULL,
    "bookmarks_count" integer DEFAULT 0 NOT NULL,
    "spot_color" "text" DEFAULT 'blue'::"text",
    "label_id" "uuid",
    "language" character varying(10) DEFAULT NULL::character varying,
    "google_formatted_address" "jsonb",
    "google_short_address" "jsonb",
    "name" "jsonb",
    "is_public" boolean DEFAULT false NOT NULL,
    "prefecture_id" "text",
    "city_id" "text",
    "thumbnail_image_id" "uuid"
);


ALTER TABLE "public"."user_spots" OWNER TO "postgres";


COMMENT ON COLUMN "public"."user_spots"."machi_id" IS '街ID。machi テーブルとの JOIN に使用。NULL の場合は街に紐づかないスポット（ピン刺し・現在地登録など）';



COMMENT ON COLUMN "public"."user_spots"."description" IS 'スポットの説明（一言キャッチコピー）';



COMMENT ON COLUMN "public"."user_spots"."images_count" IS '画像数（デフォルト: 0）';



COMMENT ON COLUMN "public"."user_spots"."likes_count" IS 'いいね数（デフォルト: 0）';



COMMENT ON COLUMN "public"."user_spots"."comments_count" IS 'コメント数（デフォルト: 0）';



COMMENT ON COLUMN "public"."user_spots"."order_index" IS '表示順序（デフォルト: 0）';



COMMENT ON COLUMN "public"."user_spots"."article_content" IS 'マップ記事用のスポット紹介文（ProseMirror JSON形式）';



COMMENT ON COLUMN "public"."user_spots"."bookmarks_count" IS 'ブックマーク数（デフォルト: 0）';



COMMENT ON COLUMN "public"."user_spots"."spot_color" IS 'スポットの色（pink, red, orange, yellow, green, blue, purple, gray, white）';



COMMENT ON COLUMN "public"."user_spots"."label_id" IS 'スポットのラベル（map_labelsへの外部キー）';



COMMENT ON COLUMN "public"."user_spots"."language" IS 'Detected language code (ISO 639-1) for content filtering';



COMMENT ON COLUMN "public"."user_spots"."google_formatted_address" IS '多言語住所（完全形式）- ピン刺し/現在地登録用: {"ja": "日本語", "en": "English"}';



COMMENT ON COLUMN "public"."user_spots"."google_short_address" IS '多言語住所（短縮形式）- ピン刺し/現在地登録用: {"ja": "日本語", "en": "English"}';



COMMENT ON COLUMN "public"."user_spots"."name" IS '多言語スポット名（現在地/ピン刺し登録用）: {"ja": "日本語名", "en": "English name"}。master_spot_idがNULLの場合のみ使用';



COMMENT ON COLUMN "public"."user_spots"."is_public" IS 'スポットが公開されているかどうか（デフォルト: false = 下書き）。記事（article_content）を書いて公開ボタンを押すとtrueになる';



COMMENT ON COLUMN "public"."user_spots"."prefecture_id" IS '都道府県ID。スポット作成時に座標から自動判定。エリア検索に使用';



COMMENT ON COLUMN "public"."user_spots"."city_id" IS '市区町村ID。スポット作成時に座標から自動判定。エリア検索に使用';



COMMENT ON COLUMN "public"."user_spots"."thumbnail_image_id" IS 'サムネイルとして表示する画像のID。NULLの場合は記事に挿入されていない画像のうちorder_indexが最小のものを使用';



CREATE OR REPLACE VIEW "public"."maps_public" AS
 SELECT "id",
    "user_id",
    "name",
    "description",
    "thumbnail_url",
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



CREATE TABLE IF NOT EXISTS "public"."master_spot_favorites" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "master_spot_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."master_spot_favorites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."master_spots" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "latitude" double precision NOT NULL,
    "longitude" double precision NOT NULL,
    "google_place_id" "text",
    "google_types" "text"[],
    "google_phone_number" "text",
    "google_website_uri" "text",
    "google_rating" double precision,
    "google_user_rating_count" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "machi_id" "text",
    "favorites_count" integer DEFAULT 0 NOT NULL,
    "google_formatted_address" "jsonb",
    "google_short_address" "jsonb",
    "name" "jsonb" NOT NULL
);


ALTER TABLE "public"."master_spots" OWNER TO "postgres";


COMMENT ON COLUMN "public"."master_spots"."google_formatted_address" IS '多言語住所（完全形式）: {"ja": "日本語", "en": "English"}';



COMMENT ON COLUMN "public"."master_spots"."google_short_address" IS '多言語住所（短縮形式）: {"ja": "日本語", "en": "English"}';



COMMENT ON COLUMN "public"."master_spots"."name" IS '多言語スポット名: {"ja": "日本語名", "en": "English name"}';



CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "actor_id" "uuid",
    "type" "text" NOT NULL,
    "user_spot_id" "uuid",
    "map_id" "uuid",
    "comment_id" "uuid",
    "content" "text",
    "is_read" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "notifications_type_id_check" CHECK (((("type" = ANY (ARRAY['like_spot'::"text", 'comment_spot'::"text"])) AND ("user_spot_id" IS NOT NULL)) OR (("type" = ANY (ARRAY['like_map'::"text", 'comment_map'::"text"])) AND ("map_id" IS NOT NULL)) OR (("type" = 'follow'::"text") AND ("actor_id" IS NOT NULL)) OR ("type" = 'system'::"text"))),
    CONSTRAINT "valid_notification_type" CHECK (("type" = ANY (ARRAY['like_spot'::"text", 'like_map'::"text", 'comment_spot'::"text", 'comment_map'::"text", 'follow'::"text", 'system'::"text"])))
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."prefectures" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "name_kana" "text",
    "region_id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "latitude" double precision NOT NULL,
    "longitude" double precision NOT NULL,
    "name_translations" "jsonb"
);


ALTER TABLE "public"."prefectures" OWNER TO "postgres";


COMMENT ON COLUMN "public"."prefectures"."name_translations" IS '多言語翻訳 {"en": "Tokyo", "zh": "东京"}';



CREATE TABLE IF NOT EXISTS "public"."regions" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "name_kana" "text",
    "display_order" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "latitude" double precision NOT NULL,
    "longitude" double precision NOT NULL,
    "name_translations" "jsonb",
    "country_id" "text" NOT NULL
);


ALTER TABLE "public"."regions" OWNER TO "postgres";


COMMENT ON COLUMN "public"."regions"."name_translations" IS '多言語翻訳 {"en": "Kanto", "zh": "关东"}';



CREATE TABLE IF NOT EXISTS "public"."reports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "reporter_id" "uuid" NOT NULL,
    "target_type" "public"."report_target_type" NOT NULL,
    "target_id" "uuid" NOT NULL,
    "reason" "public"."report_reason" DEFAULT 'other'::"public"."report_reason" NOT NULL,
    "description" "text",
    "status" "public"."report_status" DEFAULT 'pending'::"public"."report_status" NOT NULL,
    "admin_notes" "text",
    "resolved_at" timestamp with time zone,
    "resolved_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."reports" OWNER TO "postgres";


COMMENT ON TABLE "public"."reports" IS '報告機能テーブル';



COMMENT ON COLUMN "public"."reports"."reporter_id" IS '報告したユーザーID';



COMMENT ON COLUMN "public"."reports"."target_type" IS '報告対象のタイプ（map, spot, user, comment）';



COMMENT ON COLUMN "public"."reports"."target_id" IS '報告対象のID';



COMMENT ON COLUMN "public"."reports"."reason" IS '報告理由';



COMMENT ON COLUMN "public"."reports"."description" IS '報告の詳細説明';



COMMENT ON COLUMN "public"."reports"."status" IS '報告のステータス';



COMMENT ON COLUMN "public"."reports"."admin_notes" IS '管理者のメモ';



COMMENT ON COLUMN "public"."reports"."resolved_at" IS '解決日時';



COMMENT ON COLUMN "public"."reports"."resolved_by" IS '解決した管理者のID';



CREATE TABLE IF NOT EXISTS "public"."schedules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "machi_id" "text" NOT NULL,
    "scheduled_at" timestamp with time zone NOT NULL,
    "title" "text" NOT NULL,
    "memo" "text",
    "is_completed" boolean DEFAULT false NOT NULL,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."schedules" OWNER TO "postgres";


COMMENT ON TABLE "public"."schedules" IS 'ユーザーの予定（街への訪問予定など）';



COMMENT ON COLUMN "public"."schedules"."id" IS '予定ID';



COMMENT ON COLUMN "public"."schedules"."user_id" IS 'ユーザーID';



COMMENT ON COLUMN "public"."schedules"."machi_id" IS '街ID';



COMMENT ON COLUMN "public"."schedules"."scheduled_at" IS '予定日時';



COMMENT ON COLUMN "public"."schedules"."title" IS '予定タイトル';



COMMENT ON COLUMN "public"."schedules"."memo" IS 'メモ';



COMMENT ON COLUMN "public"."schedules"."is_completed" IS '完了済みかどうか';



COMMENT ON COLUMN "public"."schedules"."completed_at" IS '完了日時';



CREATE TABLE IF NOT EXISTS "public"."search_analytics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "query" "text" NOT NULL,
    "search_type" "text" DEFAULT 'discover'::"text" NOT NULL,
    "search_count" integer DEFAULT 1 NOT NULL,
    "gender" "text",
    "age_group" "text",
    "prefecture" "text",
    "first_searched_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_searched_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "country" "text",
    CONSTRAINT "search_analytics_age_group_check" CHECK ((("age_group" IS NULL) OR ("age_group" = ANY (ARRAY['10s'::"text", '20s'::"text", '30s'::"text", '40s'::"text", '50s'::"text", '60s+'::"text"])))),
    CONSTRAINT "search_analytics_gender_check" CHECK ((("gender" IS NULL) OR ("gender" = ANY (ARRAY['male'::"text", 'female'::"text", 'other'::"text"])))),
    CONSTRAINT "search_analytics_search_type_check" CHECK (("search_type" = ANY (ARRAY['discover'::"text", 'defaultMap'::"text", 'userMap'::"text"])))
);


ALTER TABLE "public"."search_analytics" OWNER TO "postgres";


COMMENT ON TABLE "public"."search_analytics" IS '検索分析用データ（匿名化、長期保存）';



COMMENT ON COLUMN "public"."search_analytics"."query" IS '検索クエリ';



COMMENT ON COLUMN "public"."search_analytics"."search_type" IS '検索タイプ: discover, defaultMap, userMap';



COMMENT ON COLUMN "public"."search_analytics"."search_count" IS '検索回数';



COMMENT ON COLUMN "public"."search_analytics"."gender" IS '性別（匿名）: male, female, other';



COMMENT ON COLUMN "public"."search_analytics"."age_group" IS '年代（匿名）: 10s, 20s, 30s, 40s, 50s+';



COMMENT ON COLUMN "public"."search_analytics"."prefecture" IS '居住都道府県（匿名）';



COMMENT ON COLUMN "public"."search_analytics"."first_searched_at" IS '初回検索日時';



COMMENT ON COLUMN "public"."search_analytics"."last_searched_at" IS '最終検索日時';



COMMENT ON COLUMN "public"."search_analytics"."country" IS '居住国（ISO 3166-1 alpha-2）: jp, us, etc.';



CREATE TABLE IF NOT EXISTS "public"."search_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "query" "text" NOT NULL,
    "search_type" "text" DEFAULT 'discover'::"text" NOT NULL,
    "searched_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "search_history_search_type_check" CHECK (("search_type" = ANY (ARRAY['discover'::"text", 'defaultMap'::"text", 'userMap'::"text"])))
);


ALTER TABLE "public"."search_history" OWNER TO "postgres";


COMMENT ON TABLE "public"."search_history" IS 'ユーザーの検索履歴（クラウド同期対応）';



COMMENT ON COLUMN "public"."search_history"."user_id" IS '検索したユーザーID';



COMMENT ON COLUMN "public"."search_history"."query" IS '検索クエリ';



COMMENT ON COLUMN "public"."search_history"."search_type" IS '検索タイプ: discover, defaultMap, userMap';



COMMENT ON COLUMN "public"."search_history"."searched_at" IS '検索日時';



CREATE TABLE IF NOT EXISTS "public"."spot_shorts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "spot_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "video_url" "text" NOT NULL,
    "thumbnail_url" "text",
    "duration_seconds" smallint,
    "width" smallint,
    "height" smallint,
    "file_size_bytes" integer,
    "order_index" smallint DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "duration_max_30s" CHECK ((("duration_seconds" IS NULL) OR ("duration_seconds" <= 30)))
);


ALTER TABLE "public"."spot_shorts" OWNER TO "postgres";


COMMENT ON TABLE "public"."spot_shorts" IS 'スポットに紐づくショート動画（30秒以内）';



COMMENT ON COLUMN "public"."spot_shorts"."video_url" IS 'Supabase Storageに保存された動画のURL';



COMMENT ON COLUMN "public"."spot_shorts"."thumbnail_url" IS '動画のサムネイル画像URL（任意）';



COMMENT ON COLUMN "public"."spot_shorts"."duration_seconds" IS '動画の長さ（秒）。最大30秒';



CREATE TABLE IF NOT EXISTS "public"."spot_tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_spot_id" "uuid" NOT NULL,
    "tag_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."spot_tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."system_announcement_reads" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "announcement_id" "uuid" NOT NULL,
    "read_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."system_announcement_reads" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."system_announcements" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "type" "text" DEFAULT 'info'::"text",
    "is_active" boolean DEFAULT true,
    "published_at" timestamp with time zone DEFAULT "now"(),
    "expires_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."system_announcements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "name_translations" "jsonb",
    "slug" "text" NOT NULL,
    "usage_count" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."terms_agreements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "terms_version_id" "uuid" NOT NULL,
    "privacy_version_id" "uuid" NOT NULL,
    "agreed_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "ip_address" "inet",
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."terms_agreements" OWNER TO "postgres";


COMMENT ON TABLE "public"."terms_agreements" IS 'ユーザーの利用規約・プライバシーポリシー同意履歴';



COMMENT ON COLUMN "public"."terms_agreements"."user_id" IS '同意したユーザーID';



COMMENT ON COLUMN "public"."terms_agreements"."terms_version_id" IS '同意した利用規約のバージョンID';



COMMENT ON COLUMN "public"."terms_agreements"."privacy_version_id" IS '同意したプライバシーポリシーのバージョンID';



COMMENT ON COLUMN "public"."terms_agreements"."agreed_at" IS '同意日時';



COMMENT ON COLUMN "public"."terms_agreements"."ip_address" IS '同意時のIPアドレス（法的証跡）';



COMMENT ON COLUMN "public"."terms_agreements"."user_agent" IS '同意時のユーザーエージェント（法的証跡）';



CREATE TABLE IF NOT EXISTS "public"."transport_hubs" (
    "id" "text" NOT NULL,
    "osm_id" bigint,
    "osm_type" "text",
    "prefecture_id" "text" NOT NULL,
    "city_id" "text",
    "type" "text" NOT NULL,
    "subtype" "text",
    "name" "text" NOT NULL,
    "name_kana" "text",
    "operator" "text",
    "network" "text",
    "ref" "text",
    "latitude" double precision NOT NULL,
    "longitude" double precision NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "tile_id" "text" NOT NULL,
    "name_translations" "jsonb",
    CONSTRAINT "transport_hubs_type_check" CHECK (("type" = ANY (ARRAY['station'::"text", 'airport'::"text", 'ferry_terminal'::"text", 'bus_terminal'::"text"])))
);


ALTER TABLE "public"."transport_hubs" OWNER TO "postgres";


COMMENT ON TABLE "public"."transport_hubs" IS '交通機関データ（駅、空港、フェリーターミナル、バスターミナル）';



COMMENT ON COLUMN "public"."transport_hubs"."id" IS '一意識別子（prefecture_type_osmid形式）';



COMMENT ON COLUMN "public"."transport_hubs"."osm_id" IS 'OpenStreetMapのID';



COMMENT ON COLUMN "public"."transport_hubs"."osm_type" IS 'OSMの要素タイプ（node/way/relation）';



COMMENT ON COLUMN "public"."transport_hubs"."prefecture_id" IS '都道府県ID';



COMMENT ON COLUMN "public"."transport_hubs"."city_id" IS '市区町村ID（オプション）';



COMMENT ON COLUMN "public"."transport_hubs"."type" IS '交通機関の種類（station/airport/ferry_terminal/bus_terminal）';



COMMENT ON COLUMN "public"."transport_hubs"."subtype" IS 'サブタイプ（駅: jr/metro/toei/subway/private、空港: international/domestic/military/heliport）';



COMMENT ON COLUMN "public"."transport_hubs"."name" IS '名称（日本語）';



COMMENT ON COLUMN "public"."transport_hubs"."name_kana" IS '名称（ふりがな）';



COMMENT ON COLUMN "public"."transport_hubs"."operator" IS '運営会社';



COMMENT ON COLUMN "public"."transport_hubs"."network" IS '路線網';



COMMENT ON COLUMN "public"."transport_hubs"."ref" IS '路線コード/空港コード';



COMMENT ON COLUMN "public"."transport_hubs"."latitude" IS '緯度';



COMMENT ON COLUMN "public"."transport_hubs"."longitude" IS '経度';



COMMENT ON COLUMN "public"."transport_hubs"."tile_id" IS 'タイルID（0.25度グリッド、例: "559_142"）';



COMMENT ON COLUMN "public"."transport_hubs"."name_translations" IS '多言語翻訳 {"en": "Shibuya Station", "cn": "涩谷站", "tw": "澀谷站"}';



CREATE OR REPLACE VIEW "public"."user_latest_agreements" AS
 SELECT DISTINCT ON ("ta"."user_id") "ta"."id",
    "ta"."user_id",
    "ta"."terms_version_id",
    "ta"."privacy_version_id",
    "ta"."agreed_at",
    "tv_terms"."version" AS "terms_version",
    "tv_privacy"."version" AS "privacy_version"
   FROM (("public"."terms_agreements" "ta"
     JOIN "public"."terms_versions" "tv_terms" ON (("ta"."terms_version_id" = "tv_terms"."id")))
     JOIN "public"."terms_versions" "tv_privacy" ON (("ta"."privacy_version_id" = "tv_privacy"."id")))
  ORDER BY "ta"."user_id", "ta"."agreed_at" DESC;


ALTER VIEW "public"."user_latest_agreements" OWNER TO "postgres";


COMMENT ON VIEW "public"."user_latest_agreements" IS 'ユーザーの最新の同意情報';



CREATE TABLE IF NOT EXISTS "public"."user_preferences" (
    "user_id" "uuid" NOT NULL,
    "theme" "text" DEFAULT 'system'::"text" NOT NULL,
    "locale" "text" DEFAULT 'system'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "content_languages" "text"[] DEFAULT ARRAY[]::"text"[],
    "preferred_categories" "text"[] DEFAULT ARRAY[]::"text"[],
    CONSTRAINT "user_preferences_locale_check" CHECK (("locale" = ANY (ARRAY['ja'::"text", 'en'::"text", 'cn'::"text", 'tw'::"text", 'system'::"text"]))),
    CONSTRAINT "user_preferences_preferred_categories_max_3" CHECK ((("array_length"("preferred_categories", 1) IS NULL) OR ("array_length"("preferred_categories", 1) <= 3))),
    CONSTRAINT "user_preferences_theme_check" CHECK (("theme" = ANY (ARRAY['light'::"text", 'dark'::"text", 'system'::"text"])))
);


ALTER TABLE "public"."user_preferences" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_preferences" IS 'ユーザーのアプリ設定（テーマ、言語など）';



COMMENT ON COLUMN "public"."user_preferences"."theme" IS 'テーマ設定: light, dark, 
  system（デフォルト: system）';



COMMENT ON COLUMN "public"."user_preferences"."locale" IS '言語設定: ja, en, cn, tw, 
  system（デフォルト: system）';



COMMENT ON COLUMN "public"."user_preferences"."content_languages" IS 'コンテンツ言語フィルター: 見たい言語コードの配列（空配列=全言語表示）';



COMMENT ON COLUMN "public"."user_preferences"."preferred_categories" IS '好みのカテゴリID（最大3つ、オンボーディングで収集）';



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "username" "text" NOT NULL,
    "display_name" "text" NOT NULL,
    "avatar_url" "text",
    "bio" "text",
    "is_premium" boolean DEFAULT false,
    "premium_started_at" timestamp with time zone,
    "premium_expires_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "push_token" "text",
    "push_token_updated_at" timestamp with time zone,
    "gender" "text",
    "age_group" "text",
    "prefecture" "text",
    "country" "text",
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "deletion_requested_at" timestamp with time zone,
    "suspended_at" timestamp with time zone,
    "suspended_reason" "text",
    CONSTRAINT "users_age_group_check" CHECK ((("age_group" IS NULL) OR ("age_group" = ANY (ARRAY['10s'::"text", '20s'::"text", '30s'::"text", '40s'::"text", '50s'::"text", '60s+'::"text"])))),
    CONSTRAINT "users_gender_check" CHECK ((("gender" IS NULL) OR ("gender" = ANY (ARRAY['male'::"text", 'female'::"text", 'other'::"text"])))),
    CONSTRAINT "users_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'deletion_pending'::"text", 'suspended'::"text", 'banned'::"text"])))
);


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON COLUMN "public"."users"."username" IS 'ユーザー名（@で表示される識別子）';



COMMENT ON COLUMN "public"."users"."display_name" IS '表示名（自由に設定できる名前）';



COMMENT ON COLUMN "public"."users"."gender" IS '性別: male, female, other（任意）';



COMMENT ON COLUMN "public"."users"."age_group" IS '年代: 10s, 20s, 30s, 40s, 50s, 60s+（任意）';



COMMENT ON COLUMN "public"."users"."prefecture" IS '居住地域（日本の場合は都道府県、他国の場合は州など）';



COMMENT ON COLUMN "public"."users"."country" IS '居住国（ISO 3166-1 alpha-2）: jp, us, kr, etc.';



COMMENT ON COLUMN "public"."users"."status" IS 'ユーザーステータス: active=通常, deletion_pending=退会手続き中, suspended=一時停止, banned=永久BAN';



COMMENT ON COLUMN "public"."users"."deletion_requested_at" IS '退会リクエスト日時';



COMMENT ON COLUMN "public"."users"."suspended_at" IS '一時停止日時';



COMMENT ON COLUMN "public"."users"."suspended_reason" IS '一時停止理由（管理者メモ）';



CREATE TABLE IF NOT EXISTS "public"."view_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "map_id" "uuid" NOT NULL,
    "viewed_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "view_count" integer DEFAULT 1 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."view_history" OWNER TO "postgres";


COMMENT ON TABLE "public"."view_history" IS '閲覧履歴（マップ）';



COMMENT ON COLUMN "public"."view_history"."user_id" IS '閲覧したユーザーID';



COMMENT ON COLUMN "public"."view_history"."map_id" IS '閲覧したマップID';



COMMENT ON COLUMN "public"."view_history"."viewed_at" IS '最終閲覧日時';



COMMENT ON COLUMN "public"."view_history"."view_count" IS '閲覧回数';



CREATE TABLE IF NOT EXISTS "public"."visits" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "machi_id" "text" NOT NULL,
    "visited_at" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."visits" OWNER TO "postgres";


COMMENT ON TABLE "public"."visits" IS 'ユーザーが訪問した街の記録（街ごとに1レコード、訪問有無のみ管理）';



COMMENT ON COLUMN "public"."visits"."machi_id" IS '訪問した街（駅）のID';



COMMENT ON COLUMN "public"."visits"."visited_at" IS '訪問した日時';



ALTER TABLE ONLY "public"."admin_boundaries"
    ADD CONSTRAINT "admin_boundaries_city_id_unique" UNIQUE ("city_id");



ALTER TABLE ONLY "public"."admin_boundaries"
    ADD CONSTRAINT "admin_boundaries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."bookmark_folders"
    ADD CONSTRAINT "bookmark_folders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cities"
    ADD CONSTRAINT "cities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."collection_maps"
    ADD CONSTRAINT "collection_maps_collection_id_map_id_key" UNIQUE ("collection_id", "map_id");



ALTER TABLE ONLY "public"."collection_maps"
    ADD CONSTRAINT "collection_maps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."collections"
    ADD CONSTRAINT "collections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."comment_likes"
    ADD CONSTRAINT "comment_likes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."comment_likes"
    ADD CONSTRAINT "comment_likes_user_id_comment_id_key" UNIQUE ("user_id", "comment_id");



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."continents"
    ADD CONSTRAINT "continents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."countries"
    ADD CONSTRAINT "countries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."deletion_requests"
    ADD CONSTRAINT "deletion_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."featured_category_maps"
    ADD CONSTRAINT "featured_category_maps_category_id_map_id_key" UNIQUE ("category_id", "map_id");



ALTER TABLE ONLY "public"."featured_category_maps"
    ADD CONSTRAINT "featured_category_maps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."featured_items"
    ADD CONSTRAINT "featured_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_follower_id_followee_id_key" UNIQUE ("follower_id", "followee_id");



ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."images"
    ADD CONSTRAINT "images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."machi"
    ADD CONSTRAINT "machi_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."magazine_maps"
    ADD CONSTRAINT "magazine_maps_magazine_id_map_id_key" UNIQUE ("magazine_id", "map_id");



ALTER TABLE ONLY "public"."magazine_maps"
    ADD CONSTRAINT "magazine_maps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."magazine_sections"
    ADD CONSTRAINT "magazine_sections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."magazines"
    ADD CONSTRAINT "magazines_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."map_labels"
    ADD CONSTRAINT "map_labels_map_id_name_key" UNIQUE ("map_id", "name");



ALTER TABLE ONLY "public"."map_labels"
    ADD CONSTRAINT "map_labels_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."map_tags"
    ADD CONSTRAINT "map_tags_map_id_tag_id_key" UNIQUE ("map_id", "tag_id");



ALTER TABLE ONLY "public"."map_tags"
    ADD CONSTRAINT "map_tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."maps"
    ADD CONSTRAINT "maps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."master_spot_favorites"
    ADD CONSTRAINT "master_spot_favorites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."master_spot_favorites"
    ADD CONSTRAINT "master_spot_favorites_user_id_master_spot_id_key" UNIQUE ("user_id", "master_spot_id");



ALTER TABLE ONLY "public"."master_spots"
    ADD CONSTRAINT "master_spots_google_place_id_key" UNIQUE ("google_place_id");



ALTER TABLE ONLY "public"."master_spots"
    ADD CONSTRAINT "master_spots_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."prefectures"
    ADD CONSTRAINT "prefectures_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."prefectures"
    ADD CONSTRAINT "prefectures_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."regions"
    ADD CONSTRAINT "regions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schedules"
    ADD CONSTRAINT "schedules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."search_analytics"
    ADD CONSTRAINT "search_analytics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."search_analytics"
    ADD CONSTRAINT "search_analytics_unique" UNIQUE NULLS NOT DISTINCT ("query", "search_type", "gender", "age_group", "prefecture", "country");



ALTER TABLE ONLY "public"."search_history"
    ADD CONSTRAINT "search_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."spot_shorts"
    ADD CONSTRAINT "spot_shorts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."spot_tags"
    ADD CONSTRAINT "spot_tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."spot_tags"
    ADD CONSTRAINT "spot_tags_user_spot_id_tag_id_key" UNIQUE ("user_spot_id", "tag_id");



ALTER TABLE ONLY "public"."system_announcements"
    ADD CONSTRAINT "system_announcements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."terms_agreements"
    ADD CONSTRAINT "terms_agreements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."terms_versions"
    ADD CONSTRAINT "terms_versions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."terms_versions"
    ADD CONSTRAINT "terms_versions_type_version_locale_unique" UNIQUE ("type", "version", "locale");



ALTER TABLE ONLY "public"."transport_hubs"
    ADD CONSTRAINT "transport_hubs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."system_announcement_reads"
    ADD CONSTRAINT "user_announcement_reads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."system_announcement_reads"
    ADD CONSTRAINT "user_announcement_reads_user_id_announcement_id_key" UNIQUE ("user_id", "announcement_id");



ALTER TABLE ONLY "public"."user_notification_settings"
    ADD CONSTRAINT "user_notification_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_notification_settings"
    ADD CONSTRAINT "user_notification_settings_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."user_preferences"
    ADD CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."user_spots"
    ADD CONSTRAINT "user_spots_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_spots"
    ADD CONSTRAINT "user_spots_user_id_map_id_master_spot_id_key" UNIQUE ("user_id", "map_id", "master_spot_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."view_history"
    ADD CONSTRAINT "view_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."view_history"
    ADD CONSTRAINT "view_history_user_id_map_id_key" UNIQUE ("user_id", "map_id");



ALTER TABLE ONLY "public"."visits"
    ADD CONSTRAINT "visits_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."visits"
    ADD CONSTRAINT "visits_user_id_machi_id_key" UNIQUE ("user_id", "machi_id");



CREATE UNIQUE INDEX "bookmarks_user_map_folder_unique" ON "public"."bookmarks" USING "btree" ("user_id", "map_id", COALESCE("folder_id", '00000000-0000-0000-0000-000000000000'::"uuid")) WHERE ("map_id" IS NOT NULL);



CREATE UNIQUE INDEX "bookmarks_user_spot_folder_unique" ON "public"."bookmarks" USING "btree" ("user_id", "user_spot_id", COALESCE("folder_id", '00000000-0000-0000-0000-000000000000'::"uuid")) WHERE ("user_spot_id" IS NOT NULL);



CREATE INDEX "comments_reply_to_user_id_idx" ON "public"."comments" USING "btree" ("reply_to_user_id");



CREATE INDEX "idx_admin_boundaries_admin_level" ON "public"."admin_boundaries" USING "btree" ("admin_level");



CREATE INDEX "idx_admin_boundaries_city_id" ON "public"."admin_boundaries" USING "btree" ("city_id");



CREATE INDEX "idx_admin_boundaries_country_id" ON "public"."admin_boundaries" USING "btree" ("country_id");



CREATE INDEX "idx_admin_boundaries_country_level" ON "public"."admin_boundaries" USING "btree" ("country_id", "admin_level");



CREATE INDEX "idx_admin_boundaries_geom" ON "public"."admin_boundaries" USING "gist" ("geom");



CREATE INDEX "idx_admin_boundaries_prefecture_id" ON "public"."admin_boundaries" USING "btree" ("prefecture_id");



CREATE INDEX "idx_admin_users_user_id" ON "public"."admin_users" USING "btree" ("user_id");



CREATE INDEX "idx_bookmark_folders_type" ON "public"."bookmark_folders" USING "btree" ("folder_type");



CREATE INDEX "idx_bookmark_folders_user_id" ON "public"."bookmark_folders" USING "btree" ("user_id");



CREATE INDEX "idx_bookmarks_folder_id" ON "public"."bookmarks" USING "btree" ("folder_id");



CREATE INDEX "idx_bookmarks_map_id" ON "public"."bookmarks" USING "btree" ("map_id");



CREATE INDEX "idx_bookmarks_user_id" ON "public"."bookmarks" USING "btree" ("user_id");



CREATE INDEX "idx_bookmarks_user_spot_id" ON "public"."bookmarks" USING "btree" ("user_spot_id");



CREATE INDEX "idx_categories_display_order" ON "public"."categories" USING "btree" ("display_order");



CREATE INDEX "idx_categories_is_active" ON "public"."categories" USING "btree" ("is_active");



CREATE INDEX "idx_cities_name_translations" ON "public"."cities" USING "gin" ("name_translations");



CREATE INDEX "idx_cities_prefecture_id" ON "public"."cities" USING "btree" ("prefecture_id");



CREATE INDEX "idx_cities_tile_id" ON "public"."cities" USING "btree" ("tile_id");



CREATE INDEX "idx_collection_maps_collection_id" ON "public"."collection_maps" USING "btree" ("collection_id");



CREATE INDEX "idx_collection_maps_map_id" ON "public"."collection_maps" USING "btree" ("map_id");



CREATE INDEX "idx_collections_is_public" ON "public"."collections" USING "btree" ("is_public");



CREATE INDEX "idx_collections_user_id" ON "public"."collections" USING "btree" ("user_id");



CREATE INDEX "idx_comment_likes_comment_id" ON "public"."comment_likes" USING "btree" ("comment_id");



CREATE INDEX "idx_comment_likes_user_id" ON "public"."comment_likes" USING "btree" ("user_id");



CREATE INDEX "idx_comments_created_at" ON "public"."comments" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_comments_depth" ON "public"."comments" USING "btree" ("depth");



CREATE INDEX "idx_comments_map_id" ON "public"."comments" USING "btree" ("map_id");



CREATE INDEX "idx_comments_parent_id" ON "public"."comments" USING "btree" ("parent_id");



CREATE INDEX "idx_comments_root_id" ON "public"."comments" USING "btree" ("root_id");



CREATE INDEX "idx_comments_user_id" ON "public"."comments" USING "btree" ("user_id");



CREATE INDEX "idx_comments_user_spot_id" ON "public"."comments" USING "btree" ("user_spot_id");



CREATE INDEX "idx_continents_name_translations" ON "public"."continents" USING "gin" ("name_translations");



CREATE INDEX "idx_countries_name_translations" ON "public"."countries" USING "gin" ("name_translations");



CREATE INDEX "idx_deletion_requests_email" ON "public"."deletion_requests" USING "btree" ("email") WHERE ("status" = 'pending'::"text");



CREATE INDEX "idx_deletion_requests_scheduled_at" ON "public"."deletion_requests" USING "btree" ("scheduled_at") WHERE ("status" = 'pending'::"text");



CREATE INDEX "idx_deletion_requests_status" ON "public"."deletion_requests" USING "btree" ("status");



CREATE INDEX "idx_deletion_requests_user_id" ON "public"."deletion_requests" USING "btree" ("user_id");



CREATE INDEX "idx_featured_category_maps_active" ON "public"."featured_category_maps" USING "btree" ("is_active") WHERE ("is_active" = true);



CREATE INDEX "idx_featured_category_maps_category" ON "public"."featured_category_maps" USING "btree" ("category_id");



CREATE INDEX "idx_featured_items_active_order" ON "public"."featured_items" USING "btree" ("is_active", "display_order") WHERE ("is_active" = true);



CREATE INDEX "idx_featured_items_category" ON "public"."featured_items" USING "btree" ("category_id");



CREATE INDEX "idx_follows_followee_id" ON "public"."follows" USING "btree" ("followee_id");



CREATE INDEX "idx_follows_follower_id" ON "public"."follows" USING "btree" ("follower_id");



CREATE INDEX "idx_images_user_spot_id" ON "public"."images" USING "btree" ("user_spot_id");



CREATE INDEX "idx_likes_map_id" ON "public"."likes" USING "btree" ("map_id");



CREATE INDEX "idx_likes_user_id" ON "public"."likes" USING "btree" ("user_id");



CREATE INDEX "idx_likes_user_spot_id" ON "public"."likes" USING "btree" ("user_spot_id");



CREATE INDEX "idx_machi_city_id" ON "public"."machi" USING "btree" ("city_id");



CREATE INDEX "idx_machi_name" ON "public"."machi" USING "btree" ("name");



CREATE INDEX "idx_machi_name_translations" ON "public"."machi" USING "gin" ("name_translations");



CREATE INDEX "idx_machi_osm_id" ON "public"."machi" USING "btree" ("osm_id");



CREATE INDEX "idx_machi_place_type" ON "public"."machi" USING "btree" ("place_type");



CREATE INDEX "idx_machi_prefecture_id" ON "public"."machi" USING "btree" ("prefecture_id");



CREATE INDEX "idx_machi_tile_id" ON "public"."machi" USING "btree" ("tile_id");



CREATE INDEX "idx_magazine_maps_active" ON "public"."magazine_maps" USING "btree" ("is_active") WHERE ("is_active" = true);



CREATE INDEX "idx_magazine_maps_magazine" ON "public"."magazine_maps" USING "btree" ("magazine_id");



CREATE INDEX "idx_magazine_maps_section" ON "public"."magazine_maps" USING "btree" ("section_id");



CREATE INDEX "idx_magazine_sections_active" ON "public"."magazine_sections" USING "btree" ("is_active") WHERE ("is_active" = true);



CREATE INDEX "idx_magazine_sections_magazine" ON "public"."magazine_sections" USING "btree" ("magazine_id");



CREATE INDEX "idx_magazines_active" ON "public"."magazines" USING "btree" ("is_active", "published_at" DESC) WHERE ("is_active" = true);



CREATE INDEX "idx_map_labels_map_id" ON "public"."map_labels" USING "btree" ("map_id");



CREATE INDEX "idx_map_tags_map_id" ON "public"."map_tags" USING "btree" ("map_id");



CREATE INDEX "idx_map_tags_tag_id" ON "public"."map_tags" USING "btree" ("tag_id");



CREATE INDEX "idx_maps_bookmarks_count" ON "public"."maps" USING "btree" ("bookmarks_count" DESC);



CREATE INDEX "idx_maps_category_id" ON "public"."maps" USING "btree" ("category_id");



CREATE INDEX "idx_maps_created_at" ON "public"."maps" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_maps_is_public" ON "public"."maps" USING "btree" ("is_public");



CREATE INDEX "idx_maps_language" ON "public"."maps" USING "btree" ("language");



CREATE INDEX "idx_maps_user_id" ON "public"."maps" USING "btree" ("user_id");



CREATE INDEX "idx_master_spot_favorites_master_spot_id" ON "public"."master_spot_favorites" USING "btree" ("master_spot_id");



CREATE INDEX "idx_master_spot_favorites_user_id" ON "public"."master_spot_favorites" USING "btree" ("user_id");



CREATE INDEX "idx_master_spots_google_place_id" ON "public"."master_spots" USING "btree" ("google_place_id");



CREATE INDEX "idx_master_spots_location" ON "public"."master_spots" USING "btree" ("latitude", "longitude");



CREATE INDEX "idx_master_spots_machi_id" ON "public"."master_spots" USING "btree" ("machi_id");



CREATE INDEX "idx_master_spots_name" ON "public"."master_spots" USING "gin" ("name");



CREATE INDEX "idx_notifications_actor_id" ON "public"."notifications" USING "btree" ("actor_id");



CREATE INDEX "idx_notifications_created_at" ON "public"."notifications" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "idx_notifications_is_read" ON "public"."notifications" USING "btree" ("user_id", "is_read");



CREATE INDEX "idx_notifications_type" ON "public"."notifications" USING "btree" ("type");



CREATE INDEX "idx_notifications_user_id" ON "public"."notifications" USING "btree" ("user_id");



CREATE INDEX "idx_notifications_user_spot_id" ON "public"."notifications" USING "btree" ("user_spot_id");



CREATE INDEX "idx_prefectures_name_translations" ON "public"."prefectures" USING "gin" ("name_translations");



CREATE INDEX "idx_regions_name_translations" ON "public"."regions" USING "gin" ("name_translations");



CREATE INDEX "idx_reports_created_at" ON "public"."reports" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_reports_reporter_id" ON "public"."reports" USING "btree" ("reporter_id");



CREATE INDEX "idx_reports_status" ON "public"."reports" USING "btree" ("status");



CREATE INDEX "idx_reports_target" ON "public"."reports" USING "btree" ("target_type", "target_id");



CREATE UNIQUE INDEX "idx_reports_unique_report" ON "public"."reports" USING "btree" ("reporter_id", "target_type", "target_id") WHERE ("status" = ANY (ARRAY['pending'::"public"."report_status", 'reviewing'::"public"."report_status"]));



CREATE INDEX "idx_schedules_machi_id" ON "public"."schedules" USING "btree" ("machi_id");



CREATE INDEX "idx_schedules_scheduled_at" ON "public"."schedules" USING "btree" ("scheduled_at");



CREATE INDEX "idx_schedules_user_id" ON "public"."schedules" USING "btree" ("user_id");



CREATE INDEX "idx_schedules_user_scheduled" ON "public"."schedules" USING "btree" ("user_id", "scheduled_at");



CREATE INDEX "idx_search_analytics_country" ON "public"."search_analytics" USING "btree" ("country") WHERE ("country" IS NOT NULL);



CREATE INDEX "idx_search_analytics_last_searched" ON "public"."search_analytics" USING "btree" ("last_searched_at" DESC);



CREATE INDEX "idx_search_analytics_prefecture" ON "public"."search_analytics" USING "btree" ("prefecture") WHERE ("prefecture" IS NOT NULL);



CREATE INDEX "idx_search_analytics_query" ON "public"."search_analytics" USING "btree" ("query");



CREATE INDEX "idx_search_analytics_search_count" ON "public"."search_analytics" USING "btree" ("search_count" DESC);



CREATE INDEX "idx_search_analytics_search_type" ON "public"."search_analytics" USING "btree" ("search_type");



CREATE INDEX "idx_search_history_user_id" ON "public"."search_history" USING "btree" ("user_id");



CREATE INDEX "idx_search_history_user_type_searched" ON "public"."search_history" USING "btree" ("user_id", "search_type", "searched_at" DESC);



CREATE INDEX "idx_spot_shorts_created_at" ON "public"."spot_shorts" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_spot_shorts_spot_id" ON "public"."spot_shorts" USING "btree" ("spot_id");



CREATE INDEX "idx_spot_shorts_user_id" ON "public"."spot_shorts" USING "btree" ("user_id");



CREATE INDEX "idx_spot_tags_tag_id" ON "public"."spot_tags" USING "btree" ("tag_id");



CREATE INDEX "idx_spot_tags_user_spot_id" ON "public"."spot_tags" USING "btree" ("user_spot_id");



CREATE INDEX "idx_system_announcements_published" ON "public"."system_announcements" USING "btree" ("is_active", "published_at" DESC);



CREATE INDEX "idx_tags_name" ON "public"."tags" USING "btree" ("name");



CREATE INDEX "idx_tags_slug" ON "public"."tags" USING "btree" ("slug");



CREATE INDEX "idx_tags_usage_count" ON "public"."tags" USING "btree" ("usage_count" DESC);



CREATE INDEX "idx_terms_agreements_agreed_at" ON "public"."terms_agreements" USING "btree" ("agreed_at" DESC);



CREATE INDEX "idx_terms_agreements_user_agreed" ON "public"."terms_agreements" USING "btree" ("user_id", "agreed_at" DESC);



CREATE INDEX "idx_terms_agreements_user_id" ON "public"."terms_agreements" USING "btree" ("user_id");



CREATE INDEX "idx_terms_versions_effective_at" ON "public"."terms_versions" USING "btree" ("effective_at" DESC);



CREATE INDEX "idx_terms_versions_locale" ON "public"."terms_versions" USING "btree" ("locale");



CREATE INDEX "idx_terms_versions_type" ON "public"."terms_versions" USING "btree" ("type");



CREATE INDEX "idx_terms_versions_type_effective" ON "public"."terms_versions" USING "btree" ("type", "effective_at" DESC);



CREATE INDEX "idx_terms_versions_type_locale_effective" ON "public"."terms_versions" USING "btree" ("type", "locale", "effective_at" DESC);



CREATE INDEX "idx_transport_hubs_osm_id" ON "public"."transport_hubs" USING "btree" ("osm_id");



CREATE INDEX "idx_transport_hubs_tile_id" ON "public"."transport_hubs" USING "btree" ("tile_id");



CREATE INDEX "idx_user_announcement_reads_announcement_id" ON "public"."system_announcement_reads" USING "btree" ("announcement_id");



CREATE INDEX "idx_user_announcement_reads_user_id" ON "public"."system_announcement_reads" USING "btree" ("user_id");



CREATE INDEX "idx_user_notification_settings_user_id" ON "public"."user_notification_settings" USING "btree" ("user_id");



CREATE INDEX "idx_user_spots_bookmarks_count" ON "public"."user_spots" USING "btree" ("bookmarks_count" DESC);



CREATE INDEX "idx_user_spots_city_id" ON "public"."user_spots" USING "btree" ("city_id");



CREATE INDEX "idx_user_spots_created_at" ON "public"."user_spots" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_user_spots_is_public" ON "public"."user_spots" USING "btree" ("is_public");



CREATE INDEX "idx_user_spots_label_id" ON "public"."user_spots" USING "btree" ("label_id");



CREATE INDEX "idx_user_spots_language" ON "public"."user_spots" USING "btree" ("language");



CREATE INDEX "idx_user_spots_machi_id" ON "public"."user_spots" USING "btree" ("machi_id");



CREATE INDEX "idx_user_spots_map_id" ON "public"."user_spots" USING "btree" ("map_id");



CREATE INDEX "idx_user_spots_master_spot_id" ON "public"."user_spots" USING "btree" ("master_spot_id");



CREATE INDEX "idx_user_spots_prefecture_id" ON "public"."user_spots" USING "btree" ("prefecture_id");



CREATE INDEX "idx_user_spots_thumbnail_image_id" ON "public"."user_spots" USING "btree" ("thumbnail_image_id");



CREATE INDEX "idx_user_spots_user_id" ON "public"."user_spots" USING "btree" ("user_id");



CREATE INDEX "idx_users_is_premium" ON "public"."users" USING "btree" ("is_premium");



CREATE INDEX "idx_users_push_token" ON "public"."users" USING "btree" ("push_token") WHERE ("push_token" IS NOT NULL);



CREATE INDEX "idx_users_status" ON "public"."users" USING "btree" ("status") WHERE ("status" <> 'active'::"text");



CREATE INDEX "idx_view_history_map_id" ON "public"."view_history" USING "btree" ("map_id");



CREATE INDEX "idx_view_history_user_id" ON "public"."view_history" USING "btree" ("user_id");



CREATE INDEX "idx_view_history_user_viewed" ON "public"."view_history" USING "btree" ("user_id", "viewed_at" DESC);



CREATE INDEX "idx_visits_machi_id" ON "public"."visits" USING "btree" ("machi_id");



CREATE INDEX "idx_visits_user_id" ON "public"."visits" USING "btree" ("user_id");



CREATE INDEX "idx_visits_user_machi" ON "public"."visits" USING "btree" ("user_id", "machi_id");



CREATE INDEX "idx_visits_visited_at" ON "public"."visits" USING "btree" ("visited_at" DESC);



CREATE UNIQUE INDEX "likes_user_map_unique" ON "public"."likes" USING "btree" ("user_id", "map_id") WHERE ("map_id" IS NOT NULL);



CREATE UNIQUE INDEX "likes_user_spot_unique" ON "public"."likes" USING "btree" ("user_id", "user_spot_id") WHERE ("user_spot_id" IS NOT NULL);



CREATE OR REPLACE TRIGGER "on_follow_create_notification" AFTER INSERT ON "public"."follows" FOR EACH ROW EXECUTE FUNCTION "public"."create_follow_notification"();



CREATE OR REPLACE TRIGGER "on_map_comment_create_notification" AFTER INSERT ON "public"."comments" FOR EACH ROW WHEN (("new"."map_id" IS NOT NULL)) EXECUTE FUNCTION "public"."create_comment_map_notification"();



CREATE OR REPLACE TRIGGER "on_map_like_create_notification" AFTER INSERT ON "public"."likes" FOR EACH ROW WHEN (("new"."map_id" IS NOT NULL)) EXECUTE FUNCTION "public"."create_like_map_notification"();



CREATE OR REPLACE TRIGGER "on_user_spot_comment_create_notification" AFTER INSERT ON "public"."comments" FOR EACH ROW WHEN (("new"."user_spot_id" IS NOT NULL)) EXECUTE FUNCTION "public"."create_comment_spot_notification"();



CREATE OR REPLACE TRIGGER "on_user_spot_like_create_notification" AFTER INSERT ON "public"."likes" FOR EACH ROW WHEN (("new"."user_spot_id" IS NOT NULL)) EXECUTE FUNCTION "public"."create_like_spot_notification"();



CREATE OR REPLACE TRIGGER "send-notification" AFTER INSERT ON "public"."notifications" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://whgptckcuskqggyybruw.supabase.co/functions/v1/send-notification', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZ3B0Y2tjdXNrcWdneXlicnV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzAzOTI5NCwiZXhwIjoyMDc4NjE1Mjk0fQ.BMfzJW_DuGc3aK95c7JU4KqU_zbopVAk99OjfyGMVWA"}', '{}', '5000');



CREATE OR REPLACE TRIGGER "trigger_auto_publish_map_on_spot_insert" AFTER INSERT ON "public"."user_spots" FOR EACH ROW WHEN (("new"."is_public" = true)) EXECUTE FUNCTION "public"."auto_publish_map_on_spot_insert"();



CREATE OR REPLACE TRIGGER "trigger_auto_publish_map_on_spot_publish" AFTER UPDATE ON "public"."user_spots" FOR EACH ROW WHEN (("old"."is_public" IS DISTINCT FROM "new"."is_public")) EXECUTE FUNCTION "public"."auto_publish_map_on_spot_publish"();



CREATE OR REPLACE TRIGGER "trigger_auto_unpublish_map_on_spot_delete" AFTER DELETE ON "public"."user_spots" FOR EACH ROW WHEN (("old"."is_public" = true)) EXECUTE FUNCTION "public"."auto_unpublish_map_on_spot_delete"();



CREATE OR REPLACE TRIGGER "trigger_auto_unpublish_map_when_no_public_spots" AFTER UPDATE ON "public"."user_spots" FOR EACH ROW WHEN ((("old"."is_public" = true) AND ("new"."is_public" = false))) EXECUTE FUNCTION "public"."auto_unpublish_map_when_no_public_spots"();



CREATE OR REPLACE TRIGGER "trigger_cleanup_view_history" AFTER INSERT OR UPDATE ON "public"."view_history" FOR EACH ROW EXECUTE FUNCTION "public"."cleanup_old_view_history"();



CREATE OR REPLACE TRIGGER "trigger_create_default_notification_settings" AFTER INSERT ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."create_default_notification_settings"();



CREATE OR REPLACE TRIGGER "trigger_sync_spots_language" AFTER UPDATE OF "language" ON "public"."maps" FOR EACH ROW EXECUTE FUNCTION "public"."sync_spots_language"();



CREATE OR REPLACE TRIGGER "trigger_update_admin_users_updated_at" BEFORE UPDATE ON "public"."admin_users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "trigger_update_bookmarks_count" AFTER INSERT OR DELETE ON "public"."bookmarks" FOR EACH ROW EXECUTE FUNCTION "public"."update_bookmarks_count"();



CREATE OR REPLACE TRIGGER "trigger_update_collection_maps_count" AFTER INSERT OR DELETE ON "public"."collection_maps" FOR EACH ROW EXECUTE FUNCTION "public"."update_collection_maps_count"();



CREATE OR REPLACE TRIGGER "trigger_update_comment_likes_count" AFTER INSERT OR DELETE ON "public"."comment_likes" FOR EACH ROW EXECUTE FUNCTION "public"."update_comment_likes_count"();



CREATE OR REPLACE TRIGGER "trigger_update_comment_replies_count" AFTER INSERT OR DELETE ON "public"."comments" FOR EACH ROW EXECUTE FUNCTION "public"."update_comment_replies_count"();



CREATE OR REPLACE TRIGGER "trigger_update_comments_count" AFTER INSERT OR DELETE ON "public"."comments" FOR EACH ROW EXECUTE FUNCTION "public"."update_comments_count"();



CREATE OR REPLACE TRIGGER "trigger_update_images_count" AFTER INSERT OR DELETE ON "public"."images" FOR EACH ROW EXECUTE FUNCTION "public"."update_images_count"();



CREATE OR REPLACE TRIGGER "trigger_update_likes_count" AFTER INSERT OR DELETE ON "public"."likes" FOR EACH ROW EXECUTE FUNCTION "public"."update_likes_count"();



CREATE OR REPLACE TRIGGER "trigger_update_map_spots_count" AFTER INSERT OR DELETE ON "public"."user_spots" FOR EACH ROW EXECUTE FUNCTION "public"."update_map_spots_count"();



CREATE OR REPLACE TRIGGER "trigger_update_master_spot_favorites_count" AFTER INSERT OR DELETE ON "public"."master_spot_favorites" FOR EACH ROW EXECUTE FUNCTION "public"."update_master_spot_favorites_count"();



CREATE OR REPLACE TRIGGER "update_bookmark_folders_updated_at" BEFORE UPDATE ON "public"."bookmark_folders" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_categories_updated_at" BEFORE UPDATE ON "public"."categories" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_cities_updated_at" BEFORE UPDATE ON "public"."cities" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_collections_updated_at" BEFORE UPDATE ON "public"."collections" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_comments_updated_at" BEFORE UPDATE ON "public"."comments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_countries_updated_at" BEFORE UPDATE ON "public"."countries" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_deletion_requests_updated_at" BEFORE UPDATE ON "public"."deletion_requests" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_featured_category_maps_updated_at" BEFORE UPDATE ON "public"."featured_category_maps" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_featured_items_updated_at" BEFORE UPDATE ON "public"."featured_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_images_updated_at" BEFORE UPDATE ON "public"."images" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_machi_updated_at" BEFORE UPDATE ON "public"."machi" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_magazine_maps_updated_at" BEFORE UPDATE ON "public"."magazine_maps" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_magazine_sections_updated_at" BEFORE UPDATE ON "public"."magazine_sections" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_magazines_updated_at" BEFORE UPDATE ON "public"."magazines" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_map_labels_updated_at" BEFORE UPDATE ON "public"."map_labels" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_maps_updated_at" BEFORE UPDATE ON "public"."maps" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_master_spots_updated_at" BEFORE UPDATE ON "public"."master_spots" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_prefectures_updated_at" BEFORE UPDATE ON "public"."prefectures" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_reports_updated_at" BEFORE UPDATE ON "public"."reports" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_search_analytics_updated_at" BEFORE UPDATE ON "public"."search_analytics" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_tag_usage_count_for_spots_trigger" AFTER INSERT OR DELETE ON "public"."spot_tags" FOR EACH ROW EXECUTE FUNCTION "public"."update_tag_usage_count_for_spots"();



CREATE OR REPLACE TRIGGER "update_tag_usage_count_trigger" AFTER INSERT OR DELETE ON "public"."map_tags" FOR EACH ROW EXECUTE FUNCTION "public"."update_tag_usage_count"();



CREATE OR REPLACE TRIGGER "update_tags_updated_at" BEFORE UPDATE ON "public"."tags" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_notification_settings_updated_at" BEFORE UPDATE ON "public"."user_notification_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_preferences_updated_at" BEFORE UPDATE ON "public"."user_preferences" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_spots_updated_at" BEFORE UPDATE ON "public"."user_spots" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_users_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_view_history_updated_at" BEFORE UPDATE ON "public"."view_history" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."admin_boundaries"
    ADD CONSTRAINT "admin_boundaries_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id");



ALTER TABLE ONLY "public"."admin_boundaries"
    ADD CONSTRAINT "admin_boundaries_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id");



ALTER TABLE ONLY "public"."admin_boundaries"
    ADD CONSTRAINT "admin_boundaries_prefecture_id_fkey" FOREIGN KEY ("prefecture_id") REFERENCES "public"."prefectures"("id");



ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_user_id_public_users_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



COMMENT ON CONSTRAINT "admin_users_user_id_public_users_fkey" ON "public"."admin_users" IS 'public.usersへの外部キー（JOINクエリ用）';



ALTER TABLE ONLY "public"."bookmark_folders"
    ADD CONSTRAINT "bookmark_folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "public"."bookmark_folders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookmarks"
    ADD CONSTRAINT "bookmarks_user_spot_id_fkey" FOREIGN KEY ("user_spot_id") REFERENCES "public"."user_spots"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cities"
    ADD CONSTRAINT "cities_prefecture_id_fkey" FOREIGN KEY ("prefecture_id") REFERENCES "public"."prefectures"("id");



ALTER TABLE ONLY "public"."collection_maps"
    ADD CONSTRAINT "collection_maps_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."collection_maps"
    ADD CONSTRAINT "collection_maps_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."collections"
    ADD CONSTRAINT "collections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comment_likes"
    ADD CONSTRAINT "comment_likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comment_likes"
    ADD CONSTRAINT "comment_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_reply_to_user_id_fkey" FOREIGN KEY ("reply_to_user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_root_id_fkey" FOREIGN KEY ("root_id") REFERENCES "public"."comments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_user_spot_id_fkey" FOREIGN KEY ("user_spot_id") REFERENCES "public"."user_spots"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."countries"
    ADD CONSTRAINT "countries_continent_id_fkey" FOREIGN KEY ("continent_id") REFERENCES "public"."continents"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."deletion_requests"
    ADD CONSTRAINT "deletion_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."featured_category_maps"
    ADD CONSTRAINT "featured_category_maps_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."featured_category_maps"
    ADD CONSTRAINT "featured_category_maps_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."featured_items"
    ADD CONSTRAINT "featured_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."featured_items"
    ADD CONSTRAINT "featured_items_magazine_id_fkey" FOREIGN KEY ("magazine_id") REFERENCES "public"."magazines"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."regions"
    ADD CONSTRAINT "fk_regions_country" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id");



ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_followee_id_fkey" FOREIGN KEY ("followee_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."images"
    ADD CONSTRAINT "images_user_spot_id_fkey" FOREIGN KEY ("user_spot_id") REFERENCES "public"."user_spots"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_user_spot_id_fkey" FOREIGN KEY ("user_spot_id") REFERENCES "public"."user_spots"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."machi"
    ADD CONSTRAINT "machi_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id");



ALTER TABLE ONLY "public"."machi"
    ADD CONSTRAINT "machi_prefecture_id_fkey" FOREIGN KEY ("prefecture_id") REFERENCES "public"."prefectures"("id");



ALTER TABLE ONLY "public"."magazine_maps"
    ADD CONSTRAINT "magazine_maps_magazine_id_fkey" FOREIGN KEY ("magazine_id") REFERENCES "public"."magazines"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."magazine_maps"
    ADD CONSTRAINT "magazine_maps_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."magazine_maps"
    ADD CONSTRAINT "magazine_maps_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."magazine_sections"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."magazine_sections"
    ADD CONSTRAINT "magazine_sections_magazine_id_fkey" FOREIGN KEY ("magazine_id") REFERENCES "public"."magazines"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."map_labels"
    ADD CONSTRAINT "map_labels_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."map_tags"
    ADD CONSTRAINT "map_tags_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."map_tags"
    ADD CONSTRAINT "map_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."maps"
    ADD CONSTRAINT "maps_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id");



ALTER TABLE ONLY "public"."maps"
    ADD CONSTRAINT "maps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."master_spot_favorites"
    ADD CONSTRAINT "master_spot_favorites_master_spot_id_fkey" FOREIGN KEY ("master_spot_id") REFERENCES "public"."master_spots"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."master_spot_favorites"
    ADD CONSTRAINT "master_spot_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."master_spots"
    ADD CONSTRAINT "master_spots_machi_id_fkey" FOREIGN KEY ("machi_id") REFERENCES "public"."machi"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_spot_id_fkey" FOREIGN KEY ("user_spot_id") REFERENCES "public"."user_spots"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."prefectures"
    ADD CONSTRAINT "prefectures_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id");



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_resolved_by_fkey" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."schedules"
    ADD CONSTRAINT "schedules_machi_id_fkey" FOREIGN KEY ("machi_id") REFERENCES "public"."machi"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schedules"
    ADD CONSTRAINT "schedules_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."search_history"
    ADD CONSTRAINT "search_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."spot_shorts"
    ADD CONSTRAINT "spot_shorts_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "public"."user_spots"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."spot_shorts"
    ADD CONSTRAINT "spot_shorts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."spot_tags"
    ADD CONSTRAINT "spot_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."spot_tags"
    ADD CONSTRAINT "spot_tags_user_spot_id_fkey" FOREIGN KEY ("user_spot_id") REFERENCES "public"."user_spots"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."terms_agreements"
    ADD CONSTRAINT "terms_agreements_privacy_version_id_fkey" FOREIGN KEY ("privacy_version_id") REFERENCES "public"."terms_versions"("id");



ALTER TABLE ONLY "public"."terms_agreements"
    ADD CONSTRAINT "terms_agreements_terms_version_id_fkey" FOREIGN KEY ("terms_version_id") REFERENCES "public"."terms_versions"("id");



ALTER TABLE ONLY "public"."terms_agreements"
    ADD CONSTRAINT "terms_agreements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."terms_versions"
    ADD CONSTRAINT "terms_versions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."transport_hubs"
    ADD CONSTRAINT "transport_hubs_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id");



ALTER TABLE ONLY "public"."transport_hubs"
    ADD CONSTRAINT "transport_hubs_prefecture_id_fkey" FOREIGN KEY ("prefecture_id") REFERENCES "public"."prefectures"("id");



ALTER TABLE ONLY "public"."system_announcement_reads"
    ADD CONSTRAINT "user_announcement_reads_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "public"."system_announcements"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."system_announcement_reads"
    ADD CONSTRAINT "user_announcement_reads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_notification_settings"
    ADD CONSTRAINT "user_notification_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_preferences"
    ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_spots"
    ADD CONSTRAINT "user_spots_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."user_spots"
    ADD CONSTRAINT "user_spots_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "public"."map_labels"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."user_spots"
    ADD CONSTRAINT "user_spots_machi_id_fkey" FOREIGN KEY ("machi_id") REFERENCES "public"."machi"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."user_spots"
    ADD CONSTRAINT "user_spots_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_spots"
    ADD CONSTRAINT "user_spots_master_spot_id_fkey" FOREIGN KEY ("master_spot_id") REFERENCES "public"."master_spots"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_spots"
    ADD CONSTRAINT "user_spots_prefecture_id_fkey" FOREIGN KEY ("prefecture_id") REFERENCES "public"."prefectures"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."user_spots"
    ADD CONSTRAINT "user_spots_thumbnail_image_id_fkey" FOREIGN KEY ("thumbnail_image_id") REFERENCES "public"."images"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."user_spots"
    ADD CONSTRAINT "user_spots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."view_history"
    ADD CONSTRAINT "view_history_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."view_history"
    ADD CONSTRAINT "view_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."visits"
    ADD CONSTRAINT "visits_machi_id_fkey" FOREIGN KEY ("machi_id") REFERENCES "public"."machi"("id");



ALTER TABLE ONLY "public"."visits"
    ADD CONSTRAINT "visits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE "public"."admin_boundaries" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "admin_boundaries_select_all" ON "public"."admin_boundaries" FOR SELECT USING (true);



ALTER TABLE "public"."admin_users" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "admin_users_delete_owner" ON "public"."admin_users" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_users" "au"
  WHERE (("au"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("au"."role" = 'owner'::"text")))));



CREATE POLICY "admin_users_insert_owner" ON "public"."admin_users" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."admin_users" "au"
  WHERE (("au"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("au"."role" = 'owner'::"text")))));



CREATE POLICY "admin_users_select_admin" ON "public"."admin_users" FOR SELECT TO "authenticated" USING ("public"."is_admin_user"(( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "admin_users_update_owner" ON "public"."admin_users" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_users" "au"
  WHERE (("au"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("au"."role" = 'owner'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."admin_users" "au"
  WHERE (("au"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("au"."role" = 'owner'::"text")))));



ALTER TABLE "public"."bookmark_folders" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "bookmark_folders_delete_own" ON "public"."bookmark_folders" FOR DELETE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "bookmark_folders_insert_own" ON "public"."bookmark_folders" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "bookmark_folders_select_own" ON "public"."bookmark_folders" FOR SELECT TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "bookmark_folders_update_own" ON "public"."bookmark_folders" FOR UPDATE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



ALTER TABLE "public"."bookmarks" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "bookmarks_delete_own" ON "public"."bookmarks" FOR DELETE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "bookmarks_insert_own" ON "public"."bookmarks" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "bookmarks_select_own" ON "public"."bookmarks" FOR SELECT TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "categories_select_all" ON "public"."categories" FOR SELECT USING (true);



ALTER TABLE "public"."cities" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "cities_select_all" ON "public"."cities" FOR SELECT USING (true);



ALTER TABLE "public"."collection_maps" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "collection_maps_delete_own" ON "public"."collection_maps" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."collections"
  WHERE (("collections"."id" = "collection_maps"."collection_id") AND ("collections"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "collection_maps_insert_own" ON "public"."collection_maps" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."collections"
  WHERE (("collections"."id" = "collection_maps"."collection_id") AND ("collections"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "collection_maps_select_public_or_own" ON "public"."collection_maps" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."collections"
  WHERE (("collections"."id" = "collection_maps"."collection_id") AND (("collections"."is_public" = true) OR ("collections"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))));



CREATE POLICY "collection_maps_update_own" ON "public"."collection_maps" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."collections"
  WHERE (("collections"."id" = "collection_maps"."collection_id") AND ("collections"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."collections"
  WHERE (("collections"."id" = "collection_maps"."collection_id") AND ("collections"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



ALTER TABLE "public"."collections" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "collections_delete_own" ON "public"."collections" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "collections_insert_own" ON "public"."collections" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "collections_select_public_or_own" ON "public"."collections" FOR SELECT USING ((("is_public" = true) OR (( SELECT "auth"."uid"() AS "uid") = "user_id")));



CREATE POLICY "collections_update_own" ON "public"."collections" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."comment_likes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "comment_likes_delete_own" ON "public"."comment_likes" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "comment_likes_insert_own" ON "public"."comment_likes" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "comment_likes_select_all" ON "public"."comment_likes" FOR SELECT USING (true);



ALTER TABLE "public"."comments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "comments_delete_own" ON "public"."comments" FOR DELETE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "comments_insert_own" ON "public"."comments" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "comments_select_all" ON "public"."comments" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "comments_update_own" ON "public"."comments" FOR UPDATE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



ALTER TABLE "public"."continents" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "continents_select_all" ON "public"."continents" FOR SELECT USING (true);



ALTER TABLE "public"."countries" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "countries_select_all" ON "public"."countries" FOR SELECT USING (true);



ALTER TABLE "public"."deletion_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."featured_category_maps" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "featured_category_maps_select_active" ON "public"."featured_category_maps" FOR SELECT USING (("is_active" = true));



ALTER TABLE "public"."featured_items" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "featured_items_select_active" ON "public"."featured_items" FOR SELECT TO "authenticated", "anon" USING ((("is_active" = true) AND (("starts_at" IS NULL) OR ("starts_at" <= "now"())) AND (("ends_at" IS NULL) OR ("ends_at" > "now"()))));



ALTER TABLE "public"."follows" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "follows_delete_own" ON "public"."follows" FOR DELETE TO "authenticated" USING (("follower_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "follows_insert_own" ON "public"."follows" FOR INSERT TO "authenticated" WITH CHECK (("follower_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "follows_select_all" ON "public"."follows" FOR SELECT USING (true);



ALTER TABLE "public"."images" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "images_delete_own" ON "public"."images" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_spots"
  WHERE (("user_spots"."id" = "images"."user_spot_id") AND ("user_spots"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "images_insert_own_with_limit" ON "public"."images" FOR INSERT TO "authenticated" WITH CHECK (((EXISTS ( SELECT 1
   FROM "public"."user_spots" "us"
  WHERE (("us"."id" = "images"."user_spot_id") AND ("us"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))) AND ("public"."count_images_in_spot"("user_spot_id") < 4)));



CREATE POLICY "images_select_public_or_own" ON "public"."images" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."user_spots"
     JOIN "public"."maps" ON (("maps"."id" = "user_spots"."map_id")))
  WHERE (("user_spots"."id" = "images"."user_spot_id") AND (("maps"."is_public" = true) OR ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL) AND ("maps"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))))));



ALTER TABLE "public"."likes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "likes_delete_own" ON "public"."likes" FOR DELETE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "likes_insert_own" ON "public"."likes" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "likes_select_all" ON "public"."likes" FOR SELECT USING (true);



ALTER TABLE "public"."machi" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "machi_select_all" ON "public"."machi" FOR SELECT USING (true);



ALTER TABLE "public"."magazine_maps" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "magazine_maps_select_active" ON "public"."magazine_maps" FOR SELECT TO "authenticated", "anon" USING (("is_active" = true));



ALTER TABLE "public"."magazine_sections" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "magazine_sections_select_active" ON "public"."magazine_sections" FOR SELECT TO "authenticated", "anon" USING (("is_active" = true));



ALTER TABLE "public"."magazines" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "magazines_select_active" ON "public"."magazines" FOR SELECT TO "authenticated", "anon" USING (("is_active" = true));



ALTER TABLE "public"."map_labels" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "map_labels_delete_own" ON "public"."map_labels" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."maps"
  WHERE (("maps"."id" = "map_labels"."map_id") AND ("maps"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "map_labels_insert_own" ON "public"."map_labels" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."maps"
  WHERE (("maps"."id" = "map_labels"."map_id") AND ("maps"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "map_labels_select_public_or_own" ON "public"."map_labels" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."maps"
  WHERE (("maps"."id" = "map_labels"."map_id") AND (("maps"."is_public" = true) OR ("maps"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))));



CREATE POLICY "map_labels_update_own" ON "public"."map_labels" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."maps"
  WHERE (("maps"."id" = "map_labels"."map_id") AND ("maps"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."maps"
  WHERE (("maps"."id" = "map_labels"."map_id") AND ("maps"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



ALTER TABLE "public"."map_tags" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "map_tags_delete_own" ON "public"."map_tags" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."maps"
  WHERE (("maps"."id" = "map_tags"."map_id") AND ("maps"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "map_tags_insert_own" ON "public"."map_tags" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."maps"
  WHERE (("maps"."id" = "map_tags"."map_id") AND ("maps"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "map_tags_select_all" ON "public"."map_tags" FOR SELECT USING (true);



ALTER TABLE "public"."maps" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "maps_delete_own" ON "public"."maps" FOR DELETE TO "authenticated" USING ((("user_id" = ( SELECT "auth"."uid"() AS "uid")) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("users"."status" = 'active'::"text"))))));



CREATE POLICY "maps_insert_own" ON "public"."maps" FOR INSERT TO "authenticated" WITH CHECK ((("user_id" = ( SELECT "auth"."uid"() AS "uid")) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("users"."status" = 'active'::"text"))))));



CREATE POLICY "maps_select_public_or_own" ON "public"."maps" FOR SELECT USING ((("is_public" = true) OR ((( SELECT "auth"."uid"() AS "uid") IS NOT NULL) AND ("user_id" = ( SELECT "auth"."uid"() AS "uid")))));



CREATE POLICY "maps_update_own" ON "public"."maps" FOR UPDATE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK ((("user_id" = ( SELECT "auth"."uid"() AS "uid")) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("users"."status" = 'active'::"text"))))));



ALTER TABLE "public"."master_spot_favorites" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "master_spot_favorites_delete_own" ON "public"."master_spot_favorites" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "master_spot_favorites_insert_own" ON "public"."master_spot_favorites" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "master_spot_favorites_select_own" ON "public"."master_spot_favorites" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."master_spots" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "master_spots_insert_authenticated" ON "public"."master_spots" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "master_spots_select_all" ON "public"."master_spots" FOR SELECT USING (true);



ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "notifications_delete_own" ON "public"."notifications" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "notifications_insert_system" ON "public"."notifications" FOR INSERT WITH CHECK (true);



CREATE POLICY "notifications_select_own" ON "public"."notifications" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "notifications_update_own" ON "public"."notifications" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."prefectures" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "prefectures_select_all" ON "public"."prefectures" FOR SELECT USING (true);



ALTER TABLE "public"."regions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "regions_select_all" ON "public"."regions" FOR SELECT USING (true);



ALTER TABLE "public"."reports" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "reports_insert_own" ON "public"."reports" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "reporter_id"));



CREATE POLICY "reports_select_own" ON "public"."reports" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "reporter_id"));



ALTER TABLE "public"."schedules" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "schedules_delete_own" ON "public"."schedules" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "schedules_insert_own" ON "public"."schedules" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "schedules_select_own" ON "public"."schedules" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "schedules_update_own" ON "public"."schedules" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."search_analytics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."search_history" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "search_history_delete_own" ON "public"."search_history" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "search_history_insert_own" ON "public"."search_history" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "search_history_select_own" ON "public"."search_history" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."spot_shorts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "spot_shorts_delete_own" ON "public"."spot_shorts" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "spot_shorts_insert_own" ON "public"."spot_shorts" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "spot_shorts_select_own" ON "public"."spot_shorts" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "spot_shorts_select_public" ON "public"."spot_shorts" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."user_spots" "us"
     JOIN "public"."maps" "m" ON (("m"."id" = "us"."map_id")))
  WHERE (("us"."id" = "spot_shorts"."spot_id") AND ("us"."is_public" = true) AND ("m"."is_public" = true)))));



CREATE POLICY "spot_shorts_update_own" ON "public"."spot_shorts" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."spot_tags" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "spot_tags_delete_own" ON "public"."spot_tags" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_spots"
  WHERE (("user_spots"."id" = "spot_tags"."user_spot_id") AND ("user_spots"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "spot_tags_insert_own" ON "public"."spot_tags" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_spots"
  WHERE (("user_spots"."id" = "spot_tags"."user_spot_id") AND ("user_spots"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "spot_tags_select_all" ON "public"."spot_tags" FOR SELECT USING (true);



ALTER TABLE "public"."system_announcement_reads" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "system_announcement_reads_delete_own" ON "public"."system_announcement_reads" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "system_announcement_reads_insert_own" ON "public"."system_announcement_reads" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "system_announcement_reads_select_own" ON "public"."system_announcement_reads" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."system_announcements" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "system_announcements_select_active" ON "public"."system_announcements" FOR SELECT USING ((("is_active" = true) AND (("expires_at" IS NULL) OR ("expires_at" > "now"()))));



ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "tags_insert_authenticated" ON "public"."tags" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "tags_select_all" ON "public"."tags" FOR SELECT USING (true);



ALTER TABLE "public"."terms_agreements" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "terms_agreements_insert_own" ON "public"."terms_agreements" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "terms_agreements_select_own" ON "public"."terms_agreements" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."terms_versions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "terms_versions_select_all" ON "public"."terms_versions" FOR SELECT USING (true);



ALTER TABLE "public"."transport_hubs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "transport_hubs_select_all" ON "public"."transport_hubs" FOR SELECT USING (true);



ALTER TABLE "public"."user_notification_settings" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_notification_settings_insert_own" ON "public"."user_notification_settings" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "user_notification_settings_select_own" ON "public"."user_notification_settings" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "user_notification_settings_update_own" ON "public"."user_notification_settings" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."user_preferences" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_preferences_insert_own" ON "public"."user_preferences" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "user_preferences_select_own" ON "public"."user_preferences" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "user_preferences_update_own" ON "public"."user_preferences" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."user_spots" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_spots_delete_own" ON "public"."user_spots" FOR DELETE TO "authenticated" USING ((("user_id" = ( SELECT "auth"."uid"() AS "uid")) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("users"."status" = 'active'::"text"))))));



CREATE POLICY "user_spots_insert_own_with_limit" ON "public"."user_spots" FOR INSERT TO "authenticated" WITH CHECK (((EXISTS ( SELECT 1
   FROM "public"."maps"
  WHERE (("maps"."id" = "user_spots"."map_id") AND ("maps"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("users"."status" = 'active'::"text")))) AND (("public"."is_user_premium"(( SELECT "auth"."uid"() AS "uid")) AND ("public"."count_user_spots_in_map"(( SELECT "auth"."uid"() AS "uid"), "map_id") < 100)) OR ((NOT "public"."is_user_premium"(( SELECT "auth"."uid"() AS "uid"))) AND ("public"."count_user_spots_in_map"(( SELECT "auth"."uid"() AS "uid"), "map_id") < 30)))));



CREATE POLICY "user_spots_select_public_or_own" ON "public"."user_spots" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."maps"
  WHERE (("maps"."id" = "user_spots"."map_id") AND (("maps"."is_public" = true) OR ("maps"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))));



CREATE POLICY "user_spots_update_own" ON "public"."user_spots" FOR UPDATE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK ((("user_id" = ( SELECT "auth"."uid"() AS "uid")) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ("users"."status" = 'active'::"text"))))));



ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users_insert_own" ON "public"."users" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "users_select_all" ON "public"."users" FOR SELECT USING (true);



CREATE POLICY "users_update_own" ON "public"."users" FOR UPDATE TO "authenticated" USING (((( SELECT "auth"."uid"() AS "uid") = "id") AND ("status" = 'active'::"text"))) WITH CHECK (((( SELECT "auth"."uid"() AS "uid") = "id") AND ("status" = 'active'::"text")));



ALTER TABLE "public"."view_history" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "view_history_delete_own" ON "public"."view_history" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "view_history_insert_own" ON "public"."view_history" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "view_history_select_own" ON "public"."view_history" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "view_history_update_own" ON "public"."view_history" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."visits" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "visits_delete_own" ON "public"."visits" FOR DELETE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "visits_insert_own" ON "public"."visits" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "visits_select_own" ON "public"."visits" FOR SELECT USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "visits_update_own" ON "public"."visits" FOR UPDATE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






GRANT ALL ON FUNCTION "public"."box2d_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."box2d_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."box2d_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box2d_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."box2d_out"("public"."box2d") TO "postgres";
GRANT ALL ON FUNCTION "public"."box2d_out"("public"."box2d") TO "anon";
GRANT ALL ON FUNCTION "public"."box2d_out"("public"."box2d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box2d_out"("public"."box2d") TO "service_role";



GRANT ALL ON FUNCTION "public"."box2df_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."box2df_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."box2df_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box2df_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."box2df_out"("public"."box2df") TO "postgres";
GRANT ALL ON FUNCTION "public"."box2df_out"("public"."box2df") TO "anon";
GRANT ALL ON FUNCTION "public"."box2df_out"("public"."box2df") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box2df_out"("public"."box2df") TO "service_role";



GRANT ALL ON FUNCTION "public"."box3d_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."box3d_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."box3d_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box3d_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."box3d_out"("public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."box3d_out"("public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."box3d_out"("public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box3d_out"("public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_analyze"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_analyze"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_analyze"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_analyze"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_in"("cstring", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_in"("cstring", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."geography_in"("cstring", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_in"("cstring", "oid", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_out"("public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_out"("public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_out"("public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_out"("public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_recv"("internal", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_recv"("internal", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."geography_recv"("internal", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_recv"("internal", "oid", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_send"("public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_send"("public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_send"("public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_send"("public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_typmod_in"("cstring"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_typmod_in"("cstring"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."geography_typmod_in"("cstring"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_typmod_in"("cstring"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_typmod_out"(integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_typmod_out"(integer) TO "anon";
GRANT ALL ON FUNCTION "public"."geography_typmod_out"(integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_typmod_out"(integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_analyze"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_analyze"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_analyze"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_analyze"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_out"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_out"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_out"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_out"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_recv"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_recv"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_recv"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_recv"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_send"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_send"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_send"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_send"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_typmod_in"("cstring"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_typmod_in"("cstring"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_typmod_in"("cstring"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_typmod_in"("cstring"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_typmod_out"(integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_typmod_out"(integer) TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_typmod_out"(integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_typmod_out"(integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."gidx_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."gidx_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."gidx_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gidx_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."gidx_out"("public"."gidx") TO "postgres";
GRANT ALL ON FUNCTION "public"."gidx_out"("public"."gidx") TO "anon";
GRANT ALL ON FUNCTION "public"."gidx_out"("public"."gidx") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gidx_out"("public"."gidx") TO "service_role";



GRANT ALL ON FUNCTION "public"."spheroid_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."spheroid_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."spheroid_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."spheroid_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."spheroid_out"("public"."spheroid") TO "postgres";
GRANT ALL ON FUNCTION "public"."spheroid_out"("public"."spheroid") TO "anon";
GRANT ALL ON FUNCTION "public"."spheroid_out"("public"."spheroid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."spheroid_out"("public"."spheroid") TO "service_role";



GRANT ALL ON FUNCTION "public"."box3d"("public"."box2d") TO "postgres";
GRANT ALL ON FUNCTION "public"."box3d"("public"."box2d") TO "anon";
GRANT ALL ON FUNCTION "public"."box3d"("public"."box2d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box3d"("public"."box2d") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry"("public"."box2d") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry"("public"."box2d") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry"("public"."box2d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry"("public"."box2d") TO "service_role";



GRANT ALL ON FUNCTION "public"."box"("public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."box"("public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."box"("public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box"("public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."box2d"("public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."box2d"("public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."box2d"("public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box2d"("public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry"("public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry"("public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry"("public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry"("public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."geography"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."bytea"("public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."bytea"("public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."bytea"("public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."bytea"("public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography"("public"."geography", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."geography"("public"."geography", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."geography"("public"."geography", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography"("public"."geography", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry"("public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry"("public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry"("public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry"("public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."box"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."box"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."box"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."box2d"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."box2d"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."box2d"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box2d"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."box3d"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."box3d"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."box3d"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box3d"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."bytea"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."bytea"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."bytea"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."bytea"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geography"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry"("public"."geometry", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry"("public"."geometry", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."geometry"("public"."geometry", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry"("public"."geometry", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."json"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."json"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."json"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."json"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."jsonb"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."jsonb"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."jsonb"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."jsonb"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."path"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."path"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."path"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."path"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."point"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."point"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."point"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."point"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."polygon"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."polygon"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."polygon"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."polygon"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."text"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."text"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."text"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."text"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry"("path") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry"("path") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry"("path") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry"("path") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry"("point") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry"("point") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry"("point") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry"("point") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry"("polygon") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry"("polygon") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry"("polygon") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry"("polygon") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry"("text") TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."_postgis_deprecate"("oldname" "text", "newname" "text", "version" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."_postgis_deprecate"("oldname" "text", "newname" "text", "version" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."_postgis_deprecate"("oldname" "text", "newname" "text", "version" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_postgis_deprecate"("oldname" "text", "newname" "text", "version" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."_postgis_index_extent"("tbl" "regclass", "col" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."_postgis_index_extent"("tbl" "regclass", "col" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."_postgis_index_extent"("tbl" "regclass", "col" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_postgis_index_extent"("tbl" "regclass", "col" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."_postgis_join_selectivity"("regclass", "text", "regclass", "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."_postgis_join_selectivity"("regclass", "text", "regclass", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."_postgis_join_selectivity"("regclass", "text", "regclass", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_postgis_join_selectivity"("regclass", "text", "regclass", "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."_postgis_pgsql_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."_postgis_pgsql_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."_postgis_pgsql_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."_postgis_pgsql_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."_postgis_scripts_pgsql_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."_postgis_scripts_pgsql_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."_postgis_scripts_pgsql_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."_postgis_scripts_pgsql_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."_postgis_selectivity"("tbl" "regclass", "att_name" "text", "geom" "public"."geometry", "mode" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."_postgis_selectivity"("tbl" "regclass", "att_name" "text", "geom" "public"."geometry", "mode" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."_postgis_selectivity"("tbl" "regclass", "att_name" "text", "geom" "public"."geometry", "mode" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_postgis_selectivity"("tbl" "regclass", "att_name" "text", "geom" "public"."geometry", "mode" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."_postgis_stats"("tbl" "regclass", "att_name" "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."_postgis_stats"("tbl" "regclass", "att_name" "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."_postgis_stats"("tbl" "regclass", "att_name" "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_postgis_stats"("tbl" "regclass", "att_name" "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_3ddfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_3ddfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_3ddfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_3ddfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_3ddwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_3ddwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_3ddwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_3ddwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_3dintersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_3dintersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_3dintersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_3dintersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_asgml"(integer, "public"."geometry", integer, integer, "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_asgml"(integer, "public"."geometry", integer, integer, "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_asgml"(integer, "public"."geometry", integer, integer, "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_asgml"(integer, "public"."geometry", integer, integer, "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_asx3d"(integer, "public"."geometry", integer, integer, "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_asx3d"(integer, "public"."geometry", integer, integer, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_asx3d"(integer, "public"."geometry", integer, integer, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_asx3d"(integer, "public"."geometry", integer, integer, "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_bestsrid"("public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_bestsrid"("public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_bestsrid"("public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_bestsrid"("public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_bestsrid"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_bestsrid"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_bestsrid"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_bestsrid"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_containsproperly"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_containsproperly"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_containsproperly"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_containsproperly"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_coveredby"("geog1" "public"."geography", "geog2" "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_coveredby"("geog1" "public"."geography", "geog2" "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_coveredby"("geog1" "public"."geography", "geog2" "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_coveredby"("geog1" "public"."geography", "geog2" "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_coveredby"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_coveredby"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_coveredby"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_coveredby"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_covers"("geog1" "public"."geography", "geog2" "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_covers"("geog1" "public"."geography", "geog2" "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_covers"("geog1" "public"."geography", "geog2" "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_covers"("geog1" "public"."geography", "geog2" "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_covers"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_covers"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_covers"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_covers"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_crosses"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_crosses"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_crosses"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_crosses"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_dfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_dfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_dfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_dfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_distancetree"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_distancetree"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_distancetree"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_distancetree"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_distancetree"("public"."geography", "public"."geography", double precision, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_distancetree"("public"."geography", "public"."geography", double precision, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_distancetree"("public"."geography", "public"."geography", double precision, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_distancetree"("public"."geography", "public"."geography", double precision, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography", boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography", boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography", boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography", boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography", double precision, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography", double precision, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography", double precision, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_distanceuncached"("public"."geography", "public"."geography", double precision, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_dwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_dwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_dwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_dwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_dwithin"("geog1" "public"."geography", "geog2" "public"."geography", "tolerance" double precision, "use_spheroid" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_dwithin"("geog1" "public"."geography", "geog2" "public"."geography", "tolerance" double precision, "use_spheroid" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_dwithin"("geog1" "public"."geography", "geog2" "public"."geography", "tolerance" double precision, "use_spheroid" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_dwithin"("geog1" "public"."geography", "geog2" "public"."geography", "tolerance" double precision, "use_spheroid" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_dwithinuncached"("public"."geography", "public"."geography", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_dwithinuncached"("public"."geography", "public"."geography", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_dwithinuncached"("public"."geography", "public"."geography", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_dwithinuncached"("public"."geography", "public"."geography", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_dwithinuncached"("public"."geography", "public"."geography", double precision, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_dwithinuncached"("public"."geography", "public"."geography", double precision, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_dwithinuncached"("public"."geography", "public"."geography", double precision, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_dwithinuncached"("public"."geography", "public"."geography", double precision, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_expand"("public"."geography", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_expand"("public"."geography", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_expand"("public"."geography", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_expand"("public"."geography", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_geomfromgml"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_geomfromgml"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_geomfromgml"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_geomfromgml"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_intersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_intersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_intersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_intersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_linecrossingdirection"("line1" "public"."geometry", "line2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_linecrossingdirection"("line1" "public"."geometry", "line2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_linecrossingdirection"("line1" "public"."geometry", "line2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_linecrossingdirection"("line1" "public"."geometry", "line2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_longestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_longestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_longestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_longestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_maxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_maxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_maxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_maxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_orderingequals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_orderingequals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_orderingequals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_orderingequals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_pointoutside"("public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_pointoutside"("public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_pointoutside"("public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_pointoutside"("public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_sortablehash"("geom" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_sortablehash"("geom" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_sortablehash"("geom" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_sortablehash"("geom" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_touches"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_touches"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_touches"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_touches"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_voronoi"("g1" "public"."geometry", "clip" "public"."geometry", "tolerance" double precision, "return_polygons" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_voronoi"("g1" "public"."geometry", "clip" "public"."geometry", "tolerance" double precision, "return_polygons" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."_st_voronoi"("g1" "public"."geometry", "clip" "public"."geometry", "tolerance" double precision, "return_polygons" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_voronoi"("g1" "public"."geometry", "clip" "public"."geometry", "tolerance" double precision, "return_polygons" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."_st_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."_st_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."_st_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."_st_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."add_search_history"("p_query" "text", "p_search_type" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."add_search_history"("p_query" "text", "p_search_type" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_search_history"("p_query" "text", "p_search_type" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."addauth"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."addauth"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."addauth"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."addauth"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("table_name" character varying, "column_name" character varying, "new_srid" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("table_name" character varying, "column_name" character varying, "new_srid" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("table_name" character varying, "column_name" character varying, "new_srid" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("table_name" character varying, "column_name" character varying, "new_srid" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid_in" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid_in" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid_in" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."addgeometrycolumn"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid_in" integer, "new_type" character varying, "new_dim" integer, "use_typmod" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."auto_publish_map_on_spot_insert"() TO "anon";
GRANT ALL ON FUNCTION "public"."auto_publish_map_on_spot_insert"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."auto_publish_map_on_spot_insert"() TO "service_role";



GRANT ALL ON FUNCTION "public"."auto_publish_map_on_spot_publish"() TO "anon";
GRANT ALL ON FUNCTION "public"."auto_publish_map_on_spot_publish"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."auto_publish_map_on_spot_publish"() TO "service_role";



GRANT ALL ON FUNCTION "public"."auto_unpublish_map_on_spot_delete"() TO "anon";
GRANT ALL ON FUNCTION "public"."auto_unpublish_map_on_spot_delete"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."auto_unpublish_map_on_spot_delete"() TO "service_role";



GRANT ALL ON FUNCTION "public"."auto_unpublish_map_when_no_public_spots"() TO "anon";
GRANT ALL ON FUNCTION "public"."auto_unpublish_map_when_no_public_spots"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."auto_unpublish_map_when_no_public_spots"() TO "service_role";



GRANT ALL ON FUNCTION "public"."box3dtobox"("public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."box3dtobox"("public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."box3dtobox"("public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."box3dtobox"("public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_email_has_pending_deletion"("check_email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."check_email_has_pending_deletion"("check_email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_email_has_pending_deletion"("check_email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."checkauth"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."checkauth"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."checkauth"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."checkauth"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."checkauth"("text", "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."checkauth"("text", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."checkauth"("text", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."checkauth"("text", "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."checkauthtrigger"() TO "postgres";
GRANT ALL ON FUNCTION "public"."checkauthtrigger"() TO "anon";
GRANT ALL ON FUNCTION "public"."checkauthtrigger"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."checkauthtrigger"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_old_view_history"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_old_view_history"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_old_view_history"() TO "service_role";



GRANT ALL ON FUNCTION "public"."clear_push_token"() TO "anon";
GRANT ALL ON FUNCTION "public"."clear_push_token"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."clear_push_token"() TO "service_role";



GRANT ALL ON FUNCTION "public"."clear_search_history"("p_search_type" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."clear_search_history"("p_search_type" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."clear_search_history"("p_search_type" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."contains_2d"("public"."box2df", "public"."box2df") TO "postgres";
GRANT ALL ON FUNCTION "public"."contains_2d"("public"."box2df", "public"."box2df") TO "anon";
GRANT ALL ON FUNCTION "public"."contains_2d"("public"."box2df", "public"."box2df") TO "authenticated";
GRANT ALL ON FUNCTION "public"."contains_2d"("public"."box2df", "public"."box2df") TO "service_role";



GRANT ALL ON FUNCTION "public"."contains_2d"("public"."box2df", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."contains_2d"("public"."box2df", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."contains_2d"("public"."box2df", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."contains_2d"("public"."box2df", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."contains_2d"("public"."geometry", "public"."box2df") TO "postgres";
GRANT ALL ON FUNCTION "public"."contains_2d"("public"."geometry", "public"."box2df") TO "anon";
GRANT ALL ON FUNCTION "public"."contains_2d"("public"."geometry", "public"."box2df") TO "authenticated";
GRANT ALL ON FUNCTION "public"."contains_2d"("public"."geometry", "public"."box2df") TO "service_role";



GRANT ALL ON FUNCTION "public"."count_images_in_spot"("p_user_spot_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."count_images_in_spot"("p_user_spot_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."count_images_in_spot"("p_user_spot_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."count_user_spots_in_map"("p_user_id" "uuid", "p_map_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."count_user_spots_in_map"("p_user_id" "uuid", "p_map_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."count_user_spots_in_map"("p_user_id" "uuid", "p_map_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_comment_map_notification"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_comment_map_notification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_comment_map_notification"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_comment_spot_notification"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_comment_spot_notification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_comment_spot_notification"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_default_notification_settings"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_default_notification_settings"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_default_notification_settings"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_follow_notification"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_follow_notification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_follow_notification"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_like_map_notification"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_like_map_notification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_like_map_notification"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_like_spot_notification"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_like_spot_notification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_like_spot_notification"() TO "service_role";



GRANT ALL ON FUNCTION "public"."disablelongtransactions"() TO "postgres";
GRANT ALL ON FUNCTION "public"."disablelongtransactions"() TO "anon";
GRANT ALL ON FUNCTION "public"."disablelongtransactions"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."disablelongtransactions"() TO "service_role";



GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("table_name" character varying, "column_name" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("table_name" character varying, "column_name" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("table_name" character varying, "column_name" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("table_name" character varying, "column_name" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("schema_name" character varying, "table_name" character varying, "column_name" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("schema_name" character varying, "table_name" character varying, "column_name" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("schema_name" character varying, "table_name" character varying, "column_name" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("schema_name" character varying, "table_name" character varying, "column_name" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."dropgeometrycolumn"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."dropgeometrytable"("table_name" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."dropgeometrytable"("table_name" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."dropgeometrytable"("table_name" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."dropgeometrytable"("table_name" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."dropgeometrytable"("schema_name" character varying, "table_name" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."dropgeometrytable"("schema_name" character varying, "table_name" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."dropgeometrytable"("schema_name" character varying, "table_name" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."dropgeometrytable"("schema_name" character varying, "table_name" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."dropgeometrytable"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."dropgeometrytable"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."dropgeometrytable"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."dropgeometrytable"("catalog_name" character varying, "schema_name" character varying, "table_name" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."enablelongtransactions"() TO "postgres";
GRANT ALL ON FUNCTION "public"."enablelongtransactions"() TO "anon";
GRANT ALL ON FUNCTION "public"."enablelongtransactions"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."enablelongtransactions"() TO "service_role";



GRANT ALL ON FUNCTION "public"."equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."expire_premium_subscriptions"() TO "anon";
GRANT ALL ON FUNCTION "public"."expire_premium_subscriptions"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."expire_premium_subscriptions"() TO "service_role";



GRANT ALL ON FUNCTION "public"."find_srid"(character varying, character varying, character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."find_srid"(character varying, character varying, character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."find_srid"(character varying, character varying, character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."find_srid"(character varying, character varying, character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_feed_ad_slots"("p_start_position" integer, "p_num_blocks" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."generate_feed_ad_slots"("p_start_position" integer, "p_num_blocks" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_feed_ad_slots"("p_start_position" integer, "p_num_blocks" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."geog_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geog_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geog_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geog_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_cmp"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_cmp"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_cmp"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_cmp"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_distance_knn"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_distance_knn"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_distance_knn"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_distance_knn"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_eq"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_eq"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_eq"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_eq"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_ge"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_ge"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_ge"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_ge"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_gist_compress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_gist_compress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_gist_compress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_gist_compress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_gist_consistent"("internal", "public"."geography", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_gist_consistent"("internal", "public"."geography", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."geography_gist_consistent"("internal", "public"."geography", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_gist_consistent"("internal", "public"."geography", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_gist_decompress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_gist_decompress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_gist_decompress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_gist_decompress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_gist_distance"("internal", "public"."geography", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_gist_distance"("internal", "public"."geography", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."geography_gist_distance"("internal", "public"."geography", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_gist_distance"("internal", "public"."geography", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_gist_penalty"("internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_gist_penalty"("internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_gist_penalty"("internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_gist_penalty"("internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_gist_picksplit"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_gist_picksplit"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_gist_picksplit"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_gist_picksplit"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_gist_same"("public"."box2d", "public"."box2d", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_gist_same"("public"."box2d", "public"."box2d", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_gist_same"("public"."box2d", "public"."box2d", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_gist_same"("public"."box2d", "public"."box2d", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_gist_union"("bytea", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_gist_union"("bytea", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_gist_union"("bytea", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_gist_union"("bytea", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_gt"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_gt"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_gt"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_gt"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_le"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_le"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_le"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_le"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_lt"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_lt"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_lt"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_lt"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_overlaps"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_overlaps"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_overlaps"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_overlaps"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_spgist_choose_nd"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_spgist_choose_nd"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_spgist_choose_nd"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_spgist_choose_nd"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_spgist_compress_nd"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_spgist_compress_nd"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_spgist_compress_nd"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_spgist_compress_nd"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_spgist_config_nd"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_spgist_config_nd"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_spgist_config_nd"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_spgist_config_nd"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_spgist_inner_consistent_nd"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_spgist_inner_consistent_nd"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_spgist_inner_consistent_nd"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_spgist_inner_consistent_nd"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_spgist_leaf_consistent_nd"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_spgist_leaf_consistent_nd"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_spgist_leaf_consistent_nd"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_spgist_leaf_consistent_nd"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geography_spgist_picksplit_nd"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geography_spgist_picksplit_nd"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geography_spgist_picksplit_nd"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geography_spgist_picksplit_nd"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geom2d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geom2d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geom2d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geom2d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geom3d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geom3d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geom3d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geom3d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geom4d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geom4d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geom4d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geom4d_brin_inclusion_add_value"("internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_above"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_above"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_above"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_above"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_below"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_below"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_below"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_below"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_cmp"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_cmp"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_cmp"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_cmp"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_contained_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_contained_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_contained_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_contained_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_contains_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_contains_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_contains_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_contains_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_contains_nd"("public"."geometry", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_contains_nd"("public"."geometry", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_contains_nd"("public"."geometry", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_contains_nd"("public"."geometry", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_distance_box"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_distance_box"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_distance_box"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_distance_box"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_distance_centroid"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_distance_centroid"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_distance_centroid"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_distance_centroid"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_distance_centroid_nd"("public"."geometry", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_distance_centroid_nd"("public"."geometry", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_distance_centroid_nd"("public"."geometry", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_distance_centroid_nd"("public"."geometry", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_distance_cpa"("public"."geometry", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_distance_cpa"("public"."geometry", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_distance_cpa"("public"."geometry", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_distance_cpa"("public"."geometry", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_eq"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_eq"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_eq"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_eq"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_ge"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_ge"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_ge"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_ge"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_compress_2d"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_compress_2d"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_compress_2d"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_compress_2d"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_compress_nd"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_compress_nd"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_compress_nd"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_compress_nd"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_consistent_2d"("internal", "public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_consistent_2d"("internal", "public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_consistent_2d"("internal", "public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_consistent_2d"("internal", "public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_consistent_nd"("internal", "public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_consistent_nd"("internal", "public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_consistent_nd"("internal", "public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_consistent_nd"("internal", "public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_decompress_2d"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_decompress_2d"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_decompress_2d"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_decompress_2d"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_decompress_nd"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_decompress_nd"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_decompress_nd"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_decompress_nd"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_distance_2d"("internal", "public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_distance_2d"("internal", "public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_distance_2d"("internal", "public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_distance_2d"("internal", "public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_distance_nd"("internal", "public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_distance_nd"("internal", "public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_distance_nd"("internal", "public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_distance_nd"("internal", "public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_penalty_2d"("internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_penalty_2d"("internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_penalty_2d"("internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_penalty_2d"("internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_penalty_nd"("internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_penalty_nd"("internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_penalty_nd"("internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_penalty_nd"("internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_picksplit_2d"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_picksplit_2d"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_picksplit_2d"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_picksplit_2d"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_picksplit_nd"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_picksplit_nd"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_picksplit_nd"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_picksplit_nd"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_same_2d"("geom1" "public"."geometry", "geom2" "public"."geometry", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_same_2d"("geom1" "public"."geometry", "geom2" "public"."geometry", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_same_2d"("geom1" "public"."geometry", "geom2" "public"."geometry", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_same_2d"("geom1" "public"."geometry", "geom2" "public"."geometry", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_same_nd"("public"."geometry", "public"."geometry", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_same_nd"("public"."geometry", "public"."geometry", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_same_nd"("public"."geometry", "public"."geometry", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_same_nd"("public"."geometry", "public"."geometry", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_sortsupport_2d"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_sortsupport_2d"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_sortsupport_2d"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_sortsupport_2d"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_union_2d"("bytea", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_union_2d"("bytea", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_union_2d"("bytea", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_union_2d"("bytea", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gist_union_nd"("bytea", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gist_union_nd"("bytea", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gist_union_nd"("bytea", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gist_union_nd"("bytea", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_gt"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_gt"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_gt"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_gt"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_hash"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_hash"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_hash"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_hash"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_le"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_le"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_le"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_le"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_left"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_left"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_left"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_left"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_lt"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_lt"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_lt"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_lt"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_overabove"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_overabove"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_overabove"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_overabove"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_overbelow"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_overbelow"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_overbelow"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_overbelow"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_overlaps_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_overlaps_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_overlaps_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_overlaps_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_overlaps_nd"("public"."geometry", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_overlaps_nd"("public"."geometry", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_overlaps_nd"("public"."geometry", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_overlaps_nd"("public"."geometry", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_overleft"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_overleft"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_overleft"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_overleft"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_overright"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_overright"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_overright"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_overright"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_right"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_right"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_right"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_right"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_same"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_same"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_same"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_same"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_same_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_same_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_same_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_same_3d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_same_nd"("public"."geometry", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_same_nd"("public"."geometry", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_same_nd"("public"."geometry", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_same_nd"("public"."geometry", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_sortsupport"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_sortsupport"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_sortsupport"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_sortsupport"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_2d"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_2d"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_2d"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_2d"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_3d"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_3d"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_3d"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_3d"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_nd"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_nd"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_nd"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_choose_nd"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_2d"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_2d"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_2d"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_2d"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_3d"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_3d"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_3d"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_3d"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_nd"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_nd"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_nd"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_compress_nd"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_config_2d"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_config_2d"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_config_2d"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_config_2d"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_config_3d"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_config_3d"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_config_3d"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_config_3d"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_config_nd"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_config_nd"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_config_nd"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_config_nd"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_2d"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_2d"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_2d"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_2d"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_3d"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_3d"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_3d"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_3d"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_nd"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_nd"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_nd"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_inner_consistent_nd"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_2d"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_2d"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_2d"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_2d"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_3d"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_3d"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_3d"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_3d"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_nd"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_nd"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_nd"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_leaf_consistent_nd"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_2d"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_2d"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_2d"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_2d"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_3d"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_3d"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_3d"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_3d"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_nd"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_nd"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_nd"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_spgist_picksplit_nd"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometry_within_nd"("public"."geometry", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometry_within_nd"("public"."geometry", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometry_within_nd"("public"."geometry", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometry_within_nd"("public"."geometry", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometrytype"("public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometrytype"("public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."geometrytype"("public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometrytype"("public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."geometrytype"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."geometrytype"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."geometrytype"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geometrytype"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."geomfromewkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."geomfromewkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."geomfromewkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geomfromewkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."geomfromewkt"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."geomfromewkt"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."geomfromewkt"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."geomfromewkt"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_city_by_coordinate"("lng" double precision, "lat" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."get_city_by_coordinate"("lng" double precision, "lat" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_city_by_coordinate"("lng" double precision, "lat" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_following_mixed_feed"("p_user_id" "uuid", "p_map_limit" integer, "p_spot_limit" integer, "p_map_cursor" timestamp with time zone, "p_spot_cursor" timestamp with time zone, "p_show_ads" boolean, "p_start_position" integer, "p_enable_shorts" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."get_following_mixed_feed"("p_user_id" "uuid", "p_map_limit" integer, "p_spot_limit" integer, "p_map_cursor" timestamp with time zone, "p_spot_cursor" timestamp with time zone, "p_show_ads" boolean, "p_start_position" integer, "p_enable_shorts" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_following_mixed_feed"("p_user_id" "uuid", "p_map_limit" integer, "p_spot_limit" integer, "p_map_cursor" timestamp with time zone, "p_spot_cursor" timestamp with time zone, "p_show_ads" boolean, "p_start_position" integer, "p_enable_shorts" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_mixed_feed"("p_map_limit" integer, "p_spot_limit" integer, "p_map_cursor" timestamp with time zone, "p_spot_cursor" timestamp with time zone, "p_current_user_id" "uuid", "p_show_ads" boolean, "p_start_position" integer, "p_enable_shorts" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."get_mixed_feed"("p_map_limit" integer, "p_spot_limit" integer, "p_map_cursor" timestamp with time zone, "p_spot_cursor" timestamp with time zone, "p_current_user_id" "uuid", "p_show_ads" boolean, "p_start_position" integer, "p_enable_shorts" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_mixed_feed"("p_map_limit" integer, "p_spot_limit" integer, "p_map_cursor" timestamp with time zone, "p_spot_cursor" timestamp with time zone, "p_current_user_id" "uuid", "p_show_ads" boolean, "p_start_position" integer, "p_enable_shorts" boolean) TO "service_role";



GRANT ALL ON TABLE "public"."user_notification_settings" TO "anon";
GRANT ALL ON TABLE "public"."user_notification_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."user_notification_settings" TO "service_role";



GRANT ALL ON FUNCTION "public"."get_notification_settings"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_notification_settings"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_notification_settings"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_popular_searches"("p_search_type" "text", "p_limit" integer, "p_prefecture" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_popular_searches"("p_search_type" "text", "p_limit" integer, "p_prefecture" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_popular_searches"("p_search_type" "text", "p_limit" integer, "p_prefecture" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_popular_searches"("p_search_type" "text", "p_limit" integer, "p_prefecture" "text", "p_country" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_popular_searches"("p_search_type" "text", "p_limit" integer, "p_prefecture" "text", "p_country" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_popular_searches"("p_search_type" "text", "p_limit" integer, "p_prefecture" "text", "p_country" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_proj4_from_srid"(integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."get_proj4_from_srid"(integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_proj4_from_srid"(integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_proj4_from_srid"(integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."gettransactionid"() TO "postgres";
GRANT ALL ON FUNCTION "public"."gettransactionid"() TO "anon";
GRANT ALL ON FUNCTION "public"."gettransactionid"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."gettransactionid"() TO "service_role";



GRANT ALL ON FUNCTION "public"."gserialized_gist_joinsel_2d"("internal", "oid", "internal", smallint) TO "postgres";
GRANT ALL ON FUNCTION "public"."gserialized_gist_joinsel_2d"("internal", "oid", "internal", smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."gserialized_gist_joinsel_2d"("internal", "oid", "internal", smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."gserialized_gist_joinsel_2d"("internal", "oid", "internal", smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."gserialized_gist_joinsel_nd"("internal", "oid", "internal", smallint) TO "postgres";
GRANT ALL ON FUNCTION "public"."gserialized_gist_joinsel_nd"("internal", "oid", "internal", smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."gserialized_gist_joinsel_nd"("internal", "oid", "internal", smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."gserialized_gist_joinsel_nd"("internal", "oid", "internal", smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."gserialized_gist_sel_2d"("internal", "oid", "internal", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."gserialized_gist_sel_2d"("internal", "oid", "internal", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."gserialized_gist_sel_2d"("internal", "oid", "internal", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."gserialized_gist_sel_2d"("internal", "oid", "internal", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."gserialized_gist_sel_nd"("internal", "oid", "internal", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."gserialized_gist_sel_nd"("internal", "oid", "internal", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."gserialized_gist_sel_nd"("internal", "oid", "internal", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."gserialized_gist_sel_nd"("internal", "oid", "internal", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin_user"("check_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin_user"("check_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin_user"("check_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."box2df", "public"."box2df") TO "postgres";
GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."box2df", "public"."box2df") TO "anon";
GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."box2df", "public"."box2df") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."box2df", "public"."box2df") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."box2df", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."box2df", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."box2df", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."box2df", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."geometry", "public"."box2df") TO "postgres";
GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."geometry", "public"."box2df") TO "anon";
GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."geometry", "public"."box2df") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_contained_2d"("public"."geometry", "public"."box2df") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_user_premium"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_user_premium"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_user_premium"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", timestamp without time zone) TO "postgres";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", timestamp without time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", timestamp without time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", timestamp without time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", "text", timestamp without time zone) TO "postgres";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", "text", timestamp without time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", "text", timestamp without time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."lockrow"("text", "text", "text", "text", timestamp without time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."longtransactionsenabled"() TO "postgres";
GRANT ALL ON FUNCTION "public"."longtransactionsenabled"() TO "anon";
GRANT ALL ON FUNCTION "public"."longtransactionsenabled"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."longtransactionsenabled"() TO "service_role";



GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."box2df", "public"."box2df") TO "postgres";
GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."box2df", "public"."box2df") TO "anon";
GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."box2df", "public"."box2df") TO "authenticated";
GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."box2df", "public"."box2df") TO "service_role";



GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."box2df", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."box2df", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."box2df", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."box2df", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."geometry", "public"."box2df") TO "postgres";
GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."geometry", "public"."box2df") TO "anon";
GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."geometry", "public"."box2df") TO "authenticated";
GRANT ALL ON FUNCTION "public"."overlaps_2d"("public"."geometry", "public"."box2df") TO "service_role";



GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."geography", "public"."gidx") TO "postgres";
GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."geography", "public"."gidx") TO "anon";
GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."geography", "public"."gidx") TO "authenticated";
GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."geography", "public"."gidx") TO "service_role";



GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."gidx", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."gidx", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."gidx", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."gidx", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."gidx", "public"."gidx") TO "postgres";
GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."gidx", "public"."gidx") TO "anon";
GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."gidx", "public"."gidx") TO "authenticated";
GRANT ALL ON FUNCTION "public"."overlaps_geog"("public"."gidx", "public"."gidx") TO "service_role";



GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."geometry", "public"."gidx") TO "postgres";
GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."geometry", "public"."gidx") TO "anon";
GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."geometry", "public"."gidx") TO "authenticated";
GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."geometry", "public"."gidx") TO "service_role";



GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."gidx", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."gidx", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."gidx", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."gidx", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."gidx", "public"."gidx") TO "postgres";
GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."gidx", "public"."gidx") TO "anon";
GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."gidx", "public"."gidx") TO "authenticated";
GRANT ALL ON FUNCTION "public"."overlaps_nd"("public"."gidx", "public"."gidx") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_finalfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_finalfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_finalfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_finalfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement", boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement", boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement", boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement", boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement", boolean, "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement", boolean, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement", boolean, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asflatgeobuf_transfn"("internal", "anyelement", boolean, "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_finalfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_finalfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_finalfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_finalfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_transfn"("internal", "anyelement") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_transfn"("internal", "anyelement") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_transfn"("internal", "anyelement") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_transfn"("internal", "anyelement") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_transfn"("internal", "anyelement", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_transfn"("internal", "anyelement", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_transfn"("internal", "anyelement", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asgeobuf_transfn"("internal", "anyelement", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asmvt_combinefn"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_combinefn"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_combinefn"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_combinefn"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asmvt_deserialfn"("bytea", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_deserialfn"("bytea", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_deserialfn"("bytea", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_deserialfn"("bytea", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asmvt_finalfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_finalfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_finalfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_finalfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asmvt_serialfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_serialfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_serialfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_serialfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer, "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer, "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer, "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer, "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer, "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_asmvt_transfn"("internal", "anyelement", "text", integer, "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry", double precision, integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry", double precision, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry", double precision, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_accum_transfn"("internal", "public"."geometry", double precision, integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_clusterintersecting_finalfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_clusterintersecting_finalfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_clusterintersecting_finalfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_clusterintersecting_finalfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_clusterwithin_finalfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_clusterwithin_finalfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_clusterwithin_finalfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_clusterwithin_finalfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_collect_finalfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_collect_finalfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_collect_finalfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_collect_finalfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_makeline_finalfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_makeline_finalfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_makeline_finalfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_makeline_finalfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_polygonize_finalfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_polygonize_finalfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_polygonize_finalfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_polygonize_finalfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_combinefn"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_combinefn"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_combinefn"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_combinefn"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_deserialfn"("bytea", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_deserialfn"("bytea", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_deserialfn"("bytea", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_deserialfn"("bytea", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_finalfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_finalfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_finalfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_finalfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_serialfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_serialfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_serialfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_serialfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_transfn"("internal", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_transfn"("internal", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_transfn"("internal", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_transfn"("internal", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_transfn"("internal", "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_transfn"("internal", "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_transfn"("internal", "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."pgis_geometry_union_parallel_transfn"("internal", "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."populate_geometry_columns"("use_typmod" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."populate_geometry_columns"("use_typmod" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."populate_geometry_columns"("use_typmod" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."populate_geometry_columns"("use_typmod" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."populate_geometry_columns"("tbl_oid" "oid", "use_typmod" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."populate_geometry_columns"("tbl_oid" "oid", "use_typmod" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."populate_geometry_columns"("tbl_oid" "oid", "use_typmod" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."populate_geometry_columns"("tbl_oid" "oid", "use_typmod" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_addbbox"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_addbbox"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_addbbox"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_addbbox"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_cache_bbox"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_cache_bbox"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_cache_bbox"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_cache_bbox"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_constraint_dims"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_constraint_dims"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_constraint_dims"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_constraint_dims"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_constraint_srid"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_constraint_srid"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_constraint_srid"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_constraint_srid"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_constraint_type"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_constraint_type"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_constraint_type"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_constraint_type"("geomschema" "text", "geomtable" "text", "geomcolumn" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_dropbbox"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_dropbbox"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_dropbbox"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_dropbbox"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_extensions_upgrade"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_extensions_upgrade"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_extensions_upgrade"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_extensions_upgrade"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_full_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_full_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_full_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_full_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_geos_noop"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_geos_noop"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_geos_noop"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_geos_noop"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_geos_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_geos_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_geos_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_geos_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_getbbox"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_getbbox"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_getbbox"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_getbbox"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_hasbbox"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_hasbbox"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_hasbbox"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_hasbbox"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_index_supportfn"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_index_supportfn"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_index_supportfn"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_index_supportfn"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_lib_build_date"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_lib_build_date"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_lib_build_date"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_lib_build_date"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_lib_revision"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_lib_revision"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_lib_revision"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_lib_revision"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_lib_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_lib_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_lib_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_lib_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_libjson_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_libjson_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_libjson_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_libjson_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_liblwgeom_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_liblwgeom_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_liblwgeom_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_liblwgeom_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_libprotobuf_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_libprotobuf_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_libprotobuf_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_libprotobuf_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_libxml_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_libxml_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_libxml_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_libxml_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_noop"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_noop"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_noop"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_noop"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_proj_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_proj_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_proj_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_proj_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_scripts_build_date"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_scripts_build_date"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_scripts_build_date"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_scripts_build_date"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_scripts_installed"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_scripts_installed"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_scripts_installed"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_scripts_installed"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_scripts_released"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_scripts_released"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_scripts_released"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_scripts_released"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_svn_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_svn_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_svn_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_svn_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_transform_geometry"("geom" "public"."geometry", "text", "text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_transform_geometry"("geom" "public"."geometry", "text", "text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_transform_geometry"("geom" "public"."geometry", "text", "text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_transform_geometry"("geom" "public"."geometry", "text", "text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_type_name"("geomname" character varying, "coord_dimension" integer, "use_new_name" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_type_name"("geomname" character varying, "coord_dimension" integer, "use_new_name" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_type_name"("geomname" character varying, "coord_dimension" integer, "use_new_name" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_type_name"("geomname" character varying, "coord_dimension" integer, "use_new_name" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_typmod_dims"(integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_typmod_dims"(integer) TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_typmod_dims"(integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_typmod_dims"(integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_typmod_srid"(integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_typmod_srid"(integer) TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_typmod_srid"(integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_typmod_srid"(integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_typmod_type"(integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_typmod_type"(integer) TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_typmod_type"(integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_typmod_type"(integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."postgis_wagyu_version"() TO "postgres";
GRANT ALL ON FUNCTION "public"."postgis_wagyu_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."postgis_wagyu_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."postgis_wagyu_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."publish_spot"("p_spot_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."publish_spot"("p_spot_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."publish_spot"("p_spot_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."record_map_view"("p_map_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."record_map_view"("p_map_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."record_map_view"("p_map_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."search_public_maps"("search_query" "text", "result_limit" integer, "tag_ids_filter" "uuid"[], "sort_by" "text", "date_range" "text", "region_text" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."search_public_maps"("search_query" "text", "result_limit" integer, "tag_ids_filter" "uuid"[], "sort_by" "text", "date_range" "text", "region_text" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_public_maps"("search_query" "text", "result_limit" integer, "tag_ids_filter" "uuid"[], "sort_by" "text", "date_range" "text", "region_text" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."search_public_spots"("search_query" "text", "result_limit" integer, "prefecture_id_filter" "text", "city_id_filter" "text", "tag_ids_filter" "uuid"[], "sort_by" "text", "date_range" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."search_public_spots"("search_query" "text", "result_limit" integer, "prefecture_id_filter" "text", "city_id_filter" "text", "tag_ids_filter" "uuid"[], "sort_by" "text", "date_range" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_public_spots"("search_query" "text", "result_limit" integer, "prefecture_id_filter" "text", "city_id_filter" "text", "tag_ids_filter" "uuid"[], "sort_by" "text", "date_range" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."send_push_notification"() TO "anon";
GRANT ALL ON FUNCTION "public"."send_push_notification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."send_push_notification"() TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3dclosestpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3dclosestpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_3dclosestpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3dclosestpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3ddfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3ddfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_3ddfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3ddfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3ddistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3ddistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_3ddistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3ddistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3ddwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3ddwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_3ddwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3ddwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3dintersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3dintersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_3dintersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3dintersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3dlength"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3dlength"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_3dlength"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3dlength"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3dlineinterpolatepoint"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3dlineinterpolatepoint"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_3dlineinterpolatepoint"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3dlineinterpolatepoint"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3dlongestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3dlongestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_3dlongestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3dlongestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3dmakebox"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3dmakebox"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_3dmakebox"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3dmakebox"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3dmaxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3dmaxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_3dmaxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3dmaxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3dperimeter"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3dperimeter"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_3dperimeter"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3dperimeter"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_3dshortestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3dshortestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_3dshortestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3dshortestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_addmeasure"("public"."geometry", double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_addmeasure"("public"."geometry", double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_addmeasure"("public"."geometry", double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_addmeasure"("public"."geometry", double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_addpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_addpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_addpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_addpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_addpoint"("geom1" "public"."geometry", "geom2" "public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_addpoint"("geom1" "public"."geometry", "geom2" "public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_addpoint"("geom1" "public"."geometry", "geom2" "public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_addpoint"("geom1" "public"."geometry", "geom2" "public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_affine"("public"."geometry", double precision, double precision, double precision, double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_affine"("public"."geometry", double precision, double precision, double precision, double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_affine"("public"."geometry", double precision, double precision, double precision, double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_affine"("public"."geometry", double precision, double precision, double precision, double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_affine"("public"."geometry", double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_affine"("public"."geometry", double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_affine"("public"."geometry", double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_affine"("public"."geometry", double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_angle"("line1" "public"."geometry", "line2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_angle"("line1" "public"."geometry", "line2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_angle"("line1" "public"."geometry", "line2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_angle"("line1" "public"."geometry", "line2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_angle"("pt1" "public"."geometry", "pt2" "public"."geometry", "pt3" "public"."geometry", "pt4" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_angle"("pt1" "public"."geometry", "pt2" "public"."geometry", "pt3" "public"."geometry", "pt4" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_angle"("pt1" "public"."geometry", "pt2" "public"."geometry", "pt3" "public"."geometry", "pt4" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_angle"("pt1" "public"."geometry", "pt2" "public"."geometry", "pt3" "public"."geometry", "pt4" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_area"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_area"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_area"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_area"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_area"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_area"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_area"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_area"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_area"("geog" "public"."geography", "use_spheroid" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_area"("geog" "public"."geography", "use_spheroid" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_area"("geog" "public"."geography", "use_spheroid" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_area"("geog" "public"."geography", "use_spheroid" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_area2d"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_area2d"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_area2d"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_area2d"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geography", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geography", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geography", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geography", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geometry", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geometry", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geometry", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asbinary"("public"."geometry", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asencodedpolyline"("geom" "public"."geometry", "nprecision" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asencodedpolyline"("geom" "public"."geometry", "nprecision" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_asencodedpolyline"("geom" "public"."geometry", "nprecision" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asencodedpolyline"("geom" "public"."geometry", "nprecision" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asewkb"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asewkb"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asewkb"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asewkb"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asewkb"("public"."geometry", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asewkb"("public"."geometry", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asewkb"("public"."geometry", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asewkb"("public"."geometry", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asewkt"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asewkt"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asewkt"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asewkt"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geography", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geography", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geography", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geography", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asewkt"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asgeojson"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asgeojson"("geog" "public"."geography", "maxdecimaldigits" integer, "options" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("geog" "public"."geography", "maxdecimaldigits" integer, "options" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("geog" "public"."geography", "maxdecimaldigits" integer, "options" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("geog" "public"."geography", "maxdecimaldigits" integer, "options" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asgeojson"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asgeojson"("r" "record", "geom_column" "text", "maxdecimaldigits" integer, "pretty_bool" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("r" "record", "geom_column" "text", "maxdecimaldigits" integer, "pretty_bool" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("r" "record", "geom_column" "text", "maxdecimaldigits" integer, "pretty_bool" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asgeojson"("r" "record", "geom_column" "text", "maxdecimaldigits" integer, "pretty_bool" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asgml"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asgml"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asgml"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asgml"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asgml"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asgml"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_asgml"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asgml"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asgml"("geog" "public"."geography", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asgml"("geog" "public"."geography", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asgml"("geog" "public"."geography", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asgml"("geog" "public"."geography", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asgml"("version" integer, "geog" "public"."geography", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asgml"("version" integer, "geog" "public"."geography", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asgml"("version" integer, "geog" "public"."geography", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asgml"("version" integer, "geog" "public"."geography", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asgml"("version" integer, "geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asgml"("version" integer, "geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asgml"("version" integer, "geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asgml"("version" integer, "geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer, "nprefix" "text", "id" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_ashexewkb"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_ashexewkb"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_ashexewkb"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_ashexewkb"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_ashexewkb"("public"."geometry", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_ashexewkb"("public"."geometry", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_ashexewkb"("public"."geometry", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_ashexewkb"("public"."geometry", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_askml"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_askml"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_askml"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_askml"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_askml"("geog" "public"."geography", "maxdecimaldigits" integer, "nprefix" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_askml"("geog" "public"."geography", "maxdecimaldigits" integer, "nprefix" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_askml"("geog" "public"."geography", "maxdecimaldigits" integer, "nprefix" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_askml"("geog" "public"."geography", "maxdecimaldigits" integer, "nprefix" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_askml"("geom" "public"."geometry", "maxdecimaldigits" integer, "nprefix" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_askml"("geom" "public"."geometry", "maxdecimaldigits" integer, "nprefix" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_askml"("geom" "public"."geometry", "maxdecimaldigits" integer, "nprefix" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_askml"("geom" "public"."geometry", "maxdecimaldigits" integer, "nprefix" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_aslatlontext"("geom" "public"."geometry", "tmpl" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_aslatlontext"("geom" "public"."geometry", "tmpl" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_aslatlontext"("geom" "public"."geometry", "tmpl" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_aslatlontext"("geom" "public"."geometry", "tmpl" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asmarc21"("geom" "public"."geometry", "format" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asmarc21"("geom" "public"."geometry", "format" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asmarc21"("geom" "public"."geometry", "format" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asmarc21"("geom" "public"."geometry", "format" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asmvtgeom"("geom" "public"."geometry", "bounds" "public"."box2d", "extent" integer, "buffer" integer, "clip_geom" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asmvtgeom"("geom" "public"."geometry", "bounds" "public"."box2d", "extent" integer, "buffer" integer, "clip_geom" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_asmvtgeom"("geom" "public"."geometry", "bounds" "public"."box2d", "extent" integer, "buffer" integer, "clip_geom" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asmvtgeom"("geom" "public"."geometry", "bounds" "public"."box2d", "extent" integer, "buffer" integer, "clip_geom" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_assvg"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_assvg"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_assvg"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_assvg"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_assvg"("geog" "public"."geography", "rel" integer, "maxdecimaldigits" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_assvg"("geog" "public"."geography", "rel" integer, "maxdecimaldigits" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_assvg"("geog" "public"."geography", "rel" integer, "maxdecimaldigits" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_assvg"("geog" "public"."geography", "rel" integer, "maxdecimaldigits" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_assvg"("geom" "public"."geometry", "rel" integer, "maxdecimaldigits" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_assvg"("geom" "public"."geometry", "rel" integer, "maxdecimaldigits" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_assvg"("geom" "public"."geometry", "rel" integer, "maxdecimaldigits" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_assvg"("geom" "public"."geometry", "rel" integer, "maxdecimaldigits" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_astext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_astext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_astext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_astext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_astext"("public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_astext"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_astext"("public"."geography", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geography", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geography", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geography", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_astext"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_astext"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_astwkb"("geom" "public"."geometry", "prec" integer, "prec_z" integer, "prec_m" integer, "with_sizes" boolean, "with_boxes" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_astwkb"("geom" "public"."geometry", "prec" integer, "prec_z" integer, "prec_m" integer, "with_sizes" boolean, "with_boxes" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_astwkb"("geom" "public"."geometry", "prec" integer, "prec_z" integer, "prec_m" integer, "with_sizes" boolean, "with_boxes" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_astwkb"("geom" "public"."geometry", "prec" integer, "prec_z" integer, "prec_m" integer, "with_sizes" boolean, "with_boxes" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_astwkb"("geom" "public"."geometry"[], "ids" bigint[], "prec" integer, "prec_z" integer, "prec_m" integer, "with_sizes" boolean, "with_boxes" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_astwkb"("geom" "public"."geometry"[], "ids" bigint[], "prec" integer, "prec_z" integer, "prec_m" integer, "with_sizes" boolean, "with_boxes" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_astwkb"("geom" "public"."geometry"[], "ids" bigint[], "prec" integer, "prec_z" integer, "prec_m" integer, "with_sizes" boolean, "with_boxes" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_astwkb"("geom" "public"."geometry"[], "ids" bigint[], "prec" integer, "prec_z" integer, "prec_m" integer, "with_sizes" boolean, "with_boxes" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asx3d"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asx3d"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_asx3d"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asx3d"("geom" "public"."geometry", "maxdecimaldigits" integer, "options" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_azimuth"("geog1" "public"."geography", "geog2" "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_azimuth"("geog1" "public"."geography", "geog2" "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."st_azimuth"("geog1" "public"."geography", "geog2" "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_azimuth"("geog1" "public"."geography", "geog2" "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_azimuth"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_azimuth"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_azimuth"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_azimuth"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_bdmpolyfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_bdmpolyfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_bdmpolyfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_bdmpolyfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_bdpolyfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_bdpolyfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_bdpolyfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_bdpolyfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_boundary"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_boundary"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_boundary"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_boundary"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_boundingdiagonal"("geom" "public"."geometry", "fits" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_boundingdiagonal"("geom" "public"."geometry", "fits" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_boundingdiagonal"("geom" "public"."geometry", "fits" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_boundingdiagonal"("geom" "public"."geometry", "fits" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_box2dfromgeohash"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_box2dfromgeohash"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_box2dfromgeohash"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_box2dfromgeohash"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision, integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision, integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision, "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_buffer"("text", double precision, "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision, integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision, integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision, "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_buffer"("public"."geography", double precision, "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_buffer"("geom" "public"."geometry", "radius" double precision, "quadsegs" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_buffer"("geom" "public"."geometry", "radius" double precision, "quadsegs" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_buffer"("geom" "public"."geometry", "radius" double precision, "quadsegs" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_buffer"("geom" "public"."geometry", "radius" double precision, "quadsegs" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_buffer"("geom" "public"."geometry", "radius" double precision, "options" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_buffer"("geom" "public"."geometry", "radius" double precision, "options" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_buffer"("geom" "public"."geometry", "radius" double precision, "options" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_buffer"("geom" "public"."geometry", "radius" double precision, "options" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_buildarea"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_buildarea"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_buildarea"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_buildarea"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_centroid"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_centroid"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_centroid"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_centroid"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_centroid"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_centroid"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_centroid"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_centroid"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_centroid"("public"."geography", "use_spheroid" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_centroid"("public"."geography", "use_spheroid" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_centroid"("public"."geography", "use_spheroid" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_centroid"("public"."geography", "use_spheroid" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_chaikinsmoothing"("public"."geometry", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_chaikinsmoothing"("public"."geometry", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_chaikinsmoothing"("public"."geometry", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_chaikinsmoothing"("public"."geometry", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_cleangeometry"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_cleangeometry"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_cleangeometry"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_cleangeometry"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_clipbybox2d"("geom" "public"."geometry", "box" "public"."box2d") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_clipbybox2d"("geom" "public"."geometry", "box" "public"."box2d") TO "anon";
GRANT ALL ON FUNCTION "public"."st_clipbybox2d"("geom" "public"."geometry", "box" "public"."box2d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_clipbybox2d"("geom" "public"."geometry", "box" "public"."box2d") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_closestpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_closestpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_closestpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_closestpoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_closestpointofapproach"("public"."geometry", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_closestpointofapproach"("public"."geometry", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_closestpointofapproach"("public"."geometry", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_closestpointofapproach"("public"."geometry", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_clusterdbscan"("public"."geometry", "eps" double precision, "minpoints" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_clusterdbscan"("public"."geometry", "eps" double precision, "minpoints" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_clusterdbscan"("public"."geometry", "eps" double precision, "minpoints" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_clusterdbscan"("public"."geometry", "eps" double precision, "minpoints" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_clusterintersecting"("public"."geometry"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_clusterintersecting"("public"."geometry"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."st_clusterintersecting"("public"."geometry"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_clusterintersecting"("public"."geometry"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_clusterkmeans"("geom" "public"."geometry", "k" integer, "max_radius" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_clusterkmeans"("geom" "public"."geometry", "k" integer, "max_radius" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_clusterkmeans"("geom" "public"."geometry", "k" integer, "max_radius" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_clusterkmeans"("geom" "public"."geometry", "k" integer, "max_radius" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_clusterwithin"("public"."geometry"[], double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_clusterwithin"("public"."geometry"[], double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_clusterwithin"("public"."geometry"[], double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_clusterwithin"("public"."geometry"[], double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_collect"("public"."geometry"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_collect"("public"."geometry"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."st_collect"("public"."geometry"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_collect"("public"."geometry"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_collect"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_collect"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_collect"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_collect"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_collectionextract"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_collectionextract"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_collectionextract"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_collectionextract"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_collectionextract"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_collectionextract"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_collectionextract"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_collectionextract"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_collectionhomogenize"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_collectionhomogenize"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_collectionhomogenize"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_collectionhomogenize"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box2d", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box2d", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box2d", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box2d", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box3d", "public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box3d", "public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box3d", "public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box3d", "public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box3d", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box3d", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box3d", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_combinebbox"("public"."box3d", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_concavehull"("param_geom" "public"."geometry", "param_pctconvex" double precision, "param_allow_holes" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_concavehull"("param_geom" "public"."geometry", "param_pctconvex" double precision, "param_allow_holes" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_concavehull"("param_geom" "public"."geometry", "param_pctconvex" double precision, "param_allow_holes" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_concavehull"("param_geom" "public"."geometry", "param_pctconvex" double precision, "param_allow_holes" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_contains"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_containsproperly"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_containsproperly"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_containsproperly"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_containsproperly"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_convexhull"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_convexhull"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_convexhull"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_convexhull"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_coorddim"("geometry" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_coorddim"("geometry" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_coorddim"("geometry" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_coorddim"("geometry" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_coveredby"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_coveredby"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_coveredby"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_coveredby"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_coveredby"("geog1" "public"."geography", "geog2" "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_coveredby"("geog1" "public"."geography", "geog2" "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."st_coveredby"("geog1" "public"."geography", "geog2" "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_coveredby"("geog1" "public"."geography", "geog2" "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_coveredby"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_coveredby"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_coveredby"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_coveredby"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_covers"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_covers"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_covers"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_covers"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_covers"("geog1" "public"."geography", "geog2" "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_covers"("geog1" "public"."geography", "geog2" "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."st_covers"("geog1" "public"."geography", "geog2" "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_covers"("geog1" "public"."geography", "geog2" "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_covers"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_covers"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_covers"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_covers"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_cpawithin"("public"."geometry", "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_cpawithin"("public"."geometry", "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_cpawithin"("public"."geometry", "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_cpawithin"("public"."geometry", "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_crosses"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_crosses"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_crosses"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_crosses"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_curvetoline"("geom" "public"."geometry", "tol" double precision, "toltype" integer, "flags" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_curvetoline"("geom" "public"."geometry", "tol" double precision, "toltype" integer, "flags" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_curvetoline"("geom" "public"."geometry", "tol" double precision, "toltype" integer, "flags" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_curvetoline"("geom" "public"."geometry", "tol" double precision, "toltype" integer, "flags" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_delaunaytriangles"("g1" "public"."geometry", "tolerance" double precision, "flags" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_delaunaytriangles"("g1" "public"."geometry", "tolerance" double precision, "flags" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_delaunaytriangles"("g1" "public"."geometry", "tolerance" double precision, "flags" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_delaunaytriangles"("g1" "public"."geometry", "tolerance" double precision, "flags" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_dfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_dfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_dfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_dfullywithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_difference"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_difference"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_difference"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_difference"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_dimension"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_dimension"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_dimension"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_dimension"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_disjoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_disjoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_disjoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_disjoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_distance"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_distance"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_distance"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_distance"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_distance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_distance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_distance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_distance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_distance"("geog1" "public"."geography", "geog2" "public"."geography", "use_spheroid" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_distance"("geog1" "public"."geography", "geog2" "public"."geography", "use_spheroid" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_distance"("geog1" "public"."geography", "geog2" "public"."geography", "use_spheroid" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_distance"("geog1" "public"."geography", "geog2" "public"."geography", "use_spheroid" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_distancecpa"("public"."geometry", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_distancecpa"("public"."geometry", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_distancecpa"("public"."geometry", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_distancecpa"("public"."geometry", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_distancesphere"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_distancesphere"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_distancesphere"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_distancesphere"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_distancesphere"("geom1" "public"."geometry", "geom2" "public"."geometry", "radius" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_distancesphere"("geom1" "public"."geometry", "geom2" "public"."geometry", "radius" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_distancesphere"("geom1" "public"."geometry", "geom2" "public"."geometry", "radius" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_distancesphere"("geom1" "public"."geometry", "geom2" "public"."geometry", "radius" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_distancespheroid"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_distancespheroid"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_distancespheroid"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_distancespheroid"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_distancespheroid"("geom1" "public"."geometry", "geom2" "public"."geometry", "public"."spheroid") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_distancespheroid"("geom1" "public"."geometry", "geom2" "public"."geometry", "public"."spheroid") TO "anon";
GRANT ALL ON FUNCTION "public"."st_distancespheroid"("geom1" "public"."geometry", "geom2" "public"."geometry", "public"."spheroid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_distancespheroid"("geom1" "public"."geometry", "geom2" "public"."geometry", "public"."spheroid") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_dump"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_dump"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_dump"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_dump"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_dumppoints"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_dumppoints"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_dumppoints"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_dumppoints"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_dumprings"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_dumprings"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_dumprings"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_dumprings"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_dumpsegments"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_dumpsegments"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_dumpsegments"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_dumpsegments"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_dwithin"("text", "text", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_dwithin"("text", "text", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_dwithin"("text", "text", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_dwithin"("text", "text", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_dwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_dwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_dwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_dwithin"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_dwithin"("geog1" "public"."geography", "geog2" "public"."geography", "tolerance" double precision, "use_spheroid" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_dwithin"("geog1" "public"."geography", "geog2" "public"."geography", "tolerance" double precision, "use_spheroid" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_dwithin"("geog1" "public"."geography", "geog2" "public"."geography", "tolerance" double precision, "use_spheroid" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_dwithin"("geog1" "public"."geography", "geog2" "public"."geography", "tolerance" double precision, "use_spheroid" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_endpoint"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_endpoint"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_endpoint"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_endpoint"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_envelope"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_envelope"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_envelope"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_envelope"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_equals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text", "text", boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text", "text", boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text", "text", boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_estimatedextent"("text", "text", "text", boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_expand"("public"."box2d", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_expand"("public"."box2d", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_expand"("public"."box2d", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_expand"("public"."box2d", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_expand"("public"."box3d", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_expand"("public"."box3d", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_expand"("public"."box3d", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_expand"("public"."box3d", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_expand"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_expand"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_expand"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_expand"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_expand"("box" "public"."box2d", "dx" double precision, "dy" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_expand"("box" "public"."box2d", "dx" double precision, "dy" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_expand"("box" "public"."box2d", "dx" double precision, "dy" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_expand"("box" "public"."box2d", "dx" double precision, "dy" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_expand"("box" "public"."box3d", "dx" double precision, "dy" double precision, "dz" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_expand"("box" "public"."box3d", "dx" double precision, "dy" double precision, "dz" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_expand"("box" "public"."box3d", "dx" double precision, "dy" double precision, "dz" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_expand"("box" "public"."box3d", "dx" double precision, "dy" double precision, "dz" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_expand"("geom" "public"."geometry", "dx" double precision, "dy" double precision, "dz" double precision, "dm" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_expand"("geom" "public"."geometry", "dx" double precision, "dy" double precision, "dz" double precision, "dm" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_expand"("geom" "public"."geometry", "dx" double precision, "dy" double precision, "dz" double precision, "dm" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_expand"("geom" "public"."geometry", "dx" double precision, "dy" double precision, "dz" double precision, "dm" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_exteriorring"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_exteriorring"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_exteriorring"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_exteriorring"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_filterbym"("public"."geometry", double precision, double precision, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_filterbym"("public"."geometry", double precision, double precision, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_filterbym"("public"."geometry", double precision, double precision, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_filterbym"("public"."geometry", double precision, double precision, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_findextent"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_findextent"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_findextent"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_findextent"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_findextent"("text", "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_findextent"("text", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_findextent"("text", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_findextent"("text", "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_flipcoordinates"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_flipcoordinates"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_flipcoordinates"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_flipcoordinates"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_force2d"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_force2d"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_force2d"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_force2d"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_force3d"("geom" "public"."geometry", "zvalue" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_force3d"("geom" "public"."geometry", "zvalue" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_force3d"("geom" "public"."geometry", "zvalue" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_force3d"("geom" "public"."geometry", "zvalue" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_force3dm"("geom" "public"."geometry", "mvalue" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_force3dm"("geom" "public"."geometry", "mvalue" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_force3dm"("geom" "public"."geometry", "mvalue" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_force3dm"("geom" "public"."geometry", "mvalue" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_force3dz"("geom" "public"."geometry", "zvalue" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_force3dz"("geom" "public"."geometry", "zvalue" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_force3dz"("geom" "public"."geometry", "zvalue" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_force3dz"("geom" "public"."geometry", "zvalue" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_force4d"("geom" "public"."geometry", "zvalue" double precision, "mvalue" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_force4d"("geom" "public"."geometry", "zvalue" double precision, "mvalue" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_force4d"("geom" "public"."geometry", "zvalue" double precision, "mvalue" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_force4d"("geom" "public"."geometry", "zvalue" double precision, "mvalue" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_forcecollection"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_forcecollection"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_forcecollection"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_forcecollection"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_forcecurve"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_forcecurve"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_forcecurve"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_forcecurve"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_forcepolygonccw"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_forcepolygonccw"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_forcepolygonccw"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_forcepolygonccw"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_forcepolygoncw"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_forcepolygoncw"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_forcepolygoncw"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_forcepolygoncw"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_forcerhr"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_forcerhr"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_forcerhr"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_forcerhr"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_forcesfs"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_forcesfs"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_forcesfs"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_forcesfs"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_forcesfs"("public"."geometry", "version" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_forcesfs"("public"."geometry", "version" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_forcesfs"("public"."geometry", "version" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_forcesfs"("public"."geometry", "version" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_frechetdistance"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_frechetdistance"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_frechetdistance"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_frechetdistance"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_fromflatgeobuf"("anyelement", "bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_fromflatgeobuf"("anyelement", "bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_fromflatgeobuf"("anyelement", "bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_fromflatgeobuf"("anyelement", "bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_fromflatgeobuftotable"("text", "text", "bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_fromflatgeobuftotable"("text", "text", "bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_fromflatgeobuftotable"("text", "text", "bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_fromflatgeobuftotable"("text", "text", "bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_generatepoints"("area" "public"."geometry", "npoints" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_generatepoints"("area" "public"."geometry", "npoints" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_generatepoints"("area" "public"."geometry", "npoints" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_generatepoints"("area" "public"."geometry", "npoints" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_generatepoints"("area" "public"."geometry", "npoints" integer, "seed" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_generatepoints"("area" "public"."geometry", "npoints" integer, "seed" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_generatepoints"("area" "public"."geometry", "npoints" integer, "seed" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_generatepoints"("area" "public"."geometry", "npoints" integer, "seed" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geogfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geogfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geogfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geogfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geogfromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geogfromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geogfromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geogfromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geographyfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geographyfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geographyfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geographyfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geohash"("geog" "public"."geography", "maxchars" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geohash"("geog" "public"."geography", "maxchars" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geohash"("geog" "public"."geography", "maxchars" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geohash"("geog" "public"."geography", "maxchars" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geohash"("geom" "public"."geometry", "maxchars" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geohash"("geom" "public"."geometry", "maxchars" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geohash"("geom" "public"."geometry", "maxchars" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geohash"("geom" "public"."geometry", "maxchars" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomcollfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomcollfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomcollfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomcollfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomcollfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomcollfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomcollfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomcollfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomcollfromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomcollfromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomcollfromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomcollfromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomcollfromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomcollfromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomcollfromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomcollfromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geometricmedian"("g" "public"."geometry", "tolerance" double precision, "max_iter" integer, "fail_if_not_converged" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geometricmedian"("g" "public"."geometry", "tolerance" double precision, "max_iter" integer, "fail_if_not_converged" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geometricmedian"("g" "public"."geometry", "tolerance" double precision, "max_iter" integer, "fail_if_not_converged" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geometricmedian"("g" "public"."geometry", "tolerance" double precision, "max_iter" integer, "fail_if_not_converged" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geometryfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geometryfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geometryfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geometryfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geometryfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geometryfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geometryfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geometryfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geometryn"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geometryn"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geometryn"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geometryn"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geometrytype"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geometrytype"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geometrytype"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geometrytype"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromewkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromewkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromewkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromewkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromewkt"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromewkt"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromewkt"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromewkt"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromgeohash"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromgeohash"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromgeohash"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromgeohash"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"(json) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"(json) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"(json) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"(json) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"("jsonb") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"("jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"("jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"("jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromgeojson"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromgml"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromgml"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromgml"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromgml"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromgml"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromgml"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromgml"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromgml"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromkml"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromkml"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromkml"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromkml"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfrommarc21"("marc21xml" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfrommarc21"("marc21xml" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfrommarc21"("marc21xml" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfrommarc21"("marc21xml" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromtwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromtwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromtwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromtwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_geomfromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_geomfromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_geomfromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_geomfromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_gmltosql"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_gmltosql"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_gmltosql"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_gmltosql"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_gmltosql"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_gmltosql"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_gmltosql"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_gmltosql"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_hasarc"("geometry" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_hasarc"("geometry" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_hasarc"("geometry" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_hasarc"("geometry" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_hausdorffdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_hausdorffdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_hausdorffdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_hausdorffdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_hausdorffdistance"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_hausdorffdistance"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_hausdorffdistance"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_hausdorffdistance"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_hexagon"("size" double precision, "cell_i" integer, "cell_j" integer, "origin" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_hexagon"("size" double precision, "cell_i" integer, "cell_j" integer, "origin" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_hexagon"("size" double precision, "cell_i" integer, "cell_j" integer, "origin" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_hexagon"("size" double precision, "cell_i" integer, "cell_j" integer, "origin" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_hexagongrid"("size" double precision, "bounds" "public"."geometry", OUT "geom" "public"."geometry", OUT "i" integer, OUT "j" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_hexagongrid"("size" double precision, "bounds" "public"."geometry", OUT "geom" "public"."geometry", OUT "i" integer, OUT "j" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_hexagongrid"("size" double precision, "bounds" "public"."geometry", OUT "geom" "public"."geometry", OUT "i" integer, OUT "j" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_hexagongrid"("size" double precision, "bounds" "public"."geometry", OUT "geom" "public"."geometry", OUT "i" integer, OUT "j" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_interiorringn"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_interiorringn"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_interiorringn"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_interiorringn"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_interpolatepoint"("line" "public"."geometry", "point" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_interpolatepoint"("line" "public"."geometry", "point" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_interpolatepoint"("line" "public"."geometry", "point" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_interpolatepoint"("line" "public"."geometry", "point" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_intersection"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_intersection"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_intersection"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_intersection"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_intersection"("public"."geography", "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_intersection"("public"."geography", "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."st_intersection"("public"."geography", "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_intersection"("public"."geography", "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_intersection"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_intersection"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_intersection"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_intersection"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_intersects"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_intersects"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_intersects"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_intersects"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_intersects"("geog1" "public"."geography", "geog2" "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_intersects"("geog1" "public"."geography", "geog2" "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."st_intersects"("geog1" "public"."geography", "geog2" "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_intersects"("geog1" "public"."geography", "geog2" "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_intersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_intersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_intersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_intersects"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_isclosed"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_isclosed"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_isclosed"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_isclosed"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_iscollection"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_iscollection"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_iscollection"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_iscollection"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_isempty"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_isempty"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_isempty"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_isempty"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_ispolygonccw"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_ispolygonccw"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_ispolygonccw"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_ispolygonccw"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_ispolygoncw"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_ispolygoncw"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_ispolygoncw"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_ispolygoncw"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_isring"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_isring"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_isring"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_isring"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_issimple"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_issimple"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_issimple"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_issimple"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_isvalid"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_isvalid"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_isvalid"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_isvalid"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_isvalid"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_isvalid"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_isvalid"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_isvalid"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_isvaliddetail"("geom" "public"."geometry", "flags" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_isvaliddetail"("geom" "public"."geometry", "flags" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_isvaliddetail"("geom" "public"."geometry", "flags" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_isvaliddetail"("geom" "public"."geometry", "flags" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_isvalidreason"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_isvalidreason"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_isvalidreason"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_isvalidreason"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_isvalidreason"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_isvalidreason"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_isvalidreason"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_isvalidreason"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_isvalidtrajectory"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_isvalidtrajectory"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_isvalidtrajectory"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_isvalidtrajectory"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_length"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_length"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_length"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_length"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_length"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_length"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_length"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_length"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_length"("geog" "public"."geography", "use_spheroid" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_length"("geog" "public"."geography", "use_spheroid" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_length"("geog" "public"."geography", "use_spheroid" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_length"("geog" "public"."geography", "use_spheroid" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_length2d"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_length2d"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_length2d"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_length2d"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_length2dspheroid"("public"."geometry", "public"."spheroid") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_length2dspheroid"("public"."geometry", "public"."spheroid") TO "anon";
GRANT ALL ON FUNCTION "public"."st_length2dspheroid"("public"."geometry", "public"."spheroid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_length2dspheroid"("public"."geometry", "public"."spheroid") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_lengthspheroid"("public"."geometry", "public"."spheroid") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_lengthspheroid"("public"."geometry", "public"."spheroid") TO "anon";
GRANT ALL ON FUNCTION "public"."st_lengthspheroid"("public"."geometry", "public"."spheroid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_lengthspheroid"("public"."geometry", "public"."spheroid") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_letters"("letters" "text", "font" json) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_letters"("letters" "text", "font" json) TO "anon";
GRANT ALL ON FUNCTION "public"."st_letters"("letters" "text", "font" json) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_letters"("letters" "text", "font" json) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linecrossingdirection"("line1" "public"."geometry", "line2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linecrossingdirection"("line1" "public"."geometry", "line2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_linecrossingdirection"("line1" "public"."geometry", "line2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linecrossingdirection"("line1" "public"."geometry", "line2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linefromencodedpolyline"("txtin" "text", "nprecision" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linefromencodedpolyline"("txtin" "text", "nprecision" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_linefromencodedpolyline"("txtin" "text", "nprecision" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linefromencodedpolyline"("txtin" "text", "nprecision" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linefrommultipoint"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linefrommultipoint"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_linefrommultipoint"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linefrommultipoint"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linefromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linefromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_linefromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linefromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linefromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linefromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_linefromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linefromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linefromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linefromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_linefromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linefromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linefromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linefromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_linefromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linefromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_lineinterpolatepoint"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_lineinterpolatepoint"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_lineinterpolatepoint"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_lineinterpolatepoint"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_lineinterpolatepoints"("public"."geometry", double precision, "repeat" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_lineinterpolatepoints"("public"."geometry", double precision, "repeat" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_lineinterpolatepoints"("public"."geometry", double precision, "repeat" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_lineinterpolatepoints"("public"."geometry", double precision, "repeat" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linelocatepoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linelocatepoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_linelocatepoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linelocatepoint"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linemerge"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linemerge"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_linemerge"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linemerge"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linemerge"("public"."geometry", boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linemerge"("public"."geometry", boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_linemerge"("public"."geometry", boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linemerge"("public"."geometry", boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linestringfromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linestringfromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_linestringfromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linestringfromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linestringfromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linestringfromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_linestringfromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linestringfromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linesubstring"("public"."geometry", double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linesubstring"("public"."geometry", double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_linesubstring"("public"."geometry", double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linesubstring"("public"."geometry", double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_linetocurve"("geometry" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_linetocurve"("geometry" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_linetocurve"("geometry" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_linetocurve"("geometry" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_locatealong"("geometry" "public"."geometry", "measure" double precision, "leftrightoffset" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_locatealong"("geometry" "public"."geometry", "measure" double precision, "leftrightoffset" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_locatealong"("geometry" "public"."geometry", "measure" double precision, "leftrightoffset" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_locatealong"("geometry" "public"."geometry", "measure" double precision, "leftrightoffset" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_locatebetween"("geometry" "public"."geometry", "frommeasure" double precision, "tomeasure" double precision, "leftrightoffset" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_locatebetween"("geometry" "public"."geometry", "frommeasure" double precision, "tomeasure" double precision, "leftrightoffset" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_locatebetween"("geometry" "public"."geometry", "frommeasure" double precision, "tomeasure" double precision, "leftrightoffset" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_locatebetween"("geometry" "public"."geometry", "frommeasure" double precision, "tomeasure" double precision, "leftrightoffset" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_locatebetweenelevations"("geometry" "public"."geometry", "fromelevation" double precision, "toelevation" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_locatebetweenelevations"("geometry" "public"."geometry", "fromelevation" double precision, "toelevation" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_locatebetweenelevations"("geometry" "public"."geometry", "fromelevation" double precision, "toelevation" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_locatebetweenelevations"("geometry" "public"."geometry", "fromelevation" double precision, "toelevation" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_longestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_longestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_longestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_longestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_m"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_m"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_m"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_m"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makebox2d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makebox2d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_makebox2d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makebox2d"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makeenvelope"(double precision, double precision, double precision, double precision, integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makeenvelope"(double precision, double precision, double precision, double precision, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_makeenvelope"(double precision, double precision, double precision, double precision, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makeenvelope"(double precision, double precision, double precision, double precision, integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makeline"("public"."geometry"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makeline"("public"."geometry"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."st_makeline"("public"."geometry"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makeline"("public"."geometry"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makeline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makeline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_makeline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makeline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makepoint"(double precision, double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makepointm"(double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makepointm"(double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_makepointm"(double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makepointm"(double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makepolygon"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makepolygon"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_makepolygon"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makepolygon"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makepolygon"("public"."geometry", "public"."geometry"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makepolygon"("public"."geometry", "public"."geometry"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."st_makepolygon"("public"."geometry", "public"."geometry"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makepolygon"("public"."geometry", "public"."geometry"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makevalid"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makevalid"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_makevalid"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makevalid"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makevalid"("geom" "public"."geometry", "params" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makevalid"("geom" "public"."geometry", "params" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_makevalid"("geom" "public"."geometry", "params" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makevalid"("geom" "public"."geometry", "params" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_maxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_maxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_maxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_maxdistance"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_maximuminscribedcircle"("public"."geometry", OUT "center" "public"."geometry", OUT "nearest" "public"."geometry", OUT "radius" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_maximuminscribedcircle"("public"."geometry", OUT "center" "public"."geometry", OUT "nearest" "public"."geometry", OUT "radius" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_maximuminscribedcircle"("public"."geometry", OUT "center" "public"."geometry", OUT "nearest" "public"."geometry", OUT "radius" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_maximuminscribedcircle"("public"."geometry", OUT "center" "public"."geometry", OUT "nearest" "public"."geometry", OUT "radius" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_memsize"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_memsize"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_memsize"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_memsize"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_minimumboundingcircle"("inputgeom" "public"."geometry", "segs_per_quarter" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_minimumboundingcircle"("inputgeom" "public"."geometry", "segs_per_quarter" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_minimumboundingcircle"("inputgeom" "public"."geometry", "segs_per_quarter" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_minimumboundingcircle"("inputgeom" "public"."geometry", "segs_per_quarter" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_minimumboundingradius"("public"."geometry", OUT "center" "public"."geometry", OUT "radius" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_minimumboundingradius"("public"."geometry", OUT "center" "public"."geometry", OUT "radius" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_minimumboundingradius"("public"."geometry", OUT "center" "public"."geometry", OUT "radius" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_minimumboundingradius"("public"."geometry", OUT "center" "public"."geometry", OUT "radius" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_minimumclearance"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_minimumclearance"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_minimumclearance"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_minimumclearance"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_minimumclearanceline"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_minimumclearanceline"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_minimumclearanceline"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_minimumclearanceline"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mlinefromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mlinefromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_mlinefromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mlinefromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mlinefromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mlinefromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_mlinefromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mlinefromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mlinefromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mlinefromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_mlinefromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mlinefromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mlinefromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mlinefromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_mlinefromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mlinefromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mpointfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mpointfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_mpointfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mpointfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mpointfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mpointfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_mpointfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mpointfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mpointfromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mpointfromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_mpointfromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mpointfromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mpointfromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mpointfromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_mpointfromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mpointfromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mpolyfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mpolyfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_mpolyfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mpolyfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mpolyfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mpolyfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_mpolyfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mpolyfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mpolyfromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mpolyfromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_mpolyfromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mpolyfromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_mpolyfromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_mpolyfromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_mpolyfromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_mpolyfromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_multi"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_multi"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_multi"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_multi"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_multilinefromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_multilinefromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_multilinefromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_multilinefromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_multilinestringfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_multilinestringfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_multilinestringfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_multilinestringfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_multilinestringfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_multilinestringfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_multilinestringfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_multilinestringfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_multipointfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_multipointfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_multipointfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_multipointfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_multipointfromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_multipointfromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_multipointfromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_multipointfromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_multipointfromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_multipointfromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_multipointfromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_multipointfromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_multipolyfromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_multipolyfromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_multipolyfromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_multipolyfromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_multipolyfromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_multipolyfromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_multipolyfromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_multipolyfromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_multipolygonfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_multipolygonfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_multipolygonfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_multipolygonfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_multipolygonfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_multipolygonfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_multipolygonfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_multipolygonfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_ndims"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_ndims"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_ndims"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_ndims"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_node"("g" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_node"("g" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_node"("g" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_node"("g" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_normalize"("geom" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_normalize"("geom" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_normalize"("geom" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_normalize"("geom" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_npoints"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_npoints"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_npoints"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_npoints"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_nrings"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_nrings"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_nrings"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_nrings"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_numgeometries"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_numgeometries"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_numgeometries"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_numgeometries"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_numinteriorring"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_numinteriorring"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_numinteriorring"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_numinteriorring"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_numinteriorrings"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_numinteriorrings"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_numinteriorrings"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_numinteriorrings"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_numpatches"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_numpatches"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_numpatches"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_numpatches"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_numpoints"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_numpoints"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_numpoints"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_numpoints"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_offsetcurve"("line" "public"."geometry", "distance" double precision, "params" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_offsetcurve"("line" "public"."geometry", "distance" double precision, "params" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_offsetcurve"("line" "public"."geometry", "distance" double precision, "params" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_offsetcurve"("line" "public"."geometry", "distance" double precision, "params" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_orderingequals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_orderingequals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_orderingequals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_orderingequals"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_orientedenvelope"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_orientedenvelope"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_orientedenvelope"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_orientedenvelope"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_overlaps"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_patchn"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_patchn"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_patchn"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_patchn"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_perimeter"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_perimeter"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_perimeter"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_perimeter"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_perimeter"("geog" "public"."geography", "use_spheroid" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_perimeter"("geog" "public"."geography", "use_spheroid" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_perimeter"("geog" "public"."geography", "use_spheroid" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_perimeter"("geog" "public"."geography", "use_spheroid" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_perimeter2d"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_perimeter2d"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_perimeter2d"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_perimeter2d"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_point"(double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_point"(double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_point"(double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_point"(double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_point"(double precision, double precision, "srid" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_point"(double precision, double precision, "srid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_point"(double precision, double precision, "srid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_point"(double precision, double precision, "srid" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_pointfromgeohash"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_pointfromgeohash"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_pointfromgeohash"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_pointfromgeohash"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_pointfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_pointfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_pointfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_pointfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_pointfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_pointfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_pointfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_pointfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_pointfromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_pointfromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_pointfromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_pointfromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_pointfromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_pointfromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_pointfromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_pointfromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_pointinsidecircle"("public"."geometry", double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_pointinsidecircle"("public"."geometry", double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_pointinsidecircle"("public"."geometry", double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_pointinsidecircle"("public"."geometry", double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_pointm"("xcoordinate" double precision, "ycoordinate" double precision, "mcoordinate" double precision, "srid" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_pointm"("xcoordinate" double precision, "ycoordinate" double precision, "mcoordinate" double precision, "srid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_pointm"("xcoordinate" double precision, "ycoordinate" double precision, "mcoordinate" double precision, "srid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_pointm"("xcoordinate" double precision, "ycoordinate" double precision, "mcoordinate" double precision, "srid" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_pointn"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_pointn"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_pointn"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_pointn"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_pointonsurface"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_pointonsurface"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_pointonsurface"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_pointonsurface"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_points"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_points"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_points"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_points"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_pointz"("xcoordinate" double precision, "ycoordinate" double precision, "zcoordinate" double precision, "srid" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_pointz"("xcoordinate" double precision, "ycoordinate" double precision, "zcoordinate" double precision, "srid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_pointz"("xcoordinate" double precision, "ycoordinate" double precision, "zcoordinate" double precision, "srid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_pointz"("xcoordinate" double precision, "ycoordinate" double precision, "zcoordinate" double precision, "srid" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_pointzm"("xcoordinate" double precision, "ycoordinate" double precision, "zcoordinate" double precision, "mcoordinate" double precision, "srid" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_pointzm"("xcoordinate" double precision, "ycoordinate" double precision, "zcoordinate" double precision, "mcoordinate" double precision, "srid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_pointzm"("xcoordinate" double precision, "ycoordinate" double precision, "zcoordinate" double precision, "mcoordinate" double precision, "srid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_pointzm"("xcoordinate" double precision, "ycoordinate" double precision, "zcoordinate" double precision, "mcoordinate" double precision, "srid" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_polyfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_polyfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_polyfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_polyfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_polyfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_polyfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_polyfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_polyfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_polyfromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_polyfromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_polyfromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_polyfromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_polyfromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_polyfromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_polyfromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_polyfromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_polygon"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_polygon"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_polygon"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_polygon"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_polygonfromtext"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_polygonfromtext"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_polygonfromtext"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_polygonfromtext"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_polygonfromtext"("text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_polygonfromtext"("text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_polygonfromtext"("text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_polygonfromtext"("text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_polygonfromwkb"("bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_polygonfromwkb"("bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_polygonfromwkb"("bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_polygonfromwkb"("bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_polygonfromwkb"("bytea", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_polygonfromwkb"("bytea", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_polygonfromwkb"("bytea", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_polygonfromwkb"("bytea", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_polygonize"("public"."geometry"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_polygonize"("public"."geometry"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."st_polygonize"("public"."geometry"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_polygonize"("public"."geometry"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_project"("geog" "public"."geography", "distance" double precision, "azimuth" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_project"("geog" "public"."geography", "distance" double precision, "azimuth" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_project"("geog" "public"."geography", "distance" double precision, "azimuth" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_project"("geog" "public"."geography", "distance" double precision, "azimuth" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_quantizecoordinates"("g" "public"."geometry", "prec_x" integer, "prec_y" integer, "prec_z" integer, "prec_m" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_quantizecoordinates"("g" "public"."geometry", "prec_x" integer, "prec_y" integer, "prec_z" integer, "prec_m" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_quantizecoordinates"("g" "public"."geometry", "prec_x" integer, "prec_y" integer, "prec_z" integer, "prec_m" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_quantizecoordinates"("g" "public"."geometry", "prec_x" integer, "prec_y" integer, "prec_z" integer, "prec_m" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_reduceprecision"("geom" "public"."geometry", "gridsize" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_reduceprecision"("geom" "public"."geometry", "gridsize" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_reduceprecision"("geom" "public"."geometry", "gridsize" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_reduceprecision"("geom" "public"."geometry", "gridsize" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_relate"("geom1" "public"."geometry", "geom2" "public"."geometry", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_relatematch"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_relatematch"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_relatematch"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_relatematch"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_removepoint"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_removepoint"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_removepoint"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_removepoint"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_removerepeatedpoints"("geom" "public"."geometry", "tolerance" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_removerepeatedpoints"("geom" "public"."geometry", "tolerance" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_removerepeatedpoints"("geom" "public"."geometry", "tolerance" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_removerepeatedpoints"("geom" "public"."geometry", "tolerance" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_reverse"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_reverse"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_reverse"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_reverse"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision, "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision, "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision, "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision, "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_rotate"("public"."geometry", double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_rotatex"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_rotatex"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_rotatex"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_rotatex"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_rotatey"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_rotatey"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_rotatey"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_rotatey"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_rotatez"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_rotatez"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_rotatez"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_rotatez"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", "public"."geometry", "origin" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", "public"."geometry", "origin" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", "public"."geometry", "origin" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", "public"."geometry", "origin" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_scale"("public"."geometry", double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_scroll"("public"."geometry", "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_scroll"("public"."geometry", "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_scroll"("public"."geometry", "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_scroll"("public"."geometry", "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_segmentize"("geog" "public"."geography", "max_segment_length" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_segmentize"("geog" "public"."geography", "max_segment_length" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_segmentize"("geog" "public"."geography", "max_segment_length" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_segmentize"("geog" "public"."geography", "max_segment_length" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_segmentize"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_segmentize"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_segmentize"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_segmentize"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_seteffectivearea"("public"."geometry", double precision, integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_seteffectivearea"("public"."geometry", double precision, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_seteffectivearea"("public"."geometry", double precision, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_seteffectivearea"("public"."geometry", double precision, integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_setpoint"("public"."geometry", integer, "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_setpoint"("public"."geometry", integer, "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_setpoint"("public"."geometry", integer, "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_setpoint"("public"."geometry", integer, "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_setsrid"("geog" "public"."geography", "srid" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_setsrid"("geog" "public"."geography", "srid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_setsrid"("geog" "public"."geography", "srid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_setsrid"("geog" "public"."geography", "srid" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_setsrid"("geom" "public"."geometry", "srid" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_setsrid"("geom" "public"."geometry", "srid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_setsrid"("geom" "public"."geometry", "srid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_setsrid"("geom" "public"."geometry", "srid" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_sharedpaths"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_sharedpaths"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_sharedpaths"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_sharedpaths"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_shiftlongitude"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_shiftlongitude"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_shiftlongitude"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_shiftlongitude"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_shortestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_shortestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_shortestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_shortestline"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_simplify"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_simplify"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_simplify"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_simplify"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_simplify"("public"."geometry", double precision, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_simplify"("public"."geometry", double precision, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_simplify"("public"."geometry", double precision, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_simplify"("public"."geometry", double precision, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_simplifypolygonhull"("geom" "public"."geometry", "vertex_fraction" double precision, "is_outer" boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_simplifypolygonhull"("geom" "public"."geometry", "vertex_fraction" double precision, "is_outer" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_simplifypolygonhull"("geom" "public"."geometry", "vertex_fraction" double precision, "is_outer" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_simplifypolygonhull"("geom" "public"."geometry", "vertex_fraction" double precision, "is_outer" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_simplifypreservetopology"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_simplifypreservetopology"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_simplifypreservetopology"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_simplifypreservetopology"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_simplifyvw"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_simplifyvw"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_simplifyvw"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_simplifyvw"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_snap"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_snap"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_snap"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_snap"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision, double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision, double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision, double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("public"."geometry", double precision, double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_snaptogrid"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision, double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision, double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision, double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_snaptogrid"("geom1" "public"."geometry", "geom2" "public"."geometry", double precision, double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_split"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_split"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_split"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_split"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_square"("size" double precision, "cell_i" integer, "cell_j" integer, "origin" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_square"("size" double precision, "cell_i" integer, "cell_j" integer, "origin" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_square"("size" double precision, "cell_i" integer, "cell_j" integer, "origin" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_square"("size" double precision, "cell_i" integer, "cell_j" integer, "origin" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_squaregrid"("size" double precision, "bounds" "public"."geometry", OUT "geom" "public"."geometry", OUT "i" integer, OUT "j" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_squaregrid"("size" double precision, "bounds" "public"."geometry", OUT "geom" "public"."geometry", OUT "i" integer, OUT "j" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_squaregrid"("size" double precision, "bounds" "public"."geometry", OUT "geom" "public"."geometry", OUT "i" integer, OUT "j" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_squaregrid"("size" double precision, "bounds" "public"."geometry", OUT "geom" "public"."geometry", OUT "i" integer, OUT "j" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_srid"("geog" "public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_srid"("geog" "public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."st_srid"("geog" "public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_srid"("geog" "public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_srid"("geom" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_srid"("geom" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_srid"("geom" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_srid"("geom" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_startpoint"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_startpoint"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_startpoint"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_startpoint"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_subdivide"("geom" "public"."geometry", "maxvertices" integer, "gridsize" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_subdivide"("geom" "public"."geometry", "maxvertices" integer, "gridsize" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_subdivide"("geom" "public"."geometry", "maxvertices" integer, "gridsize" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_subdivide"("geom" "public"."geometry", "maxvertices" integer, "gridsize" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_summary"("public"."geography") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_summary"("public"."geography") TO "anon";
GRANT ALL ON FUNCTION "public"."st_summary"("public"."geography") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_summary"("public"."geography") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_summary"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_summary"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_summary"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_summary"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_swapordinates"("geom" "public"."geometry", "ords" "cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_swapordinates"("geom" "public"."geometry", "ords" "cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."st_swapordinates"("geom" "public"."geometry", "ords" "cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_swapordinates"("geom" "public"."geometry", "ords" "cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_symdifference"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_symdifference"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_symdifference"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_symdifference"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_symmetricdifference"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_symmetricdifference"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_symmetricdifference"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_symmetricdifference"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_tileenvelope"("zoom" integer, "x" integer, "y" integer, "bounds" "public"."geometry", "margin" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_tileenvelope"("zoom" integer, "x" integer, "y" integer, "bounds" "public"."geometry", "margin" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_tileenvelope"("zoom" integer, "x" integer, "y" integer, "bounds" "public"."geometry", "margin" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_tileenvelope"("zoom" integer, "x" integer, "y" integer, "bounds" "public"."geometry", "margin" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_touches"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_touches"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_touches"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_touches"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_transform"("public"."geometry", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_transform"("public"."geometry", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_transform"("public"."geometry", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_transform"("public"."geometry", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "to_proj" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "to_proj" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "to_proj" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "to_proj" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "from_proj" "text", "to_srid" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "from_proj" "text", "to_srid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "from_proj" "text", "to_srid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "from_proj" "text", "to_srid" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "from_proj" "text", "to_proj" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "from_proj" "text", "to_proj" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "from_proj" "text", "to_proj" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_transform"("geom" "public"."geometry", "from_proj" "text", "to_proj" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_translate"("public"."geometry", double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_translate"("public"."geometry", double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_translate"("public"."geometry", double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_translate"("public"."geometry", double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_translate"("public"."geometry", double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_translate"("public"."geometry", double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_translate"("public"."geometry", double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_translate"("public"."geometry", double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_transscale"("public"."geometry", double precision, double precision, double precision, double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_transscale"("public"."geometry", double precision, double precision, double precision, double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_transscale"("public"."geometry", double precision, double precision, double precision, double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_transscale"("public"."geometry", double precision, double precision, double precision, double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_triangulatepolygon"("g1" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_triangulatepolygon"("g1" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_triangulatepolygon"("g1" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_triangulatepolygon"("g1" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_unaryunion"("public"."geometry", "gridsize" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_unaryunion"("public"."geometry", "gridsize" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_unaryunion"("public"."geometry", "gridsize" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_unaryunion"("public"."geometry", "gridsize" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_union"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_union"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_union"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_union"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_union"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_union"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_union"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_union"("geom1" "public"."geometry", "geom2" "public"."geometry", "gridsize" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_voronoilines"("g1" "public"."geometry", "tolerance" double precision, "extend_to" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_voronoilines"("g1" "public"."geometry", "tolerance" double precision, "extend_to" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_voronoilines"("g1" "public"."geometry", "tolerance" double precision, "extend_to" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_voronoilines"("g1" "public"."geometry", "tolerance" double precision, "extend_to" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_voronoipolygons"("g1" "public"."geometry", "tolerance" double precision, "extend_to" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_voronoipolygons"("g1" "public"."geometry", "tolerance" double precision, "extend_to" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_voronoipolygons"("g1" "public"."geometry", "tolerance" double precision, "extend_to" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_voronoipolygons"("g1" "public"."geometry", "tolerance" double precision, "extend_to" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_within"("geom1" "public"."geometry", "geom2" "public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_wkbtosql"("wkb" "bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_wkbtosql"("wkb" "bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."st_wkbtosql"("wkb" "bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_wkbtosql"("wkb" "bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_wkttosql"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_wkttosql"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_wkttosql"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_wkttosql"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_wrapx"("geom" "public"."geometry", "wrap" double precision, "move" double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_wrapx"("geom" "public"."geometry", "wrap" double precision, "move" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_wrapx"("geom" "public"."geometry", "wrap" double precision, "move" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_wrapx"("geom" "public"."geometry", "wrap" double precision, "move" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_x"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_x"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_x"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_x"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_xmax"("public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_xmax"("public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."st_xmax"("public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_xmax"("public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_xmin"("public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_xmin"("public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."st_xmin"("public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_xmin"("public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_y"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_y"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_y"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_y"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_ymax"("public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_ymax"("public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."st_ymax"("public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_ymax"("public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_ymin"("public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_ymin"("public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."st_ymin"("public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_ymin"("public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_z"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_z"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_z"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_z"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_zmax"("public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_zmax"("public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."st_zmax"("public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_zmax"("public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_zmflag"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_zmflag"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_zmflag"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_zmflag"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_zmin"("public"."box3d") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_zmin"("public"."box3d") TO "anon";
GRANT ALL ON FUNCTION "public"."st_zmin"("public"."box3d") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_zmin"("public"."box3d") TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_spots_language"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_spots_language"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_spots_language"() TO "service_role";



GRANT ALL ON FUNCTION "public"."unlockrows"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."unlockrows"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."unlockrows"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unlockrows"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."unpublish_spot"("p_spot_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."unpublish_spot"("p_spot_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unpublish_spot"("p_spot_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_bookmarks_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_bookmarks_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_bookmarks_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_collection_maps_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_collection_maps_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_collection_maps_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_comment_likes_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_comment_likes_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_comment_likes_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_comment_replies_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_comment_replies_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_comment_replies_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_comments_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_comments_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_comments_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_images_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_images_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_images_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_likes_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_likes_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_likes_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_map_spots_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_map_spots_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_map_spots_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_master_spot_favorites_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_master_spot_favorites_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_master_spot_favorites_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_notification_settings"("p_push_enabled" boolean, "p_like_enabled" boolean, "p_comment_enabled" boolean, "p_follow_enabled" boolean, "p_system_enabled" boolean, "p_email_enabled" boolean, "p_email_like_enabled" boolean, "p_email_comment_enabled" boolean, "p_email_follow_enabled" boolean, "p_email_system_enabled" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."update_notification_settings"("p_push_enabled" boolean, "p_like_enabled" boolean, "p_comment_enabled" boolean, "p_follow_enabled" boolean, "p_system_enabled" boolean, "p_email_enabled" boolean, "p_email_like_enabled" boolean, "p_email_comment_enabled" boolean, "p_email_follow_enabled" boolean, "p_email_system_enabled" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_notification_settings"("p_push_enabled" boolean, "p_like_enabled" boolean, "p_comment_enabled" boolean, "p_follow_enabled" boolean, "p_system_enabled" boolean, "p_email_enabled" boolean, "p_email_like_enabled" boolean, "p_email_comment_enabled" boolean, "p_email_follow_enabled" boolean, "p_email_system_enabled" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."update_push_token"("token" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_push_token"("token" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_push_token"("token" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_tag_usage_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_tag_usage_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_tag_usage_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_tag_usage_count_for_spots"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_tag_usage_count_for_spots"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_tag_usage_count_for_spots"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_user_premium_status"("p_user_id" "uuid", "p_is_premium" boolean, "p_expires_at" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_premium_status"("p_user_id" "uuid", "p_is_premium" boolean, "p_expires_at" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_premium_status"("p_user_id" "uuid", "p_is_premium" boolean, "p_expires_at" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."updategeometrysrid"(character varying, character varying, integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."updategeometrysrid"(character varying, character varying, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."updategeometrysrid"(character varying, character varying, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."updategeometrysrid"(character varying, character varying, integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."updategeometrysrid"(character varying, character varying, character varying, integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."updategeometrysrid"(character varying, character varying, character varying, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."updategeometrysrid"(character varying, character varying, character varying, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."updategeometrysrid"(character varying, character varying, character varying, integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."updategeometrysrid"("catalogn_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid_in" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."updategeometrysrid"("catalogn_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid_in" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."updategeometrysrid"("catalogn_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid_in" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."updategeometrysrid"("catalogn_name" character varying, "schema_name" character varying, "table_name" character varying, "column_name" character varying, "new_srid_in" integer) TO "service_role";












GRANT ALL ON FUNCTION "public"."st_3dextent"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_3dextent"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_3dextent"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_3dextent"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement", boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement", boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement", boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement", boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement", boolean, "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement", boolean, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement", boolean, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asflatgeobuf"("anyelement", boolean, "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asgeobuf"("anyelement") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asgeobuf"("anyelement") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asgeobuf"("anyelement") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asgeobuf"("anyelement") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asgeobuf"("anyelement", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asgeobuf"("anyelement", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asgeobuf"("anyelement", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asgeobuf"("anyelement", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer, "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer, "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer, "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer, "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer, "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_asmvt"("anyelement", "text", integer, "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_clusterintersecting"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_clusterintersecting"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_clusterintersecting"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_clusterintersecting"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_clusterwithin"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_clusterwithin"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_clusterwithin"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_clusterwithin"("public"."geometry", double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."st_collect"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_collect"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_collect"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_collect"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_extent"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_extent"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_extent"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_extent"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_makeline"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_makeline"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_makeline"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_makeline"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_memcollect"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_memcollect"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_memcollect"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_memcollect"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_memunion"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_memunion"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_memunion"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_memunion"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_polygonize"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_polygonize"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_polygonize"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_polygonize"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry") TO "postgres";
GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry", double precision) TO "postgres";
GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry", double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry", double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."st_union"("public"."geometry", double precision) TO "service_role";









GRANT ALL ON TABLE "public"."admin_boundaries" TO "anon";
GRANT ALL ON TABLE "public"."admin_boundaries" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_boundaries" TO "service_role";



GRANT ALL ON TABLE "public"."admin_users" TO "anon";
GRANT ALL ON TABLE "public"."admin_users" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_users" TO "service_role";



GRANT ALL ON TABLE "public"."bookmark_folders" TO "anon";
GRANT ALL ON TABLE "public"."bookmark_folders" TO "authenticated";
GRANT ALL ON TABLE "public"."bookmark_folders" TO "service_role";



GRANT ALL ON TABLE "public"."bookmarks" TO "anon";
GRANT ALL ON TABLE "public"."bookmarks" TO "authenticated";
GRANT ALL ON TABLE "public"."bookmarks" TO "service_role";



GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON TABLE "public"."cities" TO "anon";
GRANT ALL ON TABLE "public"."cities" TO "authenticated";
GRANT ALL ON TABLE "public"."cities" TO "service_role";



GRANT ALL ON TABLE "public"."collection_maps" TO "anon";
GRANT ALL ON TABLE "public"."collection_maps" TO "authenticated";
GRANT ALL ON TABLE "public"."collection_maps" TO "service_role";



GRANT ALL ON TABLE "public"."collections" TO "anon";
GRANT ALL ON TABLE "public"."collections" TO "authenticated";
GRANT ALL ON TABLE "public"."collections" TO "service_role";



GRANT ALL ON TABLE "public"."comment_likes" TO "anon";
GRANT ALL ON TABLE "public"."comment_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."comment_likes" TO "service_role";



GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";



GRANT ALL ON TABLE "public"."continents" TO "anon";
GRANT ALL ON TABLE "public"."continents" TO "authenticated";
GRANT ALL ON TABLE "public"."continents" TO "service_role";



GRANT ALL ON TABLE "public"."countries" TO "anon";
GRANT ALL ON TABLE "public"."countries" TO "authenticated";
GRANT ALL ON TABLE "public"."countries" TO "service_role";



GRANT ALL ON TABLE "public"."terms_versions" TO "anon";
GRANT ALL ON TABLE "public"."terms_versions" TO "authenticated";
GRANT ALL ON TABLE "public"."terms_versions" TO "service_role";



GRANT ALL ON TABLE "public"."current_terms_versions" TO "anon";
GRANT ALL ON TABLE "public"."current_terms_versions" TO "authenticated";
GRANT ALL ON TABLE "public"."current_terms_versions" TO "service_role";



GRANT ALL ON TABLE "public"."deletion_requests" TO "anon";
GRANT ALL ON TABLE "public"."deletion_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."deletion_requests" TO "service_role";



GRANT ALL ON TABLE "public"."featured_category_maps" TO "anon";
GRANT ALL ON TABLE "public"."featured_category_maps" TO "authenticated";
GRANT ALL ON TABLE "public"."featured_category_maps" TO "service_role";



GRANT ALL ON TABLE "public"."featured_items" TO "anon";
GRANT ALL ON TABLE "public"."featured_items" TO "authenticated";
GRANT ALL ON TABLE "public"."featured_items" TO "service_role";



GRANT ALL ON TABLE "public"."follows" TO "anon";
GRANT ALL ON TABLE "public"."follows" TO "authenticated";
GRANT ALL ON TABLE "public"."follows" TO "service_role";



GRANT ALL ON TABLE "public"."images" TO "anon";
GRANT ALL ON TABLE "public"."images" TO "authenticated";
GRANT ALL ON TABLE "public"."images" TO "service_role";



GRANT ALL ON TABLE "public"."likes" TO "anon";
GRANT ALL ON TABLE "public"."likes" TO "authenticated";
GRANT ALL ON TABLE "public"."likes" TO "service_role";



GRANT ALL ON TABLE "public"."machi" TO "anon";
GRANT ALL ON TABLE "public"."machi" TO "authenticated";
GRANT ALL ON TABLE "public"."machi" TO "service_role";



GRANT ALL ON TABLE "public"."magazine_maps" TO "anon";
GRANT ALL ON TABLE "public"."magazine_maps" TO "authenticated";
GRANT ALL ON TABLE "public"."magazine_maps" TO "service_role";



GRANT ALL ON TABLE "public"."magazine_sections" TO "anon";
GRANT ALL ON TABLE "public"."magazine_sections" TO "authenticated";
GRANT ALL ON TABLE "public"."magazine_sections" TO "service_role";



GRANT ALL ON TABLE "public"."magazines" TO "anon";
GRANT ALL ON TABLE "public"."magazines" TO "authenticated";
GRANT ALL ON TABLE "public"."magazines" TO "service_role";



GRANT ALL ON TABLE "public"."map_labels" TO "anon";
GRANT ALL ON TABLE "public"."map_labels" TO "authenticated";
GRANT ALL ON TABLE "public"."map_labels" TO "service_role";



GRANT ALL ON TABLE "public"."map_tags" TO "anon";
GRANT ALL ON TABLE "public"."map_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."map_tags" TO "service_role";



GRANT ALL ON TABLE "public"."maps" TO "anon";
GRANT ALL ON TABLE "public"."maps" TO "authenticated";
GRANT ALL ON TABLE "public"."maps" TO "service_role";



GRANT ALL ON TABLE "public"."user_spots" TO "anon";
GRANT ALL ON TABLE "public"."user_spots" TO "authenticated";
GRANT ALL ON TABLE "public"."user_spots" TO "service_role";



GRANT ALL ON TABLE "public"."maps_public" TO "anon";
GRANT ALL ON TABLE "public"."maps_public" TO "authenticated";
GRANT ALL ON TABLE "public"."maps_public" TO "service_role";



GRANT ALL ON TABLE "public"."master_spot_favorites" TO "anon";
GRANT ALL ON TABLE "public"."master_spot_favorites" TO "authenticated";
GRANT ALL ON TABLE "public"."master_spot_favorites" TO "service_role";



GRANT ALL ON TABLE "public"."master_spots" TO "anon";
GRANT ALL ON TABLE "public"."master_spots" TO "authenticated";
GRANT ALL ON TABLE "public"."master_spots" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."prefectures" TO "anon";
GRANT ALL ON TABLE "public"."prefectures" TO "authenticated";
GRANT ALL ON TABLE "public"."prefectures" TO "service_role";



GRANT ALL ON TABLE "public"."regions" TO "anon";
GRANT ALL ON TABLE "public"."regions" TO "authenticated";
GRANT ALL ON TABLE "public"."regions" TO "service_role";



GRANT ALL ON TABLE "public"."reports" TO "anon";
GRANT ALL ON TABLE "public"."reports" TO "authenticated";
GRANT ALL ON TABLE "public"."reports" TO "service_role";



GRANT ALL ON TABLE "public"."schedules" TO "anon";
GRANT ALL ON TABLE "public"."schedules" TO "authenticated";
GRANT ALL ON TABLE "public"."schedules" TO "service_role";



GRANT ALL ON TABLE "public"."search_analytics" TO "anon";
GRANT ALL ON TABLE "public"."search_analytics" TO "authenticated";
GRANT ALL ON TABLE "public"."search_analytics" TO "service_role";



GRANT ALL ON TABLE "public"."search_history" TO "anon";
GRANT ALL ON TABLE "public"."search_history" TO "authenticated";
GRANT ALL ON TABLE "public"."search_history" TO "service_role";



GRANT ALL ON TABLE "public"."spot_shorts" TO "anon";
GRANT ALL ON TABLE "public"."spot_shorts" TO "authenticated";
GRANT ALL ON TABLE "public"."spot_shorts" TO "service_role";



GRANT ALL ON TABLE "public"."spot_tags" TO "anon";
GRANT ALL ON TABLE "public"."spot_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."spot_tags" TO "service_role";



GRANT ALL ON TABLE "public"."system_announcement_reads" TO "anon";
GRANT ALL ON TABLE "public"."system_announcement_reads" TO "authenticated";
GRANT ALL ON TABLE "public"."system_announcement_reads" TO "service_role";



GRANT ALL ON TABLE "public"."system_announcements" TO "anon";
GRANT ALL ON TABLE "public"."system_announcements" TO "authenticated";
GRANT ALL ON TABLE "public"."system_announcements" TO "service_role";



GRANT ALL ON TABLE "public"."tags" TO "anon";
GRANT ALL ON TABLE "public"."tags" TO "authenticated";
GRANT ALL ON TABLE "public"."tags" TO "service_role";



GRANT ALL ON TABLE "public"."terms_agreements" TO "anon";
GRANT ALL ON TABLE "public"."terms_agreements" TO "authenticated";
GRANT ALL ON TABLE "public"."terms_agreements" TO "service_role";



GRANT ALL ON TABLE "public"."transport_hubs" TO "anon";
GRANT ALL ON TABLE "public"."transport_hubs" TO "authenticated";
GRANT ALL ON TABLE "public"."transport_hubs" TO "service_role";



GRANT ALL ON TABLE "public"."user_latest_agreements" TO "anon";
GRANT ALL ON TABLE "public"."user_latest_agreements" TO "authenticated";
GRANT ALL ON TABLE "public"."user_latest_agreements" TO "service_role";



GRANT ALL ON TABLE "public"."user_preferences" TO "anon";
GRANT ALL ON TABLE "public"."user_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."user_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."view_history" TO "anon";
GRANT ALL ON TABLE "public"."view_history" TO "authenticated";
GRANT ALL ON TABLE "public"."view_history" TO "service_role";



GRANT ALL ON TABLE "public"."visits" TO "anon";
GRANT ALL ON TABLE "public"."visits" TO "authenticated";
GRANT ALL ON TABLE "public"."visits" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";
































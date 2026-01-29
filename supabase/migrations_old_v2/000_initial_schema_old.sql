-- Machikore Initial Schema
-- Dumped from Supabase production database on 2026-01-09
-- PostgreSQL database version 17.6
--
-- This file contains the complete schema for the Machikore application.
-- It includes:
--   - ENUM types
--   - Tables with constraints
--   - Indexes
--   - Functions (RPC)
--   - Triggers

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: report_reason; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.report_reason AS ENUM (
    'spam',
    'inappropriate',
    'harassment',
    'misinformation',
    'copyright',
    'other'
);


--
-- Name: report_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.report_status AS ENUM (
    'pending',
    'reviewing',
    'resolved',
    'dismissed'
);


--
-- Name: report_target_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.report_target_type AS ENUM (
    'map',
    'spot',
    'user',
    'comment'
);


--
-- Name: add_search_history(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.add_search_history(p_query text, p_search_type text DEFAULT 'discover'::text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: FUNCTION add_search_history(p_query text, p_search_type text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.add_search_history(p_query text, p_search_type text) IS '検索履歴を追加（ユーザー用 + 分析用の両方に記録、デモグラフィック対応）';


--
-- Name: check_email_has_pending_deletion(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_email_has_pending_deletion(check_email text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE LOWER(email) = LOWER(check_email)
    AND status = 'deletion_pending'
  );
END;
$$;


--
-- Name: FUNCTION check_email_has_pending_deletion(check_email text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.check_email_has_pending_deletion(check_email text) IS 'メールアドレスが退会手続き中かチェック（users.statusを参照）';


--
-- Name: cleanup_old_view_history(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cleanup_old_view_history() RETURNS trigger
    LANGUAGE plpgsql
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


--
-- Name: FUNCTION cleanup_old_view_history(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.cleanup_old_view_history() IS '閲覧履歴を100件に制限するクリーンアップ関数（閾値方式: 110件超で削除）';


--
-- Name: clear_push_token(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.clear_push_token() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE users
  SET
    push_token = NULL,
    push_token_updated_at = NOW()
  WHERE id = auth.uid();
END;
$$;


--
-- Name: clear_search_history(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.clear_search_history(p_search_type text DEFAULT 'discover'::text) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: FUNCTION clear_search_history(p_search_type text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.clear_search_history(p_search_type text) IS '指定タイプの検索履歴を全削除';


--
-- Name: count_images_in_spot(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.count_images_in_spot(p_user_spot_id uuid) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
  BEGIN
    RETURN (
      SELECT COUNT(*)::INTEGER
      FROM images
      WHERE user_spot_id = p_user_spot_id
    );
  END;
  $$;


--
-- Name: count_user_spots_in_map(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.count_user_spots_in_map(p_user_id uuid, p_map_id uuid) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: create_comment_map_notification(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_comment_map_notification() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: create_comment_spot_notification(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_comment_spot_notification() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: create_default_notification_settings(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_default_notification_settings() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO user_notification_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;


--
-- Name: create_follow_notification(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_follow_notification() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO notifications (user_id, actor_id, type)
  VALUES (NEW.followee_id, NEW.follower_id, 'follow');

  RETURN NEW;
END;
$$;


--
-- Name: create_like_map_notification(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_like_map_notification() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: create_like_spot_notification(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_like_spot_notification() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: expire_premium_subscriptions(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.expire_premium_subscriptions() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: FUNCTION expire_premium_subscriptions(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.expire_premium_subscriptions() IS 'cronジョブで定期実行し、期限切れユーザーのプレミアムを解除。Service Role 
  Keyで実行するため認証チェック不要。';


--
-- Name: get_city_by_coordinate(double precision, double precision); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_city_by_coordinate(lng double precision, lat double precision) RETURNS TABLE(country_id text, admin_level integer, prefecture_id text, city_id text)
    LANGUAGE sql STABLE
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


--
-- Name: FUNCTION get_city_by_coordinate(lng double precision, lat double precision); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_city_by_coordinate(lng double precision, lat double precision) IS '座標から行政区画を特定。prefecture_id と city_id を直接返す。';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: user_notification_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_notification_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    push_enabled boolean DEFAULT true NOT NULL,
    like_enabled boolean DEFAULT true NOT NULL,
    comment_enabled boolean DEFAULT true NOT NULL,
    follow_enabled boolean DEFAULT true NOT NULL,
    system_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    email_enabled boolean DEFAULT false NOT NULL,
    email_like_enabled boolean DEFAULT true NOT NULL,
    email_comment_enabled boolean DEFAULT true NOT NULL,
    email_follow_enabled boolean DEFAULT true NOT NULL,
    email_system_enabled boolean DEFAULT true NOT NULL
);


--
-- Name: COLUMN user_notification_settings.email_enabled; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_notification_settings.email_enabled IS 'メール通知のマスター設定';


--
-- Name: COLUMN user_notification_settings.email_like_enabled; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_notification_settings.email_like_enabled IS 'いいねのメール通知';


--
-- Name: COLUMN user_notification_settings.email_comment_enabled; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_notification_settings.email_comment_enabled IS 'コメントのメール通知';


--
-- Name: COLUMN user_notification_settings.email_follow_enabled; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_notification_settings.email_follow_enabled IS 'フォローのメール通知';


--
-- Name: COLUMN user_notification_settings.email_system_enabled; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_notification_settings.email_system_enabled IS 'システムのメール通知';


--
-- Name: get_notification_settings(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_notification_settings() RETURNS public.user_notification_settings
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: get_popular_searches(text, integer, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_popular_searches(p_search_type text DEFAULT 'discover'::text, p_limit integer DEFAULT 10, p_prefecture text DEFAULT NULL::text) RETURNS TABLE(query text, search_count integer, last_searched_at timestamp with time zone)
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: FUNCTION get_popular_searches(p_search_type text, p_limit integer, p_prefecture text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_popular_searches(p_search_type text, p_limit integer, p_prefecture text) IS '人気の検索ワードを取得（オプションで都道府県フィルター可）';


--
-- Name: get_popular_searches(text, integer, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_popular_searches(p_search_type text DEFAULT 'discover'::text, p_limit integer DEFAULT 10, p_prefecture text DEFAULT NULL::text, p_country text DEFAULT NULL::text) RETURNS TABLE(query text, search_count integer, last_searched_at timestamp with time zone)
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: FUNCTION get_popular_searches(p_search_type text, p_limit integer, p_prefecture text, p_country text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_popular_searches(p_search_type text, p_limit integer, p_prefecture text, p_country text) IS '人気の検索ワードを取得（オプションで都道府県・国フィルター可）';


--
-- Name: get_popular_tags_by_category(text, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_popular_tags_by_category(p_category_id text, p_limit integer DEFAULT 10) RETURNS TABLE(id uuid, name text, name_translations jsonb, slug text, usage_count bigint, created_at timestamp with time zone, updated_at timestamp with time zone)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
  BEGIN
    RETURN QUERY
    SELECT
      t.id,
      t.name,
      t.name_translations,
      t.slug,
      COUNT(mt.id) AS usage_count,
      t.created_at,
      t.updated_at
    FROM tags t
    INNER JOIN map_tags mt ON mt.tag_id = t.id
    INNER JOIN maps m ON m.id = mt.map_id
    WHERE m.category_id = p_category_id
      AND m.is_public = true
    GROUP BY t.id, t.name, t.name_translations, t.slug, t.created_at, t.updated_at
    ORDER BY usage_count DESC, t.name ASC
    LIMIT p_limit;
  END;
  $$;


--
-- Name: is_admin_user(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_admin_user(check_user_id uuid) RETURNS boolean
    LANGUAGE sql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
    SELECT EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = check_user_id
    );
  $$;


--
-- Name: is_user_premium(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_user_premium(p_user_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN (
    SELECT COALESCE(is_premium, false)
    FROM users
    WHERE id = p_user_id
  );
END;
$$;


--
-- Name: FUNCTION is_user_premium(p_user_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.is_user_premium(p_user_id uuid) IS 'RLSポリシー内でスポット数制限の判定に使用（user_spots_insert_with_limit）。サーバーサイドから呼び出
  すため認証チェック不要。';


--
-- Name: record_map_view(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.record_map_view(p_map_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: search_public_spots(text, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.search_public_spots(search_query text, result_limit integer DEFAULT 30) RETURNS TABLE(id uuid, user_id uuid, map_id uuid, master_spot_id uuid, machi_id text, name jsonb, description text, spot_color text, label_id uuid, images_count integer, likes_count integer, comments_count integer, order_index integer, created_at timestamp with time zone, updated_at timestamp with time zone, latitude double precision, longitude double precision, google_formatted_address jsonb, google_short_address jsonb, master_spot_name jsonb, master_spot_latitude double precision, master_spot_longitude double precision, master_spot_google_place_id text, master_spot_google_formatted_address jsonb, master_spot_google_short_address jsonb, master_spot_google_types text[], label_name text, label_color text, user_username text, user_display_name text, user_avatar_url text, map_name text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
  BEGIN
    RETURN QUERY
    SELECT DISTINCT ON (us.id)
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
      m.name AS map_name
    FROM user_spots us
    INNER JOIN maps m ON m.id = us.map_id AND m.is_public = true
    LEFT JOIN master_spots ms ON ms.id = us.master_spot_id
    LEFT JOIN map_labels ml ON ml.id = us.label_id
    LEFT JOIN users u ON u.id = us.user_id
    WHERE
      us.description ILIKE '%' || search_query || '%'
      OR (ms.name IS NOT NULL AND ms.name::text ILIKE '%' || search_query || '%')
      OR (us.master_spot_id IS NULL AND us.name IS NOT NULL AND us.name::text ILIKE '%' ||
   search_query || '%')
    ORDER BY us.id, us.created_at DESC
    LIMIT result_limit;
  END;
  $$;


--
-- Name: send_push_notification(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.send_push_notification() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: sync_spots_language(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_spots_language() RETURNS trigger
    LANGUAGE plpgsql
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


--
-- Name: update_bookmarks_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_bookmarks_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: update_collection_maps_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_collection_maps_count() RETURNS trigger
    LANGUAGE plpgsql
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


--
-- Name: update_comment_likes_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_comment_likes_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: update_comment_replies_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_comment_replies_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: update_comments_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_comments_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: update_images_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_images_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: update_likes_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_likes_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: update_map_spots_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_map_spots_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: update_master_spot_favorites_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_master_spot_favorites_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: update_notification_settings(boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_notification_settings(p_push_enabled boolean DEFAULT NULL::boolean, p_like_enabled boolean DEFAULT NULL::boolean, p_comment_enabled boolean DEFAULT NULL::boolean, p_follow_enabled boolean DEFAULT NULL::boolean, p_system_enabled boolean DEFAULT NULL::boolean, p_email_enabled boolean DEFAULT NULL::boolean, p_email_like_enabled boolean DEFAULT NULL::boolean, p_email_comment_enabled boolean DEFAULT NULL::boolean, p_email_follow_enabled boolean DEFAULT NULL::boolean, p_email_system_enabled boolean DEFAULT NULL::boolean) RETURNS public.user_notification_settings
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: update_push_token(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_push_token(token text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE users
  SET
    push_token = token,
    push_token_updated_at = NOW()
  WHERE id = auth.uid();
END;
$$;


--
-- Name: update_tag_usage_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_tag_usage_count() RETURNS trigger
    LANGUAGE plpgsql
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


--
-- Name: update_tag_usage_count_for_spots(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_tag_usage_count_for_spots() RETURNS trigger
    LANGUAGE plpgsql
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


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: update_user_premium_status(uuid, boolean, timestamp with time zone); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_user_premium_status(p_user_id uuid, p_is_premium boolean, p_expires_at timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: FUNCTION update_user_premium_status(p_user_id uuid, p_is_premium boolean, p_expires_at timestamp with time zone); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.update_user_premium_status(p_user_id uuid, p_is_premium boolean, p_expires_at timestamp with time zone) IS 'RevenueCat Webhook（Edge Function）から課金状態変更時に呼び出し。Service Role 
  Keyで実行するため認証チェック不要。';


--
-- Name: admin_boundaries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_boundaries (
    geom public.geometry(MultiPolygon,4326),
    created_at timestamp with time zone DEFAULT now(),
    admin_level integer,
    country_id text,
    prefecture_id text,
    city_id text,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: TABLE admin_boundaries; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.admin_boundaries IS '行政区域ポリゴン（国土数値情報N03由来）';


--
-- Name: COLUMN admin_boundaries.admin_level; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.admin_boundaries.admin_level IS 'OSM admin_level (4=都道府県相当, 6-7=市区町村相当)';


--
-- Name: COLUMN admin_boundaries.country_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.admin_boundaries.country_id IS '国ID → countries.id (jp, kr, th, tw, cn)';


--
-- Name: COLUMN admin_boundaries.prefecture_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.admin_boundaries.prefecture_id IS '都道府県ID → prefectures.id';


--
-- Name: COLUMN admin_boundaries.city_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.admin_boundaries.city_id IS '市区町村ID → cities.id';


--
-- Name: admin_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role text DEFAULT 'admin'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    CONSTRAINT admin_users_role_check CHECK ((role = ANY (ARRAY['moderator'::text, 'admin'::text, 'owner'::text])))
);


--
-- Name: TABLE admin_users; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.admin_users IS '管理画面にアクセス可能なユーザー一覧';


--
-- Name: COLUMN admin_users.role; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.admin_users.role IS 'moderator: コンテンツ管理, admin: システム設定変更, owner: 管理者の追加削除も可能';


--
-- Name: bookmark_folders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookmark_folders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    folder_type text DEFAULT 'spots'::text NOT NULL,
    CONSTRAINT bookmark_folders_folder_type_check CHECK ((folder_type = ANY (ARRAY['spots'::text, 'maps'::text])))
);


--
-- Name: bookmarks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookmarks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    map_id uuid,
    user_spot_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    folder_id uuid,
    CONSTRAINT bookmarks_check CHECK ((((map_id IS NOT NULL) AND (user_spot_id IS NULL)) OR ((map_id IS NULL) AND (user_spot_id IS NOT NULL))))
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id text NOT NULL,
    name text NOT NULL,
    name_translations jsonb,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE categories; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.categories IS 'マップカテゴリ（グルメ、旅行など）。idはURL用のslugとしても使用。';


--
-- Name: category_featured_maps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.category_featured_maps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id text NOT NULL,
    map_id uuid NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE category_featured_maps; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.category_featured_maps IS 'カテゴリ別おすすめマップ（運営選定）';


--
-- Name: COLUMN category_featured_maps.category_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.category_featured_maps.category_id IS 'カテゴリID';


--
-- Name: COLUMN category_featured_maps.map_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.category_featured_maps.map_id IS 'マップID';


--
-- Name: COLUMN category_featured_maps.display_order; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.category_featured_maps.display_order IS '表示順序（小さい順）';


--
-- Name: COLUMN category_featured_maps.is_active; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.category_featured_maps.is_active IS '有効フラグ';


--
-- Name: category_featured_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.category_featured_tags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id text NOT NULL,
    tag_id uuid NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE category_featured_tags; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.category_featured_tags IS 'カテゴリ別おすすめタグ（運営選定）';


--
-- Name: COLUMN category_featured_tags.category_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.category_featured_tags.category_id IS 'カテゴリID';


--
-- Name: COLUMN category_featured_tags.tag_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.category_featured_tags.tag_id IS 'タグID';


--
-- Name: COLUMN category_featured_tags.display_order; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.category_featured_tags.display_order IS '表示順序（小さい順）';


--
-- Name: COLUMN category_featured_tags.is_active; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.category_featured_tags.is_active IS '有効フラグ';


--
-- Name: cities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cities (
    id text NOT NULL,
    prefecture_id text NOT NULL,
    name text NOT NULL,
    name_kana text,
    type text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name_translations jsonb,
    latitude double precision,
    longitude double precision,
    tile_id text,
    CONSTRAINT cities_type_check CHECK ((type = ANY (ARRAY['区'::text, '市'::text, '町'::text, '村'::text])))
);


--
-- Name: collection_maps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collection_maps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    collection_id uuid NOT NULL,
    map_id uuid NOT NULL,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: collections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    thumbnail_url text,
    is_public boolean DEFAULT false NOT NULL,
    maps_count integer DEFAULT 0 NOT NULL,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: COLUMN collections.is_public; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.collections.is_public IS 'コレクションが公開されているかどうか（デフォルト: false）';


--
-- Name: COLUMN collections.maps_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.collections.maps_count IS 'マップ数（デフォルト: 0）';


--
-- Name: comment_likes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comment_likes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    comment_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    map_id uuid,
    user_spot_id uuid,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    parent_id uuid,
    root_id uuid,
    depth integer DEFAULT 0 NOT NULL,
    likes_count integer DEFAULT 0 NOT NULL,
    replies_count integer DEFAULT 0 NOT NULL,
    CONSTRAINT comments_check CHECK ((((map_id IS NOT NULL) AND (user_spot_id IS NULL)) OR ((map_id IS NULL) AND (user_spot_id IS NOT NULL))))
);


--
-- Name: continents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.continents (
    id text NOT NULL,
    name text NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name_translations jsonb,
    name_kana text,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL
);


--
-- Name: TABLE continents; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.continents IS '大陸マスターテーブル';


--
-- Name: COLUMN continents.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.continents.id IS '大陸ID (例: east_asia, europe)';


--
-- Name: COLUMN continents.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.continents.name IS '大陸名（日本語）';


--
-- Name: COLUMN continents.display_order; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.continents.display_order IS '表示順序';


--
-- Name: COLUMN continents.latitude; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.continents.latitude IS '大陸の代表緯度';


--
-- Name: COLUMN continents.longitude; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.continents.longitude IS '大陸の代表経度';


--
-- Name: countries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.countries (
    id text NOT NULL,
    name text NOT NULL,
    name_kana text,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    continent_id text NOT NULL,
    name_translations jsonb
);


--
-- Name: COLUMN countries.continent_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.countries.continent_id IS '大陸ID（外部キー → continents.id）';


--
-- Name: terms_versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.terms_versions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type text NOT NULL,
    version text NOT NULL,
    content text NOT NULL,
    summary text,
    effective_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    locale text DEFAULT 'ja'::text NOT NULL,
    CONSTRAINT terms_versions_type_check CHECK ((type = ANY (ARRAY['terms_of_service'::text, 'privacy_policy'::text])))
);


--
-- Name: TABLE terms_versions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.terms_versions IS '利用規約・プライバシーポリシーのバージョン管理';


--
-- Name: COLUMN terms_versions.type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.terms_versions.type IS '文書タイプ: terms_of_service（利用規約）, privacy_policy（プライバシーポリシー）';


--
-- Name: COLUMN terms_versions.version; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.terms_versions.version IS 'バージョン番号（例: 1.0.0）';


--
-- Name: COLUMN terms_versions.content; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.terms_versions.content IS '規約本文（マークダウン形式）';


--
-- Name: COLUMN terms_versions.summary; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.terms_versions.summary IS '変更概要（更新時のユーザー通知用）';


--
-- Name: COLUMN terms_versions.effective_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.terms_versions.effective_at IS '施行日時';


--
-- Name: COLUMN terms_versions.locale; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.terms_versions.locale IS '言語コード（ja, en, cn, tw）';


--
-- Name: current_terms_versions; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.current_terms_versions AS
 SELECT DISTINCT ON (type, locale) id,
    type,
    version,
    content,
    summary,
    effective_at,
    created_at,
    locale
   FROM public.terms_versions
  WHERE (effective_at <= now())
  ORDER BY type, locale, effective_at DESC;


--
-- Name: VIEW current_terms_versions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.current_terms_versions IS '現在有効な利用規約・プライバシーポリシーの最新バージョン（言語別）';


--
-- Name: deletion_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deletion_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    requested_at timestamp with time zone DEFAULT now() NOT NULL,
    scheduled_at timestamp with time zone DEFAULT (now() + '30 days'::interval) NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    cancelled_at timestamp with time zone,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    email text,
    reason text,
    CONSTRAINT deletion_requests_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'cancelled'::text, 'completed'::text])))
);


--
-- Name: TABLE deletion_requests; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.deletion_requests IS 'アカウント削除リクエスト管理テーブル';


--
-- Name: COLUMN deletion_requests.user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.deletion_requests.user_id IS '削除対象のユーザーID（削除完了後はNULL）';


--
-- Name: COLUMN deletion_requests.requested_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.deletion_requests.requested_at IS '削除リクエスト日時';


--
-- Name: COLUMN deletion_requests.scheduled_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.deletion_requests.scheduled_at IS '削除予定日時（デフォルト: リクエストから30日後）';


--
-- Name: COLUMN deletion_requests.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.deletion_requests.status IS 'ステータス: pending(保留中), cancelled(キャンセル), completed(完了)';


--
-- Name: COLUMN deletion_requests.cancelled_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.deletion_requests.cancelled_at IS 'キャンセル日時';


--
-- Name: COLUMN deletion_requests.completed_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.deletion_requests.completed_at IS '削除完了日時';


--
-- Name: COLUMN deletion_requests.email; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.deletion_requests.email IS '削除対象ユーザーのメールアドレス（再登録防止用）';


--
-- Name: COLUMN deletion_requests.reason; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.deletion_requests.reason IS '退会理由（任意）';


--
-- Name: featured_carousel_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.featured_carousel_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    image_url text NOT NULL,
    link_type text DEFAULT 'tag'::text NOT NULL,
    link_value text,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    starts_at timestamp with time zone,
    ends_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    category_id text,
    content text
);


--
-- Name: TABLE featured_carousel_items; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.featured_carousel_items IS '発見タブの特集カルーセルに表示するバナーコンテンツ';


--
-- Name: COLUMN featured_carousel_items.title; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.featured_carousel_items.title IS '表示タイトル';


--
-- Name: COLUMN featured_carousel_items.description; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.featured_carousel_items.description IS 'サブタイトル・説明';


--
-- Name: COLUMN featured_carousel_items.image_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.featured_carousel_items.image_url IS 'バナー画像URL';


--
-- Name: COLUMN featured_carousel_items.link_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.featured_carousel_items.link_type IS 'リンク種別（tag/map/user/url）';


--
-- Name: COLUMN featured_carousel_items.link_value; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.featured_carousel_items.link_value IS 'リンク先の値';


--
-- Name: COLUMN featured_carousel_items.display_order; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.featured_carousel_items.display_order IS '表示順（小さい順）';


--
-- Name: COLUMN featured_carousel_items.is_active; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.featured_carousel_items.is_active IS '公開フラグ';


--
-- Name: COLUMN featured_carousel_items.starts_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.featured_carousel_items.starts_at IS '表示開始日時';


--
-- Name: COLUMN featured_carousel_items.ends_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.featured_carousel_items.ends_at IS '表示終了日時';


--
-- Name: COLUMN featured_carousel_items.category_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.featured_carousel_items.category_id IS 'カテゴリID（NULLの場合は「すべて」カテゴリで表示）';


--
-- Name: follows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.follows (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    follower_id uuid NOT NULL,
    followee_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_spot_id uuid NOT NULL,
    local_path text,
    cloud_path text,
    width integer,
    height integer,
    file_size integer,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: likes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.likes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    map_id uuid,
    user_spot_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT likes_check CHECK ((((map_id IS NOT NULL) AND (user_spot_id IS NULL)) OR ((map_id IS NULL) AND (user_spot_id IS NOT NULL))))
);


--
-- Name: machi; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.machi (
    id text NOT NULL,
    name text NOT NULL,
    latitude double precision,
    longitude double precision,
    prefecture_id text NOT NULL,
    city_id text,
    name_kana text,
    name_translations jsonb,
    prefecture_name text NOT NULL,
    prefecture_name_translations jsonb,
    city_name text,
    city_name_translations jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    osm_id bigint,
    place_type text,
    tile_id text
);


--
-- Name: TABLE machi; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.machi IS 'エリア（街）マスター。リリース後に需要のある市から段階的にデータを追加。ポリゴンデータは将来追加予定。';


--
-- Name: map_labels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_labels (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    map_id uuid NOT NULL,
    name text NOT NULL,
    color text DEFAULT 'blue'::text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE map_labels; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.map_labels IS 'マップごとのラベル定義（スポットの種類分け用）';


--
-- Name: COLUMN map_labels.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_labels.name IS 'ラベル名（例: ドトール、スタバ）';


--
-- Name: COLUMN map_labels.color; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_labels.color IS 'ラベルの色（pink, red, orange, yellow, green, blue, purple, gray, white）';


--
-- Name: COLUMN map_labels.sort_order; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_labels.sort_order IS '表示順';


--
-- Name: map_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_tags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    map_id uuid NOT NULL,
    tag_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: maps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.maps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    is_public boolean DEFAULT false NOT NULL,
    is_official boolean DEFAULT false NOT NULL,
    thumbnail_url text,
    spots_count integer DEFAULT 0 NOT NULL,
    likes_count integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    comments_count integer DEFAULT 0 NOT NULL,
    is_article_public boolean DEFAULT false NOT NULL,
    bookmarks_count integer DEFAULT 0 NOT NULL,
    category_id text,
    article_intro jsonb,
    article_outro jsonb,
    show_label_chips boolean DEFAULT false,
    language character varying(10) DEFAULT NULL::character varying
);


--
-- Name: COLUMN maps.is_public; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.maps.is_public IS 'マップが公開されているかどうか（デフォルト: false）';


--
-- Name: COLUMN maps.is_official; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.maps.is_official IS '公式マップかどうか（デフォルト: false）';


--
-- Name: COLUMN maps.spots_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.maps.spots_count IS 'スポット数（デフォルト: 0）';


--
-- Name: COLUMN maps.likes_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.maps.likes_count IS 'いいね数（デフォルト: 0）';


--
-- Name: COLUMN maps.comments_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.maps.comments_count IS 'コメント数（デフォルト: 0）';


--
-- Name: COLUMN maps.is_article_public; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.maps.is_article_public IS '記事が公開されているかどうか（デフォルト: false）';


--
-- Name: COLUMN maps.bookmarks_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.maps.bookmarks_count IS 'ブックマーク数（デフォルト: 0）';


--
-- Name: COLUMN maps.category_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.maps.category_id IS 'カテゴリへの外部キー参照';


--
-- Name: COLUMN maps.article_intro; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.maps.article_intro IS 'マップ記事のまえがき（ProseMirror JSON形式）';


--
-- Name: COLUMN maps.article_outro; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.maps.article_outro IS 'マップ記事のあとがき（ProseMirror JSON形式）';


--
-- Name: COLUMN maps.show_label_chips; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.maps.show_label_chips IS 'ラベルチップをマップ上部に表示するかどうか';


--
-- Name: COLUMN maps.language; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.maps.language IS 'Detected language code (ISO 639-1) for content filtering';


--
-- Name: master_spot_favorites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.master_spot_favorites (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    master_spot_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: master_spots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.master_spots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    google_place_id text,
    google_types text[],
    google_phone_number text,
    google_website_uri text,
    google_rating double precision,
    google_user_rating_count integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    machi_id text,
    favorites_count integer DEFAULT 0 NOT NULL,
    google_formatted_address jsonb,
    google_short_address jsonb,
    name jsonb NOT NULL
);


--
-- Name: COLUMN master_spots.google_formatted_address; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.master_spots.google_formatted_address IS '多言語住所（完全形式）: {"ja": "日本語", "en": "English"}';


--
-- Name: COLUMN master_spots.google_short_address; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.master_spots.google_short_address IS '多言語住所（短縮形式）: {"ja": "日本語", "en": "English"}';


--
-- Name: COLUMN master_spots.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.master_spots.name IS '多言語スポット名: {"ja": "日本語名", "en": "English name"}';


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    actor_id uuid,
    type text NOT NULL,
    user_spot_id uuid,
    map_id uuid,
    comment_id uuid,
    content text,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT notifications_type_id_check CHECK ((((type = ANY (ARRAY['like_spot'::text, 'comment_spot'::text])) AND (user_spot_id IS NOT NULL)) OR ((type = ANY (ARRAY['like_map'::text, 'comment_map'::text])) AND (map_id IS NOT NULL)) OR ((type = 'follow'::text) AND (actor_id IS NOT NULL)) OR (type = 'system'::text))),
    CONSTRAINT valid_notification_type CHECK ((type = ANY (ARRAY['like_spot'::text, 'like_map'::text, 'comment_spot'::text, 'comment_map'::text, 'follow'::text, 'system'::text])))
);


--
-- Name: prefectures; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.prefectures (
    id text NOT NULL,
    name text NOT NULL,
    name_kana text,
    region_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    name_translations jsonb
);


--
-- Name: COLUMN prefectures.name_translations; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.prefectures.name_translations IS '多言語翻訳 {"en": "Tokyo", "zh": "东京"}';


--
-- Name: regions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.regions (
    id text NOT NULL,
    name text NOT NULL,
    name_kana text,
    display_order integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    name_translations jsonb,
    country_id text NOT NULL
);


--
-- Name: COLUMN regions.name_translations; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.regions.name_translations IS '多言語翻訳 {"en": "Kanto", "zh": "关东"}';


--
-- Name: reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reporter_id uuid NOT NULL,
    target_type public.report_target_type NOT NULL,
    target_id uuid NOT NULL,
    reason public.report_reason DEFAULT 'other'::public.report_reason NOT NULL,
    description text,
    status public.report_status DEFAULT 'pending'::public.report_status NOT NULL,
    admin_notes text,
    resolved_at timestamp with time zone,
    resolved_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE reports; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.reports IS '報告機能テーブル';


--
-- Name: COLUMN reports.reporter_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.reports.reporter_id IS '報告したユーザーID';


--
-- Name: COLUMN reports.target_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.reports.target_type IS '報告対象のタイプ（map, spot, user, comment）';


--
-- Name: COLUMN reports.target_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.reports.target_id IS '報告対象のID';


--
-- Name: COLUMN reports.reason; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.reports.reason IS '報告理由';


--
-- Name: COLUMN reports.description; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.reports.description IS '報告の詳細説明';


--
-- Name: COLUMN reports.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.reports.status IS '報告のステータス';


--
-- Name: COLUMN reports.admin_notes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.reports.admin_notes IS '管理者のメモ';


--
-- Name: COLUMN reports.resolved_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.reports.resolved_at IS '解決日時';


--
-- Name: COLUMN reports.resolved_by; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.reports.resolved_by IS '解決した管理者のID';


--
-- Name: schedules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schedules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    machi_id text NOT NULL,
    scheduled_at timestamp with time zone NOT NULL,
    title text NOT NULL,
    memo text,
    is_completed boolean DEFAULT false NOT NULL,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE schedules; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.schedules IS 'ユーザーの予定（街への訪問予定など）';


--
-- Name: COLUMN schedules.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.schedules.id IS '予定ID';


--
-- Name: COLUMN schedules.user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.schedules.user_id IS 'ユーザーID';


--
-- Name: COLUMN schedules.machi_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.schedules.machi_id IS '街ID';


--
-- Name: COLUMN schedules.scheduled_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.schedules.scheduled_at IS '予定日時';


--
-- Name: COLUMN schedules.title; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.schedules.title IS '予定タイトル';


--
-- Name: COLUMN schedules.memo; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.schedules.memo IS 'メモ';


--
-- Name: COLUMN schedules.is_completed; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.schedules.is_completed IS '完了済みかどうか';


--
-- Name: COLUMN schedules.completed_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.schedules.completed_at IS '完了日時';


--
-- Name: search_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.search_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    query text NOT NULL,
    search_type text DEFAULT 'discover'::text NOT NULL,
    search_count integer DEFAULT 1 NOT NULL,
    gender text,
    age_group text,
    prefecture text,
    first_searched_at timestamp with time zone DEFAULT now() NOT NULL,
    last_searched_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    country text,
    CONSTRAINT search_analytics_age_group_check CHECK (((age_group IS NULL) OR (age_group = ANY (ARRAY['10s'::text, '20s'::text, '30s'::text, '40s'::text, '50s'::text, '60s+'::text])))),
    CONSTRAINT search_analytics_gender_check CHECK (((gender IS NULL) OR (gender = ANY (ARRAY['male'::text, 'female'::text, 'other'::text])))),
    CONSTRAINT search_analytics_search_type_check CHECK ((search_type = ANY (ARRAY['discover'::text, 'defaultMap'::text, 'userMap'::text])))
);


--
-- Name: TABLE search_analytics; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.search_analytics IS '検索分析用データ（匿名化、長期保存）';


--
-- Name: COLUMN search_analytics.query; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.search_analytics.query IS '検索クエリ';


--
-- Name: COLUMN search_analytics.search_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.search_analytics.search_type IS '検索タイプ: discover, defaultMap, userMap';


--
-- Name: COLUMN search_analytics.search_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.search_analytics.search_count IS '検索回数';


--
-- Name: COLUMN search_analytics.gender; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.search_analytics.gender IS '性別（匿名）: male, female, other';


--
-- Name: COLUMN search_analytics.age_group; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.search_analytics.age_group IS '年代（匿名）: 10s, 20s, 30s, 40s, 50s+';


--
-- Name: COLUMN search_analytics.prefecture; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.search_analytics.prefecture IS '居住都道府県（匿名）';


--
-- Name: COLUMN search_analytics.first_searched_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.search_analytics.first_searched_at IS '初回検索日時';


--
-- Name: COLUMN search_analytics.last_searched_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.search_analytics.last_searched_at IS '最終検索日時';


--
-- Name: COLUMN search_analytics.country; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.search_analytics.country IS '居住国（ISO 3166-1 alpha-2）: jp, us, etc.';


--
-- Name: search_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.search_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    query text NOT NULL,
    search_type text DEFAULT 'discover'::text NOT NULL,
    searched_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT search_history_search_type_check CHECK ((search_type = ANY (ARRAY['discover'::text, 'defaultMap'::text, 'userMap'::text])))
);


--
-- Name: TABLE search_history; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.search_history IS 'ユーザーの検索履歴（クラウド同期対応）';


--
-- Name: COLUMN search_history.user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.search_history.user_id IS '検索したユーザーID';


--
-- Name: COLUMN search_history.query; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.search_history.query IS '検索クエリ';


--
-- Name: COLUMN search_history.search_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.search_history.search_type IS '検索タイプ: discover, defaultMap, userMap';


--
-- Name: COLUMN search_history.searched_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.search_history.searched_at IS '検索日時';


--
-- Name: spot_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.spot_tags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_spot_id uuid NOT NULL,
    tag_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: system_announcement_reads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_announcement_reads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    announcement_id uuid NOT NULL,
    read_at timestamp with time zone DEFAULT now()
);


--
-- Name: system_announcements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_announcements (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    type text DEFAULT 'info'::text,
    is_active boolean DEFAULT true,
    published_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    name_translations jsonb,
    slug text NOT NULL,
    usage_count integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: terms_agreements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.terms_agreements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    terms_version_id uuid NOT NULL,
    privacy_version_id uuid NOT NULL,
    agreed_at timestamp with time zone DEFAULT now() NOT NULL,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE terms_agreements; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.terms_agreements IS 'ユーザーの利用規約・プライバシーポリシー同意履歴';


--
-- Name: COLUMN terms_agreements.user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.terms_agreements.user_id IS '同意したユーザーID';


--
-- Name: COLUMN terms_agreements.terms_version_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.terms_agreements.terms_version_id IS '同意した利用規約のバージョンID';


--
-- Name: COLUMN terms_agreements.privacy_version_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.terms_agreements.privacy_version_id IS '同意したプライバシーポリシーのバージョンID';


--
-- Name: COLUMN terms_agreements.agreed_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.terms_agreements.agreed_at IS '同意日時';


--
-- Name: COLUMN terms_agreements.ip_address; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.terms_agreements.ip_address IS '同意時のIPアドレス（法的証跡）';


--
-- Name: COLUMN terms_agreements.user_agent; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.terms_agreements.user_agent IS '同意時のユーザーエージェント（法的証跡）';


--
-- Name: transport_hubs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transport_hubs (
    id text NOT NULL,
    osm_id bigint,
    osm_type text,
    prefecture_id text NOT NULL,
    city_id text,
    type text NOT NULL,
    subtype text,
    name text NOT NULL,
    name_kana text,
    operator text,
    network text,
    ref text,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    tile_id text NOT NULL,
    name_translations jsonb,
    CONSTRAINT transport_hubs_type_check CHECK ((type = ANY (ARRAY['station'::text, 'airport'::text, 'ferry_terminal'::text, 'bus_terminal'::text])))
);


--
-- Name: TABLE transport_hubs; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.transport_hubs IS '交通機関データ（駅、空港、フェリーターミナル、バスターミナル）';


--
-- Name: COLUMN transport_hubs.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.transport_hubs.id IS '一意識別子（prefecture_type_osmid形式）';


--
-- Name: COLUMN transport_hubs.osm_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.transport_hubs.osm_id IS 'OpenStreetMapのID';


--
-- Name: COLUMN transport_hubs.osm_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.transport_hubs.osm_type IS 'OSMの要素タイプ（node/way/relation）';


--
-- Name: COLUMN transport_hubs.prefecture_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.transport_hubs.prefecture_id IS '都道府県ID';


--
-- Name: COLUMN transport_hubs.city_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.transport_hubs.city_id IS '市区町村ID（オプション）';


--
-- Name: COLUMN transport_hubs.type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.transport_hubs.type IS '交通機関の種類（station/airport/ferry_terminal/bus_terminal）';


--
-- Name: COLUMN transport_hubs.subtype; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.transport_hubs.subtype IS 'サブタイプ（駅: jr/metro/toei/subway/private、空港: international/domestic/military/heliport）';


--
-- Name: COLUMN transport_hubs.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.transport_hubs.name IS '名称（日本語）';


--
-- Name: COLUMN transport_hubs.name_kana; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.transport_hubs.name_kana IS '名称（ふりがな）';


--
-- Name: COLUMN transport_hubs.operator; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.transport_hubs.operator IS '運営会社';


--
-- Name: COLUMN transport_hubs.network; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.transport_hubs.network IS '路線網';


--
-- Name: COLUMN transport_hubs.ref; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.transport_hubs.ref IS '路線コード/空港コード';


--
-- Name: COLUMN transport_hubs.latitude; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.transport_hubs.latitude IS '緯度';


--
-- Name: COLUMN transport_hubs.longitude; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.transport_hubs.longitude IS '経度';


--
-- Name: COLUMN transport_hubs.tile_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.transport_hubs.tile_id IS 'タイルID（0.25度グリッド、例: "559_142"）';


--
-- Name: COLUMN transport_hubs.name_translations; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.transport_hubs.name_translations IS '多言語翻訳 {"en": "Shibuya Station", "cn": "涩谷站", "tw": "澀谷站"}';


--
-- Name: user_latest_agreements; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.user_latest_agreements AS
 SELECT DISTINCT ON (ta.user_id) ta.id,
    ta.user_id,
    ta.terms_version_id,
    ta.privacy_version_id,
    ta.agreed_at,
    tv_terms.version AS terms_version,
    tv_privacy.version AS privacy_version
   FROM ((public.terms_agreements ta
     JOIN public.terms_versions tv_terms ON ((ta.terms_version_id = tv_terms.id)))
     JOIN public.terms_versions tv_privacy ON ((ta.privacy_version_id = tv_privacy.id)))
  ORDER BY ta.user_id, ta.agreed_at DESC;


--
-- Name: VIEW user_latest_agreements; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.user_latest_agreements IS 'ユーザーの最新の同意情報';


--
-- Name: user_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_preferences (
    user_id uuid NOT NULL,
    theme text DEFAULT 'system'::text NOT NULL,
    locale text DEFAULT 'system'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    content_languages text[] DEFAULT ARRAY[]::text[],
    preferred_categories text[] DEFAULT ARRAY[]::text[],
    CONSTRAINT user_preferences_locale_check CHECK ((locale = ANY (ARRAY['ja'::text, 'en'::text, 'cn'::text, 'tw'::text, 'system'::text]))),
    CONSTRAINT user_preferences_preferred_categories_max_3 CHECK (((array_length(preferred_categories, 1) IS NULL) OR (array_length(preferred_categories, 1) <= 3))),
    CONSTRAINT user_preferences_theme_check CHECK ((theme = ANY (ARRAY['light'::text, 'dark'::text, 'system'::text])))
);


--
-- Name: TABLE user_preferences; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.user_preferences IS 'ユーザーのアプリ設定（テーマ、言語など）';


--
-- Name: COLUMN user_preferences.theme; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_preferences.theme IS 'テーマ設定: light, dark, 
  system（デフォルト: system）';


--
-- Name: COLUMN user_preferences.locale; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_preferences.locale IS '言語設定: ja, en, cn, tw, 
  system（デフォルト: system）';


--
-- Name: COLUMN user_preferences.content_languages; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_preferences.content_languages IS 'コンテンツ言語フィルター: 見たい言語コードの配列（空配列=全言語表示）';


--
-- Name: COLUMN user_preferences.preferred_categories; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_preferences.preferred_categories IS '好みのカテゴリID（最大3つ、オンボーディングで収集）';


--
-- Name: user_spots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_spots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    map_id uuid NOT NULL,
    master_spot_id uuid,
    machi_id text,
    description text NOT NULL,
    images_count integer DEFAULT 0 NOT NULL,
    likes_count integer DEFAULT 0 NOT NULL,
    comments_count integer DEFAULT 0 NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    article_content jsonb,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    bookmarks_count integer DEFAULT 0 NOT NULL,
    spot_color text DEFAULT 'blue'::text,
    label_id uuid,
    language character varying(10) DEFAULT NULL::character varying,
    google_formatted_address jsonb,
    google_short_address jsonb,
    name jsonb
);


--
-- Name: COLUMN user_spots.machi_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_spots.machi_id IS '街ID。machi テーブルとの JOIN に使用。NULL の場合は街に紐づかないスポット（ピン刺し・現在地登録など）';


--
-- Name: COLUMN user_spots.description; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_spots.description IS 'スポットの説明（一言キャッチコピー）';


--
-- Name: COLUMN user_spots.images_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_spots.images_count IS '画像数（デフォルト: 0）';


--
-- Name: COLUMN user_spots.likes_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_spots.likes_count IS 'いいね数（デフォルト: 0）';


--
-- Name: COLUMN user_spots.comments_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_spots.comments_count IS 'コメント数（デフォルト: 0）';


--
-- Name: COLUMN user_spots.order_index; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_spots.order_index IS '表示順序（デフォルト: 0）';


--
-- Name: COLUMN user_spots.article_content; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_spots.article_content IS 'マップ記事用のスポット紹介文（ProseMirror JSON形式）';


--
-- Name: COLUMN user_spots.bookmarks_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_spots.bookmarks_count IS 'ブックマーク数（デフォルト: 0）';


--
-- Name: COLUMN user_spots.spot_color; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_spots.spot_color IS 'スポットの色（pink, red, orange, yellow, green, blue, purple, gray, white）';


--
-- Name: COLUMN user_spots.label_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_spots.label_id IS 'スポットのラベル（map_labelsへの外部キー）';


--
-- Name: COLUMN user_spots.language; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_spots.language IS 'Detected language code (ISO 639-1) for content filtering';


--
-- Name: COLUMN user_spots.google_formatted_address; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_spots.google_formatted_address IS '多言語住所（完全形式）- ピン刺し/現在地登録用: {"ja": "日本語", "en": "English"}';


--
-- Name: COLUMN user_spots.google_short_address; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_spots.google_short_address IS '多言語住所（短縮形式）- ピン刺し/現在地登録用: {"ja": "日本語", "en": "English"}';


--
-- Name: COLUMN user_spots.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_spots.name IS '多言語スポット名（現在地/ピン刺し登録用）: {"ja": "日本語名", "en": "English name"}。master_spot_idがNULLの場合のみ使用';


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    username text NOT NULL,
    display_name text NOT NULL,
    avatar_url text,
    bio text,
    is_premium boolean DEFAULT false,
    premium_started_at timestamp with time zone,
    premium_expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    push_token text,
    push_token_updated_at timestamp with time zone,
    gender text,
    age_group text,
    prefecture text,
    country text,
    status text DEFAULT 'active'::text NOT NULL,
    deletion_requested_at timestamp with time zone,
    suspended_at timestamp with time zone,
    suspended_reason text,
    CONSTRAINT users_age_group_check CHECK (((age_group IS NULL) OR (age_group = ANY (ARRAY['10s'::text, '20s'::text, '30s'::text, '40s'::text, '50s'::text, '60s+'::text])))),
    CONSTRAINT users_gender_check CHECK (((gender IS NULL) OR (gender = ANY (ARRAY['male'::text, 'female'::text, 'other'::text])))),
    CONSTRAINT users_status_check CHECK ((status = ANY (ARRAY['active'::text, 'deletion_pending'::text, 'suspended'::text, 'banned'::text])))
);


--
-- Name: COLUMN users.username; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.username IS 'ユーザー名（@で表示される識別子）';


--
-- Name: COLUMN users.display_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.display_name IS '表示名（自由に設定できる名前）';


--
-- Name: COLUMN users.gender; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.gender IS '性別: male, female, other（任意）';


--
-- Name: COLUMN users.age_group; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.age_group IS '年代: 10s, 20s, 30s, 40s, 50s, 60s+（任意）';


--
-- Name: COLUMN users.prefecture; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.prefecture IS '居住地域（日本の場合は都道府県、他国の場合は州など）';


--
-- Name: COLUMN users.country; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.country IS '居住国（ISO 3166-1 alpha-2）: jp, us, kr, etc.';


--
-- Name: COLUMN users.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.status IS 'ユーザーステータス: active=通常, deletion_pending=退会手続き中, suspended=一時停止, banned=永久BAN';


--
-- Name: COLUMN users.deletion_requested_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.deletion_requested_at IS '退会リクエスト日時';


--
-- Name: COLUMN users.suspended_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.suspended_at IS '一時停止日時';


--
-- Name: COLUMN users.suspended_reason; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.suspended_reason IS '一時停止理由（管理者メモ）';


--
-- Name: view_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.view_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    map_id uuid NOT NULL,
    viewed_at timestamp with time zone DEFAULT now() NOT NULL,
    view_count integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE view_history; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.view_history IS '閲覧履歴（マップ）';


--
-- Name: COLUMN view_history.user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.view_history.user_id IS '閲覧したユーザーID';


--
-- Name: COLUMN view_history.map_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.view_history.map_id IS '閲覧したマップID';


--
-- Name: COLUMN view_history.viewed_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.view_history.viewed_at IS '最終閲覧日時';


--
-- Name: COLUMN view_history.view_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.view_history.view_count IS '閲覧回数';


--
-- Name: visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    machi_id text NOT NULL,
    visited_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE visits; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.visits IS 'ユーザーが訪問した街の記録（街ごとに1レコード、訪問有無のみ管理）';


--
-- Name: COLUMN visits.machi_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.visits.machi_id IS '訪問した街（駅）のID';


--
-- Name: COLUMN visits.visited_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.visits.visited_at IS '訪問した日時';


--
-- Name: admin_boundaries admin_boundaries_city_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_boundaries
    ADD CONSTRAINT admin_boundaries_city_id_unique UNIQUE (city_id);


--
-- Name: admin_boundaries admin_boundaries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_boundaries
    ADD CONSTRAINT admin_boundaries_pkey PRIMARY KEY (id);


--
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- Name: admin_users admin_users_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_user_id_key UNIQUE (user_id);


--
-- Name: bookmark_folders bookmark_folders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmark_folders
    ADD CONSTRAINT bookmark_folders_pkey PRIMARY KEY (id);


--
-- Name: bookmarks bookmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: category_featured_maps category_featured_maps_category_id_map_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_featured_maps
    ADD CONSTRAINT category_featured_maps_category_id_map_id_key UNIQUE (category_id, map_id);


--
-- Name: category_featured_maps category_featured_maps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_featured_maps
    ADD CONSTRAINT category_featured_maps_pkey PRIMARY KEY (id);


--
-- Name: category_featured_tags category_featured_tags_category_id_tag_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_featured_tags
    ADD CONSTRAINT category_featured_tags_category_id_tag_id_key UNIQUE (category_id, tag_id);


--
-- Name: category_featured_tags category_featured_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_featured_tags
    ADD CONSTRAINT category_featured_tags_pkey PRIMARY KEY (id);


--
-- Name: cities cities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_pkey PRIMARY KEY (id);


--
-- Name: collection_maps collection_maps_collection_id_map_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collection_maps
    ADD CONSTRAINT collection_maps_collection_id_map_id_key UNIQUE (collection_id, map_id);


--
-- Name: collection_maps collection_maps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collection_maps
    ADD CONSTRAINT collection_maps_pkey PRIMARY KEY (id);


--
-- Name: collections collections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_pkey PRIMARY KEY (id);


--
-- Name: comment_likes comment_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment_likes
    ADD CONSTRAINT comment_likes_pkey PRIMARY KEY (id);


--
-- Name: comment_likes comment_likes_user_id_comment_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment_likes
    ADD CONSTRAINT comment_likes_user_id_comment_id_key UNIQUE (user_id, comment_id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: continents continents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.continents
    ADD CONSTRAINT continents_pkey PRIMARY KEY (id);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


--
-- Name: deletion_requests deletion_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deletion_requests
    ADD CONSTRAINT deletion_requests_pkey PRIMARY KEY (id);


--
-- Name: featured_carousel_items featured_carousel_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.featured_carousel_items
    ADD CONSTRAINT featured_carousel_items_pkey PRIMARY KEY (id);


--
-- Name: follows follows_follower_id_followee_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_follower_id_followee_id_key UNIQUE (follower_id, followee_id);


--
-- Name: follows follows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_pkey PRIMARY KEY (id);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- Name: machi machi_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.machi
    ADD CONSTRAINT machi_pkey PRIMARY KEY (id);


--
-- Name: map_labels map_labels_map_id_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_labels
    ADD CONSTRAINT map_labels_map_id_name_key UNIQUE (map_id, name);


--
-- Name: map_labels map_labels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_labels
    ADD CONSTRAINT map_labels_pkey PRIMARY KEY (id);


--
-- Name: map_tags map_tags_map_id_tag_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_tags
    ADD CONSTRAINT map_tags_map_id_tag_id_key UNIQUE (map_id, tag_id);


--
-- Name: map_tags map_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_tags
    ADD CONSTRAINT map_tags_pkey PRIMARY KEY (id);


--
-- Name: maps maps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maps
    ADD CONSTRAINT maps_pkey PRIMARY KEY (id);


--
-- Name: master_spot_favorites master_spot_favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_spot_favorites
    ADD CONSTRAINT master_spot_favorites_pkey PRIMARY KEY (id);


--
-- Name: master_spot_favorites master_spot_favorites_user_id_master_spot_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_spot_favorites
    ADD CONSTRAINT master_spot_favorites_user_id_master_spot_id_key UNIQUE (user_id, master_spot_id);


--
-- Name: master_spots master_spots_google_place_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_spots
    ADD CONSTRAINT master_spots_google_place_id_key UNIQUE (google_place_id);


--
-- Name: master_spots master_spots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_spots
    ADD CONSTRAINT master_spots_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: prefectures prefectures_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prefectures
    ADD CONSTRAINT prefectures_name_key UNIQUE (name);


--
-- Name: prefectures prefectures_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prefectures
    ADD CONSTRAINT prefectures_pkey PRIMARY KEY (id);


--
-- Name: regions regions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regions
    ADD CONSTRAINT regions_pkey PRIMARY KEY (id);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- Name: schedules schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);


--
-- Name: search_analytics search_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_analytics
    ADD CONSTRAINT search_analytics_pkey PRIMARY KEY (id);


--
-- Name: search_analytics search_analytics_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_analytics
    ADD CONSTRAINT search_analytics_unique UNIQUE NULLS NOT DISTINCT (query, search_type, gender, age_group, prefecture, country);


--
-- Name: search_history search_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_history
    ADD CONSTRAINT search_history_pkey PRIMARY KEY (id);


--
-- Name: spot_tags spot_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.spot_tags
    ADD CONSTRAINT spot_tags_pkey PRIMARY KEY (id);


--
-- Name: spot_tags spot_tags_user_spot_id_tag_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.spot_tags
    ADD CONSTRAINT spot_tags_user_spot_id_tag_id_key UNIQUE (user_spot_id, tag_id);


--
-- Name: system_announcements system_announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_announcements
    ADD CONSTRAINT system_announcements_pkey PRIMARY KEY (id);


--
-- Name: tags tags_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: tags tags_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_slug_key UNIQUE (slug);


--
-- Name: terms_agreements terms_agreements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.terms_agreements
    ADD CONSTRAINT terms_agreements_pkey PRIMARY KEY (id);


--
-- Name: terms_versions terms_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.terms_versions
    ADD CONSTRAINT terms_versions_pkey PRIMARY KEY (id);


--
-- Name: terms_versions terms_versions_type_version_locale_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.terms_versions
    ADD CONSTRAINT terms_versions_type_version_locale_unique UNIQUE (type, version, locale);


--
-- Name: transport_hubs transport_hubs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transport_hubs
    ADD CONSTRAINT transport_hubs_pkey PRIMARY KEY (id);


--
-- Name: system_announcement_reads user_announcement_reads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_announcement_reads
    ADD CONSTRAINT user_announcement_reads_pkey PRIMARY KEY (id);


--
-- Name: system_announcement_reads user_announcement_reads_user_id_announcement_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_announcement_reads
    ADD CONSTRAINT user_announcement_reads_user_id_announcement_id_key UNIQUE (user_id, announcement_id);


--
-- Name: user_notification_settings user_notification_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_notification_settings
    ADD CONSTRAINT user_notification_settings_pkey PRIMARY KEY (id);


--
-- Name: user_notification_settings user_notification_settings_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_notification_settings
    ADD CONSTRAINT user_notification_settings_user_id_key UNIQUE (user_id);


--
-- Name: user_preferences user_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (user_id);


--
-- Name: user_spots user_spots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_spots
    ADD CONSTRAINT user_spots_pkey PRIMARY KEY (id);


--
-- Name: user_spots user_spots_user_id_map_id_master_spot_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_spots
    ADD CONSTRAINT user_spots_user_id_map_id_master_spot_id_key UNIQUE (user_id, map_id, master_spot_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: view_history view_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.view_history
    ADD CONSTRAINT view_history_pkey PRIMARY KEY (id);


--
-- Name: view_history view_history_user_id_map_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.view_history
    ADD CONSTRAINT view_history_user_id_map_id_key UNIQUE (user_id, map_id);


--
-- Name: visits visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_pkey PRIMARY KEY (id);


--
-- Name: visits visits_user_id_machi_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_user_id_machi_id_key UNIQUE (user_id, machi_id);


--
-- Name: bookmarks_user_map_folder_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX bookmarks_user_map_folder_unique ON public.bookmarks USING btree (user_id, map_id, COALESCE(folder_id, '00000000-0000-0000-0000-000000000000'::uuid)) WHERE (map_id IS NOT NULL);


--
-- Name: bookmarks_user_spot_folder_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX bookmarks_user_spot_folder_unique ON public.bookmarks USING btree (user_id, user_spot_id, COALESCE(folder_id, '00000000-0000-0000-0000-000000000000'::uuid)) WHERE (user_spot_id IS NOT NULL);


--
-- Name: idx_admin_boundaries_admin_level; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_boundaries_admin_level ON public.admin_boundaries USING btree (admin_level);


--
-- Name: idx_admin_boundaries_city_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_boundaries_city_id ON public.admin_boundaries USING btree (city_id);


--
-- Name: idx_admin_boundaries_country_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_boundaries_country_id ON public.admin_boundaries USING btree (country_id);


--
-- Name: idx_admin_boundaries_country_level; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_boundaries_country_level ON public.admin_boundaries USING btree (country_id, admin_level);


--
-- Name: idx_admin_boundaries_geom; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_boundaries_geom ON public.admin_boundaries USING gist (geom);


--
-- Name: idx_admin_boundaries_prefecture_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_boundaries_prefecture_id ON public.admin_boundaries USING btree (prefecture_id);


--
-- Name: idx_admin_users_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_users_user_id ON public.admin_users USING btree (user_id);


--
-- Name: idx_bookmark_folders_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookmark_folders_type ON public.bookmark_folders USING btree (folder_type);


--
-- Name: idx_bookmark_folders_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookmark_folders_user_id ON public.bookmark_folders USING btree (user_id);


--
-- Name: idx_bookmarks_folder_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookmarks_folder_id ON public.bookmarks USING btree (folder_id);


--
-- Name: idx_bookmarks_map_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookmarks_map_id ON public.bookmarks USING btree (map_id);


--
-- Name: idx_bookmarks_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookmarks_user_id ON public.bookmarks USING btree (user_id);


--
-- Name: idx_bookmarks_user_spot_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookmarks_user_spot_id ON public.bookmarks USING btree (user_spot_id);


--
-- Name: idx_categories_display_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_categories_display_order ON public.categories USING btree (display_order);


--
-- Name: idx_categories_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_categories_is_active ON public.categories USING btree (is_active);


--
-- Name: idx_category_featured_maps_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_category_featured_maps_active ON public.category_featured_maps USING btree (is_active) WHERE (is_active = true);


--
-- Name: idx_category_featured_maps_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_category_featured_maps_category ON public.category_featured_maps USING btree (category_id);


--
-- Name: idx_category_featured_tags_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_category_featured_tags_active ON public.category_featured_tags USING btree (is_active) WHERE (is_active = true);


--
-- Name: idx_category_featured_tags_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_category_featured_tags_category ON public.category_featured_tags USING btree (category_id);


--
-- Name: idx_cities_name_translations; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cities_name_translations ON public.cities USING gin (name_translations);


--
-- Name: idx_cities_prefecture_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cities_prefecture_id ON public.cities USING btree (prefecture_id);


--
-- Name: idx_cities_tile_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cities_tile_id ON public.cities USING btree (tile_id);


--
-- Name: idx_collection_maps_collection_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_collection_maps_collection_id ON public.collection_maps USING btree (collection_id);


--
-- Name: idx_collection_maps_map_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_collection_maps_map_id ON public.collection_maps USING btree (map_id);


--
-- Name: idx_collections_is_public; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_collections_is_public ON public.collections USING btree (is_public);


--
-- Name: idx_collections_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_collections_user_id ON public.collections USING btree (user_id);


--
-- Name: idx_comment_likes_comment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_comment_likes_comment_id ON public.comment_likes USING btree (comment_id);


--
-- Name: idx_comment_likes_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_comment_likes_user_id ON public.comment_likes USING btree (user_id);


--
-- Name: idx_comments_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_comments_created_at ON public.comments USING btree (created_at DESC);


--
-- Name: idx_comments_depth; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_comments_depth ON public.comments USING btree (depth);


--
-- Name: idx_comments_map_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_comments_map_id ON public.comments USING btree (map_id);


--
-- Name: idx_comments_parent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_comments_parent_id ON public.comments USING btree (parent_id);


--
-- Name: idx_comments_root_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_comments_root_id ON public.comments USING btree (root_id);


--
-- Name: idx_comments_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_comments_user_id ON public.comments USING btree (user_id);


--
-- Name: idx_comments_user_spot_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_comments_user_spot_id ON public.comments USING btree (user_spot_id);


--
-- Name: idx_continents_name_translations; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_continents_name_translations ON public.continents USING gin (name_translations);


--
-- Name: idx_countries_name_translations; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_countries_name_translations ON public.countries USING gin (name_translations);


--
-- Name: idx_deletion_requests_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_deletion_requests_email ON public.deletion_requests USING btree (email) WHERE (status = 'pending'::text);


--
-- Name: idx_deletion_requests_scheduled_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_deletion_requests_scheduled_at ON public.deletion_requests USING btree (scheduled_at) WHERE (status = 'pending'::text);


--
-- Name: idx_deletion_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_deletion_requests_status ON public.deletion_requests USING btree (status);


--
-- Name: idx_deletion_requests_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_deletion_requests_user_id ON public.deletion_requests USING btree (user_id);


--
-- Name: idx_featured_carousel_items_active_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_featured_carousel_items_active_order ON public.featured_carousel_items USING btree (is_active, display_order) WHERE (is_active = true);


--
-- Name: idx_featured_carousel_items_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_featured_carousel_items_category ON public.featured_carousel_items USING btree (category_id);


--
-- Name: idx_follows_followee_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_follows_followee_id ON public.follows USING btree (followee_id);


--
-- Name: idx_follows_follower_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_follows_follower_id ON public.follows USING btree (follower_id);


--
-- Name: idx_images_user_spot_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_images_user_spot_id ON public.images USING btree (user_spot_id);


--
-- Name: idx_likes_map_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_likes_map_id ON public.likes USING btree (map_id);


--
-- Name: idx_likes_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_likes_user_id ON public.likes USING btree (user_id);


--
-- Name: idx_likes_user_spot_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_likes_user_spot_id ON public.likes USING btree (user_spot_id);


--
-- Name: idx_machi_city_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_machi_city_id ON public.machi USING btree (city_id);


--
-- Name: idx_machi_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_machi_name ON public.machi USING btree (name);


--
-- Name: idx_machi_name_translations; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_machi_name_translations ON public.machi USING gin (name_translations);


--
-- Name: idx_machi_osm_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_machi_osm_id ON public.machi USING btree (osm_id);


--
-- Name: idx_machi_place_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_machi_place_type ON public.machi USING btree (place_type);


--
-- Name: idx_machi_prefecture_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_machi_prefecture_id ON public.machi USING btree (prefecture_id);


--
-- Name: idx_machi_tile_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_machi_tile_id ON public.machi USING btree (tile_id);


--
-- Name: idx_map_labels_map_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_map_labels_map_id ON public.map_labels USING btree (map_id);


--
-- Name: idx_map_tags_map_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_map_tags_map_id ON public.map_tags USING btree (map_id);


--
-- Name: idx_map_tags_tag_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_map_tags_tag_id ON public.map_tags USING btree (tag_id);


--
-- Name: idx_maps_bookmarks_count; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_maps_bookmarks_count ON public.maps USING btree (bookmarks_count DESC);


--
-- Name: idx_maps_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_maps_category_id ON public.maps USING btree (category_id);


--
-- Name: idx_maps_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_maps_created_at ON public.maps USING btree (created_at DESC);


--
-- Name: idx_maps_is_article_public; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_maps_is_article_public ON public.maps USING btree (is_article_public);


--
-- Name: idx_maps_is_public; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_maps_is_public ON public.maps USING btree (is_public);


--
-- Name: idx_maps_language; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_maps_language ON public.maps USING btree (language);


--
-- Name: idx_maps_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_maps_user_id ON public.maps USING btree (user_id);


--
-- Name: idx_master_spot_favorites_master_spot_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_master_spot_favorites_master_spot_id ON public.master_spot_favorites USING btree (master_spot_id);


--
-- Name: idx_master_spot_favorites_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_master_spot_favorites_user_id ON public.master_spot_favorites USING btree (user_id);


--
-- Name: idx_master_spots_google_place_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_master_spots_google_place_id ON public.master_spots USING btree (google_place_id);


--
-- Name: idx_master_spots_location; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_master_spots_location ON public.master_spots USING btree (latitude, longitude);


--
-- Name: idx_master_spots_machi_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_master_spots_machi_id ON public.master_spots USING btree (machi_id);


--
-- Name: idx_master_spots_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_master_spots_name ON public.master_spots USING gin (name);


--
-- Name: idx_notifications_actor_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_actor_id ON public.notifications USING btree (actor_id);


--
-- Name: idx_notifications_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_created_at ON public.notifications USING btree (user_id, created_at DESC);


--
-- Name: idx_notifications_is_read; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_is_read ON public.notifications USING btree (user_id, is_read);


--
-- Name: idx_notifications_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_type ON public.notifications USING btree (type);


--
-- Name: idx_notifications_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);


--
-- Name: idx_notifications_user_spot_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user_spot_id ON public.notifications USING btree (user_spot_id);


--
-- Name: idx_prefectures_name_translations; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_prefectures_name_translations ON public.prefectures USING gin (name_translations);


--
-- Name: idx_regions_name_translations; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_regions_name_translations ON public.regions USING gin (name_translations);


--
-- Name: idx_reports_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reports_created_at ON public.reports USING btree (created_at DESC);


--
-- Name: idx_reports_reporter_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reports_reporter_id ON public.reports USING btree (reporter_id);


--
-- Name: idx_reports_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reports_status ON public.reports USING btree (status);


--
-- Name: idx_reports_target; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reports_target ON public.reports USING btree (target_type, target_id);


--
-- Name: idx_reports_unique_report; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_reports_unique_report ON public.reports USING btree (reporter_id, target_type, target_id) WHERE (status = ANY (ARRAY['pending'::public.report_status, 'reviewing'::public.report_status]));


--
-- Name: idx_schedules_machi_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_schedules_machi_id ON public.schedules USING btree (machi_id);


--
-- Name: idx_schedules_scheduled_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_schedules_scheduled_at ON public.schedules USING btree (scheduled_at);


--
-- Name: idx_schedules_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_schedules_user_id ON public.schedules USING btree (user_id);


--
-- Name: idx_schedules_user_scheduled; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_schedules_user_scheduled ON public.schedules USING btree (user_id, scheduled_at);


--
-- Name: idx_search_analytics_country; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_search_analytics_country ON public.search_analytics USING btree (country) WHERE (country IS NOT NULL);


--
-- Name: idx_search_analytics_last_searched; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_search_analytics_last_searched ON public.search_analytics USING btree (last_searched_at DESC);


--
-- Name: idx_search_analytics_prefecture; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_search_analytics_prefecture ON public.search_analytics USING btree (prefecture) WHERE (prefecture IS NOT NULL);


--
-- Name: idx_search_analytics_query; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_search_analytics_query ON public.search_analytics USING btree (query);


--
-- Name: idx_search_analytics_search_count; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_search_analytics_search_count ON public.search_analytics USING btree (search_count DESC);


--
-- Name: idx_search_analytics_search_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_search_analytics_search_type ON public.search_analytics USING btree (search_type);


--
-- Name: idx_search_history_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_search_history_user_id ON public.search_history USING btree (user_id);


--
-- Name: idx_search_history_user_type_searched; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_search_history_user_type_searched ON public.search_history USING btree (user_id, search_type, searched_at DESC);


--
-- Name: idx_spot_tags_tag_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_spot_tags_tag_id ON public.spot_tags USING btree (tag_id);


--
-- Name: idx_spot_tags_user_spot_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_spot_tags_user_spot_id ON public.spot_tags USING btree (user_spot_id);


--
-- Name: idx_system_announcements_published; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_system_announcements_published ON public.system_announcements USING btree (is_active, published_at DESC);


--
-- Name: idx_tags_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tags_name ON public.tags USING btree (name);


--
-- Name: idx_tags_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tags_slug ON public.tags USING btree (slug);


--
-- Name: idx_tags_usage_count; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tags_usage_count ON public.tags USING btree (usage_count DESC);


--
-- Name: idx_terms_agreements_agreed_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_terms_agreements_agreed_at ON public.terms_agreements USING btree (agreed_at DESC);


--
-- Name: idx_terms_agreements_user_agreed; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_terms_agreements_user_agreed ON public.terms_agreements USING btree (user_id, agreed_at DESC);


--
-- Name: idx_terms_agreements_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_terms_agreements_user_id ON public.terms_agreements USING btree (user_id);


--
-- Name: idx_terms_versions_effective_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_terms_versions_effective_at ON public.terms_versions USING btree (effective_at DESC);


--
-- Name: idx_terms_versions_locale; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_terms_versions_locale ON public.terms_versions USING btree (locale);


--
-- Name: idx_terms_versions_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_terms_versions_type ON public.terms_versions USING btree (type);


--
-- Name: idx_terms_versions_type_effective; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_terms_versions_type_effective ON public.terms_versions USING btree (type, effective_at DESC);


--
-- Name: idx_terms_versions_type_locale_effective; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_terms_versions_type_locale_effective ON public.terms_versions USING btree (type, locale, effective_at DESC);


--
-- Name: idx_transport_hubs_osm_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_transport_hubs_osm_id ON public.transport_hubs USING btree (osm_id);


--
-- Name: idx_transport_hubs_tile_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_transport_hubs_tile_id ON public.transport_hubs USING btree (tile_id);


--
-- Name: idx_user_announcement_reads_announcement_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_announcement_reads_announcement_id ON public.system_announcement_reads USING btree (announcement_id);


--
-- Name: idx_user_announcement_reads_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_announcement_reads_user_id ON public.system_announcement_reads USING btree (user_id);


--
-- Name: idx_user_notification_settings_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_notification_settings_user_id ON public.user_notification_settings USING btree (user_id);


--
-- Name: idx_user_spots_bookmarks_count; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_spots_bookmarks_count ON public.user_spots USING btree (bookmarks_count DESC);


--
-- Name: idx_user_spots_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_spots_created_at ON public.user_spots USING btree (created_at DESC);


--
-- Name: idx_user_spots_label_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_spots_label_id ON public.user_spots USING btree (label_id);


--
-- Name: idx_user_spots_language; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_spots_language ON public.user_spots USING btree (language);


--
-- Name: idx_user_spots_machi_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_spots_machi_id ON public.user_spots USING btree (machi_id);


--
-- Name: idx_user_spots_map_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_spots_map_id ON public.user_spots USING btree (map_id);


--
-- Name: idx_user_spots_master_spot_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_spots_master_spot_id ON public.user_spots USING btree (master_spot_id);


--
-- Name: idx_user_spots_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_spots_user_id ON public.user_spots USING btree (user_id);


--
-- Name: idx_users_is_premium; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_is_premium ON public.users USING btree (is_premium);


--
-- Name: idx_users_push_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_push_token ON public.users USING btree (push_token) WHERE (push_token IS NOT NULL);


--
-- Name: idx_users_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_status ON public.users USING btree (status) WHERE (status <> 'active'::text);


--
-- Name: idx_view_history_map_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_view_history_map_id ON public.view_history USING btree (map_id);


--
-- Name: idx_view_history_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_view_history_user_id ON public.view_history USING btree (user_id);


--
-- Name: idx_view_history_user_viewed; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_view_history_user_viewed ON public.view_history USING btree (user_id, viewed_at DESC);


--
-- Name: idx_visits_machi_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_visits_machi_id ON public.visits USING btree (machi_id);


--
-- Name: idx_visits_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_visits_user_id ON public.visits USING btree (user_id);


--
-- Name: idx_visits_user_machi; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_visits_user_machi ON public.visits USING btree (user_id, machi_id);


--
-- Name: idx_visits_visited_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_visits_visited_at ON public.visits USING btree (visited_at DESC);


--
-- Name: likes_user_map_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX likes_user_map_unique ON public.likes USING btree (user_id, map_id) WHERE (map_id IS NOT NULL);


--
-- Name: likes_user_spot_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX likes_user_spot_unique ON public.likes USING btree (user_id, user_spot_id) WHERE (user_spot_id IS NOT NULL);


--
-- Name: follows on_follow_create_notification; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER on_follow_create_notification AFTER INSERT ON public.follows FOR EACH ROW EXECUTE FUNCTION public.create_follow_notification();


--
-- Name: comments on_map_comment_create_notification; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER on_map_comment_create_notification AFTER INSERT ON public.comments FOR EACH ROW WHEN ((new.map_id IS NOT NULL)) EXECUTE FUNCTION public.create_comment_map_notification();


--
-- Name: likes on_map_like_create_notification; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER on_map_like_create_notification AFTER INSERT ON public.likes FOR EACH ROW WHEN ((new.map_id IS NOT NULL)) EXECUTE FUNCTION public.create_like_map_notification();


--
-- Name: comments on_user_spot_comment_create_notification; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER on_user_spot_comment_create_notification AFTER INSERT ON public.comments FOR EACH ROW WHEN ((new.user_spot_id IS NOT NULL)) EXECUTE FUNCTION public.create_comment_spot_notification();


--
-- Name: likes on_user_spot_like_create_notification; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER on_user_spot_like_create_notification AFTER INSERT ON public.likes FOR EACH ROW WHEN ((new.user_spot_id IS NOT NULL)) EXECUTE FUNCTION public.create_like_spot_notification();


--
-- Name: notifications send-notification; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "send-notification" AFTER INSERT ON public.notifications FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://whgptckcuskqggyybruw.supabase.co/functions/v1/send-notification', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZ3B0Y2tjdXNrcWdneXlicnV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzAzOTI5NCwiZXhwIjoyMDc4NjE1Mjk0fQ.BMfzJW_DuGc3aK95c7JU4KqU_zbopVAk99OjfyGMVWA"}', '{}', '5000');


--
-- Name: view_history trigger_cleanup_view_history; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_cleanup_view_history AFTER INSERT OR UPDATE ON public.view_history FOR EACH ROW EXECUTE FUNCTION public.cleanup_old_view_history();


--
-- Name: users trigger_create_default_notification_settings; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_create_default_notification_settings AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION public.create_default_notification_settings();


--
-- Name: maps trigger_sync_spots_language; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_sync_spots_language AFTER UPDATE OF language ON public.maps FOR EACH ROW EXECUTE FUNCTION public.sync_spots_language();


--
-- Name: admin_users trigger_update_admin_users_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: bookmarks trigger_update_bookmarks_count; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_bookmarks_count AFTER INSERT OR DELETE ON public.bookmarks FOR EACH ROW EXECUTE FUNCTION public.update_bookmarks_count();


--
-- Name: collection_maps trigger_update_collection_maps_count; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_collection_maps_count AFTER INSERT OR DELETE ON public.collection_maps FOR EACH ROW EXECUTE FUNCTION public.update_collection_maps_count();


--
-- Name: comment_likes trigger_update_comment_likes_count; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_comment_likes_count AFTER INSERT OR DELETE ON public.comment_likes FOR EACH ROW EXECUTE FUNCTION public.update_comment_likes_count();


--
-- Name: comments trigger_update_comment_replies_count; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_comment_replies_count AFTER INSERT OR DELETE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.update_comment_replies_count();


--
-- Name: comments trigger_update_comments_count; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_comments_count AFTER INSERT OR DELETE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.update_comments_count();


--
-- Name: images trigger_update_images_count; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_images_count AFTER INSERT OR DELETE ON public.images FOR EACH ROW EXECUTE FUNCTION public.update_images_count();


--
-- Name: likes trigger_update_likes_count; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_likes_count AFTER INSERT OR DELETE ON public.likes FOR EACH ROW EXECUTE FUNCTION public.update_likes_count();


--
-- Name: user_spots trigger_update_map_spots_count; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_map_spots_count AFTER INSERT OR DELETE ON public.user_spots FOR EACH ROW EXECUTE FUNCTION public.update_map_spots_count();


--
-- Name: master_spot_favorites trigger_update_master_spot_favorites_count; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_master_spot_favorites_count AFTER INSERT OR DELETE ON public.master_spot_favorites FOR EACH ROW EXECUTE FUNCTION public.update_master_spot_favorites_count();


--
-- Name: bookmark_folders update_bookmark_folders_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_bookmark_folders_updated_at BEFORE UPDATE ON public.bookmark_folders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: categories update_categories_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: category_featured_maps update_category_featured_maps_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_category_featured_maps_updated_at BEFORE UPDATE ON public.category_featured_maps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: category_featured_tags update_category_featured_tags_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_category_featured_tags_updated_at BEFORE UPDATE ON public.category_featured_tags FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: cities update_cities_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_cities_updated_at BEFORE UPDATE ON public.cities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: collections update_collections_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON public.collections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: comments update_comments_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: countries update_countries_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON public.countries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: deletion_requests update_deletion_requests_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_deletion_requests_updated_at BEFORE UPDATE ON public.deletion_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: featured_carousel_items update_featured_carousel_items_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_featured_carousel_items_updated_at BEFORE UPDATE ON public.featured_carousel_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: images update_images_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_images_updated_at BEFORE UPDATE ON public.images FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: machi update_machi_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_machi_updated_at BEFORE UPDATE ON public.machi FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: map_labels update_map_labels_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_map_labels_updated_at BEFORE UPDATE ON public.map_labels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: maps update_maps_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_maps_updated_at BEFORE UPDATE ON public.maps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: master_spots update_master_spots_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_master_spots_updated_at BEFORE UPDATE ON public.master_spots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: prefectures update_prefectures_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_prefectures_updated_at BEFORE UPDATE ON public.prefectures FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: reports update_reports_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON public.reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: search_analytics update_search_analytics_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_search_analytics_updated_at BEFORE UPDATE ON public.search_analytics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: spot_tags update_tag_usage_count_for_spots_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_tag_usage_count_for_spots_trigger AFTER INSERT OR DELETE ON public.spot_tags FOR EACH ROW EXECUTE FUNCTION public.update_tag_usage_count_for_spots();


--
-- Name: map_tags update_tag_usage_count_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_tag_usage_count_trigger AFTER INSERT OR DELETE ON public.map_tags FOR EACH ROW EXECUTE FUNCTION public.update_tag_usage_count();


--
-- Name: tags update_tags_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON public.tags FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_notification_settings update_user_notification_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_notification_settings_updated_at BEFORE UPDATE ON public.user_notification_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_preferences update_user_preferences_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_spots update_user_spots_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_spots_updated_at BEFORE UPDATE ON public.user_spots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: view_history update_view_history_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_view_history_updated_at BEFORE UPDATE ON public.view_history FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: admin_boundaries admin_boundaries_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_boundaries
    ADD CONSTRAINT admin_boundaries_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id);


--
-- Name: admin_boundaries admin_boundaries_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_boundaries
    ADD CONSTRAINT admin_boundaries_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id);


--
-- Name: admin_boundaries admin_boundaries_prefecture_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_boundaries
    ADD CONSTRAINT admin_boundaries_prefecture_id_fkey FOREIGN KEY (prefecture_id) REFERENCES public.prefectures(id);


--
-- Name: admin_users admin_users_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: admin_users admin_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: admin_users admin_users_user_id_public_users_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_user_id_public_users_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: CONSTRAINT admin_users_user_id_public_users_fkey ON admin_users; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON CONSTRAINT admin_users_user_id_public_users_fkey ON public.admin_users IS 'public.usersへの外部キー（JOINクエリ用）';


--
-- Name: bookmark_folders bookmark_folders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmark_folders
    ADD CONSTRAINT bookmark_folders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: bookmarks bookmarks_folder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES public.bookmark_folders(id) ON DELETE CASCADE;


--
-- Name: bookmarks bookmarks_map_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_map_id_fkey FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;


--
-- Name: bookmarks bookmarks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: bookmarks bookmarks_user_spot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_user_spot_id_fkey FOREIGN KEY (user_spot_id) REFERENCES public.user_spots(id) ON DELETE CASCADE;


--
-- Name: category_featured_maps category_featured_maps_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_featured_maps
    ADD CONSTRAINT category_featured_maps_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: category_featured_maps category_featured_maps_map_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_featured_maps
    ADD CONSTRAINT category_featured_maps_map_id_fkey FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;


--
-- Name: category_featured_tags category_featured_tags_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_featured_tags
    ADD CONSTRAINT category_featured_tags_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: category_featured_tags category_featured_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_featured_tags
    ADD CONSTRAINT category_featured_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- Name: cities cities_prefecture_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_prefecture_id_fkey FOREIGN KEY (prefecture_id) REFERENCES public.prefectures(id);


--
-- Name: collection_maps collection_maps_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collection_maps
    ADD CONSTRAINT collection_maps_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;


--
-- Name: collection_maps collection_maps_map_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collection_maps
    ADD CONSTRAINT collection_maps_map_id_fkey FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;


--
-- Name: collections collections_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: comment_likes comment_likes_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment_likes
    ADD CONSTRAINT comment_likes_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON DELETE CASCADE;


--
-- Name: comment_likes comment_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment_likes
    ADD CONSTRAINT comment_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: comments comments_map_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_map_id_fkey FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;


--
-- Name: comments comments_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.comments(id) ON DELETE CASCADE;


--
-- Name: comments comments_root_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_root_id_fkey FOREIGN KEY (root_id) REFERENCES public.comments(id) ON DELETE CASCADE;


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: comments comments_user_spot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_spot_id_fkey FOREIGN KEY (user_spot_id) REFERENCES public.user_spots(id) ON DELETE CASCADE;


--
-- Name: countries countries_continent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_continent_id_fkey FOREIGN KEY (continent_id) REFERENCES public.continents(id) ON DELETE SET NULL;


--
-- Name: deletion_requests deletion_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deletion_requests
    ADD CONSTRAINT deletion_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: featured_carousel_items featured_carousel_items_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.featured_carousel_items
    ADD CONSTRAINT featured_carousel_items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: regions fk_regions_country; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regions
    ADD CONSTRAINT fk_regions_country FOREIGN KEY (country_id) REFERENCES public.countries(id);


--
-- Name: follows follows_followee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_followee_id_fkey FOREIGN KEY (followee_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: follows follows_follower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: images images_user_spot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_user_spot_id_fkey FOREIGN KEY (user_spot_id) REFERENCES public.user_spots(id) ON DELETE CASCADE;


--
-- Name: likes likes_map_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_map_id_fkey FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;


--
-- Name: likes likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: likes likes_user_spot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_user_spot_id_fkey FOREIGN KEY (user_spot_id) REFERENCES public.user_spots(id) ON DELETE CASCADE;


--
-- Name: machi machi_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.machi
    ADD CONSTRAINT machi_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id);


--
-- Name: machi machi_prefecture_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.machi
    ADD CONSTRAINT machi_prefecture_id_fkey FOREIGN KEY (prefecture_id) REFERENCES public.prefectures(id);


--
-- Name: map_labels map_labels_map_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_labels
    ADD CONSTRAINT map_labels_map_id_fkey FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;


--
-- Name: map_tags map_tags_map_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_tags
    ADD CONSTRAINT map_tags_map_id_fkey FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;


--
-- Name: map_tags map_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_tags
    ADD CONSTRAINT map_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- Name: maps maps_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maps
    ADD CONSTRAINT maps_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: maps maps_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maps
    ADD CONSTRAINT maps_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: master_spot_favorites master_spot_favorites_master_spot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_spot_favorites
    ADD CONSTRAINT master_spot_favorites_master_spot_id_fkey FOREIGN KEY (master_spot_id) REFERENCES public.master_spots(id) ON DELETE CASCADE;


--
-- Name: master_spot_favorites master_spot_favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_spot_favorites
    ADD CONSTRAINT master_spot_favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: master_spots master_spots_machi_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_spots
    ADD CONSTRAINT master_spots_machi_id_fkey FOREIGN KEY (machi_id) REFERENCES public.machi(id) ON DELETE SET NULL;


--
-- Name: notifications notifications_actor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_map_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_map_id_fkey FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_spot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_spot_id_fkey FOREIGN KEY (user_spot_id) REFERENCES public.user_spots(id) ON DELETE CASCADE;


--
-- Name: prefectures prefectures_region_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prefectures
    ADD CONSTRAINT prefectures_region_id_fkey FOREIGN KEY (region_id) REFERENCES public.regions(id);


--
-- Name: reports reports_reporter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reports reports_resolved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES public.users(id);


--
-- Name: schedules schedules_machi_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_machi_id_fkey FOREIGN KEY (machi_id) REFERENCES public.machi(id) ON DELETE CASCADE;


--
-- Name: schedules schedules_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: search_history search_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_history
    ADD CONSTRAINT search_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: spot_tags spot_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.spot_tags
    ADD CONSTRAINT spot_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- Name: spot_tags spot_tags_user_spot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.spot_tags
    ADD CONSTRAINT spot_tags_user_spot_id_fkey FOREIGN KEY (user_spot_id) REFERENCES public.user_spots(id) ON DELETE CASCADE;


--
-- Name: terms_agreements terms_agreements_privacy_version_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.terms_agreements
    ADD CONSTRAINT terms_agreements_privacy_version_id_fkey FOREIGN KEY (privacy_version_id) REFERENCES public.terms_versions(id);


--
-- Name: terms_agreements terms_agreements_terms_version_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.terms_agreements
    ADD CONSTRAINT terms_agreements_terms_version_id_fkey FOREIGN KEY (terms_version_id) REFERENCES public.terms_versions(id);


--
-- Name: terms_agreements terms_agreements_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.terms_agreements
    ADD CONSTRAINT terms_agreements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: terms_versions terms_versions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.terms_versions
    ADD CONSTRAINT terms_versions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: transport_hubs transport_hubs_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transport_hubs
    ADD CONSTRAINT transport_hubs_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id);


--
-- Name: transport_hubs transport_hubs_prefecture_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transport_hubs
    ADD CONSTRAINT transport_hubs_prefecture_id_fkey FOREIGN KEY (prefecture_id) REFERENCES public.prefectures(id);


--
-- Name: system_announcement_reads user_announcement_reads_announcement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_announcement_reads
    ADD CONSTRAINT user_announcement_reads_announcement_id_fkey FOREIGN KEY (announcement_id) REFERENCES public.system_announcements(id) ON DELETE CASCADE;


--
-- Name: system_announcement_reads user_announcement_reads_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_announcement_reads
    ADD CONSTRAINT user_announcement_reads_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_notification_settings user_notification_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_notification_settings
    ADD CONSTRAINT user_notification_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_preferences user_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_spots user_spots_label_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_spots
    ADD CONSTRAINT user_spots_label_id_fkey FOREIGN KEY (label_id) REFERENCES public.map_labels(id) ON DELETE SET NULL;


--
-- Name: user_spots user_spots_machi_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_spots
    ADD CONSTRAINT user_spots_machi_id_fkey FOREIGN KEY (machi_id) REFERENCES public.machi(id) ON DELETE SET NULL;


--
-- Name: user_spots user_spots_map_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_spots
    ADD CONSTRAINT user_spots_map_id_fkey FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;


--
-- Name: user_spots user_spots_master_spot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_spots
    ADD CONSTRAINT user_spots_master_spot_id_fkey FOREIGN KEY (master_spot_id) REFERENCES public.master_spots(id) ON DELETE CASCADE;


--
-- Name: user_spots user_spots_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_spots
    ADD CONSTRAINT user_spots_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: view_history view_history_map_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.view_history
    ADD CONSTRAINT view_history_map_id_fkey FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;


--
-- Name: view_history view_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.view_history
    ADD CONSTRAINT view_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: visits visits_machi_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_machi_id_fkey FOREIGN KEY (machi_id) REFERENCES public.machi(id);


--
-- Name: visits visits_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: admin_boundaries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin_boundaries ENABLE ROW LEVEL SECURITY;

--
-- Name: admin_boundaries admin_boundaries_select_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_boundaries_select_all ON public.admin_boundaries FOR SELECT USING (true);


--
-- Name: admin_users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

--
-- Name: admin_users admin_users_delete_owner; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_users_delete_owner ON public.admin_users FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.admin_users au
  WHERE ((au.user_id = auth.uid()) AND (au.role = 'owner'::text)))));


--
-- Name: admin_users admin_users_insert_owner; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_users_insert_owner ON public.admin_users FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admin_users au
  WHERE ((au.user_id = auth.uid()) AND (au.role = 'owner'::text)))));


--
-- Name: admin_users admin_users_select_admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_users_select_admin ON public.admin_users FOR SELECT TO authenticated USING (public.is_admin_user(auth.uid()));


--
-- Name: admin_users admin_users_update_owner; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_users_update_owner ON public.admin_users FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.admin_users au
  WHERE ((au.user_id = auth.uid()) AND (au.role = 'owner'::text))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admin_users au
  WHERE ((au.user_id = auth.uid()) AND (au.role = 'owner'::text)))));


--
-- Name: bookmark_folders; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bookmark_folders ENABLE ROW LEVEL SECURITY;

--
-- Name: bookmark_folders bookmark_folders_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY bookmark_folders_delete_own ON public.bookmark_folders FOR DELETE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: bookmark_folders bookmark_folders_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY bookmark_folders_insert_own ON public.bookmark_folders FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));


--
-- Name: bookmark_folders bookmark_folders_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY bookmark_folders_select_own ON public.bookmark_folders FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: bookmark_folders bookmark_folders_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY bookmark_folders_update_own ON public.bookmark_folders FOR UPDATE TO authenticated USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));


--
-- Name: bookmarks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

--
-- Name: bookmarks bookmarks_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY bookmarks_delete_own ON public.bookmarks FOR DELETE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: bookmarks bookmarks_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY bookmarks_insert_own ON public.bookmarks FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));


--
-- Name: bookmarks bookmarks_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY bookmarks_select_own ON public.bookmarks FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: categories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

--
-- Name: categories categories_select_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY categories_select_all ON public.categories FOR SELECT USING (true);


--
-- Name: category_featured_maps; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.category_featured_maps ENABLE ROW LEVEL SECURITY;

--
-- Name: category_featured_maps category_featured_maps_select_active; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY category_featured_maps_select_active ON public.category_featured_maps FOR SELECT USING ((is_active = true));


--
-- Name: category_featured_tags; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.category_featured_tags ENABLE ROW LEVEL SECURITY;

--
-- Name: category_featured_tags category_featured_tags_select_active; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY category_featured_tags_select_active ON public.category_featured_tags FOR SELECT USING ((is_active = true));


--
-- Name: cities; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

--
-- Name: cities cities_select_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY cities_select_all ON public.cities FOR SELECT USING (true);


--
-- Name: collection_maps; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.collection_maps ENABLE ROW LEVEL SECURITY;

--
-- Name: collection_maps collection_maps_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY collection_maps_delete_own ON public.collection_maps FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.collections
  WHERE ((collections.id = collection_maps.collection_id) AND (collections.user_id = auth.uid())))));


--
-- Name: collection_maps collection_maps_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY collection_maps_insert_own ON public.collection_maps FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.collections
  WHERE ((collections.id = collection_maps.collection_id) AND (collections.user_id = auth.uid())))));


--
-- Name: collection_maps collection_maps_select_public_or_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY collection_maps_select_public_or_own ON public.collection_maps FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.collections
  WHERE ((collections.id = collection_maps.collection_id) AND ((collections.is_public = true) OR (collections.user_id = auth.uid()))))));


--
-- Name: collection_maps collection_maps_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY collection_maps_update_own ON public.collection_maps FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.collections
  WHERE ((collections.id = collection_maps.collection_id) AND (collections.user_id = auth.uid()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.collections
  WHERE ((collections.id = collection_maps.collection_id) AND (collections.user_id = auth.uid())))));


--
-- Name: collections; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

--
-- Name: collections collections_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY collections_delete_own ON public.collections FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: collections collections_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY collections_insert_own ON public.collections FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: collections collections_select_public_or_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY collections_select_public_or_own ON public.collections FOR SELECT USING (((is_public = true) OR (auth.uid() = user_id)));


--
-- Name: collections collections_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY collections_update_own ON public.collections FOR UPDATE USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: comment_likes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

--
-- Name: comment_likes comment_likes_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY comment_likes_delete_own ON public.comment_likes FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: comment_likes comment_likes_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY comment_likes_insert_own ON public.comment_likes FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: comment_likes comment_likes_select_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY comment_likes_select_all ON public.comment_likes FOR SELECT USING (true);


--
-- Name: comments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

--
-- Name: comments comments_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY comments_delete_own ON public.comments FOR DELETE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: comments comments_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY comments_insert_own ON public.comments FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));


--
-- Name: comments comments_select_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY comments_select_all ON public.comments FOR SELECT TO authenticated USING (true);


--
-- Name: comments comments_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY comments_update_own ON public.comments FOR UPDATE TO authenticated USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));


--
-- Name: continents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.continents ENABLE ROW LEVEL SECURITY;

--
-- Name: continents continents_select_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY continents_select_all ON public.continents FOR SELECT USING (true);


--
-- Name: countries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

--
-- Name: countries countries_select_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY countries_select_all ON public.countries FOR SELECT USING (true);


--
-- Name: deletion_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.deletion_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: featured_carousel_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.featured_carousel_items ENABLE ROW LEVEL SECURITY;

--
-- Name: featured_carousel_items featured_carousel_items_select_active; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY featured_carousel_items_select_active ON public.featured_carousel_items FOR SELECT TO authenticated, anon USING (((is_active = true) AND ((starts_at IS NULL) OR (starts_at <= now())) AND ((ends_at IS NULL) OR (ends_at > now()))));


--
-- Name: follows; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

--
-- Name: follows follows_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY follows_delete_own ON public.follows FOR DELETE TO authenticated USING ((follower_id = auth.uid()));


--
-- Name: follows follows_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY follows_insert_own ON public.follows FOR INSERT TO authenticated WITH CHECK ((follower_id = auth.uid()));


--
-- Name: follows follows_select_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY follows_select_all ON public.follows FOR SELECT USING (true);


--
-- Name: images; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

--
-- Name: images images_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY images_delete_own ON public.images FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.user_spots
  WHERE ((user_spots.id = images.user_spot_id) AND (user_spots.user_id = auth.uid())))));


--
-- Name: images images_insert_own_with_limit; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY images_insert_own_with_limit ON public.images FOR INSERT TO authenticated WITH CHECK (((EXISTS ( SELECT 1
   FROM public.user_spots us
  WHERE ((us.id = images.user_spot_id) AND (us.user_id = auth.uid())))) AND (public.count_images_in_spot(user_spot_id) < 4)));


--
-- Name: images images_select_public_or_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY images_select_public_or_own ON public.images FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (public.user_spots
     JOIN public.maps ON ((maps.id = user_spots.map_id)))
  WHERE ((user_spots.id = images.user_spot_id) AND ((maps.is_public = true) OR ((auth.uid() IS NOT NULL) AND (maps.user_id = auth.uid())))))));


--
-- Name: likes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

--
-- Name: likes likes_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY likes_delete_own ON public.likes FOR DELETE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: likes likes_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY likes_insert_own ON public.likes FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));


--
-- Name: likes likes_select_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY likes_select_all ON public.likes FOR SELECT USING (true);


--
-- Name: machi; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.machi ENABLE ROW LEVEL SECURITY;

--
-- Name: machi machi_select_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY machi_select_all ON public.machi FOR SELECT USING (true);


--
-- Name: map_labels; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.map_labels ENABLE ROW LEVEL SECURITY;

--
-- Name: map_labels map_labels_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY map_labels_delete_own ON public.map_labels FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = map_labels.map_id) AND (maps.user_id = auth.uid())))));


--
-- Name: map_labels map_labels_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY map_labels_insert_own ON public.map_labels FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = map_labels.map_id) AND (maps.user_id = auth.uid())))));


--
-- Name: map_labels map_labels_select_public_or_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY map_labels_select_public_or_own ON public.map_labels FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = map_labels.map_id) AND ((maps.is_public = true) OR (maps.user_id = auth.uid()))))));


--
-- Name: map_labels map_labels_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY map_labels_update_own ON public.map_labels FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = map_labels.map_id) AND (maps.user_id = auth.uid()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = map_labels.map_id) AND (maps.user_id = auth.uid())))));


--
-- Name: map_tags; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.map_tags ENABLE ROW LEVEL SECURITY;

--
-- Name: map_tags map_tags_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY map_tags_delete_own ON public.map_tags FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = map_tags.map_id) AND (maps.user_id = auth.uid())))));


--
-- Name: map_tags map_tags_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY map_tags_insert_own ON public.map_tags FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = map_tags.map_id) AND (maps.user_id = auth.uid())))));


--
-- Name: map_tags map_tags_select_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY map_tags_select_all ON public.map_tags FOR SELECT USING (true);


--
-- Name: maps; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.maps ENABLE ROW LEVEL SECURITY;

--
-- Name: maps maps_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY maps_delete_own ON public.maps FOR DELETE TO authenticated USING (((user_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.status = 'active'::text))))));


--
-- Name: maps maps_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY maps_insert_own ON public.maps FOR INSERT TO authenticated WITH CHECK (((user_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.status = 'active'::text))))));


--
-- Name: maps maps_select_public_or_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY maps_select_public_or_own ON public.maps FOR SELECT USING (((is_public = true) OR ((auth.uid() IS NOT NULL) AND (user_id = auth.uid()))));


--
-- Name: maps maps_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY maps_update_own ON public.maps FOR UPDATE TO authenticated USING ((user_id = auth.uid())) WITH CHECK (((user_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.status = 'active'::text))))));


--
-- Name: master_spot_favorites; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.master_spot_favorites ENABLE ROW LEVEL SECURITY;

--
-- Name: master_spot_favorites master_spot_favorites_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY master_spot_favorites_delete_own ON public.master_spot_favorites FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: master_spot_favorites master_spot_favorites_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY master_spot_favorites_insert_own ON public.master_spot_favorites FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: master_spot_favorites master_spot_favorites_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY master_spot_favorites_select_own ON public.master_spot_favorites FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: master_spots; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.master_spots ENABLE ROW LEVEL SECURITY;

--
-- Name: master_spots master_spots_insert_authenticated; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY master_spots_insert_authenticated ON public.master_spots FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: master_spots master_spots_select_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY master_spots_select_all ON public.master_spots FOR SELECT USING (true);


--
-- Name: notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: notifications notifications_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notifications_delete_own ON public.notifications FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: notifications notifications_insert_system; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notifications_insert_system ON public.notifications FOR INSERT WITH CHECK (true);


--
-- Name: notifications notifications_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notifications_select_own ON public.notifications FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: notifications notifications_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notifications_update_own ON public.notifications FOR UPDATE USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: prefectures; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.prefectures ENABLE ROW LEVEL SECURITY;

--
-- Name: prefectures prefectures_select_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY prefectures_select_all ON public.prefectures FOR SELECT USING (true);


--
-- Name: regions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;

--
-- Name: regions regions_select_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY regions_select_all ON public.regions FOR SELECT USING (true);


--
-- Name: reports; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

--
-- Name: reports reports_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY reports_insert_own ON public.reports FOR INSERT TO authenticated WITH CHECK ((auth.uid() = reporter_id));


--
-- Name: reports reports_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY reports_select_own ON public.reports FOR SELECT TO authenticated USING ((auth.uid() = reporter_id));


--
-- Name: schedules; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

--
-- Name: schedules schedules_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY schedules_delete_own ON public.schedules FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: schedules schedules_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY schedules_insert_own ON public.schedules FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: schedules schedules_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY schedules_select_own ON public.schedules FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: schedules schedules_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY schedules_update_own ON public.schedules FOR UPDATE USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: search_analytics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: search_history; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

--
-- Name: search_history search_history_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY search_history_delete_own ON public.search_history FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: search_history search_history_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY search_history_insert_own ON public.search_history FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: search_history search_history_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY search_history_select_own ON public.search_history FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: spot_tags; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.spot_tags ENABLE ROW LEVEL SECURITY;

--
-- Name: spot_tags spot_tags_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY spot_tags_delete_own ON public.spot_tags FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.user_spots
  WHERE ((user_spots.id = spot_tags.user_spot_id) AND (user_spots.user_id = auth.uid())))));


--
-- Name: spot_tags spot_tags_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY spot_tags_insert_own ON public.spot_tags FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.user_spots
  WHERE ((user_spots.id = spot_tags.user_spot_id) AND (user_spots.user_id = auth.uid())))));


--
-- Name: spot_tags spot_tags_select_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY spot_tags_select_all ON public.spot_tags FOR SELECT USING (true);


--
-- Name: system_announcement_reads; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.system_announcement_reads ENABLE ROW LEVEL SECURITY;

--
-- Name: system_announcement_reads system_announcement_reads_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY system_announcement_reads_delete_own ON public.system_announcement_reads FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: system_announcement_reads system_announcement_reads_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY system_announcement_reads_insert_own ON public.system_announcement_reads FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: system_announcement_reads system_announcement_reads_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY system_announcement_reads_select_own ON public.system_announcement_reads FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: system_announcements; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.system_announcements ENABLE ROW LEVEL SECURITY;

--
-- Name: system_announcements system_announcements_select_active; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY system_announcements_select_active ON public.system_announcements FOR SELECT USING (((is_active = true) AND ((expires_at IS NULL) OR (expires_at > now()))));


--
-- Name: tags; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

--
-- Name: tags tags_insert_authenticated; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tags_insert_authenticated ON public.tags FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: tags tags_select_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tags_select_all ON public.tags FOR SELECT USING (true);


--
-- Name: terms_agreements; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.terms_agreements ENABLE ROW LEVEL SECURITY;

--
-- Name: terms_agreements terms_agreements_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY terms_agreements_insert_own ON public.terms_agreements FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: terms_agreements terms_agreements_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY terms_agreements_select_own ON public.terms_agreements FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: terms_versions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.terms_versions ENABLE ROW LEVEL SECURITY;

--
-- Name: terms_versions terms_versions_select_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY terms_versions_select_all ON public.terms_versions FOR SELECT USING (true);


--
-- Name: transport_hubs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.transport_hubs ENABLE ROW LEVEL SECURITY;

--
-- Name: transport_hubs transport_hubs_select_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY transport_hubs_select_all ON public.transport_hubs FOR SELECT USING (true);


--
-- Name: user_notification_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_notification_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: user_notification_settings user_notification_settings_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_notification_settings_insert_own ON public.user_notification_settings FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_notification_settings user_notification_settings_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_notification_settings_select_own ON public.user_notification_settings FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_notification_settings user_notification_settings_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_notification_settings_update_own ON public.user_notification_settings FOR UPDATE USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_preferences; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

--
-- Name: user_preferences user_preferences_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_preferences_insert_own ON public.user_preferences FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_preferences user_preferences_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_preferences_select_own ON public.user_preferences FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_preferences user_preferences_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_preferences_update_own ON public.user_preferences FOR UPDATE USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_spots; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_spots ENABLE ROW LEVEL SECURITY;

--
-- Name: user_spots user_spots_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_spots_delete_own ON public.user_spots FOR DELETE TO authenticated USING (((user_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.status = 'active'::text))))));


--
-- Name: user_spots user_spots_insert_own_with_limit; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_spots_insert_own_with_limit ON public.user_spots FOR INSERT TO authenticated WITH CHECK (((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = user_spots.map_id) AND (maps.user_id = auth.uid())))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.status = 'active'::text)))) AND ((public.is_user_premium(auth.uid()) AND (public.count_user_spots_in_map(auth.uid(), map_id) < 100)) OR ((NOT public.is_user_premium(auth.uid())) AND (public.count_user_spots_in_map(auth.uid(), map_id) < 30)))));


--
-- Name: user_spots user_spots_select_public_or_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_spots_select_public_or_own ON public.user_spots FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = user_spots.map_id) AND ((maps.is_public = true) OR (maps.user_id = auth.uid()))))));


--
-- Name: user_spots user_spots_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_spots_update_own ON public.user_spots FOR UPDATE TO authenticated USING ((user_id = auth.uid())) WITH CHECK (((user_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.status = 'active'::text))))));


--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: users users_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY users_insert_own ON public.users FOR INSERT TO authenticated WITH CHECK ((auth.uid() = id));


--
-- Name: users users_select_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY users_select_all ON public.users FOR SELECT USING (true);


--
-- Name: users users_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY users_update_own ON public.users FOR UPDATE TO authenticated USING (((auth.uid() = id) AND (status = 'active'::text))) WITH CHECK (((auth.uid() = id) AND (status = 'active'::text)));


--
-- Name: view_history; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.view_history ENABLE ROW LEVEL SECURITY;

--
-- Name: view_history view_history_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY view_history_delete_own ON public.view_history FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: view_history view_history_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY view_history_insert_own ON public.view_history FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: view_history view_history_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY view_history_select_own ON public.view_history FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: view_history view_history_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY view_history_update_own ON public.view_history FOR UPDATE USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- PostgreSQL database dump complete
--

\unrestrict msAnCJ8yKakMWFa2swNAHvsRB8bmVHDe9z6SppvRwyo01rLANlpeVgZRu1oHGeC


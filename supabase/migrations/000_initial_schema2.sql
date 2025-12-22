--
-- PostgreSQL database dump
--

\restrict p5jzjG7S1j57xJrAorczlFPJTx1c01L2IeXkXEdsLofd4NbvbhQbTTeEvCIxhjW

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7 (Homebrew)

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
-- Name: check_spots_limit(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_spots_limit() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- 現在のマップのスポット数をチェック
  IF (SELECT COUNT(*) FROM user_spots WHERE map_id = NEW.map_id) >= 100 THEN
    RAISE EXCEPTION 'マップあたりのスポット数上限（100）に達しています';
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: check_spots_limit_on_update(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_spots_limit_on_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- map_idが変更された場合のみチェック
  IF OLD.map_id IS DISTINCT FROM NEW.map_id THEN
    IF (SELECT COUNT(*) FROM user_spots WHERE map_id = NEW.map_id) >= 100 THEN
      RAISE EXCEPTION '移動先のマップはスポット数上限（100）に達しています';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;


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
-- Name: decrement_comment_likes_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.decrement_comment_likes_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE comments
  SET likes_count = GREATEST(0, likes_count - 1)
  WHERE id = OLD.comment_id;
  RETURN OLD;
END;
$$;


--
-- Name: decrement_comment_replies_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.decrement_comment_replies_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF OLD.parent_id IS NOT NULL THEN
    UPDATE comments
    SET replies_count = GREATEST(0, replies_count - 1)
    WHERE id = OLD.parent_id;
  END IF;
  RETURN OLD;
END;
$$;


--
-- Name: decrement_map_bookmarks_count(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.decrement_map_bookmarks_count(p_map_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE maps
  SET bookmarks_count = GREATEST(0, bookmarks_count - 1)
  WHERE id = p_map_id;
END;
$$;


--
-- Name: decrement_map_comments_count(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.decrement_map_comments_count(map_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE maps
  SET comments_count = GREATEST(COALESCE(comments_count, 0) - 1, 0)
  WHERE id = map_id;
END;
$$;


--
-- Name: decrement_map_likes_count(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.decrement_map_likes_count(map_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE maps
  SET likes_count = GREATEST(0, likes_count - 1)
  WHERE id = map_id;
END;
$$;


--
-- Name: decrement_map_spots_count(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.decrement_map_spots_count(map_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE maps
  SET spots_count = GREATEST(0, spots_count - 1)
  WHERE id = map_id;
END;
$$;


--
-- Name: decrement_master_spot_favorites_count(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.decrement_master_spot_favorites_count(master_spot_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE master_spots
  SET favorites_count = GREATEST(0, favorites_count - 1)
  WHERE id = master_spot_id;
END;
$$;


--
-- Name: decrement_user_spot_bookmarks_count(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.decrement_user_spot_bookmarks_count(user_spot_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE user_spots
  SET bookmarks_count = GREATEST(0, bookmarks_count - 1)
  WHERE id = user_spot_id;
END;
$$;


--
-- Name: decrement_user_spot_comments_count(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.decrement_user_spot_comments_count(user_spot_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE user_spots
  SET comments_count = GREATEST(0, comments_count - 1)
  WHERE id = user_spot_id;
END;
$$;


--
-- Name: decrement_user_spot_images_count(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.decrement_user_spot_images_count(user_spot_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE user_spots
  SET images_count = GREATEST(0, images_count - 1)
  WHERE id = user_spot_id;
END;
$$;


--
-- Name: decrement_user_spot_likes_count(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.decrement_user_spot_likes_count(user_spot_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE user_spots
  SET likes_count = GREATEST(0, likes_count - 1)
  WHERE id = user_spot_id;
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
-- Name: get_popular_tags_by_category(uuid, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_popular_tags_by_category(p_category_id uuid, p_limit integer DEFAULT 10) RETURNS TABLE(id uuid, name text, name_translations jsonb, is_official boolean, usage_count bigint, created_at timestamp with time zone, updated_at timestamp with time zone)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.name,
    t.name_translations,
    t.is_official,
    COUNT(mt.id) AS usage_count,
    t.created_at,
    t.updated_at
  FROM tags t
  INNER JOIN map_tags mt ON mt.tag_id = t.id
  INNER JOIN maps m ON m.id = mt.map_id
  WHERE m.category_id = p_category_id
    AND m.is_public = true
  GROUP BY t.id, t.name, t.name_translations, t.is_official, t.created_at, t.updated_at
  ORDER BY usage_count DESC, t.name ASC
  LIMIT p_limit;
END;
$$;


--
-- Name: increment_comment_likes_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_comment_likes_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE comments
  SET likes_count = likes_count + 1
  WHERE id = NEW.comment_id;
  RETURN NEW;
END;
$$;


--
-- Name: increment_comment_replies_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_comment_replies_count() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF NEW.parent_id IS NOT NULL THEN
    UPDATE comments
    SET replies_count = replies_count + 1
    WHERE id = NEW.parent_id;
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: increment_map_bookmarks_count(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_map_bookmarks_count(p_map_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE maps
  SET bookmarks_count = bookmarks_count + 1
  WHERE id = p_map_id;
END;
$$;


--
-- Name: increment_map_comments_count(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_map_comments_count(map_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE maps
  SET comments_count = COALESCE(comments_count, 0) + 1
  WHERE id = map_id;
END;
$$;


--
-- Name: increment_map_likes_count(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_map_likes_count(map_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE maps
  SET likes_count = likes_count + 1
  WHERE id = map_id;
END;
$$;


--
-- Name: increment_map_spots_count(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_map_spots_count(map_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE maps
  SET spots_count = spots_count + 1
  WHERE id = map_id;
END;
$$;


--
-- Name: increment_master_spot_favorites_count(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_master_spot_favorites_count(master_spot_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE master_spots
  SET favorites_count = favorites_count + 1
  WHERE id = master_spot_id;
END;
$$;


--
-- Name: increment_user_spot_bookmarks_count(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_user_spot_bookmarks_count(user_spot_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE user_spots
  SET bookmarks_count = bookmarks_count + 1
  WHERE id = user_spot_id;
END;
$$;


--
-- Name: increment_user_spot_comments_count(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_user_spot_comments_count(user_spot_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE user_spots
  SET comments_count = comments_count + 1
  WHERE id = user_spot_id;
END;
$$;


--
-- Name: increment_user_spot_images_count(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_user_spot_images_count(user_spot_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE user_spots
  SET images_count = images_count + 1
  WHERE id = user_spot_id;
END;
$$;


--
-- Name: increment_user_spot_likes_count(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_user_spot_likes_count(user_spot_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE user_spots
  SET likes_count = likes_count + 1
  WHERE id = user_spot_id;
END;
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
-- Name: migrate_maps_tags_to_table(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.migrate_maps_tags_to_table() RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  map_record RECORD;
  tag_name TEXT;
  tag_id UUID;
BEGIN
  -- 既存のmapsテーブルからtagsを持つレコードを取得
  FOR map_record IN SELECT id, tags FROM maps WHERE tags IS NOT NULL AND jsonb_array_length(tags) > 0 LOOP
    -- 各タグをループ
    FOR tag_name IN SELECT jsonb_array_elements_text(map_record.tags) LOOP
      -- タグが存在しなければ作成
      INSERT INTO tags (name, slug)
      VALUES (tag_name, lower(replace(tag_name, ' ', '-')))
      ON CONFLICT (name) DO NOTHING;

      -- タグIDを取得
      SELECT id INTO tag_id FROM tags WHERE name = tag_name;

      -- map_tagsに挿入
      INSERT INTO map_tags (map_id, tag_id)
      VALUES (map_record.id, tag_id)
      ON CONFLICT (map_id, tag_id) DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$;


--
-- Name: migrate_spots_tags_to_table(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.migrate_spots_tags_to_table() RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  spot_record RECORD;
  tag_name TEXT;
  tag_uuid UUID;
BEGIN
  -- 既存のuser_spotsテーブルからtagsを持つレコードを取得
  FOR spot_record IN SELECT id, tags FROM user_spots WHERE tags IS NOT NULL AND jsonb_array_length(tags) > 0 LOOP
    -- 各タグをループ
    FOR tag_name IN SELECT jsonb_array_elements_text(spot_record.tags) LOOP
      -- タグが存在しなければ作成
      INSERT INTO tags (name, slug)
      VALUES (tag_name, lower(replace(tag_name, ' ', '-')))
      ON CONFLICT (name) DO NOTHING;

      -- タグIDを取得
      SELECT id INTO tag_uuid FROM tags WHERE name = tag_name;

      -- spot_tagsに挿入
      INSERT INTO spot_tags (user_spot_id, tag_id)
      VALUES (spot_record.id, tag_uuid)
      ON CONFLICT (user_spot_id, tag_id) DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$;


--
-- Name: record_map_view(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.record_map_view(p_user_id uuid, p_map_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.view_history (user_id, map_id, viewed_at, view_count)
  VALUES (p_user_id, p_map_id, now(), 1)
  ON CONFLICT (user_id, map_id)
  DO UPDATE SET
    viewed_at = now(),
    view_count = view_history.view_count + 1,
    updated_at = now();
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

  -- Edge Functionを非同期で呼び出し（名前を修正: send-notification）
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
      'spot_id', NEW.spot_id,
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
-- Name: update_notification_settings_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_notification_settings_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
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
-- Name: update_view_history_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_view_history_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: admin_boundaries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_boundaries (
    id integer NOT NULL,
    geom public.geometry(MultiPolygon,4326),
    created_at timestamp with time zone DEFAULT now(),
    admin_level integer,
    country_id text,
    prefecture_id text,
    city_id text
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
-- Name: admin_boundaries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admin_boundaries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admin_boundaries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admin_boundaries_id_seq OWNED BY public.admin_boundaries.id;


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
    slug text NOT NULL,
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

COMMENT ON TABLE public.categories IS 'マップカテゴリ（グルメ、旅行など）';


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
-- Name: current_terms_versions; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.current_terms_versions AS
 SELECT DISTINCT ON (type) id,
    type,
    version,
    content,
    summary,
    effective_at,
    created_at
   FROM public.terms_versions
  WHERE (effective_at <= now())
  ORDER BY type, effective_at DESC;


--
-- Name: VIEW current_terms_versions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.current_terms_versions IS '現在有効な利用規約・プライバシーポリシーの最新バージョン';


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
    is_default boolean DEFAULT false NOT NULL,
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
    show_label_chips boolean DEFAULT false
);


--
-- Name: COLUMN maps.is_public; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.maps.is_public IS 'マップが公開されているかどうか（デフォルト: false）';


--
-- Name: COLUMN maps.is_default; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.maps.is_default IS 'デフォルトマップかどうか（デフォルト: false）';


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
    name text NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    google_place_id text,
    google_formatted_address text,
    google_types text[],
    google_phone_number text,
    google_website_uri text,
    google_rating double precision,
    google_user_rating_count integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    machi_id text,
    google_short_address text,
    favorites_count integer DEFAULT 0 NOT NULL
);


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
-- Name: user_spots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_spots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    map_id uuid NOT NULL,
    master_spot_id uuid,
    machi_id text,
    custom_name text NOT NULL,
    description text,
    images_count integer DEFAULT 0 NOT NULL,
    likes_count integer DEFAULT 0 NOT NULL,
    comments_count integer DEFAULT 0 NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    article_content jsonb,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    google_formatted_address text,
    google_short_address text,
    bookmarks_count integer DEFAULT 0 NOT NULL,
    prefecture_id text,
    color text,
    spot_color text DEFAULT 'blue'::text,
    label_id uuid,
    city_id text,
    prefecture_name text,
    city_name text,
    machi_name text
);


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
-- Name: COLUMN user_spots.prefecture_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_spots.prefecture_id IS '都道府県ID（prefectures.id）。都道府県別検索の高速化のため非正規化';


--
-- Name: COLUMN user_spots.color; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_spots.color IS 'スポットの色（pink, red, orange, yellow, green, blue, purple, gray, white）';


--
-- Name: COLUMN user_spots.spot_color; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_spots.spot_color IS 'スポットの色（pink, red, orange, yellow, green, blue, purple, gray, white）';


--
-- Name: COLUMN user_spots.label_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_spots.label_id IS 'スポットのラベル（map_labelsへの外部キー）';


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
    push_token_updated_at timestamp with time zone
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
-- Name: admin_boundaries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_boundaries ALTER COLUMN id SET DEFAULT nextval('public.admin_boundaries_id_seq'::regclass);


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
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


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
-- Name: terms_versions terms_versions_type_version_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.terms_versions
    ADD CONSTRAINT terms_versions_type_version_key UNIQUE (type, version);


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

CREATE INDEX idx_master_spots_name ON public.master_spots USING btree (name);


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
-- Name: idx_terms_versions_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_terms_versions_type ON public.terms_versions USING btree (type);


--
-- Name: idx_terms_versions_type_effective; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_terms_versions_type_effective ON public.terms_versions USING btree (type, effective_at DESC);


--
-- Name: idx_transport_hubs_location; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_transport_hubs_location ON public.transport_hubs USING btree (latitude, longitude);


--
-- Name: idx_transport_hubs_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_transport_hubs_name ON public.transport_hubs USING btree (name);


--
-- Name: idx_transport_hubs_osm_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_transport_hubs_osm_id ON public.transport_hubs USING btree (osm_id);


--
-- Name: idx_transport_hubs_prefecture_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_transport_hubs_prefecture_id ON public.transport_hubs USING btree (prefecture_id);


--
-- Name: idx_transport_hubs_tile_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_transport_hubs_tile_id ON public.transport_hubs USING btree (tile_id);


--
-- Name: idx_transport_hubs_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_transport_hubs_type ON public.transport_hubs USING btree (type);


--
-- Name: idx_transport_hubs_type_subtype; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_transport_hubs_type_subtype ON public.transport_hubs USING btree (type, subtype);


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
-- Name: idx_user_spots_prefecture_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_spots_prefecture_id ON public.user_spots USING btree (prefecture_id);


--
-- Name: idx_user_spots_prefecture_map; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_spots_prefecture_map ON public.user_spots USING btree (prefecture_id, map_id);


--
-- Name: idx_user_spots_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_spots_user_id ON public.user_spots USING btree (user_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_is_premium; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_is_premium ON public.users USING btree (is_premium);


--
-- Name: idx_users_push_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_push_token ON public.users USING btree (push_token) WHERE (push_token IS NOT NULL);


--
-- Name: idx_users_username; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_username ON public.users USING btree (username);


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
-- Name: idx_view_history_viewed_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_view_history_viewed_at ON public.view_history USING btree (viewed_at DESC);


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
-- Name: users_username_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_username_idx ON public.users USING btree (username);


--
-- Name: user_spots enforce_spots_limit; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER enforce_spots_limit BEFORE INSERT ON public.user_spots FOR EACH ROW EXECUTE FUNCTION public.check_spots_limit();


--
-- Name: user_spots enforce_spots_limit_on_update; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER enforce_spots_limit_on_update BEFORE UPDATE ON public.user_spots FOR EACH ROW EXECUTE FUNCTION public.check_spots_limit_on_update();


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
-- Name: comment_likes trigger_decrement_comment_likes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_decrement_comment_likes AFTER DELETE ON public.comment_likes FOR EACH ROW EXECUTE FUNCTION public.decrement_comment_likes_count();


--
-- Name: comments trigger_decrement_comment_replies; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_decrement_comment_replies AFTER DELETE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.decrement_comment_replies_count();


--
-- Name: comment_likes trigger_increment_comment_likes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_increment_comment_likes AFTER INSERT ON public.comment_likes FOR EACH ROW EXECUTE FUNCTION public.increment_comment_likes_count();


--
-- Name: comments trigger_increment_comment_replies; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_increment_comment_replies AFTER INSERT ON public.comments FOR EACH ROW EXECUTE FUNCTION public.increment_comment_replies_count();


--
-- Name: collection_maps trigger_update_collection_maps_count; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_collection_maps_count AFTER INSERT OR DELETE ON public.collection_maps FOR EACH ROW EXECUTE FUNCTION public.update_collection_maps_count();


--
-- Name: user_notification_settings trigger_update_notification_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_notification_settings_updated_at BEFORE UPDATE ON public.user_notification_settings FOR EACH ROW EXECUTE FUNCTION public.update_notification_settings_updated_at();


--
-- Name: view_history trigger_update_view_history_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_view_history_updated_at BEFORE UPDATE ON public.view_history FOR EACH ROW EXECUTE FUNCTION public.update_view_history_updated_at();


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
-- Name: user_spots update_user_spots_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_spots_updated_at BEFORE UPDATE ON public.user_spots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


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
-- Name: bookmark_folders bookmark_folders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmark_folders
    ADD CONSTRAINT bookmark_folders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: bookmarks bookmarks_folder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES public.bookmark_folders(id) ON DELETE SET NULL;


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
-- Name: user_spots user_spots_prefecture_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_spots
    ADD CONSTRAINT user_spots_prefecture_id_fkey FOREIGN KEY (prefecture_id) REFERENCES public.prefectures(id) ON DELETE SET NULL;


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
-- Name: system_announcements Anyone can view active announcements; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active announcements" ON public.system_announcements FOR SELECT USING (((is_active = true) AND ((expires_at IS NULL) OR (expires_at > now()))));


--
-- Name: cities Anyone can view cities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view cities" ON public.cities FOR SELECT USING (true);


--
-- Name: machi Anyone can view machi; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view machi" ON public.machi FOR SELECT USING (true);


--
-- Name: master_spots Anyone can view master spots; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view master spots" ON public.master_spots FOR SELECT USING (true);


--
-- Name: prefectures Anyone can view prefectures; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view prefectures" ON public.prefectures FOR SELECT USING (true);


--
-- Name: users Anyone can view users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view users" ON public.users FOR SELECT USING (true);


--
-- Name: master_spots Authenticated users can create master spots; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can create master spots" ON public.master_spots FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: collection_maps Collection maps viewable if collection is viewable; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Collection maps viewable if collection is viewable" ON public.collection_maps FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.collections
  WHERE ((collections.id = collection_maps.collection_id) AND ((collections.is_public = true) OR (collections.user_id = auth.uid()))))));


--
-- Name: comments Comments are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT TO authenticated USING (true);


--
-- Name: follows Follows are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Follows are viewable by everyone" ON public.follows FOR SELECT USING (true);


--
-- Name: images Images are viewable if spot is public or own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Images are viewable if spot is public or own" ON public.images FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (public.user_spots
     JOIN public.maps ON ((maps.id = user_spots.map_id)))
  WHERE ((user_spots.id = images.user_spot_id) AND ((maps.is_public = true) OR ((auth.uid() IS NOT NULL) AND (maps.user_id = auth.uid())))))));


--
-- Name: likes Likes are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Likes are viewable by everyone" ON public.likes FOR SELECT TO authenticated USING (true);


--
-- Name: map_labels Map labels are viewable if map is viewable; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Map labels are viewable if map is viewable" ON public.map_labels FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = map_labels.map_id) AND ((maps.is_public = true) OR (maps.user_id = auth.uid()))))));


--
-- Name: collections Public collections are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public collections are viewable by everyone" ON public.collections FOR SELECT USING (((is_public = true) OR (auth.uid() = user_id)));


--
-- Name: maps Public maps are viewable by anyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public maps are viewable by anyone" ON public.maps FOR SELECT USING (((is_public = true) OR ((auth.uid() IS NOT NULL) AND (user_id = auth.uid()))));


--
-- Name: notifications System can insert notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);


--
-- Name: user_spots User spots are viewable if map is public or own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "User spots are viewable if map is public or own" ON public.user_spots FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = user_spots.map_id) AND ((maps.is_public = true) OR ((auth.uid() IS NOT NULL) AND (maps.user_id = auth.uid())))))));


--
-- Name: comments Users can create comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create comments" ON public.comments FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));


--
-- Name: images Users can create images in their own spots; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create images in their own spots" ON public.images FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.user_spots
  WHERE ((user_spots.id = images.user_spot_id) AND (user_spots.user_id = auth.uid())))));


--
-- Name: map_labels Users can create labels in their own maps; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create labels in their own maps" ON public.map_labels FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = map_labels.map_id) AND (maps.user_id = auth.uid())))));


--
-- Name: reports Users can create reports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create reports" ON public.reports FOR INSERT TO authenticated WITH CHECK ((auth.uid() = reporter_id));


--
-- Name: user_spots Users can create spots in their own maps; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create spots in their own maps" ON public.user_spots FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = user_spots.map_id) AND (maps.user_id = auth.uid())))));


--
-- Name: bookmark_folders Users can create their own bookmark folders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own bookmark folders" ON public.bookmark_folders FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));


--
-- Name: bookmarks Users can create their own bookmarks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own bookmarks" ON public.bookmarks FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));


--
-- Name: follows Users can create their own follows; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own follows" ON public.follows FOR INSERT TO authenticated WITH CHECK ((follower_id = auth.uid()));


--
-- Name: likes Users can create their own likes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own likes" ON public.likes FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));


--
-- Name: maps Users can create their own maps; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own maps" ON public.maps FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));


--
-- Name: images Users can delete images in their own spots; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete images in their own spots" ON public.images FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.user_spots
  WHERE ((user_spots.id = images.user_spot_id) AND (user_spots.user_id = auth.uid())))));


--
-- Name: map_labels Users can delete labels in their own maps; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete labels in their own maps" ON public.map_labels FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = map_labels.map_id) AND (maps.user_id = auth.uid())))));


--
-- Name: system_announcement_reads Users can delete own announcement reads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own announcement reads" ON public.system_announcement_reads FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: master_spot_favorites Users can delete own favorites; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own favorites" ON public.master_spot_favorites FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: notifications Users can delete own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: bookmark_folders Users can delete their own bookmark folders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own bookmark folders" ON public.bookmark_folders FOR DELETE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: bookmarks Users can delete their own bookmarks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own bookmarks" ON public.bookmarks FOR DELETE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: comments Users can delete their own comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: follows Users can delete their own follows; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own follows" ON public.follows FOR DELETE TO authenticated USING ((follower_id = auth.uid()));


--
-- Name: view_history Users can delete their own history; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own history" ON public.view_history FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: likes Users can delete their own likes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own likes" ON public.likes FOR DELETE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: maps Users can delete their own maps; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own maps" ON public.maps FOR DELETE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: user_spots Users can delete their own spots; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own spots" ON public.user_spots FOR DELETE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: system_announcement_reads Users can insert own announcement reads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own announcement reads" ON public.system_announcement_reads FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: master_spot_favorites Users can insert own favorites; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own favorites" ON public.master_spot_favorites FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_notification_settings Users can insert own notification settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own notification settings" ON public.user_notification_settings FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: users Users can insert own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT TO authenticated WITH CHECK ((auth.uid() = id));


--
-- Name: view_history Users can insert their own history; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own history" ON public.view_history FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: collection_maps Users can manage maps in own collections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage maps in own collections" ON public.collection_maps USING ((EXISTS ( SELECT 1
   FROM public.collections
  WHERE ((collections.id = collection_maps.collection_id) AND (collections.user_id = auth.uid()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.collections
  WHERE ((collections.id = collection_maps.collection_id) AND (collections.user_id = auth.uid())))));


--
-- Name: collections Users can manage own collections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage own collections" ON public.collections USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: map_labels Users can update labels in their own maps; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update labels in their own maps" ON public.map_labels FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = map_labels.map_id) AND (maps.user_id = auth.uid())))));


--
-- Name: user_notification_settings Users can update own notification settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own notification settings" ON public.user_notification_settings FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: notifications Users can update own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: bookmark_folders Users can update their own bookmark folders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own bookmark folders" ON public.bookmark_folders FOR UPDATE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: comments Users can update their own comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own comments" ON public.comments FOR UPDATE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: view_history Users can update their own history; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own history" ON public.view_history FOR UPDATE USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: maps Users can update their own maps; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own maps" ON public.maps FOR UPDATE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: users Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE TO authenticated USING ((auth.uid() = id));


--
-- Name: user_spots Users can update their own spots; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own spots" ON public.user_spots FOR UPDATE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: system_announcement_reads Users can view own announcement reads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own announcement reads" ON public.system_announcement_reads FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: master_spot_favorites Users can view own favorites; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own favorites" ON public.master_spot_favorites FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_notification_settings Users can view own notification settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own notification settings" ON public.user_notification_settings FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: notifications Users can view own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: reports Users can view own reports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own reports" ON public.reports FOR SELECT TO authenticated USING ((auth.uid() = reporter_id));


--
-- Name: bookmark_folders Users can view their own bookmark folders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own bookmark folders" ON public.bookmark_folders FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: bookmarks Users can view their own bookmarks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: view_history Users can view their own history; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own history" ON public.view_history FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: admin_boundaries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin_boundaries ENABLE ROW LEVEL SECURITY;

--
-- Name: admin_boundaries admin_boundaries_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_boundaries_read ON public.admin_boundaries FOR SELECT USING (true);


--
-- Name: bookmark_folders; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bookmark_folders ENABLE ROW LEVEL SECURITY;

--
-- Name: bookmarks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

--
-- Name: categories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

--
-- Name: categories categories_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY categories_select_policy ON public.categories FOR SELECT USING (true);


--
-- Name: category_featured_maps; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.category_featured_maps ENABLE ROW LEVEL SECURITY;

--
-- Name: category_featured_maps category_featured_maps_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY category_featured_maps_select_policy ON public.category_featured_maps FOR SELECT USING ((is_active = true));


--
-- Name: category_featured_tags; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.category_featured_tags ENABLE ROW LEVEL SECURITY;

--
-- Name: category_featured_tags category_featured_tags_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY category_featured_tags_select_policy ON public.category_featured_tags FOR SELECT USING ((is_active = true));


--
-- Name: collection_maps; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.collection_maps ENABLE ROW LEVEL SECURITY;

--
-- Name: collections; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

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
-- Name: continents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.continents ENABLE ROW LEVEL SECURITY;

--
-- Name: continents continents_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY continents_select_policy ON public.continents FOR SELECT USING (true);


--
-- Name: countries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

--
-- Name: countries countries_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY countries_select_policy ON public.countries FOR SELECT USING (true);


--
-- Name: featured_carousel_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.featured_carousel_items ENABLE ROW LEVEL SECURITY;

--
-- Name: featured_carousel_items featured_carousel_items_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY featured_carousel_items_select_policy ON public.featured_carousel_items FOR SELECT TO authenticated, anon USING (((is_active = true) AND ((starts_at IS NULL) OR (starts_at <= now())) AND ((ends_at IS NULL) OR (ends_at > now()))));


--
-- Name: follows; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

--
-- Name: images; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

--
-- Name: likes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

--
-- Name: likes likes_delete_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY likes_delete_policy ON public.likes FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: likes likes_insert_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY likes_insert_policy ON public.likes FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: likes likes_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY likes_select_policy ON public.likes FOR SELECT USING (true);


--
-- Name: map_labels; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.map_labels ENABLE ROW LEVEL SECURITY;

--
-- Name: map_tags; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.map_tags ENABLE ROW LEVEL SECURITY;

--
-- Name: map_tags map_tags_delete_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY map_tags_delete_policy ON public.map_tags FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = map_tags.map_id) AND (maps.user_id = auth.uid())))));


--
-- Name: map_tags map_tags_insert_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY map_tags_insert_policy ON public.map_tags FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.maps
  WHERE ((maps.id = map_tags.map_id) AND (maps.user_id = auth.uid())))));


--
-- Name: map_tags map_tags_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY map_tags_select_policy ON public.map_tags FOR SELECT USING (true);


--
-- Name: maps; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.maps ENABLE ROW LEVEL SECURITY;

--
-- Name: master_spot_favorites; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.master_spot_favorites ENABLE ROW LEVEL SECURITY;

--
-- Name: master_spots; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.master_spots ENABLE ROW LEVEL SECURITY;

--
-- Name: notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: reports; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY schedules_update_own ON public.schedules FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: spot_tags; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.spot_tags ENABLE ROW LEVEL SECURITY;

--
-- Name: spot_tags spot_tags_delete_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY spot_tags_delete_policy ON public.spot_tags FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.user_spots
  WHERE ((user_spots.id = spot_tags.user_spot_id) AND (user_spots.user_id = auth.uid())))));


--
-- Name: spot_tags spot_tags_insert_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY spot_tags_insert_policy ON public.spot_tags FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.user_spots
  WHERE ((user_spots.id = spot_tags.user_spot_id) AND (user_spots.user_id = auth.uid())))));


--
-- Name: spot_tags spot_tags_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY spot_tags_select_policy ON public.spot_tags FOR SELECT USING (true);


--
-- Name: system_announcement_reads; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.system_announcement_reads ENABLE ROW LEVEL SECURITY;

--
-- Name: system_announcements; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.system_announcements ENABLE ROW LEVEL SECURITY;

--
-- Name: tags; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

--
-- Name: tags tags_insert_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tags_insert_policy ON public.tags FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: tags tags_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY tags_select_policy ON public.tags FOR SELECT USING (true);


--
-- Name: terms_agreements; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.terms_agreements ENABLE ROW LEVEL SECURITY;

--
-- Name: terms_agreements terms_agreements_insert_own_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY terms_agreements_insert_own_policy ON public.terms_agreements FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: terms_agreements terms_agreements_select_own_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY terms_agreements_select_own_policy ON public.terms_agreements FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: terms_versions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.terms_versions ENABLE ROW LEVEL SECURITY;

--
-- Name: terms_versions terms_versions_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY terms_versions_select_policy ON public.terms_versions FOR SELECT USING (true);


--
-- Name: transport_hubs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.transport_hubs ENABLE ROW LEVEL SECURITY;

--
-- Name: transport_hubs transport_hubs_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY transport_hubs_select_policy ON public.transport_hubs FOR SELECT USING (true);


--
-- Name: user_notification_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_notification_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: user_spots; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_spots ENABLE ROW LEVEL SECURITY;

--
-- Name: user_spots user_spots_insert_with_limit; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_spots_insert_with_limit ON public.user_spots FOR INSERT WITH CHECK (((auth.uid() = user_id) AND ((public.is_user_premium(auth.uid()) AND (public.count_user_spots_in_map(auth.uid(), map_id) < 100)) OR ((NOT public.is_user_premium(auth.uid())) AND (public.count_user_spots_in_map(auth.uid(), map_id) < 30)))));


--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: view_history; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.view_history ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict p5jzjG7S1j57xJrAorczlFPJTx1c01L2IeXkXEdsLofd4NbvbhQbTTeEvCIxhjW


-- ============================================================
-- 通知（notifications, user_notification_settings）
-- ============================================================
-- 通知機能とユーザーの通知設定
-- 最終更新: 2025-12-23

-- ============================================================
-- user_notification_settings（通知設定）
-- ============================================================

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

COMMENT ON COLUMN public.user_notification_settings.email_enabled IS 'メール通知のマスター設定';
COMMENT ON COLUMN public.user_notification_settings.email_like_enabled IS 'いいねのメール通知';
COMMENT ON COLUMN public.user_notification_settings.email_comment_enabled IS 'コメントのメール通知';
COMMENT ON COLUMN public.user_notification_settings.email_follow_enabled IS 'フォローのメール通知';
COMMENT ON COLUMN public.user_notification_settings.email_system_enabled IS 'システムのメール通知';

ALTER TABLE ONLY public.user_notification_settings ADD CONSTRAINT user_notification_settings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_notification_settings ADD CONSTRAINT user_notification_settings_user_id_key UNIQUE (user_id);
ALTER TABLE ONLY public.user_notification_settings ADD CONSTRAINT user_notification_settings_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

CREATE INDEX idx_user_notification_settings_user_id ON public.user_notification_settings USING btree (user_id);

ALTER TABLE public.user_notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own notification settings" ON public.user_notification_settings
    FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can update own notification settings" ON public.user_notification_settings
    FOR UPDATE USING ((auth.uid() = user_id));
CREATE POLICY "Users can view own notification settings" ON public.user_notification_settings
    FOR SELECT USING ((auth.uid() = user_id));

-- ============================================================
-- notifications（通知）
-- ============================================================

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    actor_id uuid,
    type text NOT NULL,
    user_spot_id uuid,
    map_id uuid,
    comment_id uuid,
    content text,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT notifications_type_id_check CHECK (
        (((type = ANY (ARRAY['like_spot'::text, 'comment_spot'::text])) AND (user_spot_id IS NOT NULL))
        OR ((type = ANY (ARRAY['like_map'::text, 'comment_map'::text])) AND (map_id IS NOT NULL))
        OR ((type = 'follow'::text) AND (actor_id IS NOT NULL))
        OR (type = 'system'::text))
    ),
    CONSTRAINT valid_notification_type CHECK (
        (type = ANY (ARRAY['like_spot'::text, 'like_map'::text, 'comment_spot'::text, 'comment_map'::text, 'follow'::text, 'system'::text]))
    )
);

ALTER TABLE ONLY public.notifications ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.notifications ADD CONSTRAINT notifications_actor_id_fkey
    FOREIGN KEY (actor_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.notifications ADD CONSTRAINT notifications_comment_id_fkey
    FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.notifications ADD CONSTRAINT notifications_map_id_fkey
    FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.notifications ADD CONSTRAINT notifications_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.notifications ADD CONSTRAINT notifications_user_spot_id_fkey
    FOREIGN KEY (user_spot_id) REFERENCES public.user_spots(id) ON DELETE CASCADE;

CREATE INDEX idx_notifications_actor_id ON public.notifications USING btree (actor_id);
CREATE INDEX idx_notifications_created_at ON public.notifications USING btree (user_id, created_at DESC);
CREATE INDEX idx_notifications_is_read ON public.notifications USING btree (user_id, is_read);
CREATE INDEX idx_notifications_type ON public.notifications USING btree (type);
CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);
CREATE INDEX idx_notifications_user_spot_id ON public.notifications USING btree (user_spot_id);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE USING ((auth.uid() = user_id));
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING ((auth.uid() = user_id));
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING ((auth.uid() = user_id));

-- ============================================================
-- 通知関連の関数
-- ============================================================

-- 通知設定を取得（なければ作成）
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

-- 通知設定を更新
CREATE FUNCTION public.update_notification_settings(
    p_push_enabled boolean DEFAULT NULL,
    p_like_enabled boolean DEFAULT NULL,
    p_comment_enabled boolean DEFAULT NULL,
    p_follow_enabled boolean DEFAULT NULL,
    p_system_enabled boolean DEFAULT NULL,
    p_email_enabled boolean DEFAULT NULL,
    p_email_like_enabled boolean DEFAULT NULL,
    p_email_comment_enabled boolean DEFAULT NULL,
    p_email_follow_enabled boolean DEFAULT NULL,
    p_email_system_enabled boolean DEFAULT NULL
) RETURNS public.user_notification_settings
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

-- 通知設定のupdated_atを更新
CREATE FUNCTION public.update_notification_settings_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- デフォルト通知設定を作成（ユーザー作成時に呼び出される）
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

-- ============================================================
-- 通知作成トリガー関数
-- ============================================================

-- マップへのコメント通知
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

-- スポットへのコメント通知
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

-- フォロー通知
CREATE FUNCTION public.create_follow_notification() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO notifications (user_id, actor_id, type)
  VALUES (NEW.followee_id, NEW.follower_id, 'follow');

  RETURN NEW;
END;
$$;

-- マップへのいいね通知
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

-- スポットへのいいね通知
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

-- プッシュ通知を送信（Edge Function呼び出し）
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

-- ============================================================
-- トリガー
-- ============================================================

CREATE TRIGGER trigger_update_notification_settings_updated_at
    BEFORE UPDATE ON public.user_notification_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_notification_settings_updated_at();

CREATE TRIGGER trigger_create_default_notification_settings
    AFTER INSERT ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.create_default_notification_settings();

CREATE TRIGGER on_follow_create_notification
    AFTER INSERT ON public.follows
    FOR EACH ROW EXECUTE FUNCTION public.create_follow_notification();

CREATE TRIGGER on_map_comment_create_notification
    AFTER INSERT ON public.comments
    FOR EACH ROW WHEN ((new.map_id IS NOT NULL))
    EXECUTE FUNCTION public.create_comment_map_notification();

CREATE TRIGGER on_map_like_create_notification
    AFTER INSERT ON public.likes
    FOR EACH ROW WHEN ((new.map_id IS NOT NULL))
    EXECUTE FUNCTION public.create_like_map_notification();

CREATE TRIGGER on_user_spot_comment_create_notification
    AFTER INSERT ON public.comments
    FOR EACH ROW WHEN ((new.user_spot_id IS NOT NULL))
    EXECUTE FUNCTION public.create_comment_spot_notification();

CREATE TRIGGER on_user_spot_like_create_notification
    AFTER INSERT ON public.likes
    FOR EACH ROW WHEN ((new.user_spot_id IS NOT NULL))
    EXECUTE FUNCTION public.create_like_spot_notification();

CREATE TRIGGER "send-notification"
    AFTER INSERT ON public.notifications
    FOR EACH ROW EXECUTE FUNCTION public.send_push_notification();

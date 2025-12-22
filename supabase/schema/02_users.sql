-- ============================================================
-- ユーザー関連
-- ============================================================
-- テーブル: users, follows, user_notification_settings
-- 最終更新: 2025-12-23
-- ソース: 000_initial_schema2.sql (pg_dump)

-- ============================================================
-- users (ユーザー)
-- ============================================================
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

COMMENT ON COLUMN public.users.username IS 'ユーザー名（@で表示される識別子）';
COMMENT ON COLUMN public.users.display_name IS '表示名（自由に設定できる名前）';

-- Primary Key & Unique
ALTER TABLE ONLY public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY public.users ADD CONSTRAINT users_username_key UNIQUE (username);

-- Indexes
CREATE UNIQUE INDEX users_username_idx ON public.users(username);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_is_premium ON public.users(is_premium);
CREATE INDEX idx_users_push_token ON public.users(push_token) WHERE push_token IS NOT NULL;
CREATE INDEX idx_users_username ON public.users(username);

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_select_all" ON public.users FOR SELECT USING (true);
CREATE POLICY "users_insert_own" ON public.users FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (id = auth.uid());

-- Trigger
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- follows (フォロー)
-- ============================================================
CREATE TABLE public.follows (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    follower_id uuid NOT NULL,
    followee_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Primary Key & Unique
ALTER TABLE ONLY public.follows ADD CONSTRAINT follows_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.follows ADD CONSTRAINT follows_follower_id_followee_id_key UNIQUE (follower_id, followee_id);

-- Foreign Keys
ALTER TABLE ONLY public.follows ADD CONSTRAINT follows_followee_id_fkey FOREIGN KEY (followee_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.follows ADD CONSTRAINT follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX idx_follows_followee_id ON public.follows(followee_id);
CREATE INDEX idx_follows_follower_id ON public.follows(follower_id);

-- RLS
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "follows_select_all" ON public.follows FOR SELECT USING (true);
CREATE POLICY "follows_insert_own" ON public.follows FOR INSERT WITH CHECK (follower_id = auth.uid());
CREATE POLICY "follows_delete_own" ON public.follows FOR DELETE USING (follower_id = auth.uid());

-- Trigger: フォロー通知
CREATE FUNCTION public.create_follow_notification() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO notifications (user_id, actor_id, type)
  VALUES (NEW.followee_id, NEW.follower_id, 'follow');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_follow_create_notification
    AFTER INSERT ON public.follows
    FOR EACH ROW EXECUTE FUNCTION public.create_follow_notification();

-- ============================================================
-- user_notification_settings (通知設定)
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

-- Primary Key & Unique
ALTER TABLE ONLY public.user_notification_settings ADD CONSTRAINT user_notification_settings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_notification_settings ADD CONSTRAINT user_notification_settings_user_id_key UNIQUE (user_id);

-- Foreign Keys
ALTER TABLE ONLY public.user_notification_settings ADD CONSTRAINT user_notification_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX idx_user_notification_settings_user_id ON public.user_notification_settings(user_id);

-- RLS
ALTER TABLE public.user_notification_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_notification_settings_select_own" ON public.user_notification_settings
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "user_notification_settings_insert_own" ON public.user_notification_settings
    FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_notification_settings_update_own" ON public.user_notification_settings
    FOR UPDATE USING (user_id = auth.uid());

-- Trigger: デフォルト通知設定の作成
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

CREATE TRIGGER trigger_create_default_notification_settings
    AFTER INSERT ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.create_default_notification_settings();

-- Trigger: updated_at
CREATE FUNCTION public.update_notification_settings_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_notification_settings_updated_at
    BEFORE UPDATE ON public.user_notification_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_notification_settings_updated_at();

-- ============================================================
-- RPC Functions
-- ============================================================

-- プレミアム会員チェック
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

-- プレミアム状態更新
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

-- 期限切れプレミアム無効化
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

-- 通知設定取得
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

-- 通知設定更新
CREATE FUNCTION public.update_notification_settings(
    p_push_enabled boolean DEFAULT NULL::boolean,
    p_like_enabled boolean DEFAULT NULL::boolean,
    p_comment_enabled boolean DEFAULT NULL::boolean,
    p_follow_enabled boolean DEFAULT NULL::boolean,
    p_system_enabled boolean DEFAULT NULL::boolean,
    p_email_enabled boolean DEFAULT NULL::boolean,
    p_email_like_enabled boolean DEFAULT NULL::boolean,
    p_email_comment_enabled boolean DEFAULT NULL::boolean,
    p_email_follow_enabled boolean DEFAULT NULL::boolean,
    p_email_system_enabled boolean DEFAULT NULL::boolean
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

-- プッシュトークン更新
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

-- プッシュトークンクリア
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

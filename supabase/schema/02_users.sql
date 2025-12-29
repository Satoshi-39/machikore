-- ============================================================
-- ユーザー（users, follows, visits, schedules, view_history, user_preferences）
-- ============================================================
-- ユーザー情報とユーザー間のリレーション
-- 最終更新: 2025-12-27

-- ============================================================
-- users（ユーザー）
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
    push_token_updated_at timestamp with time zone,
    -- デモグラフィック情報（任意、オンボーディングで収集）
    gender text,
    age_group text,
    country text,
    prefecture text
);

COMMENT ON COLUMN public.users.username IS 'ユーザー名（@で表示される識別子）';
COMMENT ON COLUMN public.users.display_name IS '表示名（自由に設定できる名前）';
COMMENT ON COLUMN public.users.gender IS '性別: male, female, other（任意）';
COMMENT ON COLUMN public.users.age_group IS '年代: 10s, 20s, 30s, 40s, 50s, 60s+（任意）';
COMMENT ON COLUMN public.users.country IS '居住国（ISO 3166-1 alpha-2）: jp, us, kr, etc.';
COMMENT ON COLUMN public.users.prefecture IS '居住地域（日本の場合は都道府県、他国の場合は州など）';

ALTER TABLE ONLY public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY public.users ADD CONSTRAINT users_username_key UNIQUE (username);
ALTER TABLE ONLY public.users ADD CONSTRAINT users_gender_check
    CHECK (gender IS NULL OR gender IN ('male', 'female', 'other'));
ALTER TABLE ONLY public.users ADD CONSTRAINT users_age_group_check
    CHECK (age_group IS NULL OR age_group IN ('10s', '20s', '30s', '40s', '50s', '60s+'));

CREATE INDEX idx_users_is_premium ON public.users USING btree (is_premium);
CREATE INDEX idx_users_push_token ON public.users USING btree (push_token) WHERE (push_token IS NOT NULL);

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_select_all ON public.users FOR SELECT USING (true);
CREATE POLICY users_insert_own ON public.users
    FOR INSERT TO authenticated WITH CHECK ((auth.uid() = id));
CREATE POLICY users_update_own ON public.users
    FOR UPDATE TO authenticated USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));

-- ============================================================
-- follows（フォロー関係）
-- ============================================================

CREATE TABLE public.follows (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    follower_id uuid NOT NULL,
    followee_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.follows ADD CONSTRAINT follows_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.follows ADD CONSTRAINT follows_follower_id_followee_id_key UNIQUE (follower_id, followee_id);
ALTER TABLE ONLY public.follows ADD CONSTRAINT follows_followee_id_fkey
    FOREIGN KEY (followee_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.follows ADD CONSTRAINT follows_follower_id_fkey
    FOREIGN KEY (follower_id) REFERENCES public.users(id) ON DELETE CASCADE;

CREATE INDEX idx_follows_followee_id ON public.follows USING btree (followee_id);
CREATE INDEX idx_follows_follower_id ON public.follows USING btree (follower_id);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY follows_select_all ON public.follows FOR SELECT USING (true);
CREATE POLICY follows_insert_own ON public.follows
    FOR INSERT TO authenticated WITH CHECK ((follower_id = auth.uid()));
CREATE POLICY follows_delete_own ON public.follows
    FOR DELETE TO authenticated USING ((follower_id = auth.uid()));

-- ============================================================
-- visits（訪問記録）
-- ============================================================

CREATE TABLE public.visits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    machi_id text NOT NULL,
    visited_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.visits IS 'ユーザーが訪問した街の記録（街ごとに1レコード、訪問有無のみ管理）';
COMMENT ON COLUMN public.visits.machi_id IS '訪問した街（駅）のID';
COMMENT ON COLUMN public.visits.visited_at IS '訪問した日時';

ALTER TABLE ONLY public.visits ADD CONSTRAINT visits_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.visits ADD CONSTRAINT visits_user_id_machi_id_key UNIQUE (user_id, machi_id);
ALTER TABLE ONLY public.visits ADD CONSTRAINT visits_machi_id_fkey
    FOREIGN KEY (machi_id) REFERENCES public.machi(id);
ALTER TABLE ONLY public.visits ADD CONSTRAINT visits_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

CREATE INDEX idx_visits_machi_id ON public.visits USING btree (machi_id);
CREATE INDEX idx_visits_user_id ON public.visits USING btree (user_id);
CREATE INDEX idx_visits_user_machi ON public.visits USING btree (user_id, machi_id);
CREATE INDEX idx_visits_visited_at ON public.visits USING btree (visited_at DESC);

-- ============================================================
-- schedules（予定）
-- ============================================================

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

COMMENT ON TABLE public.schedules IS 'ユーザーの予定（街への訪問予定など）';
COMMENT ON COLUMN public.schedules.id IS '予定ID';
COMMENT ON COLUMN public.schedules.user_id IS 'ユーザーID';
COMMENT ON COLUMN public.schedules.machi_id IS '街ID';
COMMENT ON COLUMN public.schedules.scheduled_at IS '予定日時';
COMMENT ON COLUMN public.schedules.title IS '予定タイトル';
COMMENT ON COLUMN public.schedules.memo IS 'メモ';
COMMENT ON COLUMN public.schedules.is_completed IS '完了済みかどうか';
COMMENT ON COLUMN public.schedules.completed_at IS '完了日時';

ALTER TABLE ONLY public.schedules ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.schedules ADD CONSTRAINT schedules_machi_id_fkey
    FOREIGN KEY (machi_id) REFERENCES public.machi(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.schedules ADD CONSTRAINT schedules_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

CREATE INDEX idx_schedules_machi_id ON public.schedules USING btree (machi_id);
CREATE INDEX idx_schedules_scheduled_at ON public.schedules USING btree (scheduled_at);
CREATE INDEX idx_schedules_user_id ON public.schedules USING btree (user_id);
CREATE INDEX idx_schedules_user_scheduled ON public.schedules USING btree (user_id, scheduled_at);

ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY schedules_delete_own ON public.schedules FOR DELETE USING ((auth.uid() = user_id));
CREATE POLICY schedules_insert_own ON public.schedules FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY schedules_select_own ON public.schedules FOR SELECT USING ((auth.uid() = user_id));
CREATE POLICY schedules_update_own ON public.schedules FOR UPDATE USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));

-- ============================================================
-- view_history（閲覧履歴）
-- ============================================================

CREATE TABLE public.view_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    map_id uuid NOT NULL,
    viewed_at timestamp with time zone DEFAULT now() NOT NULL,
    view_count integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.view_history IS '閲覧履歴（マップ）';
COMMENT ON COLUMN public.view_history.user_id IS '閲覧したユーザーID';
COMMENT ON COLUMN public.view_history.map_id IS '閲覧したマップID';
COMMENT ON COLUMN public.view_history.viewed_at IS '最終閲覧日時';
COMMENT ON COLUMN public.view_history.view_count IS '閲覧回数';

ALTER TABLE ONLY public.view_history ADD CONSTRAINT view_history_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.view_history ADD CONSTRAINT view_history_user_id_map_id_key UNIQUE (user_id, map_id);
-- 注意: mapsテーブルは03_maps.sqlで定義されるが、設計書として外部キーはここにまとめる
ALTER TABLE ONLY public.view_history ADD CONSTRAINT view_history_map_id_fkey
    FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.view_history ADD CONSTRAINT view_history_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

CREATE INDEX idx_view_history_map_id ON public.view_history USING btree (map_id);
CREATE INDEX idx_view_history_user_id ON public.view_history USING btree (user_id);
CREATE INDEX idx_view_history_user_viewed ON public.view_history USING btree (user_id, viewed_at DESC);

ALTER TABLE public.view_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY view_history_delete_own ON public.view_history
    FOR DELETE USING ((auth.uid() = user_id));
CREATE POLICY view_history_insert_own ON public.view_history
    FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY view_history_update_own ON public.view_history
    FOR UPDATE USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
CREATE POLICY view_history_select_own ON public.view_history
    FOR SELECT USING ((auth.uid() = user_id));

-- ============================================================
-- 閲覧履歴関連の関数とトリガー
-- ============================================================

-- 閲覧履歴を記録
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

-- 閲覧履歴を100件に制限するクリーンアップ関数
CREATE FUNCTION public.cleanup_old_view_history() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  history_count INTEGER;
BEGIN
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

COMMENT ON FUNCTION public.cleanup_old_view_history()
IS '閲覧履歴を100件に制限するクリーンアップ関数（閾値方式: 110件超で削除）';

CREATE TRIGGER trigger_cleanup_view_history
    AFTER INSERT OR UPDATE ON public.view_history
    FOR EACH ROW EXECUTE FUNCTION public.cleanup_old_view_history();

CREATE TRIGGER update_view_history_updated_at
    BEFORE UPDATE ON public.view_history
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- user_preferences（ユーザー設定）
-- ============================================================

CREATE TABLE public.user_preferences (
    user_id uuid NOT NULL,
    theme text DEFAULT 'system' NOT NULL,
    locale text DEFAULT 'system' NOT NULL,
    content_languages text[] DEFAULT ARRAY[]::text[],
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_preferences_theme_check CHECK ((theme = ANY (ARRAY['light'::text, 'dark'::text, 'system'::text]))),
    CONSTRAINT user_preferences_locale_check CHECK ((locale = ANY (ARRAY['ja'::text, 'en'::text, 'cn'::text, 'tw'::text, 'system'::text])))
);

COMMENT ON TABLE public.user_preferences IS 'ユーザーのアプリ設定（テーマ、言語など）';
COMMENT ON COLUMN public.user_preferences.theme IS 'テーマ設定: light, dark, system（デフォルト: system）';
COMMENT ON COLUMN public.user_preferences.locale IS 'UI言語設定: ja, en, cn, tw, system（デフォルト: system）';
COMMENT ON COLUMN public.user_preferences.content_languages IS 'コンテンツ言語フィルター: 見たい言語コードの配列（空配列=全言語表示）';

ALTER TABLE ONLY public.user_preferences ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (user_id);
ALTER TABLE ONLY public.user_preferences ADD CONSTRAINT user_preferences_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_preferences_select_own ON public.user_preferences
    FOR SELECT USING ((auth.uid() = user_id));
CREATE POLICY user_preferences_insert_own ON public.user_preferences
    FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY user_preferences_update_own ON public.user_preferences
    FOR UPDATE USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));

-- ============================================================
-- プレミアム関連関数
-- ============================================================
-- 注意: これらの関数はサーバーサイド（Edge Functions、cronジョブ）から
-- Service Role Key で呼び出されることを想定しています。
-- クライアントから直接呼び出されることはありません。
-- そのため、auth.uid() による認証チェックは行っていません。

-- ユーザーがプレミアムかどうかをチェック
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

COMMENT ON FUNCTION public.is_user_premium(uuid)
IS 'RLSポリシー内でスポット数制限の判定に使用（user_spots_insert_with_limit）。サーバーサイドから呼び出すため認証チェック不要。';

-- プレミアムステータスを更新
CREATE FUNCTION public.update_user_premium_status(
    p_user_id uuid,
    p_is_premium boolean,
    p_expires_at timestamp with time zone DEFAULT NULL
) RETURNS void
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

COMMENT ON FUNCTION public.update_user_premium_status(uuid, boolean, timestamp with time zone)
IS 'RevenueCat Webhook（Edge Function）から課金状態変更時に呼び出し。Service Role Keyで実行するため認証チェック不要。';

-- 期限切れのプレミアムサブスクリプションを無効化
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

COMMENT ON FUNCTION public.expire_premium_subscriptions()
IS 'cronジョブで定期実行し、期限切れユーザーのプレミアムを解除。Service Role Keyで実行するため認証チェック不要。';

-- ============================================================
-- プッシュトークン関連関数
-- ============================================================

-- プッシュトークンを更新
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

-- プッシュトークンをクリア
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

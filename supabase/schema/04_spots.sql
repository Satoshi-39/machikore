-- ============================================================
-- スポット（master_spots, user_spots, images, spot_tags, master_spot_favorites）
-- ============================================================
-- マスタースポット（場所情報）とユーザースポット（ユーザーの保存情報）
-- 最終更新: 2025-12-23

-- ============================================================
-- master_spots（マスタースポット）
-- ============================================================

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

ALTER TABLE ONLY public.master_spots ADD CONSTRAINT master_spots_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.master_spots ADD CONSTRAINT master_spots_google_place_id_key UNIQUE (google_place_id);
ALTER TABLE ONLY public.master_spots ADD CONSTRAINT master_spots_machi_id_fkey
    FOREIGN KEY (machi_id) REFERENCES public.machi(id) ON DELETE SET NULL;

CREATE INDEX idx_master_spots_google_place_id ON public.master_spots USING btree (google_place_id);
CREATE INDEX idx_master_spots_location ON public.master_spots USING btree (latitude, longitude);
CREATE INDEX idx_master_spots_machi_id ON public.master_spots USING btree (machi_id);
CREATE INDEX idx_master_spots_name ON public.master_spots USING btree (name);

CREATE TRIGGER update_master_spots_updated_at
    BEFORE UPDATE ON public.master_spots
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.master_spots ENABLE ROW LEVEL SECURITY;

CREATE POLICY master_spots_select_all ON public.master_spots FOR SELECT USING (true);
CREATE POLICY master_spots_insert_authenticated ON public.master_spots
    FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================
-- master_spot_favorites（マスタースポットお気に入り）
-- ============================================================

CREATE TABLE public.master_spot_favorites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    master_spot_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.master_spot_favorites ADD CONSTRAINT master_spot_favorites_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.master_spot_favorites ADD CONSTRAINT master_spot_favorites_user_id_master_spot_id_key
    UNIQUE (user_id, master_spot_id);
ALTER TABLE ONLY public.master_spot_favorites ADD CONSTRAINT master_spot_favorites_master_spot_id_fkey
    FOREIGN KEY (master_spot_id) REFERENCES public.master_spots(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.master_spot_favorites ADD CONSTRAINT master_spot_favorites_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

CREATE INDEX idx_master_spot_favorites_master_spot_id ON public.master_spot_favorites USING btree (master_spot_id);
CREATE INDEX idx_master_spot_favorites_user_id ON public.master_spot_favorites USING btree (user_id);

ALTER TABLE public.master_spot_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY master_spot_favorites_delete_own ON public.master_spot_favorites
    FOR DELETE USING ((auth.uid() = user_id));
CREATE POLICY master_spot_favorites_insert_own ON public.master_spot_favorites
    FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY master_spot_favorites_select_own ON public.master_spot_favorites
    FOR SELECT USING ((auth.uid() = user_id));

-- ============================================================
-- user_spots（ユーザースポット）
-- ============================================================

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

COMMENT ON COLUMN public.user_spots.images_count IS '画像数（デフォルト: 0）';
COMMENT ON COLUMN public.user_spots.likes_count IS 'いいね数（デフォルト: 0）';
COMMENT ON COLUMN public.user_spots.comments_count IS 'コメント数（デフォルト: 0）';
COMMENT ON COLUMN public.user_spots.order_index IS '表示順序（デフォルト: 0）';
COMMENT ON COLUMN public.user_spots.article_content IS 'マップ記事用のスポット紹介文（ProseMirror JSON形式）';
COMMENT ON COLUMN public.user_spots.bookmarks_count IS 'ブックマーク数（デフォルト: 0）';
COMMENT ON COLUMN public.user_spots.prefecture_id IS '都道府県ID（prefectures.id）。都道府県別検索の高速化のため非正規化';
COMMENT ON COLUMN public.user_spots.color IS 'スポットの色（pink, red, orange, yellow, green, blue, purple, gray, white）';
COMMENT ON COLUMN public.user_spots.spot_color IS 'スポットの色（pink, red, orange, yellow, green, blue, purple, gray, white）';
COMMENT ON COLUMN public.user_spots.label_id IS 'スポットのラベル（map_labelsへの外部キー）';

ALTER TABLE ONLY public.user_spots ADD CONSTRAINT user_spots_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_spots ADD CONSTRAINT user_spots_user_id_map_id_master_spot_id_key
    UNIQUE (user_id, map_id, master_spot_id);
ALTER TABLE ONLY public.user_spots ADD CONSTRAINT user_spots_city_id_fkey
    FOREIGN KEY (city_id) REFERENCES public.cities(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.user_spots ADD CONSTRAINT user_spots_label_id_fkey
    FOREIGN KEY (label_id) REFERENCES public.map_labels(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.user_spots ADD CONSTRAINT user_spots_machi_id_fkey
    FOREIGN KEY (machi_id) REFERENCES public.machi(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.user_spots ADD CONSTRAINT user_spots_map_id_fkey
    FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.user_spots ADD CONSTRAINT user_spots_master_spot_id_fkey
    FOREIGN KEY (master_spot_id) REFERENCES public.master_spots(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.user_spots ADD CONSTRAINT user_spots_prefecture_id_fkey
    FOREIGN KEY (prefecture_id) REFERENCES public.prefectures(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.user_spots ADD CONSTRAINT user_spots_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

CREATE INDEX idx_user_spots_bookmarks_count ON public.user_spots USING btree (bookmarks_count DESC);
CREATE INDEX idx_user_spots_city_id ON public.user_spots USING btree (city_id);
CREATE INDEX idx_user_spots_created_at ON public.user_spots USING btree (created_at DESC);
CREATE INDEX idx_user_spots_label_id ON public.user_spots USING btree (label_id);
CREATE INDEX idx_user_spots_machi_id ON public.user_spots USING btree (machi_id);
CREATE INDEX idx_user_spots_map_id ON public.user_spots USING btree (map_id);
CREATE INDEX idx_user_spots_master_spot_id ON public.user_spots USING btree (master_spot_id);
CREATE INDEX idx_user_spots_prefecture_id ON public.user_spots USING btree (prefecture_id);
CREATE INDEX idx_user_spots_prefecture_map ON public.user_spots USING btree (prefecture_id, map_id);
CREATE INDEX idx_user_spots_user_id ON public.user_spots USING btree (user_id);

CREATE TRIGGER update_user_spots_updated_at
    BEFORE UPDATE ON public.user_spots
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.user_spots ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_spots_select_public_or_own ON public.user_spots
    FOR SELECT USING ((EXISTS ( SELECT 1 FROM public.maps WHERE ((maps.id = user_spots.map_id) AND ((maps.is_public = true) OR (maps.user_id = auth.uid()))))));
CREATE POLICY user_spots_insert_own ON public.user_spots
    FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1 FROM public.maps WHERE ((maps.id = user_spots.map_id) AND (maps.user_id = auth.uid())))));
CREATE POLICY user_spots_delete_own ON public.user_spots
    FOR DELETE TO authenticated USING ((user_id = auth.uid()));
CREATE POLICY user_spots_update_own ON public.user_spots
    FOR UPDATE TO authenticated USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));
CREATE POLICY user_spots_insert_with_limit ON public.user_spots
    FOR INSERT WITH CHECK (((auth.uid() = user_id) AND ((public.is_user_premium(auth.uid()) AND (public.count_user_spots_in_map(auth.uid(), map_id) < 100)) OR ((NOT public.is_user_premium(auth.uid())) AND (public.count_user_spots_in_map(auth.uid(), map_id) < 30)))));

-- ============================================================
-- images（スポット画像）
-- ============================================================

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

ALTER TABLE ONLY public.images ADD CONSTRAINT images_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.images ADD CONSTRAINT images_user_spot_id_fkey
    FOREIGN KEY (user_spot_id) REFERENCES public.user_spots(id) ON DELETE CASCADE;

CREATE INDEX idx_images_user_spot_id ON public.images USING btree (user_spot_id);

ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

CREATE POLICY images_select_public_or_own ON public.images
    FOR SELECT USING ((EXISTS ( SELECT 1 FROM public.user_spots us JOIN public.maps m ON ((m.id = us.map_id)) WHERE ((us.id = images.user_spot_id) AND ((m.is_public = true) OR (m.user_id = auth.uid()))))));
CREATE POLICY images_insert_own ON public.images
    FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1 FROM public.user_spots us WHERE ((us.id = images.user_spot_id) AND (us.user_id = auth.uid())))));
CREATE POLICY images_delete_own ON public.images
    FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1 FROM public.user_spots us WHERE ((us.id = images.user_spot_id) AND (us.user_id = auth.uid())))));

-- ============================================================
-- spot_tags（スポットとタグの中間テーブル）
-- ============================================================

CREATE TABLE public.spot_tags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_spot_id uuid NOT NULL,
    tag_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.spot_tags ADD CONSTRAINT spot_tags_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.spot_tags ADD CONSTRAINT spot_tags_user_spot_id_tag_id_key UNIQUE (user_spot_id, tag_id);
ALTER TABLE ONLY public.spot_tags ADD CONSTRAINT spot_tags_tag_id_fkey
    FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.spot_tags ADD CONSTRAINT spot_tags_user_spot_id_fkey
    FOREIGN KEY (user_spot_id) REFERENCES public.user_spots(id) ON DELETE CASCADE;

CREATE INDEX idx_spot_tags_tag_id ON public.spot_tags USING btree (tag_id);
CREATE INDEX idx_spot_tags_user_spot_id ON public.spot_tags USING btree (user_spot_id);

ALTER TABLE public.spot_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY spot_tags_delete_own ON public.spot_tags
    FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1 FROM public.user_spots WHERE ((user_spots.id = spot_tags.user_spot_id) AND (user_spots.user_id = auth.uid())))));
CREATE POLICY spot_tags_insert_own ON public.spot_tags
    FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1 FROM public.user_spots WHERE ((user_spots.id = spot_tags.user_spot_id) AND (user_spots.user_id = auth.uid())))));
CREATE POLICY spot_tags_select_all ON public.spot_tags FOR SELECT USING (true);

-- ============================================================
-- スポット関連のトリガー関数
-- ============================================================

-- スポット数制限チェック（INSERT時）
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

-- スポット数制限チェック（UPDATE時）
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

-- スポット数をカウントする関数
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

-- 画像数カウンター更新関数
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

-- master_spots.favorites_count を更新するトリガー関数
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

-- tags.usage_count を更新するトリガー関数（spot_tags用）
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

-- ============================================================
-- スポット関連のトリガー
-- ============================================================

CREATE TRIGGER enforce_spots_limit
    BEFORE INSERT ON public.user_spots
    FOR EACH ROW EXECUTE FUNCTION public.check_spots_limit();

CREATE TRIGGER enforce_spots_limit_on_update
    BEFORE UPDATE ON public.user_spots
    FOR EACH ROW EXECUTE FUNCTION public.check_spots_limit_on_update();

CREATE TRIGGER trigger_update_map_spots_count
    AFTER INSERT OR DELETE ON public.user_spots
    FOR EACH ROW EXECUTE FUNCTION public.update_map_spots_count();

CREATE TRIGGER trigger_update_images_count
    AFTER INSERT OR DELETE ON public.images
    FOR EACH ROW EXECUTE FUNCTION public.update_images_count();

CREATE TRIGGER trigger_update_master_spot_favorites_count
    AFTER INSERT OR DELETE ON public.master_spot_favorites
    FOR EACH ROW EXECUTE FUNCTION public.update_master_spot_favorites_count();

CREATE TRIGGER update_tag_usage_count_for_spots_trigger
    AFTER INSERT OR DELETE ON public.spot_tags
    FOR EACH ROW EXECUTE FUNCTION public.update_tag_usage_count_for_spots();

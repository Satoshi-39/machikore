-- ============================================================
-- マップ（maps, categories, tags, map_tags, map_labels）
-- ============================================================
-- ユーザーが作成するマップとその関連テーブル
-- 最終更新: 2025-12-23

-- ============================================================
-- categories（カテゴリ）
-- ============================================================

CREATE TABLE public.categories (
    id text NOT NULL,
    name text NOT NULL,
    name_translations jsonb,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.categories IS 'マップカテゴリ（グルメ、旅行など）。idはURL用のslugとしても使用。';

ALTER TABLE ONLY public.categories ADD CONSTRAINT categories_pkey PRIMARY KEY (id);

CREATE INDEX idx_categories_display_order ON public.categories USING btree (display_order);
CREATE INDEX idx_categories_is_active ON public.categories USING btree (is_active);

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY categories_select_policy ON public.categories FOR SELECT USING (true);

-- ============================================================
-- tags（タグ）
-- ============================================================

CREATE TABLE public.tags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    name_translations jsonb,
    slug text NOT NULL,
    usage_count integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.tags ADD CONSTRAINT tags_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.tags ADD CONSTRAINT tags_name_key UNIQUE (name);
ALTER TABLE ONLY public.tags ADD CONSTRAINT tags_slug_key UNIQUE (slug);

CREATE INDEX idx_tags_name ON public.tags USING btree (name);
CREATE INDEX idx_tags_slug ON public.tags USING btree (slug);
CREATE INDEX idx_tags_usage_count ON public.tags USING btree (usage_count DESC);

CREATE TRIGGER update_tags_updated_at
    BEFORE UPDATE ON public.tags
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY tags_insert_policy ON public.tags FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY tags_select_policy ON public.tags FOR SELECT USING (true);

-- ============================================================
-- maps（マップ）
-- ============================================================

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
    show_label_chips boolean DEFAULT false
);

COMMENT ON COLUMN public.maps.is_public IS 'マップが公開されているかどうか（デフォルト: false）';
COMMENT ON COLUMN public.maps.is_official IS '公式マップかどうか（デフォルト: false）';
COMMENT ON COLUMN public.maps.spots_count IS 'スポット数（デフォルト: 0）';
COMMENT ON COLUMN public.maps.likes_count IS 'いいね数（デフォルト: 0）';
COMMENT ON COLUMN public.maps.comments_count IS 'コメント数（デフォルト: 0）';
COMMENT ON COLUMN public.maps.is_article_public IS '記事が公開されているかどうか（デフォルト: false）';
COMMENT ON COLUMN public.maps.bookmarks_count IS 'ブックマーク数（デフォルト: 0）';
COMMENT ON COLUMN public.maps.category_id IS 'カテゴリへの外部キー参照';
COMMENT ON COLUMN public.maps.article_intro IS 'マップ記事のまえがき（ProseMirror JSON形式）';
COMMENT ON COLUMN public.maps.article_outro IS 'マップ記事のあとがき（ProseMirror JSON形式）';
COMMENT ON COLUMN public.maps.show_label_chips IS 'ラベルチップをマップ上部に表示するかどうか';

ALTER TABLE ONLY public.maps ADD CONSTRAINT maps_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.maps ADD CONSTRAINT maps_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.maps ADD CONSTRAINT maps_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES public.categories(id);

CREATE INDEX idx_maps_bookmarks_count ON public.maps USING btree (bookmarks_count DESC);
CREATE INDEX idx_maps_category_id ON public.maps USING btree (category_id);
CREATE INDEX idx_maps_created_at ON public.maps USING btree (created_at DESC);
CREATE INDEX idx_maps_is_article_public ON public.maps USING btree (is_article_public);
CREATE INDEX idx_maps_is_public ON public.maps USING btree (is_public);
CREATE INDEX idx_maps_user_id ON public.maps USING btree (user_id);

CREATE TRIGGER update_maps_updated_at
    BEFORE UPDATE ON public.maps
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.maps ENABLE ROW LEVEL SECURITY;

CREATE POLICY maps_select_public_or_own ON public.maps
    FOR SELECT USING (((is_public = true) OR ((auth.uid() IS NOT NULL) AND (user_id = auth.uid()))));
CREATE POLICY maps_insert_own ON public.maps
    FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));
CREATE POLICY maps_delete_own ON public.maps
    FOR DELETE TO authenticated USING ((user_id = auth.uid()));
CREATE POLICY maps_update_own ON public.maps
    FOR UPDATE TO authenticated USING ((user_id = auth.uid()));

-- view_history の外部キーを追加
ALTER TABLE ONLY public.view_history ADD CONSTRAINT view_history_map_id_fkey
    FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.view_history ADD CONSTRAINT view_history_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- ============================================================
-- map_tags（マップとタグの中間テーブル）
-- ============================================================

CREATE TABLE public.map_tags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    map_id uuid NOT NULL,
    tag_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.map_tags ADD CONSTRAINT map_tags_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.map_tags ADD CONSTRAINT map_tags_map_id_tag_id_key UNIQUE (map_id, tag_id);
ALTER TABLE ONLY public.map_tags ADD CONSTRAINT map_tags_map_id_fkey
    FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.map_tags ADD CONSTRAINT map_tags_tag_id_fkey
    FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;

CREATE INDEX idx_map_tags_map_id ON public.map_tags USING btree (map_id);
CREATE INDEX idx_map_tags_tag_id ON public.map_tags USING btree (tag_id);

ALTER TABLE public.map_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY map_tags_delete_own ON public.map_tags
    FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1 FROM public.maps WHERE ((maps.id = map_tags.map_id) AND (maps.user_id = auth.uid())))));
CREATE POLICY map_tags_insert_own ON public.map_tags
    FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1 FROM public.maps WHERE ((maps.id = map_tags.map_id) AND (maps.user_id = auth.uid())))));
CREATE POLICY map_tags_select_all ON public.map_tags FOR SELECT USING (true);

-- ============================================================
-- map_labels（マップラベル）
-- ============================================================

CREATE TABLE public.map_labels (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    map_id uuid NOT NULL,
    name text NOT NULL,
    color text DEFAULT 'blue'::text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.map_labels IS 'マップごとのラベル定義（スポットの種類分け用）';
COMMENT ON COLUMN public.map_labels.name IS 'ラベル名（例: ドトール、スタバ）';
COMMENT ON COLUMN public.map_labels.color IS 'ラベルの色（pink, red, orange, yellow, green, blue, purple, gray, white）';
COMMENT ON COLUMN public.map_labels.sort_order IS '表示順';

ALTER TABLE ONLY public.map_labels ADD CONSTRAINT map_labels_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.map_labels ADD CONSTRAINT map_labels_map_id_name_key UNIQUE (map_id, name);
ALTER TABLE ONLY public.map_labels ADD CONSTRAINT map_labels_map_id_fkey
    FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;

CREATE INDEX idx_map_labels_map_id ON public.map_labels USING btree (map_id);

CREATE TRIGGER update_map_labels_updated_at
    BEFORE UPDATE ON public.map_labels
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.map_labels ENABLE ROW LEVEL SECURITY;

CREATE POLICY map_labels_select_public_or_own ON public.map_labels
    FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1 FROM public.maps WHERE ((maps.id = map_labels.map_id) AND ((maps.is_public = true) OR (maps.user_id = auth.uid()))))));
CREATE POLICY map_labels_insert_own ON public.map_labels
    FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1 FROM public.maps WHERE ((maps.id = map_labels.map_id) AND (maps.user_id = auth.uid())))));
CREATE POLICY map_labels_delete_own ON public.map_labels
    FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1 FROM public.maps WHERE ((maps.id = map_labels.map_id) AND (maps.user_id = auth.uid())))));
CREATE POLICY map_labels_update_own ON public.map_labels
    FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1 FROM public.maps WHERE ((maps.id = map_labels.map_id) AND (maps.user_id = auth.uid())))));

-- ============================================================
-- カウンター更新トリガー関数
-- ============================================================

-- maps.spots_count を更新するトリガー関数
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

-- tags.usage_count を更新するトリガー関数（map_tags用）
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

CREATE TRIGGER update_tag_usage_count_trigger
    AFTER INSERT OR DELETE ON public.map_tags
    FOR EACH ROW EXECUTE FUNCTION public.update_tag_usage_count();

-- ============================================================
-- カテゴリ別人気タグ取得関数
-- ============================================================

CREATE FUNCTION public.get_popular_tags_by_category(p_category_id uuid, p_limit integer DEFAULT 10)
RETURNS TABLE(id uuid, name text, name_translations jsonb, is_official boolean, usage_count bigint, created_at timestamp with time zone, updated_at timestamp with time zone)
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

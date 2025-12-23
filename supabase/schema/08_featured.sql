-- ============================================================
-- おすすめ（featured_carousel_items, category_featured_maps, category_featured_tags, system_announcements）
-- ============================================================
-- おすすめマップ、タグ、カルーセル、お知らせ
-- 最終更新: 2025-12-23

-- ============================================================
-- featured_carousel_items（特集カルーセル）
-- ============================================================

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

COMMENT ON TABLE public.featured_carousel_items IS '発見タブの特集カルーセルに表示するバナーコンテンツ';
COMMENT ON COLUMN public.featured_carousel_items.title IS '表示タイトル';
COMMENT ON COLUMN public.featured_carousel_items.description IS 'サブタイトル・説明';
COMMENT ON COLUMN public.featured_carousel_items.image_url IS 'バナー画像URL';
COMMENT ON COLUMN public.featured_carousel_items.link_type IS 'リンク種別（tag/map/user/url）';
COMMENT ON COLUMN public.featured_carousel_items.link_value IS 'リンク先の値';
COMMENT ON COLUMN public.featured_carousel_items.display_order IS '表示順（小さい順）';
COMMENT ON COLUMN public.featured_carousel_items.is_active IS '公開フラグ';
COMMENT ON COLUMN public.featured_carousel_items.starts_at IS '表示開始日時';
COMMENT ON COLUMN public.featured_carousel_items.ends_at IS '表示終了日時';
COMMENT ON COLUMN public.featured_carousel_items.category_id IS 'カテゴリID（NULLの場合は「すべて」カテゴリで表示）';

ALTER TABLE ONLY public.featured_carousel_items ADD CONSTRAINT featured_carousel_items_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.featured_carousel_items ADD CONSTRAINT featured_carousel_items_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;

CREATE INDEX idx_featured_carousel_items_active_order ON public.featured_carousel_items USING btree (is_active, display_order) WHERE (is_active = true);
CREATE INDEX idx_featured_carousel_items_category ON public.featured_carousel_items USING btree (category_id);

CREATE TRIGGER update_featured_carousel_items_updated_at
    BEFORE UPDATE ON public.featured_carousel_items
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.featured_carousel_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY featured_carousel_items_select_policy ON public.featured_carousel_items
    FOR SELECT TO authenticated, anon USING (((is_active = true) AND ((starts_at IS NULL) OR (starts_at <= now())) AND ((ends_at IS NULL) OR (ends_at > now()))));

-- ============================================================
-- category_featured_maps（カテゴリ別おすすめマップ）
-- ============================================================

CREATE TABLE public.category_featured_maps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id text NOT NULL,
    map_id uuid NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.category_featured_maps IS 'カテゴリ別おすすめマップ（運営選定）';
COMMENT ON COLUMN public.category_featured_maps.category_id IS 'カテゴリID';
COMMENT ON COLUMN public.category_featured_maps.map_id IS 'マップID';
COMMENT ON COLUMN public.category_featured_maps.display_order IS '表示順序（小さい順）';
COMMENT ON COLUMN public.category_featured_maps.is_active IS '有効フラグ';

ALTER TABLE ONLY public.category_featured_maps ADD CONSTRAINT category_featured_maps_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.category_featured_maps ADD CONSTRAINT category_featured_maps_category_id_map_id_key
    UNIQUE (category_id, map_id);
ALTER TABLE ONLY public.category_featured_maps ADD CONSTRAINT category_featured_maps_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.category_featured_maps ADD CONSTRAINT category_featured_maps_map_id_fkey
    FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;

CREATE INDEX idx_category_featured_maps_active ON public.category_featured_maps USING btree (is_active) WHERE (is_active = true);
CREATE INDEX idx_category_featured_maps_category ON public.category_featured_maps USING btree (category_id);

CREATE TRIGGER update_category_featured_maps_updated_at
    BEFORE UPDATE ON public.category_featured_maps
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.category_featured_maps ENABLE ROW LEVEL SECURITY;

CREATE POLICY category_featured_maps_select_policy ON public.category_featured_maps FOR SELECT USING ((is_active = true));

-- ============================================================
-- category_featured_tags（カテゴリ別おすすめタグ）
-- ============================================================

CREATE TABLE public.category_featured_tags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id text NOT NULL,
    tag_id uuid NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.category_featured_tags IS 'カテゴリ別おすすめタグ（運営選定）';
COMMENT ON COLUMN public.category_featured_tags.category_id IS 'カテゴリID';
COMMENT ON COLUMN public.category_featured_tags.tag_id IS 'タグID';
COMMENT ON COLUMN public.category_featured_tags.display_order IS '表示順序（小さい順）';
COMMENT ON COLUMN public.category_featured_tags.is_active IS '有効フラグ';

ALTER TABLE ONLY public.category_featured_tags ADD CONSTRAINT category_featured_tags_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.category_featured_tags ADD CONSTRAINT category_featured_tags_category_id_tag_id_key
    UNIQUE (category_id, tag_id);
ALTER TABLE ONLY public.category_featured_tags ADD CONSTRAINT category_featured_tags_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.category_featured_tags ADD CONSTRAINT category_featured_tags_tag_id_fkey
    FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;

CREATE INDEX idx_category_featured_tags_active ON public.category_featured_tags USING btree (is_active) WHERE (is_active = true);
CREATE INDEX idx_category_featured_tags_category ON public.category_featured_tags USING btree (category_id);

CREATE TRIGGER update_category_featured_tags_updated_at
    BEFORE UPDATE ON public.category_featured_tags
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.category_featured_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY category_featured_tags_select_policy ON public.category_featured_tags FOR SELECT USING ((is_active = true));

-- ============================================================
-- system_announcements（システムお知らせ）
-- ============================================================

CREATE TABLE public.system_announcements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    type text DEFAULT 'info'::text,
    is_active boolean DEFAULT true,
    published_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.system_announcements ADD CONSTRAINT system_announcements_pkey PRIMARY KEY (id);

CREATE INDEX idx_system_announcements_published ON public.system_announcements USING btree (is_active, published_at DESC);

ALTER TABLE public.system_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active announcements" ON public.system_announcements
    FOR SELECT USING (((is_active = true) AND ((expires_at IS NULL) OR (expires_at > now()))));

-- ============================================================
-- system_announcement_reads（お知らせ既読管理）
-- ============================================================

CREATE TABLE public.system_announcement_reads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    announcement_id uuid NOT NULL,
    read_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.system_announcement_reads ADD CONSTRAINT user_announcement_reads_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.system_announcement_reads ADD CONSTRAINT user_announcement_reads_user_id_announcement_id_key
    UNIQUE (user_id, announcement_id);
ALTER TABLE ONLY public.system_announcement_reads ADD CONSTRAINT user_announcement_reads_announcement_id_fkey
    FOREIGN KEY (announcement_id) REFERENCES public.system_announcements(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.system_announcement_reads ADD CONSTRAINT user_announcement_reads_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.system_announcement_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can delete own announcement reads" ON public.system_announcement_reads
    FOR DELETE USING ((auth.uid() = user_id));
CREATE POLICY "Users can insert own announcement reads" ON public.system_announcement_reads
    FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can view own announcement reads" ON public.system_announcement_reads
    FOR SELECT USING ((auth.uid() = user_id));

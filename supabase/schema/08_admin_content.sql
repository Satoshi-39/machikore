-- ============================================================
-- 管理コンテンツ（featured_items, magazines, category_featured_maps, category_featured_tags, system_announcements）
-- ============================================================
-- 運営が管理するおすすめコンテンツとお知らせ
-- 最終更新: 2025-01-15

-- ============================================================
-- Enum Types
-- ============================================================

CREATE TYPE public.featured_link_type AS ENUM ('url', 'magazine');
CREATE TYPE public.featured_source_type AS ENUM ('tag', 'manual');

-- ============================================================
-- magazines（マガジン）
-- ============================================================

CREATE TABLE public.magazines (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    title text NOT NULL,
    description text,
    thumbnail_url text,
    published_at timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.magazines IS 'マガジン（特集記事）';
COMMENT ON COLUMN public.magazines.name IS 'マガジン名（ヘッダー表示用）';
COMMENT ON COLUMN public.magazines.title IS 'タイトル（サムネイル下に大きく表示）';
COMMENT ON COLUMN public.magazines.description IS '説明文';
COMMENT ON COLUMN public.magazines.thumbnail_url IS 'サムネイル画像URL';
COMMENT ON COLUMN public.magazines.published_at IS '公開日時';
COMMENT ON COLUMN public.magazines.is_active IS '公開フラグ';

ALTER TABLE ONLY public.magazines ADD CONSTRAINT magazines_pkey PRIMARY KEY (id);

CREATE INDEX idx_magazines_active ON public.magazines USING btree (is_active, published_at DESC) WHERE (is_active = true);

CREATE TRIGGER update_magazines_updated_at
    BEFORE UPDATE ON public.magazines
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.magazines ENABLE ROW LEVEL SECURITY;

CREATE POLICY magazines_select_active ON public.magazines
    FOR SELECT TO authenticated, anon USING (is_active = true);

-- ============================================================
-- magazine_sections（マガジン内のセクション）
-- ============================================================

CREATE TABLE public.magazine_sections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    magazine_id uuid NOT NULL,
    name text NOT NULL,
    title text,
    description text,
    thumbnail_url text,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.magazine_sections IS 'マガジン内のセクション（カテゴリ分け用）';
COMMENT ON COLUMN public.magazine_sections.magazine_id IS 'マガジンID';
COMMENT ON COLUMN public.magazine_sections.name IS 'セクション名（ヘッダー表示用）';
COMMENT ON COLUMN public.magazine_sections.title IS 'タイトル（大きく表示）';
COMMENT ON COLUMN public.magazine_sections.description IS '説明文（任意）';
COMMENT ON COLUMN public.magazine_sections.thumbnail_url IS 'セクションのサムネイル画像URL';
COMMENT ON COLUMN public.magazine_sections.display_order IS '表示順序（小さい順）';
COMMENT ON COLUMN public.magazine_sections.is_active IS '有効フラグ';

ALTER TABLE ONLY public.magazine_sections ADD CONSTRAINT magazine_sections_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.magazine_sections ADD CONSTRAINT magazine_sections_magazine_id_fkey
    FOREIGN KEY (magazine_id) REFERENCES public.magazines(id) ON DELETE CASCADE;

CREATE INDEX idx_magazine_sections_magazine ON public.magazine_sections USING btree (magazine_id);
CREATE INDEX idx_magazine_sections_active ON public.magazine_sections USING btree (is_active) WHERE (is_active = true);

CREATE TRIGGER update_magazine_sections_updated_at
    BEFORE UPDATE ON public.magazine_sections
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.magazine_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY magazine_sections_select_active ON public.magazine_sections
    FOR SELECT TO authenticated, anon USING (is_active = true);

-- ============================================================
-- magazine_maps（マガジンに紐づくマップ）
-- ============================================================

CREATE TABLE public.magazine_maps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    magazine_id uuid NOT NULL,
    map_id uuid NOT NULL,
    section_id uuid,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    source_type public.featured_source_type DEFAULT 'manual' NOT NULL,
    source_tag text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.magazine_maps IS 'マガジンに紐づくマップ';
COMMENT ON COLUMN public.magazine_maps.magazine_id IS 'マガジンID';
COMMENT ON COLUMN public.magazine_maps.map_id IS 'マップID';
COMMENT ON COLUMN public.magazine_maps.section_id IS 'セクションID（NULLの場合はセクションなし）';
COMMENT ON COLUMN public.magazine_maps.display_order IS '表示順序（小さい順）';
COMMENT ON COLUMN public.magazine_maps.is_active IS '有効フラグ';
COMMENT ON COLUMN public.magazine_maps.source_type IS '登録元タイプ: tag=タグ一括登録, manual=手動登録';
COMMENT ON COLUMN public.magazine_maps.source_tag IS 'タグ一括登録時のタグ名（source_type=tagの場合のみ）';

ALTER TABLE ONLY public.magazine_maps ADD CONSTRAINT magazine_maps_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.magazine_maps ADD CONSTRAINT magazine_maps_magazine_id_map_id_key
    UNIQUE (magazine_id, map_id);
ALTER TABLE ONLY public.magazine_maps ADD CONSTRAINT magazine_maps_magazine_id_fkey
    FOREIGN KEY (magazine_id) REFERENCES public.magazines(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.magazine_maps ADD CONSTRAINT magazine_maps_map_id_fkey
    FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.magazine_maps ADD CONSTRAINT magazine_maps_section_id_fkey
    FOREIGN KEY (section_id) REFERENCES public.magazine_sections(id) ON DELETE SET NULL;

CREATE INDEX idx_magazine_maps_magazine ON public.magazine_maps USING btree (magazine_id);
CREATE INDEX idx_magazine_maps_section ON public.magazine_maps USING btree (section_id);
CREATE INDEX idx_magazine_maps_active ON public.magazine_maps USING btree (is_active) WHERE (is_active = true);

CREATE TRIGGER update_magazine_maps_updated_at
    BEFORE UPDATE ON public.magazine_maps
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.magazine_maps ENABLE ROW LEVEL SECURITY;

CREATE POLICY magazine_maps_select_active ON public.magazine_maps
    FOR SELECT TO authenticated, anon USING (is_active = true);

-- ============================================================
-- featured_items（特集アイテム）
-- ============================================================

CREATE TABLE public.featured_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    image_url text NOT NULL,
    link_type public.featured_link_type DEFAULT 'magazine' NOT NULL,
    link_value text,
    magazine_id uuid,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    starts_at timestamp with time zone,
    ends_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    category_id text
);

COMMENT ON TABLE public.featured_items IS '特集アイテム（カルーセルバナー等）';
COMMENT ON COLUMN public.featured_items.title IS '表示タイトル';
COMMENT ON COLUMN public.featured_items.description IS 'サブタイトル・説明';
COMMENT ON COLUMN public.featured_items.image_url IS 'バナー画像URL';
COMMENT ON COLUMN public.featured_items.link_type IS 'リンクタイプ: url=外部リンク, magazine=マガジンページ';
COMMENT ON COLUMN public.featured_items.link_value IS 'リンク先の値（link_type=urlの場合はURL）';
COMMENT ON COLUMN public.featured_items.magazine_id IS 'マガジンID（link_type=magazineの場合）';
COMMENT ON COLUMN public.featured_items.display_order IS '表示順（小さい順）';
COMMENT ON COLUMN public.featured_items.is_active IS '公開フラグ';
COMMENT ON COLUMN public.featured_items.starts_at IS '表示開始日時';
COMMENT ON COLUMN public.featured_items.ends_at IS '表示終了日時';
COMMENT ON COLUMN public.featured_items.category_id IS 'カテゴリID（NULLの場合は「すべて」カテゴリで表示）';

ALTER TABLE ONLY public.featured_items ADD CONSTRAINT featured_items_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.featured_items ADD CONSTRAINT featured_items_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.featured_items ADD CONSTRAINT featured_items_magazine_id_fkey
    FOREIGN KEY (magazine_id) REFERENCES public.magazines(id) ON DELETE SET NULL;

CREATE INDEX idx_featured_items_active_order ON public.featured_items USING btree (is_active, display_order) WHERE (is_active = true);
CREATE INDEX idx_featured_items_category ON public.featured_items USING btree (category_id);

CREATE TRIGGER update_featured_items_updated_at
    BEFORE UPDATE ON public.featured_items
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.featured_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY featured_items_select_active ON public.featured_items
    FOR SELECT TO authenticated, anon USING (((is_active = true) AND ((starts_at IS NULL) OR (starts_at <= now())) AND ((ends_at IS NULL) OR (ends_at > now()))));

-- ============================================================
-- featured_category_maps（カテゴリ別おすすめマップ）
-- ============================================================

CREATE TABLE public.featured_category_maps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id text NOT NULL,
    map_id uuid NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.featured_category_maps IS 'カテゴリ別おすすめマップ（運営選定）';
COMMENT ON COLUMN public.featured_category_maps.category_id IS 'カテゴリID';
COMMENT ON COLUMN public.featured_category_maps.map_id IS 'マップID';
COMMENT ON COLUMN public.featured_category_maps.display_order IS '表示順序（小さい順）';
COMMENT ON COLUMN public.featured_category_maps.is_active IS '有効フラグ';

ALTER TABLE ONLY public.featured_category_maps ADD CONSTRAINT featured_category_maps_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.featured_category_maps ADD CONSTRAINT featured_category_maps_category_id_map_id_key
    UNIQUE (category_id, map_id);
ALTER TABLE ONLY public.featured_category_maps ADD CONSTRAINT featured_category_maps_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.featured_category_maps ADD CONSTRAINT featured_category_maps_map_id_fkey
    FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;

CREATE INDEX idx_featured_category_maps_active ON public.featured_category_maps USING btree (is_active) WHERE (is_active = true);
CREATE INDEX idx_featured_category_maps_category ON public.featured_category_maps USING btree (category_id);

CREATE TRIGGER update_featured_category_maps_updated_at
    BEFORE UPDATE ON public.featured_category_maps
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.featured_category_maps ENABLE ROW LEVEL SECURITY;

CREATE POLICY featured_category_maps_select_active ON public.featured_category_maps FOR SELECT USING ((is_active = true));

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

CREATE POLICY system_announcements_select_active ON public.system_announcements
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

CREATE POLICY system_announcement_reads_select_own ON public.system_announcement_reads
    FOR SELECT USING ((auth.uid() = user_id));
CREATE POLICY system_announcement_reads_insert_own ON public.system_announcement_reads
    FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY system_announcement_reads_delete_own ON public.system_announcement_reads
    FOR DELETE USING ((auth.uid() = user_id));

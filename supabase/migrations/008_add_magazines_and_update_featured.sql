-- =============================================
-- Migration: magazines テーブル追加 + featured_items 更新
-- =============================================

-- =============================================
-- 1. magazines テーブル作成
-- =============================================

CREATE TABLE public.magazines (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    thumbnail_url text,
    content text,
    published_at timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.magazines IS 'マガジン（特集記事）';
COMMENT ON COLUMN public.magazines.title IS 'マガジンタイトル';
COMMENT ON COLUMN public.magazines.description IS '概要・説明文';
COMMENT ON COLUMN public.magazines.thumbnail_url IS 'サムネイル画像URL';
COMMENT ON COLUMN public.magazines.content IS '本文（Markdown対応）';
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

-- =============================================
-- 2. magazine_maps テーブル作成
-- =============================================

CREATE TABLE public.magazine_maps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    magazine_id uuid NOT NULL,
    map_id uuid NOT NULL,
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

CREATE INDEX idx_magazine_maps_magazine ON public.magazine_maps USING btree (magazine_id);
CREATE INDEX idx_magazine_maps_active ON public.magazine_maps USING btree (is_active) WHERE (is_active = true);

CREATE TRIGGER update_magazine_maps_updated_at
    BEFORE UPDATE ON public.magazine_maps
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.magazine_maps ENABLE ROW LEVEL SECURITY;

CREATE POLICY magazine_maps_select_active ON public.magazine_maps
    FOR SELECT TO authenticated, anon USING (is_active = true);

-- =============================================
-- 3. featured_items に magazine_id カラム追加
-- =============================================

ALTER TABLE public.featured_items
    ADD COLUMN magazine_id uuid;

ALTER TABLE ONLY public.featured_items ADD CONSTRAINT featured_items_magazine_id_fkey
    FOREIGN KEY (magazine_id) REFERENCES public.magazines(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.featured_items.magazine_id IS 'マガジンID（link_type=magazineの場合）';

-- =============================================
-- 4. link_type enum を更新（detail → magazine）
-- =============================================

-- 既存のdetailをmagazineに変換（まだデータがない想定）
UPDATE public.featured_items
SET link_type = 'url'
WHERE link_type = 'detail';

-- 新しいenum型を作成
DROP TYPE IF EXISTS public.featured_link_type_new;
CREATE TYPE public.featured_link_type_new AS ENUM ('url', 'magazine');

-- カラムの型を変更
ALTER TABLE public.featured_items
    ALTER COLUMN link_type DROP DEFAULT,
    ALTER COLUMN link_type TYPE public.featured_link_type_new
        USING link_type::text::public.featured_link_type_new,
    ALTER COLUMN link_type SET DEFAULT 'magazine';

-- 古いenum型を削除して新しいものをリネーム
DROP TYPE IF EXISTS public.featured_link_type;
ALTER TYPE public.featured_link_type_new RENAME TO featured_link_type;

COMMENT ON COLUMN public.featured_items.link_type IS 'リンクタイプ: url=外部リンク, magazine=マガジンページ';

-- =============================================
-- 5. featured_maps テーブル削除
-- =============================================

DROP TABLE IF EXISTS public.featured_maps;

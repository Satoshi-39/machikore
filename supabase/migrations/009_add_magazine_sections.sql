-- =============================================
-- Migration: magazine_sections テーブル追加
-- =============================================
-- マガジン内でセクション/カテゴリ分けを可能にする

-- =============================================
-- 1. magazine_sections テーブル作成
-- =============================================

CREATE TABLE public.magazine_sections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    magazine_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.magazine_sections IS 'マガジン内のセクション（カテゴリ分け用）';
COMMENT ON COLUMN public.magazine_sections.magazine_id IS 'マガジンID';
COMMENT ON COLUMN public.magazine_sections.title IS 'セクションタイトル（例: 東京エリア）';
COMMENT ON COLUMN public.magazine_sections.description IS 'セクションの説明';
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

-- =============================================
-- 2. magazine_maps に section_id カラム追加
-- =============================================

ALTER TABLE public.magazine_maps
    ADD COLUMN section_id uuid;

ALTER TABLE ONLY public.magazine_maps ADD CONSTRAINT magazine_maps_section_id_fkey
    FOREIGN KEY (section_id) REFERENCES public.magazine_sections(id) ON DELETE SET NULL;

CREATE INDEX idx_magazine_maps_section ON public.magazine_maps USING btree (section_id);

COMMENT ON COLUMN public.magazine_maps.section_id IS 'セクションID（NULLの場合はセクションなし）';

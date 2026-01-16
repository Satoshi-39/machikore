-- =============================================
-- Migration: magazine_sections に thumbnail_url 追加
-- =============================================

ALTER TABLE public.magazine_sections
    ADD COLUMN thumbnail_url text;

COMMENT ON COLUMN public.magazine_sections.thumbnail_url IS 'セクションのサムネイル画像URL';

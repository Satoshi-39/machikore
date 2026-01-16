-- =============================================
-- Migration: category_featured_maps を featured_category_maps にリネーム
-- =============================================
-- featured系テーブルの命名規則を統一

-- テーブルをリネーム
ALTER TABLE public.category_featured_maps RENAME TO featured_category_maps;

-- インデックスをリネーム
ALTER INDEX idx_category_featured_maps_active RENAME TO idx_featured_category_maps_active;
ALTER INDEX idx_category_featured_maps_category RENAME TO idx_featured_category_maps_category;

-- 制約をリネーム
ALTER TABLE public.featured_category_maps
    RENAME CONSTRAINT category_featured_maps_pkey TO featured_category_maps_pkey;
ALTER TABLE public.featured_category_maps
    RENAME CONSTRAINT category_featured_maps_category_id_map_id_key TO featured_category_maps_category_id_map_id_key;
ALTER TABLE public.featured_category_maps
    RENAME CONSTRAINT category_featured_maps_category_id_fkey TO featured_category_maps_category_id_fkey;
ALTER TABLE public.featured_category_maps
    RENAME CONSTRAINT category_featured_maps_map_id_fkey TO featured_category_maps_map_id_fkey;

-- トリガーをリネーム（トリガーは直接リネームできないので再作成）
DROP TRIGGER IF EXISTS update_category_featured_maps_updated_at ON public.featured_category_maps;
CREATE TRIGGER update_featured_category_maps_updated_at
    BEFORE UPDATE ON public.featured_category_maps
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLSポリシーをリネーム（ポリシーも再作成が必要）
DROP POLICY IF EXISTS category_featured_maps_select_active ON public.featured_category_maps;
CREATE POLICY featured_category_maps_select_active ON public.featured_category_maps
    FOR SELECT USING ((is_active = true));

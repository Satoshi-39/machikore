-- =============================================
-- Migration: category_featured_tags テーブルを削除
-- =============================================
-- カテゴリ別タグページを廃止したため不要

-- RLSポリシーを削除
DROP POLICY IF EXISTS category_featured_tags_select_active ON public.category_featured_tags;

-- テーブルを削除
DROP TABLE IF EXISTS public.category_featured_tags;

-- RPC関数も削除（使用していた場合）
DROP FUNCTION IF EXISTS public.get_popular_tags_by_category(text, integer);

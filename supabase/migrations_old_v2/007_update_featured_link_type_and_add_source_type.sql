-- =============================================
-- Migration: featured_items.link_type変更 + featured_maps.source_type追加
-- =============================================

-- =============================================
-- 1. featured_items.link_typeの変更
--    - 'tag', 'curated', 'map'を削除
--    - 'url', 'detail'のみに
-- =============================================

-- 既存のlink_typeを'detail'に変換（tag, curated, mapの場合）
UPDATE public.featured_items
SET link_type = 'detail'
WHERE link_type IN ('tag', 'curated', 'map');

-- 新しいenum型を作成
DROP TYPE IF EXISTS public.featured_link_type_new;
CREATE TYPE public.featured_link_type_new AS ENUM ('url', 'detail');

-- カラムの型を変更
ALTER TABLE public.featured_items
  ALTER COLUMN link_type DROP DEFAULT,
  ALTER COLUMN link_type TYPE public.featured_link_type_new
    USING link_type::text::public.featured_link_type_new,
  ALTER COLUMN link_type SET DEFAULT 'detail';

-- 古いenum型を削除して新しいものをリネーム
DROP TYPE IF EXISTS public.featured_link_type;
ALTER TYPE public.featured_link_type_new RENAME TO featured_link_type;

-- =============================================
-- 2. featured_maps.source_typeの追加
-- =============================================

-- source_type enum作成
CREATE TYPE public.featured_source_type AS ENUM ('tag', 'manual');

-- featured_mapsにsource_typeカラムを追加
ALTER TABLE public.featured_maps
  ADD COLUMN source_type public.featured_source_type NOT NULL DEFAULT 'manual';

-- source_tagカラムを追加（タグ一括登録時のタグ名を記録）
ALTER TABLE public.featured_maps
  ADD COLUMN source_tag text DEFAULT NULL;

-- コメント追加
COMMENT ON COLUMN public.featured_items.link_type IS 'リンクタイプ: url=外部リンク, detail=特集詳細ページ';
COMMENT ON COLUMN public.featured_maps.source_type IS '登録元タイプ: tag=タグ一括登録, manual=手動登録';
COMMENT ON COLUMN public.featured_maps.source_tag IS 'タグ一括登録時のタグ名（source_type=tagの場合のみ）';

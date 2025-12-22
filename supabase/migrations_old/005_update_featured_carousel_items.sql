-- featured_carousel_itemsテーブルの更新

-- 未使用のrelated_tagsカラムを削除
ALTER TABLE public.featured_carousel_items DROP COLUMN related_tags;

-- 特集詳細ページ用のcontentカラムを追加（リッチテキスト/マークダウン用）
ALTER TABLE public.featured_carousel_items ADD COLUMN content text;

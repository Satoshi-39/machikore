-- =============================================
-- Migration: featured_items から content カラムを削除
-- =============================================
-- featured_items はカルーセルバナー用で、本文を表示する画面がないため不要

ALTER TABLE public.featured_items
    DROP COLUMN IF EXISTS content;

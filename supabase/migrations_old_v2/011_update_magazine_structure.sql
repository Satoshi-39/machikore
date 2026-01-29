-- =============================================
-- Migration: magazines と magazine_sections の構造変更
-- =============================================
-- magazines: name追加、content削除
-- magazine_sections: name追加、既存titleをnameに移行

-- =============================================
-- 1. magazines テーブル
-- =============================================

-- name カラムを追加
ALTER TABLE public.magazines
    ADD COLUMN name text;

-- 既存データ: titleをnameにコピー
UPDATE public.magazines SET name = title WHERE name IS NULL;

-- name を NOT NULL に変更
ALTER TABLE public.magazines
    ALTER COLUMN name SET NOT NULL;

-- content カラムを削除
ALTER TABLE public.magazines
    DROP COLUMN content;

COMMENT ON COLUMN public.magazines.name IS 'マガジン名（ヘッダー表示用）';
COMMENT ON COLUMN public.magazines.title IS 'タイトル（サムネイル下に大きく表示）';

-- =============================================
-- 2. magazine_sections テーブル
-- =============================================

-- name カラムを追加
ALTER TABLE public.magazine_sections
    ADD COLUMN name text;

-- 既存データ: titleをnameにコピー、titleはdescriptionに
UPDATE public.magazine_sections
SET
    name = title,
    title = description,
    description = NULL;

-- name を NOT NULL に変更
ALTER TABLE public.magazine_sections
    ALTER COLUMN name SET NOT NULL;

-- title は NULL 許容のまま（任意項目）
ALTER TABLE public.magazine_sections
    ALTER COLUMN title DROP NOT NULL;

COMMENT ON COLUMN public.magazine_sections.name IS 'セクション名（ヘッダー表示用）';
COMMENT ON COLUMN public.magazine_sections.title IS 'タイトル（大きく表示）';
COMMENT ON COLUMN public.magazine_sections.description IS '説明文（任意）';

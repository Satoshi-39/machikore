-- =============================================
-- Migration: 不要カラムの削除
-- =============================================
-- 1. machi.lines: 路線情報は不要になったため削除
-- 2. name_en: name_translations JSONBで多言語対応するため削除
-- =============================================

-- =============================================
-- 1. machi テーブルから lines カラムを削除
-- =============================================
ALTER TABLE machi DROP COLUMN IF EXISTS lines;

-- =============================================
-- 2. 各テーブルから name_en カラムを削除
-- =============================================

-- prefectures
ALTER TABLE prefectures DROP COLUMN IF EXISTS name_en;

-- regions
ALTER TABLE regions DROP COLUMN IF EXISTS name_en;

-- countries
ALTER TABLE countries DROP COLUMN IF EXISTS name_en;

-- continents
ALTER TABLE continents DROP COLUMN IF EXISTS name_en;

-- transport_hubs
ALTER TABLE transport_hubs DROP COLUMN IF EXISTS name_en;

-- cities（念のため確認して削除）
ALTER TABLE cities DROP COLUMN IF EXISTS name_en;

-- machi（念のため確認して削除）
ALTER TABLE machi DROP COLUMN IF EXISTS name_en;

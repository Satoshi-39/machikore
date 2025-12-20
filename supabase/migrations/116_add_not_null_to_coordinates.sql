-- =============================================
-- Migration: 座標データにNOT NULL制約を追加
-- =============================================
-- 地理データの座標は必須なので、NOT NULL制約を追加
-- =============================================

-- =============================================
-- 1. regions テーブル
-- =============================================
-- まずNULLデータがあれば0で埋める（実際にはデータは入っているはず）
UPDATE regions SET latitude = 0 WHERE latitude IS NULL;
UPDATE regions SET longitude = 0 WHERE longitude IS NULL;

-- NOT NULL制約を追加
ALTER TABLE regions ALTER COLUMN latitude SET NOT NULL;
ALTER TABLE regions ALTER COLUMN longitude SET NOT NULL;

-- ===============================
-- machi から country_id を削除
-- ===============================
-- 理由: machiで国別フィルタは使用しない。prefecture_id → regions.country_id で辿れる

-- 外部キー制約を削除（存在する場合）
ALTER TABLE machi DROP CONSTRAINT IF EXISTS fk_machi_country;

-- country_id カラムを削除
ALTER TABLE machi DROP COLUMN IF EXISTS country_id;

-- ===============================
-- 日本のregions.idにjp_プレフィックスを追加
-- ===============================
-- 他の国（cn_central等）と命名規則を統一

-- 1. prefectures.region_id を先に更新（外部キー参照）
UPDATE prefectures SET region_id = 'jp_' || region_id
WHERE region_id NOT LIKE '%_%';

-- 2. regions.id を更新
UPDATE regions SET id = 'jp_' || id
WHERE id NOT LIKE '%_%';

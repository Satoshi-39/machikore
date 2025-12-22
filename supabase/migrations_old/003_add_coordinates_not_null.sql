-- =============================================
-- 座標カラムのNOT NULL制約追加とcontinentsへの緯度経度追加
-- =============================================

-- =============================================
-- 1. continentsテーブルに緯度経度カラムを追加
-- =============================================
ALTER TABLE public.continents
ADD COLUMN latitude double precision,
ADD COLUMN longitude double precision;

-- 大陸の代表座標を設定
UPDATE public.continents SET latitude = 35.6762, longitude = 139.6503 WHERE id = 'east_asia';       -- 東京付近（東アジア）
UPDATE public.continents SET latitude = 13.7563, longitude = 100.5018 WHERE id = 'southeast_asia'; -- バンコク付近（東南アジア）
UPDATE public.continents SET latitude = 20.5937, longitude = 78.9629 WHERE id = 'south_asia';      -- インド中央（南アジア）
UPDATE public.continents SET latitude = 41.2044, longitude = 74.7661 WHERE id = 'central_asia';    -- キルギス付近（中央アジア）
UPDATE public.continents SET latitude = 29.3117, longitude = 47.4818 WHERE id = 'west_asia';       -- クウェート付近（西アジア）
UPDATE public.continents SET latitude = 54.5260, longitude = 15.2551 WHERE id = 'europe';          -- ヨーロッパ中央
UPDATE public.continents SET latitude = 54.5260, longitude = -105.2551 WHERE id = 'north_america'; -- 北アメリカ中央
UPDATE public.continents SET latitude = 15.7835, longitude = -90.2308 WHERE id = 'central_america';-- グアテマラ付近（中央アメリカ）
UPDATE public.continents SET latitude = -8.7832, longitude = -55.4915 WHERE id = 'south_america';  -- 南アメリカ中央
UPDATE public.continents SET latitude = -25.2744, longitude = 133.7751 WHERE id = 'oceania';       -- オーストラリア中央
UPDATE public.continents SET latitude = -8.7832, longitude = 34.5085 WHERE id = 'africa';          -- アフリカ中央

-- NOT NULL制約を追加
ALTER TABLE public.continents
ALTER COLUMN latitude SET NOT NULL,
ALTER COLUMN longitude SET NOT NULL;

COMMENT ON COLUMN public.continents.latitude IS '大陸の代表緯度';
COMMENT ON COLUMN public.continents.longitude IS '大陸の代表経度';

-- =============================================
-- 2. countriesテーブルの緯度経度をNOT NULLに
-- =============================================
-- まず既存データにNULLがないことを確認（あればデフォルト値を設定）
-- 日本、韓国、台湾、タイ、中国は既にデータがあるはず

ALTER TABLE public.countries
ALTER COLUMN latitude SET NOT NULL,
ALTER COLUMN longitude SET NOT NULL;

-- =============================================
-- 3. regionsテーブルの緯度経度をNOT NULLに
-- =============================================
ALTER TABLE public.regions
ALTER COLUMN latitude SET NOT NULL,
ALTER COLUMN longitude SET NOT NULL;

-- =============================================
-- 4. prefecturesテーブルの緯度経度をNOT NULLに
-- =============================================
ALTER TABLE public.prefectures
ALTER COLUMN latitude SET NOT NULL,
ALTER COLUMN longitude SET NOT NULL;

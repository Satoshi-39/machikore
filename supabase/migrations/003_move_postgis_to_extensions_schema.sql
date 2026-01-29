-- Migration: PostGIS を public → extensions スキーマに移行
--
-- 手順:
-- 1. 依存オブジェクト（RPC関数、テーブル）を DROP
-- 2. PostGIS を extensions スキーマに移動
-- 3. 依存オブジェクトを再作成（extensions.geometry を参照）
-- 4. admin_boundaries のデータは再アップロードが必要

BEGIN;

-- 1. 依存オブジェクトを DROP
DROP FUNCTION IF EXISTS public.get_city_by_coordinate(double precision, double precision);
DROP TABLE IF EXISTS public.admin_boundaries;

-- 2. PostGIS を DROP して extensions スキーマに再作成
--    SET SCHEMA は PostGIS で非対応のため DROP → CREATE で対応
DROP EXTENSION postgis CASCADE;
CREATE EXTENSION postgis WITH SCHEMA extensions;

-- 3. admin_boundaries テーブルを再作成（extensions.geometry を参照）
CREATE TABLE public.admin_boundaries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    geom extensions.geometry(MultiPolygon, 4326),
    created_at timestamp with time zone DEFAULT now(),
    admin_level integer,
    country_id text,
    prefecture_id text,
    city_id text
);

ALTER TABLE public.admin_boundaries OWNER TO postgres;

COMMENT ON TABLE public.admin_boundaries IS '行政区域ポリゴン（国土数値情報N03由来）';
COMMENT ON COLUMN public.admin_boundaries.admin_level IS 'OSM admin_level (4=都道府県相当, 6-7=市区町村相当)';
COMMENT ON COLUMN public.admin_boundaries.country_id IS '国ID → countries.id (jp, kr, th, tw, cn)';
COMMENT ON COLUMN public.admin_boundaries.prefecture_id IS '都道府県ID → prefectures.id';
COMMENT ON COLUMN public.admin_boundaries.city_id IS '市区町村ID → cities.id';

-- 制約
ALTER TABLE ONLY public.admin_boundaries
    ADD CONSTRAINT admin_boundaries_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.admin_boundaries
    ADD CONSTRAINT admin_boundaries_city_id_unique UNIQUE (city_id);

ALTER TABLE ONLY public.admin_boundaries
    ADD CONSTRAINT admin_boundaries_city_id_fkey
    FOREIGN KEY (city_id) REFERENCES public.cities(id);

ALTER TABLE ONLY public.admin_boundaries
    ADD CONSTRAINT admin_boundaries_country_id_fkey
    FOREIGN KEY (country_id) REFERENCES public.countries(id);

ALTER TABLE ONLY public.admin_boundaries
    ADD CONSTRAINT admin_boundaries_prefecture_id_fkey
    FOREIGN KEY (prefecture_id) REFERENCES public.prefectures(id);

-- インデックス
CREATE INDEX idx_admin_boundaries_admin_level ON public.admin_boundaries USING btree (admin_level);
CREATE INDEX idx_admin_boundaries_city_id ON public.admin_boundaries USING btree (city_id);
CREATE INDEX idx_admin_boundaries_country_id ON public.admin_boundaries USING btree (country_id);
CREATE INDEX idx_admin_boundaries_country_level ON public.admin_boundaries USING btree (country_id, admin_level);
CREATE INDEX idx_admin_boundaries_geom ON public.admin_boundaries USING gist (geom);
CREATE INDEX idx_admin_boundaries_prefecture_id ON public.admin_boundaries USING btree (prefecture_id);

-- RLS
ALTER TABLE public.admin_boundaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY admin_boundaries_select_all ON public.admin_boundaries FOR SELECT USING (true);

-- 4. RPC関数を再作成（search_path に extensions を含めて ST_* を解決）
CREATE OR REPLACE FUNCTION public.get_city_by_coordinate(lng double precision, lat double precision)
RETURNS TABLE(country_id text, admin_level integer, prefecture_id text, city_id text)
    LANGUAGE sql STABLE
    SET search_path = 'public', 'extensions'
    AS $$
  SELECT
    ab.country_id,
    ab.admin_level,
    ab.prefecture_id,
    ab.city_id
  FROM admin_boundaries ab
  WHERE ST_Contains(ab.geom, ST_SetSRID(ST_Point(lng, lat), 4326))
  ORDER BY ab.admin_level DESC
  LIMIT 1;
$$;

ALTER FUNCTION public.get_city_by_coordinate(double precision, double precision) OWNER TO postgres;
COMMENT ON FUNCTION public.get_city_by_coordinate(double precision, double precision) IS '座標から行政区画を特定。prefecture_id と city_id を直接返す。';

-- GRANT
GRANT ALL ON TABLE public.admin_boundaries TO anon;
GRANT ALL ON TABLE public.admin_boundaries TO authenticated;
GRANT ALL ON TABLE public.admin_boundaries TO service_role;

GRANT ALL ON FUNCTION public.get_city_by_coordinate(double precision, double precision) TO anon;
GRANT ALL ON FUNCTION public.get_city_by_coordinate(double precision, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.get_city_by_coordinate(double precision, double precision) TO service_role;

COMMIT;

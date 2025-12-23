-- ============================================================
-- 地理データ（大陸・国・地域・都道府県・市区町村・街・交通機関・行政区域）
-- ============================================================
-- 地理階層: continents → countries → regions → prefectures → cities → machi
-- 最終更新: 2025-12-23

-- ============================================================
-- continents（大陸）
-- ============================================================

CREATE TABLE public.continents (
    id text NOT NULL,
    name text NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name_translations jsonb,
    name_kana text,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL
);

COMMENT ON TABLE public.continents IS '大陸マスターテーブル';
COMMENT ON COLUMN public.continents.id IS '大陸ID (例: east_asia, europe)';
COMMENT ON COLUMN public.continents.name IS '大陸名（日本語）';
COMMENT ON COLUMN public.continents.display_order IS '表示順序';
COMMENT ON COLUMN public.continents.latitude IS '大陸の代表緯度';
COMMENT ON COLUMN public.continents.longitude IS '大陸の代表経度';

ALTER TABLE ONLY public.continents ADD CONSTRAINT continents_pkey PRIMARY KEY (id);

ALTER TABLE public.continents ENABLE ROW LEVEL SECURITY;
CREATE POLICY continents_select_policy ON public.continents FOR SELECT USING (true);

-- ============================================================
-- countries（国）
-- ============================================================

CREATE TABLE public.countries (
    id text NOT NULL,
    name text NOT NULL,
    name_kana text,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    continent_id text NOT NULL,
    name_translations jsonb
);

COMMENT ON COLUMN public.countries.continent_id IS '大陸ID（外部キー → continents.id）';

ALTER TABLE ONLY public.countries ADD CONSTRAINT countries_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.countries ADD CONSTRAINT countries_continent_id_fkey
    FOREIGN KEY (continent_id) REFERENCES public.continents(id) ON DELETE SET NULL;

CREATE TRIGGER update_countries_updated_at
    BEFORE UPDATE ON public.countries
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
CREATE POLICY countries_select_policy ON public.countries FOR SELECT USING (true);

-- ============================================================
-- regions（地域）
-- ============================================================

CREATE TABLE public.regions (
    id text NOT NULL,
    name text NOT NULL,
    name_kana text,
    display_order integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    name_translations jsonb,
    country_id text NOT NULL
);

COMMENT ON COLUMN public.regions.name_translations IS '多言語翻訳 {"en": "Kanto", "zh": "关东"}';

ALTER TABLE ONLY public.regions ADD CONSTRAINT regions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.regions ADD CONSTRAINT fk_regions_country
    FOREIGN KEY (country_id) REFERENCES public.countries(id);

-- ============================================================
-- prefectures（都道府県）
-- ============================================================

CREATE TABLE public.prefectures (
    id text NOT NULL,
    name text NOT NULL,
    name_kana text,
    region_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    name_translations jsonb
);

COMMENT ON COLUMN public.prefectures.name_translations IS '多言語翻訳 {"en": "Tokyo", "zh": "东京"}';

ALTER TABLE ONLY public.prefectures ADD CONSTRAINT prefectures_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.prefectures ADD CONSTRAINT prefectures_name_key UNIQUE (name);
ALTER TABLE ONLY public.prefectures ADD CONSTRAINT prefectures_region_id_fkey
    FOREIGN KEY (region_id) REFERENCES public.regions(id);

CREATE TRIGGER update_prefectures_updated_at
    BEFORE UPDATE ON public.prefectures
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Anyone can view prefectures" ON public.prefectures FOR SELECT USING (true);

-- ============================================================
-- cities（市区町村）
-- ============================================================

CREATE TABLE public.cities (
    id text NOT NULL,
    prefecture_id text NOT NULL,
    name text NOT NULL,
    name_kana text,
    type text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name_translations jsonb,
    latitude double precision,
    longitude double precision,
    tile_id text,
    CONSTRAINT cities_type_check CHECK ((type = ANY (ARRAY['区'::text, '市'::text, '町'::text, '村'::text])))
);

ALTER TABLE ONLY public.cities ADD CONSTRAINT cities_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.cities ADD CONSTRAINT cities_prefecture_id_fkey
    FOREIGN KEY (prefecture_id) REFERENCES public.prefectures(id);

CREATE INDEX idx_cities_prefecture_id ON public.cities USING btree (prefecture_id);
CREATE INDEX idx_cities_tile_id ON public.cities USING btree (tile_id);

CREATE TRIGGER update_cities_updated_at
    BEFORE UPDATE ON public.cities
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Anyone can view cities" ON public.cities FOR SELECT USING (true);

-- ============================================================
-- machi（街）
-- ============================================================

CREATE TABLE public.machi (
    id text NOT NULL,
    name text NOT NULL,
    latitude double precision,
    longitude double precision,
    prefecture_id text NOT NULL,
    city_id text,
    name_kana text,
    name_translations jsonb,
    prefecture_name text NOT NULL,
    prefecture_name_translations jsonb,
    city_name text,
    city_name_translations jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    osm_id bigint,
    place_type text,
    tile_id text
);

ALTER TABLE ONLY public.machi ADD CONSTRAINT machi_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.machi ADD CONSTRAINT machi_city_id_fkey
    FOREIGN KEY (city_id) REFERENCES public.cities(id);
ALTER TABLE ONLY public.machi ADD CONSTRAINT machi_prefecture_id_fkey
    FOREIGN KEY (prefecture_id) REFERENCES public.prefectures(id);

CREATE INDEX idx_machi_city_id ON public.machi USING btree (city_id);
CREATE INDEX idx_machi_name ON public.machi USING btree (name);
CREATE INDEX idx_machi_osm_id ON public.machi USING btree (osm_id);
CREATE INDEX idx_machi_place_type ON public.machi USING btree (place_type);
CREATE INDEX idx_machi_prefecture_id ON public.machi USING btree (prefecture_id);
CREATE INDEX idx_machi_tile_id ON public.machi USING btree (tile_id);

CREATE TRIGGER update_machi_updated_at
    BEFORE UPDATE ON public.machi
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Anyone can view machi" ON public.machi FOR SELECT USING (true);

-- ============================================================
-- transport_hubs（交通機関）
-- ============================================================

CREATE TABLE public.transport_hubs (
    id text NOT NULL,
    osm_id bigint,
    osm_type text,
    prefecture_id text NOT NULL,
    city_id text,
    type text NOT NULL,
    subtype text,
    name text NOT NULL,
    name_kana text,
    operator text,
    network text,
    ref text,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    tile_id text NOT NULL,
    name_translations jsonb,
    CONSTRAINT transport_hubs_type_check CHECK ((type = ANY (ARRAY['station'::text, 'airport'::text, 'ferry_terminal'::text, 'bus_terminal'::text])))
);

COMMENT ON TABLE public.transport_hubs IS '交通機関データ（駅、空港、フェリーターミナル、バスターミナル）';
COMMENT ON COLUMN public.transport_hubs.id IS '一意識別子（prefecture_type_osmid形式）';
COMMENT ON COLUMN public.transport_hubs.osm_id IS 'OpenStreetMapのID';
COMMENT ON COLUMN public.transport_hubs.osm_type IS 'OSMの要素タイプ（node/way/relation）';
COMMENT ON COLUMN public.transport_hubs.prefecture_id IS '都道府県ID';
COMMENT ON COLUMN public.transport_hubs.city_id IS '市区町村ID（オプション）';
COMMENT ON COLUMN public.transport_hubs.type IS '交通機関の種類（station/airport/ferry_terminal/bus_terminal）';
COMMENT ON COLUMN public.transport_hubs.subtype IS 'サブタイプ（駅: jr/metro/toei/subway/private、空港: international/domestic/military/heliport）';
COMMENT ON COLUMN public.transport_hubs.name IS '名称（日本語）';
COMMENT ON COLUMN public.transport_hubs.name_kana IS '名称（ふりがな）';
COMMENT ON COLUMN public.transport_hubs.operator IS '運営会社';
COMMENT ON COLUMN public.transport_hubs.network IS '路線網';
COMMENT ON COLUMN public.transport_hubs.ref IS '路線コード/空港コード';
COMMENT ON COLUMN public.transport_hubs.latitude IS '緯度';
COMMENT ON COLUMN public.transport_hubs.longitude IS '経度';
COMMENT ON COLUMN public.transport_hubs.tile_id IS 'タイルID（0.25度グリッド、例: "559_142"）';
COMMENT ON COLUMN public.transport_hubs.name_translations IS '多言語翻訳 {"en": "Shibuya Station", "cn": "涩谷站", "tw": "澀谷站"}';

ALTER TABLE ONLY public.transport_hubs ADD CONSTRAINT transport_hubs_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.transport_hubs ADD CONSTRAINT transport_hubs_city_id_fkey
    FOREIGN KEY (city_id) REFERENCES public.cities(id);
ALTER TABLE ONLY public.transport_hubs ADD CONSTRAINT transport_hubs_prefecture_id_fkey
    FOREIGN KEY (prefecture_id) REFERENCES public.prefectures(id);

CREATE INDEX idx_transport_hubs_location ON public.transport_hubs USING btree (latitude, longitude);
CREATE INDEX idx_transport_hubs_name ON public.transport_hubs USING btree (name);
CREATE INDEX idx_transport_hubs_osm_id ON public.transport_hubs USING btree (osm_id);
CREATE INDEX idx_transport_hubs_prefecture_id ON public.transport_hubs USING btree (prefecture_id);
CREATE INDEX idx_transport_hubs_tile_id ON public.transport_hubs USING btree (tile_id);
CREATE INDEX idx_transport_hubs_type ON public.transport_hubs USING btree (type);
CREATE INDEX idx_transport_hubs_type_subtype ON public.transport_hubs USING btree (type, subtype);

ALTER TABLE public.transport_hubs ENABLE ROW LEVEL SECURITY;
CREATE POLICY transport_hubs_select_policy ON public.transport_hubs FOR SELECT USING (true);

-- ============================================================
-- admin_boundaries（行政区域ポリゴン）
-- ============================================================

CREATE TABLE public.admin_boundaries (
    id integer NOT NULL,
    geom public.geometry(MultiPolygon,4326),
    created_at timestamp with time zone DEFAULT now(),
    admin_level integer,
    country_id text,
    prefecture_id text,
    city_id text
);

COMMENT ON TABLE public.admin_boundaries IS '行政区域ポリゴン（国土数値情報N03由来）';
COMMENT ON COLUMN public.admin_boundaries.admin_level IS 'OSM admin_level (4=都道府県相当, 6-7=市区町村相当)';
COMMENT ON COLUMN public.admin_boundaries.country_id IS '国ID → countries.id (jp, kr, th, tw, cn)';
COMMENT ON COLUMN public.admin_boundaries.prefecture_id IS '都道府県ID → prefectures.id';
COMMENT ON COLUMN public.admin_boundaries.city_id IS '市区町村ID → cities.id';

CREATE SEQUENCE public.admin_boundaries_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.admin_boundaries_id_seq OWNED BY public.admin_boundaries.id;
ALTER TABLE ONLY public.admin_boundaries ALTER COLUMN id SET DEFAULT nextval('public.admin_boundaries_id_seq'::regclass);

ALTER TABLE ONLY public.admin_boundaries ADD CONSTRAINT admin_boundaries_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.admin_boundaries ADD CONSTRAINT admin_boundaries_city_id_unique UNIQUE (city_id);
ALTER TABLE ONLY public.admin_boundaries ADD CONSTRAINT admin_boundaries_city_id_fkey
    FOREIGN KEY (city_id) REFERENCES public.cities(id);
ALTER TABLE ONLY public.admin_boundaries ADD CONSTRAINT admin_boundaries_country_id_fkey
    FOREIGN KEY (country_id) REFERENCES public.countries(id);
ALTER TABLE ONLY public.admin_boundaries ADD CONSTRAINT admin_boundaries_prefecture_id_fkey
    FOREIGN KEY (prefecture_id) REFERENCES public.prefectures(id);

CREATE INDEX idx_admin_boundaries_admin_level ON public.admin_boundaries USING btree (admin_level);
CREATE INDEX idx_admin_boundaries_city_id ON public.admin_boundaries USING btree (city_id);
CREATE INDEX idx_admin_boundaries_country_id ON public.admin_boundaries USING btree (country_id);
CREATE INDEX idx_admin_boundaries_country_level ON public.admin_boundaries USING btree (country_id, admin_level);
CREATE INDEX idx_admin_boundaries_geom ON public.admin_boundaries USING gist (geom);
CREATE INDEX idx_admin_boundaries_prefecture_id ON public.admin_boundaries USING btree (prefecture_id);

ALTER TABLE public.admin_boundaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY admin_boundaries_read ON public.admin_boundaries FOR SELECT USING (true);

-- ============================================================
-- 地理空間関数
-- ============================================================

-- 座標から行政区画を特定
CREATE FUNCTION public.get_city_by_coordinate(lng double precision, lat double precision)
RETURNS TABLE(country_id text, admin_level integer, prefecture_id text, city_id text)
    LANGUAGE sql STABLE
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

COMMENT ON FUNCTION public.get_city_by_coordinate(lng double precision, lat double precision)
IS '座標から行政区画を特定。prefecture_id と city_id を直接返す。';

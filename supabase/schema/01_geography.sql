-- ============================================================
-- 地理マスターデータ
-- ============================================================
-- テーブル: continents, countries, regions, prefectures, cities, machi, transport_hubs, admin_boundaries
-- 最終更新: 2025-12-23

-- ============================================================
-- continents (大陸)
-- ============================================================
CREATE TABLE continents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_kana TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    name_translations JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE continents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "continents_select_all" ON continents FOR SELECT USING (true);

-- Trigger
CREATE TRIGGER update_continents_updated_at
    BEFORE UPDATE ON continents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- countries (国)
-- ============================================================
CREATE TABLE countries (
    id TEXT PRIMARY KEY,  -- ISO 3166-1 alpha-2
    name TEXT NOT NULL,
    name_kana TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    continent_id TEXT NOT NULL REFERENCES continents(id),
    name_translations JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "countries_select_all" ON countries FOR SELECT USING (true);

-- Trigger
CREATE TRIGGER update_countries_updated_at
    BEFORE UPDATE ON countries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- regions (地方)
-- ============================================================
CREATE TABLE regions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_kana TEXT,
    display_order INTEGER NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    country_id TEXT NOT NULL REFERENCES countries(id),
    name_translations JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "regions_select_all" ON regions FOR SELECT USING (true);

-- Trigger
CREATE TRIGGER update_regions_updated_at
    BEFORE UPDATE ON regions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- prefectures (都道府県)
-- ============================================================
CREATE TABLE prefectures (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_kana TEXT,
    region_id TEXT NOT NULL REFERENCES regions(id),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    name_translations JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE prefectures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "prefectures_select_all" ON prefectures FOR SELECT USING (true);

-- Trigger
CREATE TRIGGER update_prefectures_updated_at
    BEFORE UPDATE ON prefectures
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- cities (市区町村)
-- ============================================================
CREATE TABLE cities (
    id TEXT PRIMARY KEY,
    prefecture_id TEXT NOT NULL REFERENCES prefectures(id),
    name TEXT NOT NULL,
    name_kana TEXT,
    type TEXT NOT NULL CHECK (type IN ('区', '市', '町', '村')),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    tile_id TEXT,
    name_translations JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_cities_prefecture_id ON cities(prefecture_id);
CREATE INDEX idx_cities_tile_id ON cities(tile_id);

-- RLS
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cities_select_all" ON cities FOR SELECT USING (true);

-- Trigger
CREATE TRIGGER update_cities_updated_at
    BEFORE UPDATE ON cities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- machi (街)
-- ============================================================
CREATE TABLE machi (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_kana TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    prefecture_id TEXT NOT NULL REFERENCES prefectures(id),
    prefecture_name TEXT NOT NULL,
    prefecture_name_translations JSONB,
    city_id TEXT REFERENCES cities(id),
    city_name TEXT,
    city_name_translations JSONB,
    name_translations JSONB,
    osm_id BIGINT,
    place_type TEXT,
    tile_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_machi_city_id ON machi(city_id);
CREATE INDEX idx_machi_name ON machi(name);
CREATE INDEX idx_machi_osm_id ON machi(osm_id);
CREATE INDEX idx_machi_place_type ON machi(place_type);
CREATE INDEX idx_machi_prefecture_id ON machi(prefecture_id);
CREATE INDEX idx_machi_tile_id ON machi(tile_id);

-- RLS
ALTER TABLE machi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "machi_select_all" ON machi FOR SELECT USING (true);

-- Trigger
CREATE TRIGGER update_machi_updated_at
    BEFORE UPDATE ON machi
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- transport_hubs (交通拠点)
-- ============================================================
CREATE TABLE transport_hubs (
    id TEXT PRIMARY KEY,
    osm_id BIGINT,
    osm_type TEXT,
    prefecture_id TEXT NOT NULL REFERENCES prefectures(id),
    city_id TEXT REFERENCES cities(id),
    type TEXT NOT NULL CHECK (type IN ('station', 'airport', 'ferry_terminal', 'bus_terminal')),
    subtype TEXT,
    name TEXT NOT NULL,
    name_kana TEXT,
    name_translations JSONB,
    operator TEXT,
    network TEXT,
    ref TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    tile_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_transport_hubs_location ON transport_hubs(latitude, longitude);
CREATE INDEX idx_transport_hubs_name ON transport_hubs(name);
CREATE INDEX idx_transport_hubs_osm_id ON transport_hubs(osm_id);
CREATE INDEX idx_transport_hubs_prefecture_id ON transport_hubs(prefecture_id);
CREATE INDEX idx_transport_hubs_tile_id ON transport_hubs(tile_id);
CREATE INDEX idx_transport_hubs_type ON transport_hubs(type);
CREATE INDEX idx_transport_hubs_type_subtype ON transport_hubs(type, subtype);

-- RLS
ALTER TABLE transport_hubs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "transport_hubs_select_all" ON transport_hubs FOR SELECT USING (true);

-- Trigger
CREATE TRIGGER update_transport_hubs_updated_at
    BEFORE UPDATE ON transport_hubs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- admin_boundaries (行政境界 - PostGIS)
-- ============================================================
-- Note: PostGIS拡張が必要
-- CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE admin_boundaries (
    id SERIAL PRIMARY KEY,
    country_id TEXT REFERENCES countries(id),
    admin_level INTEGER,  -- 4=都道府県, 7=市区町村
    prefecture_id TEXT REFERENCES prefectures(id),
    city_id TEXT REFERENCES cities(id),
    geom GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_admin_boundaries_geom ON admin_boundaries USING GIST(geom);
CREATE INDEX idx_admin_boundaries_country_id ON admin_boundaries(country_id);
CREATE INDEX idx_admin_boundaries_admin_level ON admin_boundaries(admin_level);
CREATE INDEX idx_admin_boundaries_prefecture_id ON admin_boundaries(prefecture_id);
CREATE INDEX idx_admin_boundaries_city_id ON admin_boundaries(city_id);
CREATE INDEX idx_admin_boundaries_country_level ON admin_boundaries(country_id, admin_level);

-- RLS
ALTER TABLE admin_boundaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_boundaries_select_all" ON admin_boundaries FOR SELECT USING (true);

-- ============================================================
-- RPC: 座標から行政区画を取得
-- ============================================================
CREATE OR REPLACE FUNCTION get_city_by_coordinate(lng DOUBLE PRECISION, lat DOUBLE PRECISION)
RETURNS TABLE (
    country_id TEXT,
    admin_level INTEGER,
    prefecture_id TEXT,
    city_id TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ab.country_id,
        ab.admin_level,
        ab.prefecture_id,
        ab.city_id
    FROM admin_boundaries ab
    WHERE ST_Contains(ab.geom, ST_SetSRID(ST_Point(lng, lat), 4326))
    ORDER BY ab.admin_level DESC;
END;
$$ LANGUAGE plpgsql STABLE;

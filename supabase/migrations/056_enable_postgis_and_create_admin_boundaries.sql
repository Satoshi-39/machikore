-- PostGISを有効化し、行政区域テーブルをgeometry型で作成
-- 国土数値情報 N03（行政区域）から生成したポリゴンを保存

-- PostGIS拡張を有効化（既に有効な場合はスキップ）
CREATE EXTENSION IF NOT EXISTS postgis;

-- 新しい行政区域テーブル（PostGIS geometry型）
CREATE TABLE IF NOT EXISTS admin_boundaries (
  id SERIAL PRIMARY KEY,
  code VARCHAR(5) NOT NULL,           -- 行政区域コード（5桁）
  name VARCHAR(100) NOT NULL,         -- 市区町村名
  prefecture VARCHAR(20) NOT NULL,    -- 都道府県名
  pref_code VARCHAR(2) NOT NULL,      -- 都道府県コード（2桁）
  geom GEOMETRY(MultiPolygon, 4326),  -- ポリゴン（WGS84座標系）
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(code)                        -- 行政区域コードは一意
);

-- 空間インデックス（GiST）を作成
CREATE INDEX IF NOT EXISTS idx_admin_boundaries_geom ON admin_boundaries USING GIST (geom);

-- 通常のインデックス
CREATE INDEX IF NOT EXISTS idx_admin_boundaries_code ON admin_boundaries(code);
CREATE INDEX IF NOT EXISTS idx_admin_boundaries_pref_code ON admin_boundaries(pref_code);

-- RLS（Row Level Security）を有効化
ALTER TABLE admin_boundaries ENABLE ROW LEVEL SECURITY;

-- 読み取りポリシー（全員が読める）
DROP POLICY IF EXISTS "admin_boundaries_read" ON admin_boundaries;
CREATE POLICY "admin_boundaries_read" ON admin_boundaries
  FOR SELECT USING (true);

-- 座標から市区町村を取得するRPC関数
CREATE OR REPLACE FUNCTION get_city_by_coordinate(
  lng DOUBLE PRECISION,
  lat DOUBLE PRECISION
)
RETURNS TABLE (
  code VARCHAR(5),
  name VARCHAR(100),
  prefecture VARCHAR(20),
  pref_code VARCHAR(2)
)
LANGUAGE SQL
STABLE
AS $$
  SELECT
    ab.code,
    ab.name,
    ab.prefecture,
    ab.pref_code
  FROM admin_boundaries ab
  WHERE ST_Contains(ab.geom, ST_SetSRID(ST_Point(lng, lat), 4326))
  LIMIT 1;
$$;

-- 関数の実行権限を付与
GRANT EXECUTE ON FUNCTION get_city_by_coordinate(DOUBLE PRECISION, DOUBLE PRECISION) TO anon, authenticated;

COMMENT ON TABLE admin_boundaries IS '行政区域ポリゴン（国土数値情報N03由来）';
COMMENT ON FUNCTION get_city_by_coordinate IS '座標から市区町村を判定するRPC関数';

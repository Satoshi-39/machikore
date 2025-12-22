-- =============================================
-- 交通機関テーブルの作成
-- 駅、空港、フェリーターミナル、バスターミナルを統合管理
-- =============================================

-- トランザクション開始
BEGIN;

-- =============================================
-- transport_hubs テーブル作成
-- =============================================

CREATE TABLE IF NOT EXISTS transport_hubs (
  -- 主キー
  id TEXT PRIMARY KEY,
  osm_id BIGINT,
  osm_type TEXT,  -- 'node', 'way', 'relation'

  -- 地域情報
  prefecture_id TEXT NOT NULL REFERENCES prefectures(id),
  city_id TEXT REFERENCES cities(id),

  -- 種類
  type TEXT NOT NULL CHECK (type IN ('station', 'airport', 'ferry_terminal', 'bus_terminal')),
  subtype TEXT,  -- 駅: 'jr', 'metro', 'toei', 'subway', 'private' / 空港: 'international', 'domestic', 'military', 'heliport'

  -- 名称
  name TEXT NOT NULL,
  name_kana TEXT,
  name_en TEXT,

  -- 運営情報
  operator TEXT,       -- 運営会社（'東日本旅客鉄道', '東京地下鉄' など）
  network TEXT,        -- 路線網（'京成', 'JR East' など）
  ref TEXT,            -- 路線コード/空港コード（'JY04', 'HND' など）

  -- 座標
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,

  -- メタデータ
  country_code TEXT DEFAULT 'jp',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- インデックス作成
-- =============================================

-- 都道府県での検索用
CREATE INDEX IF NOT EXISTS idx_transport_hubs_prefecture_id ON transport_hubs(prefecture_id);

-- 種類での検索用
CREATE INDEX IF NOT EXISTS idx_transport_hubs_type ON transport_hubs(type);

-- 種類とサブタイプの複合インデックス
CREATE INDEX IF NOT EXISTS idx_transport_hubs_type_subtype ON transport_hubs(type, subtype);

-- 名前での検索用
CREATE INDEX IF NOT EXISTS idx_transport_hubs_name ON transport_hubs(name);

-- 座標での検索用（地理的検索）
CREATE INDEX IF NOT EXISTS idx_transport_hubs_location ON transport_hubs(latitude, longitude);

-- OSM IDでの検索用（重複チェック用）
CREATE INDEX IF NOT EXISTS idx_transport_hubs_osm_id ON transport_hubs(osm_id);

-- =============================================
-- RLSポリシー設定
-- =============================================

-- RLSを有効化
ALTER TABLE transport_hubs ENABLE ROW LEVEL SECURITY;

-- 全ユーザーが読み取り可能
CREATE POLICY "transport_hubs_select_policy" ON transport_hubs
  FOR SELECT
  USING (true);

-- =============================================
-- コメント追加
-- =============================================

COMMENT ON TABLE transport_hubs IS '交通機関データ（駅、空港、フェリーターミナル、バスターミナル）';
COMMENT ON COLUMN transport_hubs.id IS '一意識別子（prefecture_type_osmid形式）';
COMMENT ON COLUMN transport_hubs.osm_id IS 'OpenStreetMapのID';
COMMENT ON COLUMN transport_hubs.osm_type IS 'OSMの要素タイプ（node/way/relation）';
COMMENT ON COLUMN transport_hubs.prefecture_id IS '都道府県ID';
COMMENT ON COLUMN transport_hubs.city_id IS '市区町村ID（オプション）';
COMMENT ON COLUMN transport_hubs.type IS '交通機関の種類（station/airport/ferry_terminal/bus_terminal）';
COMMENT ON COLUMN transport_hubs.subtype IS 'サブタイプ（駅: jr/metro/toei/subway/private、空港: international/domestic/military/heliport）';
COMMENT ON COLUMN transport_hubs.name IS '名称（日本語）';
COMMENT ON COLUMN transport_hubs.name_kana IS '名称（ふりがな）';
COMMENT ON COLUMN transport_hubs.name_en IS '名称（英語）';
COMMENT ON COLUMN transport_hubs.operator IS '運営会社';
COMMENT ON COLUMN transport_hubs.network IS '路線網';
COMMENT ON COLUMN transport_hubs.ref IS '路線コード/空港コード';
COMMENT ON COLUMN transport_hubs.latitude IS '緯度';
COMMENT ON COLUMN transport_hubs.longitude IS '経度';

-- トランザクションコミット
COMMIT;

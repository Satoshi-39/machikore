-- Supabase: Machi階層構造の追加
-- 実行場所: Supabase Dashboard > SQL Editor

-- ============================================
-- 1. prefectures（都道府県マスター）テーブル作成
-- ============================================

CREATE TABLE IF NOT EXISTS prefectures (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  name_kana TEXT NOT NULL,
  region TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE prefectures IS '都道府県マスターデータ';
COMMENT ON COLUMN prefectures.id IS 'ローマ字ID (例: tokyo, osaka)';
COMMENT ON COLUMN prefectures.name IS '都道府県名 (例: 東京都)';
COMMENT ON COLUMN prefectures.region IS '地方区分 (例: 関東, 近畿)';

-- RLSポリシー（全員読み取り可能）
ALTER TABLE prefectures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Prefectures are viewable by everyone"
  ON prefectures FOR SELECT
  USING (true);

-- ============================================
-- 2. cities（市区町村マスター）テーブル作成
-- ============================================

CREATE TABLE IF NOT EXISTS cities (
  id TEXT PRIMARY KEY,
  prefecture_id TEXT NOT NULL REFERENCES prefectures(id),
  name TEXT NOT NULL,
  name_kana TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('区', '市', '町', '村')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(prefecture_id, name)
);

COMMENT ON TABLE cities IS '市区町村マスターデータ';
COMMENT ON COLUMN cities.id IS 'ローマ字ID (例: shibuya, minato)';
COMMENT ON COLUMN cities.type IS '自治体種別 (区/市/町/村)';

-- インデックス
CREATE INDEX idx_cities_prefecture_id ON cities(prefecture_id);

-- RLSポリシー（全員読み取り可能）
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cities are viewable by everyone"
  ON cities FOR SELECT
  USING (true);

-- ============================================
-- 3. machi（街・駅マスター）テーブル作成
-- ============================================

CREATE TABLE IF NOT EXISTS machi (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  line_name TEXT NOT NULL,
  prefecture_id TEXT NOT NULL REFERENCES prefectures(id),
  city_id TEXT REFERENCES cities(id),
  prefecture TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE machi IS '街・駅マスターデータ';
COMMENT ON COLUMN machi.prefecture IS '後方互換用（将来削除予定）';

-- インデックス
CREATE INDEX idx_machi_name ON machi(name);
CREATE INDEX idx_machi_line_name ON machi(line_name);
CREATE INDEX idx_machi_prefecture_id ON machi(prefecture_id);
CREATE INDEX idx_machi_city_id ON machi(city_id);

-- RLSポリシー（全員読み取り可能）
ALTER TABLE machi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Machi are viewable by everyone"
  ON machi FOR SELECT
  USING (true);

-- ============================================
-- 4. サンプルデータ投入（関東地方のみ）
-- ============================================

-- 都道府県
INSERT INTO prefectures (id, name, name_kana, region) VALUES
  ('tokyo', '東京都', 'とうきょうと', '関東'),
  ('kanagawa', '神奈川県', 'かながわけん', '関東'),
  ('saitama', '埼玉県', 'さいたまけん', '関東'),
  ('chiba', '千葉県', 'ちばけん', '関東')
ON CONFLICT (id) DO NOTHING;

-- 東京23区
INSERT INTO cities (id, prefecture_id, name, name_kana, type) VALUES
  ('chiyoda', 'tokyo', '千代田区', 'ちよだく', '区'),
  ('chuo', 'tokyo', '中央区', 'ちゅうおうく', '区'),
  ('minato', 'tokyo', '港区', 'みなとく', '区'),
  ('shinjuku', 'tokyo', '新宿区', 'しんじゅくく', '区'),
  ('bunkyo', 'tokyo', '文京区', 'ぶんきょうく', '区'),
  ('taito', 'tokyo', '台東区', 'たいとうく', '区'),
  ('sumida', 'tokyo', '墨田区', 'すみだく', '区'),
  ('koto', 'tokyo', '江東区', 'こうとうく', '区'),
  ('shinagawa', 'tokyo', '品川区', 'しながわく', '区'),
  ('meguro', 'tokyo', '目黒区', 'めぐろく', '区'),
  ('ota', 'tokyo', '大田区', 'おおたく', '区'),
  ('setagaya', 'tokyo', '世田谷区', 'せたがやく', '区'),
  ('shibuya', 'tokyo', '渋谷区', 'しぶやく', '区'),
  ('nakano', 'tokyo', '中野区', 'なかのく', '区'),
  ('suginami', 'tokyo', '杉並区', 'すぎなみく', '区'),
  ('toshima', 'tokyo', '豊島区', 'としまく', '区'),
  ('kita', 'tokyo', '北区', 'きたく', '区'),
  ('arakawa', 'tokyo', '荒川区', 'あらかわく', '区'),
  ('itabashi', 'tokyo', '板橋区', 'いたばしく', '区'),
  ('nerima', 'tokyo', '練馬区', 'ねりまく', '区'),
  ('adachi', 'tokyo', '足立区', 'あだちく', '区'),
  ('katsushika', 'tokyo', '葛飾区', 'かつしかく', '区'),
  ('edogawa', 'tokyo', '江戸川区', 'えどがわく', '区')
ON CONFLICT (id) DO NOTHING;

-- 確認用クエリ
SELECT
  p.name as prefecture,
  COUNT(c.id) as city_count
FROM prefectures p
LEFT JOIN cities c ON p.id = c.prefecture_id
GROUP BY p.id, p.name
ORDER BY p.name;

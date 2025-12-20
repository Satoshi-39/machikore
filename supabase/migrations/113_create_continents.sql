-- 大陸マスターテーブルを作成
-- countriesテーブルのcontinent_id外部キー参照先

CREATE TABLE IF NOT EXISTS continents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- コメント
COMMENT ON TABLE continents IS '大陸マスターテーブル';
COMMENT ON COLUMN continents.id IS '大陸ID (例: east_asia, europe)';
COMMENT ON COLUMN continents.name IS '大陸名（日本語）';
COMMENT ON COLUMN continents.name_en IS '大陸名（英語）';
COMMENT ON COLUMN continents.display_order IS '表示順序';

-- RLS有効化（読み取り専用マスターデータ）
ALTER TABLE continents ENABLE ROW LEVEL SECURITY;

-- 全員が読み取り可能
CREATE POLICY "continents_select_policy" ON continents
  FOR SELECT USING (true);

-- 初期データ投入
INSERT INTO continents (id, name, name_en, display_order) VALUES
  ('east_asia', '東アジア', 'East Asia', 1),
  ('southeast_asia', '東南アジア', 'Southeast Asia', 2),
  ('south_asia', '南アジア', 'South Asia', 3),
  ('central_asia', '中央アジア', 'Central Asia', 4),
  ('west_asia', '西アジア', 'West Asia', 5),
  ('europe', 'ヨーロッパ', 'Europe', 6),
  ('north_america', '北アメリカ', 'North America', 7),
  ('central_america', '中央アメリカ', 'Central America', 8),
  ('south_america', '南アメリカ', 'South America', 9),
  ('oceania', 'オセアニア', 'Oceania', 10),
  ('africa', 'アフリカ', 'Africa', 11)
ON CONFLICT (id) DO NOTHING;

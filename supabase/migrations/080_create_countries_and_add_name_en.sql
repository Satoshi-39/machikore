-- ===============================
-- 国テーブル作成 & 多言語対応カラム追加
-- ===============================

-- 1. 国テーブルを作成
CREATE TABLE IF NOT EXISTS countries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_kana TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  country_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 国テーブルのRLSを有効化
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

-- 誰でも読み取り可能
CREATE POLICY "countries_select_policy" ON countries
  FOR SELECT USING (true);

-- 国テーブルのトリガー
CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON countries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. regionsテーブルのname UNIQUE制約を削除（複数国で同じ名前がありえるため）
-- ※データ挿入前に削除する必要がある
-- 制約を先に削除（インデックスは制約に依存しているため制約削除で自動的に削除される）
ALTER TABLE regions DROP CONSTRAINT IF EXISTS regions_name_key;

-- 3. regionsテーブルにカラムを追加
ALTER TABLE regions ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE regions ADD COLUMN IF NOT EXISTS country_code TEXT NOT NULL DEFAULT 'jp';
ALTER TABLE regions ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE regions ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- 4. prefecturesテーブルにカラムを追加
ALTER TABLE prefectures ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE prefectures ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE prefectures ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
ALTER TABLE prefectures ADD COLUMN IF NOT EXISTS country_code TEXT NOT NULL DEFAULT 'jp';

-- 4. 国データを挿入
INSERT INTO countries (id, name, name_en, name_kana, latitude, longitude, country_code) VALUES
  ('japan', '日本', 'Japan', 'にほん', 36.2048, 138.2529, 'jp'),
  ('usa', 'アメリカ', 'United States', '', 37.0902, -95.7129, 'us'),
  ('south_korea', '韓国', 'South Korea', '', 35.9078, 127.7669, 'kr'),
  ('taiwan', '台湾', 'Taiwan', '', 23.6978, 120.9605, 'tw'),
  ('china', '中国', 'China', '', 35.8617, 104.1954, 'cn'),
  ('thailand', 'タイ', 'Thailand', '', 15.87, 100.9925, 'th')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  name_kana = EXCLUDED.name_kana,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  country_code = EXCLUDED.country_code,
  updated_at = NOW();

-- 5. 日本の地方データにname_enを設定
UPDATE regions SET name_en = 'Hokkaido' WHERE id = 'hokkaido';
UPDATE regions SET name_en = 'Tohoku' WHERE id = 'tohoku';
UPDATE regions SET name_en = 'Kanto' WHERE id = 'kanto';
UPDATE regions SET name_en = 'Chubu' WHERE id = 'chubu';
UPDATE regions SET name_en = 'Kinki' WHERE id = 'kinki';
UPDATE regions SET name_en = 'Chugoku' WHERE id = 'chugoku';
UPDATE regions SET name_en = 'Shikoku' WHERE id = 'shikoku';
UPDATE regions SET name_en = 'Kyushu' WHERE id = 'kyushu';
UPDATE regions SET name_en = 'Okinawa' WHERE id = 'okinawa';

-- 6. 新しい国の地方データを挿入
-- アメリカ
INSERT INTO regions (id, name, name_en, name_kana, latitude, longitude, country_code, display_order) VALUES
  ('us_northeast', '北東部', 'Northeast', '', 42, -73, 'us', 1),
  ('us_midwest', '中西部', 'Midwest', '', 41, -91, 'us', 2),
  ('us_south', '南部', 'South', '', 33, -88, 'us', 3),
  ('us_west', '西部', 'West', '', 40, -115, 'us', 4)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  updated_at = NOW();

-- 韓国
INSERT INTO regions (id, name, name_en, name_kana, latitude, longitude, country_code, display_order) VALUES
  ('kr_capital', '首都圏', 'Capital', '', 37.5, 127, 'kr', 1),
  ('kr_gangwon', '江原圏', 'Gangwon', '', 37.75, 128.25, 'kr', 2),
  ('kr_chungcheong', '忠清圏', 'Chungcheong', '', 36.5, 127, 'kr', 3),
  ('kr_honam', '湖南圏', 'Honam', '', 35.5, 127, 'kr', 4),
  ('kr_yeongnam', '嶺南圏', 'Yeongnam', '', 35.5, 128.5, 'kr', 5),
  ('kr_jeju', '済州圏', 'Jeju', '', 33.4, 126.5, 'kr', 6)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  updated_at = NOW();

-- 台湾
INSERT INTO regions (id, name, name_en, name_kana, latitude, longitude, country_code, display_order) VALUES
  ('tw_north', '北部', 'Northern Taiwan', '', 25, 121.5, 'tw', 1),
  ('tw_central', '中部', 'Central Taiwan', '', 24, 120.7, 'tw', 2),
  ('tw_south', '南部', 'Southern Taiwan', '', 23, 120.3, 'tw', 3),
  ('tw_east', '東部', 'Eastern Taiwan', '', 23.5, 121.3, 'tw', 4),
  ('tw_islands', '離島', 'Offshore Islands', '', 24, 119, 'tw', 5)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  updated_at = NOW();

-- 中国
INSERT INTO regions (id, name, name_en, name_kana, latitude, longitude, country_code, display_order) VALUES
  ('cn_north', '華北', 'North China', '', 40, 116, 'cn', 1),
  ('cn_northeast', '東北', 'Northeast China', '', 44, 125, 'cn', 2),
  ('cn_east', '華東', 'East China', '', 31, 121, 'cn', 3),
  ('cn_central', '華中', 'Central China', '', 31, 112, 'cn', 4),
  ('cn_south', '華南', 'South China', '', 23, 113, 'cn', 5),
  ('cn_southwest', '西南', 'Southwest China', '', 30, 103, 'cn', 6),
  ('cn_northwest', '西北', 'Northwest China', '', 36, 106, 'cn', 7)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  updated_at = NOW();

-- タイ
INSERT INTO regions (id, name, name_en, name_kana, latitude, longitude, country_code, display_order) VALUES
  ('th_north', '北部', 'Northern Thailand', '', 18.8, 99, 'th', 1),
  ('th_northeast', '東北部', 'Northeastern Thailand', '', 16, 103, 'th', 2),
  ('th_central', '中部', 'Central Thailand', '', 14, 100.5, 'th', 3),
  ('th_east', '東部', 'Eastern Thailand', '', 13, 102, 'th', 4),
  ('th_west', '西部', 'Western Thailand', '', 13, 99.5, 'th', 5),
  ('th_south', '南部', 'Southern Thailand', '', 8, 99, 'th', 6)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  updated_at = NOW();


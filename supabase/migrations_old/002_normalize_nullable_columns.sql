-- ===============================
-- NULL許容の統一とcontinents.name_kana追加
-- ===============================
-- 方針:
-- - 必須項目（name, custom_name等）→ NOT NULL
-- - オプション項目（name_kana, description, 緯度経度等）→ NULL許容
-- - デフォルト空文字 '' は削除し、NULLで統一
-- ===============================

-- ===============================
-- 1. continents に name_kana を追加
-- ===============================
ALTER TABLE continents ADD COLUMN IF NOT EXISTS name_kana text;

-- ===============================
-- 2. name_kana の NOT NULL 制約を削除
-- ===============================
-- countries
ALTER TABLE countries ALTER COLUMN name_kana DROP NOT NULL;
ALTER TABLE countries ALTER COLUMN name_kana DROP DEFAULT;

-- cities
ALTER TABLE cities ALTER COLUMN name_kana DROP NOT NULL;

-- prefectures
ALTER TABLE prefectures ALTER COLUMN name_kana DROP NOT NULL;

-- regions
ALTER TABLE regions ALTER COLUMN name_kana DROP NOT NULL;

-- machi (既にNULL許容だがデフォルトを削除)
ALTER TABLE machi ALTER COLUMN name_kana DROP DEFAULT;
ALTER TABLE machi ALTER COLUMN prefecture_name DROP DEFAULT;

-- ===============================
-- 3. 空文字をNULLに変換
-- ===============================
UPDATE countries SET name_kana = NULL WHERE name_kana = '';
UPDATE cities SET name_kana = NULL WHERE name_kana = '';
UPDATE prefectures SET name_kana = NULL WHERE name_kana = '';
UPDATE regions SET name_kana = NULL WHERE name_kana = '';
UPDATE machi SET name_kana = NULL WHERE name_kana = '';
UPDATE machi SET prefecture_name = NULL WHERE prefecture_name = '';

-- ===============================
-- 4. 外部キーの NOT NULL 制約を追加
-- ===============================
-- 国は必ずいずれかの大陸に属する
ALTER TABLE countries ALTER COLUMN continent_id SET NOT NULL;

-- 地方は必ずいずれかの国に属する
ALTER TABLE regions ALTER COLUMN country_id SET NOT NULL;

-- ===============================
-- 5. 緯度経度の NOT NULL 制約を削除
-- ===============================
-- マスターデータとして座標が入力されない場合があるため NULL 許容
-- ※ master_spots, transport_hubs は座標必須なので NOT NULL のまま

-- countries
ALTER TABLE countries ALTER COLUMN latitude DROP NOT NULL;
ALTER TABLE countries ALTER COLUMN longitude DROP NOT NULL;

-- regions
ALTER TABLE regions ALTER COLUMN latitude DROP NOT NULL;
ALTER TABLE regions ALTER COLUMN longitude DROP NOT NULL;

-- machi
ALTER TABLE machi ALTER COLUMN latitude DROP NOT NULL;
ALTER TABLE machi ALTER COLUMN longitude DROP NOT NULL;

-- ===============================
-- 6. machi.prefecture_name を NOT NULL に変更
-- ===============================
-- prefecture_id が NOT NULL なので、非正規化データも一貫性を保つ
-- 既存の NULL データがあれば prefectures から取得して埋める
UPDATE machi m
SET prefecture_name = p.name
FROM prefectures p
WHERE m.prefecture_id = p.id AND m.prefecture_name IS NULL;

ALTER TABLE machi ALTER COLUMN prefecture_name SET NOT NULL;

-- ===============================
-- 7. machi.created_at / updated_at を NOT NULL に変更
-- ===============================
-- タイムスタンプは必須
UPDATE machi SET created_at = now() WHERE created_at IS NULL;
UPDATE machi SET updated_at = now() WHERE updated_at IS NULL;
ALTER TABLE machi ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE machi ALTER COLUMN updated_at SET NOT NULL;

-- ===============================
-- 8. user_spots.color の奇妙なデフォルトを修正
-- ===============================
-- 現状: DEFAULT '''blue''::text'::text（二重エスケープ）
-- spot_colorがあるのでcolorは削除候補だが、まずデフォルトを修正
ALTER TABLE user_spots ALTER COLUMN color DROP DEFAULT;
UPDATE user_spots SET color = NULL WHERE color = '''blue''::text';

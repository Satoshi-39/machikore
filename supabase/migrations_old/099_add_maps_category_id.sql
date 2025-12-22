-- ===============================
-- mapsテーブルにcategory_id外部キーを追加
-- ===============================

-- 1. category_idカラムを追加（外部キー）
ALTER TABLE maps
ADD COLUMN category_id TEXT REFERENCES categories(id);

-- 2. 既存のcategoryデータをcategory_idに移行
-- 既存のcategoryがcategories.nameと一致する場合にIDを設定
UPDATE maps
SET category_id = c.id
FROM categories c
WHERE maps.category = c.name;

-- 3. category_idにインデックスを作成
CREATE INDEX IF NOT EXISTS idx_maps_category_id ON maps (category_id);

-- 4. コメント追加
COMMENT ON COLUMN maps.category_id IS 'カテゴリへの外部キー参照';
COMMENT ON COLUMN maps.category IS '非推奨: category_idを使用してください。将来的に削除予定';

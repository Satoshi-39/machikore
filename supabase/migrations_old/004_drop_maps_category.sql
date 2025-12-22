-- ===============================
-- maps.category カラムを削除
-- ===============================
-- 非推奨カラム。category_id（外部キー → categories.id）を使用する。
-- コメントにも「非推奨: category_idを使用してください」と記載されていた。

ALTER TABLE maps DROP COLUMN IF EXISTS category;

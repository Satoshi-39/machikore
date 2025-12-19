-- featured_carousel_itemsにcategory_idを追加
-- NULL = すべてカテゴリ用、値あり = 特定カテゴリ用

-- カラム追加
ALTER TABLE featured_carousel_items
ADD COLUMN category_id TEXT REFERENCES categories(id) ON DELETE SET NULL;

-- インデックス追加
CREATE INDEX idx_featured_carousel_items_category ON featured_carousel_items(category_id);

-- コメント
COMMENT ON COLUMN featured_carousel_items.category_id IS 'カテゴリID（NULLの場合は「すべて」カテゴリで表示）';

-- ===============================
-- master_spots.bookmarks_count カラムを削除
-- ===============================
-- このカラムは使用されておらず、更新する仕組みもないため削除
-- favorites_count が代わりに使用される

-- インデックスを削除（存在する場合）
DROP INDEX IF EXISTS idx_master_spots_bookmarks_count;

-- カラムを削除
ALTER TABLE master_spots DROP COLUMN IF EXISTS bookmarks_count;

-- =============================================
-- マスタースポットのいいね機能を削除し、ブックマーク機能を追加
-- =============================================

-- =============================================
-- 1. likesテーブルからmaster_spot_id関連を削除
-- =============================================

-- 既存のマスタースポットいいねデータを削除
DELETE FROM likes WHERE master_spot_id IS NOT NULL;

-- CHECK制約を削除して再作成（master_spot_idを除外）
ALTER TABLE likes DROP CONSTRAINT IF EXISTS likes_check;
ALTER TABLE likes ADD CONSTRAINT likes_check CHECK (
  (map_id IS NOT NULL AND spot_id IS NULL) OR
  (map_id IS NULL AND spot_id IS NOT NULL)
);

-- master_spot_idカラムを削除
ALTER TABLE likes DROP COLUMN IF EXISTS master_spot_id;

-- インデックスを削除
DROP INDEX IF EXISTS idx_likes_master_spot_id;

-- =============================================
-- 2. master_spotsテーブルからlikes_countを削除
-- =============================================

ALTER TABLE master_spots DROP COLUMN IF EXISTS likes_count;

-- =============================================
-- 3. いいね数関数を削除
-- =============================================

DROP FUNCTION IF EXISTS increment_master_spot_likes_count(UUID);
DROP FUNCTION IF EXISTS decrement_master_spot_likes_count(UUID);

-- =============================================
-- 4. bookmarksテーブルにmaster_spot_idを追加
-- =============================================

-- master_spot_idカラムを追加
ALTER TABLE bookmarks ADD COLUMN IF NOT EXISTS master_spot_id UUID REFERENCES master_spots(id) ON DELETE CASCADE;

-- 既存のCHECK制約を削除して再作成（master_spot_idを含む）
ALTER TABLE bookmarks DROP CONSTRAINT IF EXISTS bookmarks_check;
ALTER TABLE bookmarks ADD CONSTRAINT bookmarks_check CHECK (
  (map_id IS NOT NULL AND spot_id IS NULL AND master_spot_id IS NULL) OR
  (map_id IS NULL AND spot_id IS NOT NULL AND master_spot_id IS NULL) OR
  (map_id IS NULL AND spot_id IS NULL AND master_spot_id IS NOT NULL)
);

-- インデックスを追加
CREATE INDEX IF NOT EXISTS idx_bookmarks_master_spot_id ON bookmarks(master_spot_id);

-- ユニーク制約を更新（複合ユニーク制約）
-- 既存の制約を削除（制約はDROP CONSTRAINTで削除する必要がある）
ALTER TABLE bookmarks DROP CONSTRAINT IF EXISTS bookmarks_user_id_map_id_spot_id_key;
-- 既存の部分ユニークインデックスがあれば削除
DROP INDEX IF EXISTS bookmarks_user_map_unique;
DROP INDEX IF EXISTS bookmarks_user_spot_unique;
DROP INDEX IF EXISTS bookmarks_user_master_spot_unique;
-- 新しい部分ユニークインデックスを作成
CREATE UNIQUE INDEX bookmarks_user_map_unique ON bookmarks (user_id, map_id) WHERE map_id IS NOT NULL;
CREATE UNIQUE INDEX bookmarks_user_spot_unique ON bookmarks (user_id, spot_id) WHERE spot_id IS NOT NULL;
CREATE UNIQUE INDEX bookmarks_user_master_spot_unique ON bookmarks (user_id, master_spot_id) WHERE master_spot_id IS NOT NULL;

-- =============================================
-- 5. master_spotsテーブルにbookmarks_countを追加
-- =============================================

ALTER TABLE master_spots ADD COLUMN IF NOT EXISTS bookmarks_count INTEGER DEFAULT 0;

-- =============================================
-- 6. ブックマーク数関数を追加
-- =============================================

-- マスタースポットのブックマーク数をインクリメント
CREATE OR REPLACE FUNCTION increment_master_spot_bookmarks_count(p_master_spot_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE master_spots
  SET bookmarks_count = bookmarks_count + 1
  WHERE id = p_master_spot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- マスタースポットのブックマーク数をデクリメント
CREATE OR REPLACE FUNCTION decrement_master_spot_bookmarks_count(p_master_spot_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE master_spots
  SET bookmarks_count = GREATEST(0, bookmarks_count - 1)
  WHERE id = p_master_spot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

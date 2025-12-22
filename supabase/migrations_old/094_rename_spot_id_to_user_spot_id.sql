-- =============================================
-- 全テーブルのspot_idをuser_spot_idにリネーム
--
-- 対象テーブル：
-- - comments
-- - images
-- - likes
-- - notifications
--
-- 注意: bookmarksテーブルは既にuser_spot_idにリネーム済み
--
-- 理由：
-- - spot_idはuser_spotsテーブルを参照しているため、
--   master_spot_idとの区別をつけやすくするためにリネーム
-- =============================================

-- =============================================
-- 1. comments テーブル
-- =============================================

-- インデックスを削除
DROP INDEX IF EXISTS idx_comments_spot_id;

-- 外部キー制約を削除
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_spot_id_fkey;

-- カラム名を変更
ALTER TABLE comments RENAME COLUMN spot_id TO user_spot_id;

-- 外部キー制約を追加
ALTER TABLE comments ADD CONSTRAINT comments_user_spot_id_fkey
  FOREIGN KEY (user_spot_id) REFERENCES user_spots(id) ON DELETE CASCADE;

-- インデックスを作成
CREATE INDEX idx_comments_user_spot_id ON comments(user_spot_id);

-- =============================================
-- 3. images テーブル
-- =============================================

-- インデックスを削除
DROP INDEX IF EXISTS idx_images_spot_id;

-- 外部キー制約を削除
ALTER TABLE images DROP CONSTRAINT IF EXISTS images_spot_id_fkey;

-- カラム名を変更
ALTER TABLE images RENAME COLUMN spot_id TO user_spot_id;

-- 外部キー制約を追加
ALTER TABLE images ADD CONSTRAINT images_user_spot_id_fkey
  FOREIGN KEY (user_spot_id) REFERENCES user_spots(id) ON DELETE CASCADE;

-- インデックスを作成
CREATE INDEX idx_images_user_spot_id ON images(user_spot_id);

-- =============================================
-- 4. likes テーブル
-- =============================================

-- インデックスを削除
DROP INDEX IF EXISTS idx_likes_spot_id;

-- 既存のユニーク制約を削除
ALTER TABLE likes DROP CONSTRAINT IF EXISTS likes_user_id_map_id_spot_id_key;

-- CHECK制約を削除
ALTER TABLE likes DROP CONSTRAINT IF EXISTS likes_check;

-- 外部キー制約を削除
ALTER TABLE likes DROP CONSTRAINT IF EXISTS likes_spot_id_fkey;

-- カラム名を変更
ALTER TABLE likes RENAME COLUMN spot_id TO user_spot_id;

-- 外部キー制約を追加
ALTER TABLE likes ADD CONSTRAINT likes_user_spot_id_fkey
  FOREIGN KEY (user_spot_id) REFERENCES user_spots(id) ON DELETE CASCADE;

-- CHECK制約を再作成
ALTER TABLE likes ADD CONSTRAINT likes_check CHECK (
  (map_id IS NOT NULL AND user_spot_id IS NULL) OR
  (map_id IS NULL AND user_spot_id IS NOT NULL)
);

-- インデックスを作成
CREATE INDEX idx_likes_user_spot_id ON likes(user_spot_id);

-- ユニーク制約を再作成（部分インデックス）
-- likes_user_map_uniqueは既に存在する可能性があるのでIF NOT EXISTSを使用
CREATE UNIQUE INDEX IF NOT EXISTS likes_user_map_unique ON likes (user_id, map_id) WHERE map_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS likes_user_spot_unique ON likes (user_id, user_spot_id) WHERE user_spot_id IS NOT NULL;

-- =============================================
-- 5. notifications テーブル
-- =============================================

-- インデックスを削除（存在する場合）
DROP INDEX IF EXISTS idx_notifications_spot_id;

-- 外部キー制約を削除
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_spot_id_fkey;

-- カラム名を変更
ALTER TABLE notifications RENAME COLUMN spot_id TO user_spot_id;

-- 外部キー制約を追加
ALTER TABLE notifications ADD CONSTRAINT notifications_user_spot_id_fkey
  FOREIGN KEY (user_spot_id) REFERENCES user_spots(id) ON DELETE CASCADE;

-- インデックスを作成
CREATE INDEX idx_notifications_user_spot_id ON notifications(user_spot_id);

-- =============================================
-- 6. RPC関数を削除して新しい名前で再作成
-- =============================================

-- 旧関数を削除（bookmarks用）
DROP FUNCTION IF EXISTS increment_spot_bookmarks_count(UUID);
DROP FUNCTION IF EXISTS decrement_spot_bookmarks_count(UUID);
-- 既存の関数も削除（パラメータ名変更のため）
DROP FUNCTION IF EXISTS increment_user_spot_bookmarks_count(UUID);
DROP FUNCTION IF EXISTS decrement_user_spot_bookmarks_count(UUID);

-- ユーザースポットのブックマーク数インクリメント関数（リネーム）
CREATE FUNCTION increment_user_spot_bookmarks_count(user_spot_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_spots
  SET bookmarks_count = bookmarks_count + 1
  WHERE id = user_spot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ユーザースポットのブックマーク数デクリメント関数（リネーム）
CREATE FUNCTION decrement_user_spot_bookmarks_count(user_spot_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_spots
  SET bookmarks_count = GREATEST(0, bookmarks_count - 1)
  WHERE id = user_spot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 旧関数を削除（likes用）
DROP FUNCTION IF EXISTS increment_spot_likes_count(UUID);
DROP FUNCTION IF EXISTS decrement_spot_likes_count(UUID);
DROP FUNCTION IF EXISTS increment_user_spot_likes_count(UUID);
DROP FUNCTION IF EXISTS decrement_user_spot_likes_count(UUID);

-- ユーザースポットのいいね数インクリメント関数（リネーム）
CREATE FUNCTION increment_user_spot_likes_count(user_spot_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_spots
  SET likes_count = likes_count + 1
  WHERE id = user_spot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ユーザースポットのいいね数デクリメント関数（リネーム）
CREATE FUNCTION decrement_user_spot_likes_count(user_spot_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_spots
  SET likes_count = GREATEST(0, likes_count - 1)
  WHERE id = user_spot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 旧関数を削除（comments用）
DROP FUNCTION IF EXISTS increment_spot_comments_count(UUID);
DROP FUNCTION IF EXISTS decrement_spot_comments_count(UUID);
DROP FUNCTION IF EXISTS increment_user_spot_comments_count(UUID);
DROP FUNCTION IF EXISTS decrement_user_spot_comments_count(UUID);

-- ユーザースポットのコメント数インクリメント関数（リネーム）
CREATE FUNCTION increment_user_spot_comments_count(user_spot_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_spots
  SET comments_count = comments_count + 1
  WHERE id = user_spot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ユーザースポットのコメント数デクリメント関数（リネーム）
CREATE FUNCTION decrement_user_spot_comments_count(user_spot_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_spots
  SET comments_count = GREATEST(0, comments_count - 1)
  WHERE id = user_spot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 旧関数を削除（images用）
DROP FUNCTION IF EXISTS increment_spot_images_count(UUID);
DROP FUNCTION IF EXISTS decrement_spot_images_count(UUID);
DROP FUNCTION IF EXISTS increment_user_spot_images_count(UUID);
DROP FUNCTION IF EXISTS decrement_user_spot_images_count(UUID);

-- ユーザースポットの画像数インクリメント関数（リネーム）
CREATE FUNCTION increment_user_spot_images_count(user_spot_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_spots
  SET images_count = images_count + 1
  WHERE id = user_spot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ユーザースポットの画像数デクリメント関数（リネーム）
CREATE FUNCTION decrement_user_spot_images_count(user_spot_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_spots
  SET images_count = GREATEST(0, images_count - 1)
  WHERE id = user_spot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

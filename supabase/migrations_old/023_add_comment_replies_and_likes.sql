-- ===============================
-- コメント返信機能といいね機能の追加
-- ===============================

-- 1. commentsテーブルに返信用カラムを追加
-- parent_id: 直接の親コメントID（NULLならトップレベル）
-- root_id: ルートコメントID（スレッドのグループ化用、将来の拡張用）
-- depth: 階層の深さ（0がトップレベル、1が返信、2が返信の返信...）
-- likes_count: いいね数
-- replies_count: 返信数（直接の子コメントのみカウント）

ALTER TABLE comments
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS root_id UUID REFERENCES comments(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS depth INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS likes_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS replies_count INTEGER NOT NULL DEFAULT 0;

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_root_id ON comments(root_id);
CREATE INDEX IF NOT EXISTS idx_comments_depth ON comments(depth);

-- ===============================
-- 2. comment_likesテーブル作成
-- ===============================

CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, comment_id)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);

-- ===============================
-- 3. RLSポリシー設定
-- ===============================

ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- 誰でも閲覧可能
CREATE POLICY "comment_likes_select_all" ON comment_likes
  FOR SELECT USING (true);

-- 自分のいいねのみ作成可能
CREATE POLICY "comment_likes_insert_own" ON comment_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 自分のいいねのみ削除可能
CREATE POLICY "comment_likes_delete_own" ON comment_likes
  FOR DELETE USING (auth.uid() = user_id);

-- ===============================
-- 4. いいね数更新トリガー
-- ===============================

-- いいね追加時にカウントを増やす
CREATE OR REPLACE FUNCTION increment_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE comments
  SET likes_count = likes_count + 1
  WHERE id = NEW.comment_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- いいね削除時にカウントを減らす
CREATE OR REPLACE FUNCTION decrement_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE comments
  SET likes_count = GREATEST(0, likes_count - 1)
  WHERE id = OLD.comment_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガー作成
DROP TRIGGER IF EXISTS trigger_increment_comment_likes ON comment_likes;
CREATE TRIGGER trigger_increment_comment_likes
  AFTER INSERT ON comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION increment_comment_likes_count();

DROP TRIGGER IF EXISTS trigger_decrement_comment_likes ON comment_likes;
CREATE TRIGGER trigger_decrement_comment_likes
  AFTER DELETE ON comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_comment_likes_count();

-- ===============================
-- 5. 返信数更新トリガー
-- ===============================

-- 返信追加時に親コメントのカウントを増やす
CREATE OR REPLACE FUNCTION increment_comment_replies_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_id IS NOT NULL THEN
    UPDATE comments
    SET replies_count = replies_count + 1
    WHERE id = NEW.parent_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 返信削除時に親コメントのカウントを減らす
CREATE OR REPLACE FUNCTION decrement_comment_replies_count()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.parent_id IS NOT NULL THEN
    UPDATE comments
    SET replies_count = GREATEST(0, replies_count - 1)
    WHERE id = OLD.parent_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガー作成
DROP TRIGGER IF EXISTS trigger_increment_comment_replies ON comments;
CREATE TRIGGER trigger_increment_comment_replies
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION increment_comment_replies_count();

DROP TRIGGER IF EXISTS trigger_decrement_comment_replies ON comments;
CREATE TRIGGER trigger_decrement_comment_replies
  AFTER DELETE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION decrement_comment_replies_count();

-- =============================================
-- マスタースポットをブックマークから分離
--
-- 変更内容：
-- 1. bookmarksテーブルからmaster_spot_id関連を削除
-- 2. master_spot_favoritesテーブルを新規作成（お気に入りフラグ用）
--
-- 理由：
-- - ブックマークはユーザースポットとマップのみに限定
-- - マスタースポットのお気に入りはデフォルトマップ専用機能として分離
-- - これによりブックマークフォルダのマップ表示がシンプルになる
-- =============================================

-- =============================================
-- 1. bookmarksテーブルからmaster_spot_id関連を削除
-- =============================================

-- master_spot_idを持つブックマークを削除（データ移行は後で行う）
DELETE FROM bookmarks WHERE master_spot_id IS NOT NULL;

-- インデックスを削除
DROP INDEX IF EXISTS idx_bookmarks_master_spot_id;
DROP INDEX IF EXISTS bookmarks_user_master_spot_unique;
DROP INDEX IF EXISTS bookmarks_user_master_spot_folder_unique;

-- CHECK制約を削除して再作成（master_spot_idを除外）
ALTER TABLE bookmarks DROP CONSTRAINT IF EXISTS bookmarks_check;
ALTER TABLE bookmarks ADD CONSTRAINT bookmarks_check CHECK (
  (map_id IS NOT NULL AND user_spot_id IS NULL) OR
  (map_id IS NULL AND user_spot_id IS NOT NULL)
);

-- 外部キー制約を削除
ALTER TABLE bookmarks DROP CONSTRAINT IF EXISTS bookmarks_master_spot_id_fkey;

-- master_spot_idカラムを削除
ALTER TABLE bookmarks DROP COLUMN IF EXISTS master_spot_id;

-- RPC関数を削除
DROP FUNCTION IF EXISTS increment_master_spot_bookmarks_count(UUID);
DROP FUNCTION IF EXISTS decrement_master_spot_bookmarks_count(UUID);

-- =============================================
-- 2. master_spot_favoritesテーブルを新規作成
-- =============================================

CREATE TABLE IF NOT EXISTS master_spot_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  master_spot_id UUID NOT NULL REFERENCES master_spots(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, master_spot_id)
);

-- インデックス作成
CREATE INDEX idx_master_spot_favorites_user_id ON master_spot_favorites(user_id);
CREATE INDEX idx_master_spot_favorites_master_spot_id ON master_spot_favorites(master_spot_id);

-- RLS有効化
ALTER TABLE master_spot_favorites ENABLE ROW LEVEL SECURITY;

-- 自分のお気に入りのみ閲覧可能
CREATE POLICY "Users can view own favorites"
  ON master_spot_favorites FOR SELECT
  USING (auth.uid() = user_id);

-- 自分のお気に入りのみ追加可能
CREATE POLICY "Users can insert own favorites"
  ON master_spot_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 自分のお気に入りのみ削除可能
CREATE POLICY "Users can delete own favorites"
  ON master_spot_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- 3. master_spotsテーブルにfavorites_countカラム追加
-- =============================================

ALTER TABLE master_spots ADD COLUMN IF NOT EXISTS favorites_count INTEGER DEFAULT 0;

-- お気に入り数インクリメント関数
CREATE OR REPLACE FUNCTION increment_master_spot_favorites_count(master_spot_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE master_spots
  SET favorites_count = favorites_count + 1
  WHERE id = master_spot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- お気に入り数デクリメント関数
CREATE OR REPLACE FUNCTION decrement_master_spot_favorites_count(master_spot_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE master_spots
  SET favorites_count = GREATEST(0, favorites_count - 1)
  WHERE id = master_spot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

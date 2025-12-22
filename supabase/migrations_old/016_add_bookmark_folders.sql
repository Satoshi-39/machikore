-- =============================================
-- ブックマークフォルダ機能
-- =============================================

-- ===============================
-- 1. bookmark_folders テーブル作成
-- ===============================

CREATE TABLE IF NOT EXISTS bookmark_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_bookmark_folders_user_id ON bookmark_folders(user_id);

-- ===============================
-- 2. bookmarks テーブルに folder_id を追加
-- ===============================

ALTER TABLE bookmarks
ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES bookmark_folders(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_bookmarks_folder_id ON bookmarks(folder_id);

-- ===============================
-- 3. RLS ポリシー
-- ===============================

ALTER TABLE bookmark_folders ENABLE ROW LEVEL SECURITY;

-- 自分のフォルダのみ閲覧可能
CREATE POLICY "Users can view their own bookmark folders"
  ON bookmark_folders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 自分のフォルダのみ作成可能
CREATE POLICY "Users can create their own bookmark folders"
  ON bookmark_folders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 自分のフォルダのみ更新可能
CREATE POLICY "Users can update their own bookmark folders"
  ON bookmark_folders FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- 自分のフォルダのみ削除可能
CREATE POLICY "Users can delete their own bookmark folders"
  ON bookmark_folders FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ===============================
-- 4. updated_at 自動更新トリガー
-- ===============================

CREATE TRIGGER update_bookmark_folders_updated_at
  BEFORE UPDATE ON bookmark_folders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

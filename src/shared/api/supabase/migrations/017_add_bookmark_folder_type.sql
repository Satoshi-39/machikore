-- =============================================
-- ブックマークフォルダにタイプ（スポット/マップ）を追加
-- スポット用フォルダとマップ用フォルダを独立させる
-- =============================================

-- folder_type カラムを追加
ALTER TABLE bookmark_folders
ADD COLUMN IF NOT EXISTS folder_type TEXT NOT NULL DEFAULT 'spots'
  CHECK (folder_type IN ('spots', 'maps'));

-- インデックス追加
CREATE INDEX IF NOT EXISTS idx_bookmark_folders_type ON bookmark_folders(folder_type);

-- 既存データは全てスポット用としてマイグレーション済み
-- マップ用フォルダは新規作成が必要

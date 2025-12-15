-- 特集カルーセル画像用ストレージバケット

-- ===============================
-- 1. featured-carousels バケット作成
-- ===============================

INSERT INTO storage.buckets (id, name, public)
VALUES ('featured-carousels', 'featured-carousels', true)
ON CONFLICT (id) DO NOTHING;

-- ===============================
-- 2. RLS ポリシー設定
-- ===============================

-- 既存ポリシーを削除（再実行時のエラー回避）
DROP POLICY IF EXISTS "Anyone can view featured carousel images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload featured carousel images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete featured carousel images" ON storage.objects;

-- 誰でも閲覧可能
CREATE POLICY "Anyone can view featured carousel images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'featured-carousels');

-- 認証済みユーザーはアップロード可能（将来的に管理者のみに制限可能）
CREATE POLICY "Authenticated users can upload featured carousel images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'featured-carousels');

-- 認証済みユーザーは削除可能（将来的に管理者のみに制限可能）
CREATE POLICY "Authenticated users can delete featured carousel images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'featured-carousels');

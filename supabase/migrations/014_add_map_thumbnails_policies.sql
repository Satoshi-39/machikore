-- map-thumbnails バケットの RLS ポリシー設定
-- Supabase Dashboard > SQL Editor で実行してください

-- ===============================
-- map-thumbnails バケットのポリシー
-- ===============================

-- 既存ポリシーを削除（再実行時のエラー回避）
DROP POLICY IF EXISTS "Anyone can view map thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload map thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own map thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own map thumbnails" ON storage.objects;

-- 誰でも閲覧可能
CREATE POLICY "Anyone can view map thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'map-thumbnails');

-- 認証済みユーザーはアップロード可能
CREATE POLICY "Authenticated users can upload map thumbnails"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'map-thumbnails');

-- 自分がアップロードした画像は更新可能
CREATE POLICY "Users can update their own map thumbnails"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'map-thumbnails' AND owner = auth.uid());

-- 自分がアップロードした画像は削除可能
CREATE POLICY "Users can delete their own map thumbnails"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'map-thumbnails' AND owner = auth.uid());

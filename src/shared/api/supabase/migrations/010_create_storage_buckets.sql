-- Supabase Storage バケットの作成
-- Supabase Dashboard > Storage で手動作成するか、このSQLを実行

-- ===============================
-- 1. spot-images バケット
-- ===============================

-- バケットを作成（存在しない場合）
INSERT INTO storage.buckets (id, name, public)
VALUES ('spot-images', 'spot-images', true)
ON CONFLICT (id) DO NOTHING;

-- ===============================
-- 2. RLS ポリシー設定
-- ===============================

-- 既存ポリシーを削除（再実行時のエラー回避）
DROP POLICY IF EXISTS "Anyone can view spot images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload spot images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own spot images" ON storage.objects;

-- 誰でも閲覧可能
CREATE POLICY "Anyone can view spot images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'spot-images');

-- 認証済みユーザーはアップロード可能
CREATE POLICY "Authenticated users can upload spot images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'spot-images');

-- 自分がアップロードした画像は削除可能
-- （注：owner = auth.uid() でチェック）
CREATE POLICY "Users can delete their own spot images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'spot-images' AND owner = auth.uid());

-- ===============================
-- 3. avatars バケット（既存がなければ）
-- ===============================

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- avatars用ポリシー
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars' AND owner = auth.uid());

-- ===============================
-- 4. map-thumbnails バケット（将来用）
-- ===============================

INSERT INTO storage.buckets (id, name, public)
VALUES ('map-thumbnails', 'map-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

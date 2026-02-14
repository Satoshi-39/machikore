-- OGサムネイル画像用ストレージバケット
-- fetch-ogp Edge Function が外部OG画像をダウンロードし、このバケットに再アップロードする

-- ===============================
-- 1. og-thumbnails バケット作成
-- ===============================

INSERT INTO storage.buckets (id, name, public)
VALUES ('og-thumbnails', 'og-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- ===============================
-- 2. RLS ポリシー設定
-- ===============================

-- 既存ポリシーを削除（再実行時のエラー回避）
DROP POLICY IF EXISTS "Anyone can view og thumbnail images" ON storage.objects;

-- 誰でも閲覧可能（公開バケット）
CREATE POLICY "Anyone can view og thumbnail images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'og-thumbnails');

-- INSERT/UPDATE/DELETE ポリシーは不要
-- アップロードはEdge FunctionからService Role Keyで行うため、RLSをバイパスする

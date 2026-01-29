-- ============================================================
-- spot_shorts テーブル作成
-- ============================================================
-- ショート動画（30秒以内）を保存するテーブル
-- Supabase Storageに保存した動画URLを参照
-- 最終更新: 2026-01-20

-- ===============================
-- テーブル作成
-- ===============================

CREATE TABLE spot_shorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id UUID NOT NULL REFERENCES user_spots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- 動画情報
  video_url TEXT NOT NULL,              -- Supabase Storage URL
  thumbnail_url TEXT,                    -- サムネイル画像URL（任意）
  duration_seconds SMALLINT,             -- 動画長（秒）

  -- メタデータ（任意）
  width SMALLINT,                        -- 動画幅
  height SMALLINT,                       -- 動画高さ
  file_size_bytes INTEGER,               -- ファイルサイズ（バイト）

  -- 順序・日時
  order_index SMALLINT DEFAULT 0,        -- 表示順（複数動画がある場合）
  created_at TIMESTAMPTZ DEFAULT now(),

  -- 制約: 30秒以内
  CONSTRAINT duration_max_30s CHECK (duration_seconds IS NULL OR duration_seconds <= 30)
);

-- コメント
COMMENT ON TABLE spot_shorts IS 'スポットに紐づくショート動画（30秒以内）';
COMMENT ON COLUMN spot_shorts.video_url IS 'Supabase Storageに保存された動画のURL';
COMMENT ON COLUMN spot_shorts.thumbnail_url IS '動画のサムネイル画像URL（任意）';
COMMENT ON COLUMN spot_shorts.duration_seconds IS '動画の長さ（秒）。最大30秒';

-- ===============================
-- インデックス
-- ===============================

CREATE INDEX idx_spot_shorts_spot_id ON spot_shorts(spot_id);
CREATE INDEX idx_spot_shorts_user_id ON spot_shorts(user_id);
CREATE INDEX idx_spot_shorts_created_at ON spot_shorts(created_at DESC);

-- ===============================
-- RLS（Row Level Security）
-- ===============================

ALTER TABLE spot_shorts ENABLE ROW LEVEL SECURITY;

-- 公開スポットのショート動画は誰でも閲覧可能
CREATE POLICY "spot_shorts_select_public" ON spot_shorts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_spots us
      JOIN maps m ON m.id = us.map_id
      WHERE us.id = spot_shorts.spot_id
        AND us.is_public = true
        AND m.is_public = true
    )
  );

-- 自分のショート動画は常に閲覧可能
CREATE POLICY "spot_shorts_select_own" ON spot_shorts
  FOR SELECT
  USING (auth.uid() = user_id);

-- 自分のショート動画のみ作成可能
CREATE POLICY "spot_shorts_insert_own" ON spot_shorts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 自分のショート動画のみ更新可能
CREATE POLICY "spot_shorts_update_own" ON spot_shorts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 自分のショート動画のみ削除可能
CREATE POLICY "spot_shorts_delete_own" ON spot_shorts
  FOR DELETE
  USING (auth.uid() = user_id);

-- ===============================
-- Supabase Storage バケット作成
-- ===============================
-- 注意: Storage バケットはSQLでは作成できません
-- Supabase Dashboardまたは以下のAPIで作成してください:
--
-- バケット名: spot-shorts
-- 公開設定: public（URLで直接アクセス可能にするため）
-- ファイルサイズ制限: 50MB（30秒720pで十分な余裕）
-- 許可するMIMEタイプ: video/mp4, video/quicktime, video/webm

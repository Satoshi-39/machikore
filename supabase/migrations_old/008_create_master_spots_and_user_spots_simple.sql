-- master_spots と user_spots の2テーブル構成
-- SQLiteスキーマと統一（データ移行なしのシンプル版）

-- ===============================
-- 0. クリーンアップ
-- ===============================
DROP TABLE IF EXISTS spots_backup;
DROP TABLE IF EXISTS user_spots CASCADE;
DROP TABLE IF EXISTS master_spots CASCADE;
DROP TABLE IF EXISTS spots CASCADE;

-- ===============================
-- 1. master_spots テーブル作成
-- ===============================

CREATE TABLE master_spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 基本情報
  name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,

  -- Google Places情報（検索から追加した場合）
  google_place_id TEXT UNIQUE,
  google_formatted_address TEXT,
  google_types TEXT[],
  google_phone_number TEXT,
  google_website_uri TEXT,
  google_rating DOUBLE PRECISION,
  google_user_rating_count INTEGER,

  -- メタデータ
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX idx_master_spots_google_place_id ON master_spots(google_place_id);
CREATE INDEX idx_master_spots_name ON master_spots(name);
CREATE INDEX idx_master_spots_location ON master_spots(latitude, longitude);

-- ===============================
-- 2. user_spots テーブル作成
-- ===============================

CREATE TABLE user_spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 関連
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  map_id UUID NOT NULL REFERENCES maps(id) ON DELETE CASCADE,
  master_spot_id UUID NOT NULL REFERENCES master_spots(id) ON DELETE CASCADE,
  machi_id TEXT NOT NULL REFERENCES machi(id),

  -- ユーザーカスタマイズ
  custom_name TEXT,
  description TEXT,
  tags TEXT[],

  -- メタデータ
  images_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- 同じユーザーが同じマップに同じスポットを重複登録しないように
  UNIQUE(user_id, map_id, master_spot_id)
);

-- インデックス作成
CREATE INDEX idx_user_spots_user_id ON user_spots(user_id);
CREATE INDEX idx_user_spots_map_id ON user_spots(map_id);
CREATE INDEX idx_user_spots_master_spot_id ON user_spots(master_spot_id);
CREATE INDEX idx_user_spots_machi_id ON user_spots(machi_id);
CREATE INDEX idx_user_spots_created_at ON user_spots(created_at DESC);

-- ===============================
-- 3. 外部キー制約の更新（images, likes, comments, bookmarks）
-- ===============================

-- images テーブルの spot_id を user_spots.id を参照するように更新
ALTER TABLE images DROP CONSTRAINT IF EXISTS images_spot_id_fkey;
ALTER TABLE images ADD CONSTRAINT images_spot_id_fkey
  FOREIGN KEY (spot_id) REFERENCES user_spots(id) ON DELETE CASCADE;

-- likes テーブルの spot_id を user_spots.id を参照するように更新
ALTER TABLE likes DROP CONSTRAINT IF EXISTS likes_spot_id_fkey;
ALTER TABLE likes ADD CONSTRAINT likes_spot_id_fkey
  FOREIGN KEY (spot_id) REFERENCES user_spots(id) ON DELETE CASCADE;

-- comments テーブルの spot_id を user_spots.id を参照するように更新
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_spot_id_fkey;
ALTER TABLE comments ADD CONSTRAINT comments_spot_id_fkey
  FOREIGN KEY (spot_id) REFERENCES user_spots(id) ON DELETE CASCADE;

-- bookmarks テーブルの spot_id を user_spots.id を参照するように更新
ALTER TABLE bookmarks DROP CONSTRAINT IF EXISTS bookmarks_spot_id_fkey;
ALTER TABLE bookmarks ADD CONSTRAINT bookmarks_spot_id_fkey
  FOREIGN KEY (spot_id) REFERENCES user_spots(id) ON DELETE CASCADE;

-- ===============================
-- 4. Row Level Security (RLS) ポリシー
-- ===============================

-- master_spots テーブル
ALTER TABLE master_spots ENABLE ROW LEVEL SECURITY;

-- 全ユーザーが閲覧可能
CREATE POLICY "Master spots are viewable by everyone"
  ON master_spots FOR SELECT
  TO authenticated
  USING (true);

-- 認証ユーザーが作成可能（検索結果から登録時）
CREATE POLICY "Authenticated users can create master spots"
  ON master_spots FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- user_spots テーブル
ALTER TABLE user_spots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User spots are viewable if map is viewable"
  ON user_spots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM maps
      WHERE maps.id = user_spots.map_id
      AND (maps.is_public = true OR maps.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create spots in their own maps"
  ON user_spots FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM maps
      WHERE maps.id = user_spots.map_id
      AND maps.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own spots"
  ON user_spots FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own spots"
  ON user_spots FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ===============================
-- 5. 更新日時の自動更新トリガー
-- ===============================

DROP TRIGGER IF EXISTS update_master_spots_updated_at ON master_spots;
CREATE TRIGGER update_master_spots_updated_at BEFORE UPDATE ON master_spots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_spots_updated_at ON user_spots;
CREATE TRIGGER update_user_spots_updated_at BEFORE UPDATE ON user_spots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

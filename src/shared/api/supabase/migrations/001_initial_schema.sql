-- 街コレ (Machikore) 初期スキーマ
-- PostgreSQL / Supabase用

-- ===============================
-- 1. ユーザーテーブル
-- ===============================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_subscribed BOOLEAN DEFAULT FALSE,
  subscription_started_at TIMESTAMPTZ,
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ===============================
-- 2. 地方テーブル（マスターデータ）
-- ===============================

CREATE TABLE IF NOT EXISTS regions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  name_kana TEXT NOT NULL,
  name_translations JSONB,
  country_code TEXT NOT NULL DEFAULT 'jp',
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===============================
-- 3. 都道府県テーブル（マスターデータ）
-- ===============================

CREATE TABLE IF NOT EXISTS prefectures (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  name_kana TEXT NOT NULL,
  name_translations JSONB,
  region_id TEXT REFERENCES regions(id),
  country_code TEXT NOT NULL DEFAULT 'jp',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===============================
-- 4. 市区町村テーブル（マスターデータ）
-- ===============================

CREATE TABLE IF NOT EXISTS cities (
  id TEXT PRIMARY KEY,
  prefecture_id TEXT NOT NULL REFERENCES prefectures(id),
  name TEXT NOT NULL,
  name_kana TEXT NOT NULL,
  name_translations JSONB,
  type TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT 'jp',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_cities_prefecture_id ON cities(prefecture_id);

-- ===============================
-- 5. 街テーブル（マスターデータ）
-- ===============================

CREATE TABLE IF NOT EXISTS machi (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_kana TEXT NOT NULL,
  name_translations JSONB,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  lines JSONB,
  prefecture_id TEXT NOT NULL REFERENCES prefectures(id),
  city_id TEXT REFERENCES cities(id),
  country_code TEXT NOT NULL DEFAULT 'jp',
  prefecture_name TEXT NOT NULL,
  prefecture_name_translations JSONB,
  city_name TEXT,
  city_name_translations JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_machi_name ON machi(name);
CREATE INDEX IF NOT EXISTS idx_machi_prefecture_id ON machi(prefecture_id);
CREATE INDEX IF NOT EXISTS idx_machi_city_id ON machi(city_id);
CREATE INDEX IF NOT EXISTS idx_machi_country_code ON machi(country_code);

-- ===============================
-- 6. マップテーブル
-- ===============================

CREATE TABLE IF NOT EXISTS maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tags JSONB, -- JSON array of tags
  is_public BOOLEAN DEFAULT FALSE,
  is_default BOOLEAN DEFAULT FALSE,
  is_official BOOLEAN DEFAULT FALSE,
  thumbnail_url TEXT,
  spots_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_maps_user_id ON maps(user_id);
CREATE INDEX IF NOT EXISTS idx_maps_is_public ON maps(is_public);
CREATE INDEX IF NOT EXISTS idx_maps_created_at ON maps(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_maps_tags ON maps USING GIN(tags);

-- ===============================
-- 7. スポットテーブル
-- ===============================

CREATE TABLE IF NOT EXISTS spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  map_id UUID NOT NULL REFERENCES maps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  machi_id TEXT NOT NULL REFERENCES machi(id),
  name TEXT NOT NULL,
  address TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  memo TEXT,
  images_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_spots_map_id ON spots(map_id);
CREATE INDEX IF NOT EXISTS idx_spots_user_id ON spots(user_id);
CREATE INDEX IF NOT EXISTS idx_spots_machi_id ON spots(machi_id);
CREATE INDEX IF NOT EXISTS idx_spots_created_at ON spots(created_at DESC);

-- ===============================
-- 8. 訪問記録テーブル（マップ訪問）
-- ===============================

CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  map_id UUID NOT NULL REFERENCES maps(id) ON DELETE CASCADE,
  visited_at TIMESTAMPTZ NOT NULL,
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_visits_user_id ON visits(user_id);
CREATE INDEX IF NOT EXISTS idx_visits_map_id ON visits(map_id);
CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON visits(visited_at);

-- ===============================
-- 9. フォローテーブル
-- ===============================

CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  followee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(follower_id, followee_id)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_followee_id ON follows(followee_id);

-- ===============================
-- 10. コメントテーブル（マップとスポット用）
-- ===============================

CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  map_id UUID REFERENCES maps(id) ON DELETE CASCADE,
  spot_id UUID REFERENCES spots(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    (map_id IS NOT NULL AND spot_id IS NULL) OR
    (map_id IS NULL AND spot_id IS NOT NULL)
  )
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_map_id ON comments(map_id);
CREATE INDEX IF NOT EXISTS idx_comments_spot_id ON comments(spot_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- ===============================
-- 11. ブックマークテーブル（マップとスポット用）
-- ===============================

CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  map_id UUID REFERENCES maps(id) ON DELETE CASCADE,
  spot_id UUID REFERENCES spots(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, map_id, spot_id),
  CHECK (
    (map_id IS NOT NULL AND spot_id IS NULL) OR
    (map_id IS NULL AND spot_id IS NOT NULL)
  )
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_map_id ON bookmarks(map_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_spot_id ON bookmarks(spot_id);

-- ===============================
-- 12. 画像テーブル（スポット用）
-- ===============================

CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id UUID NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
  local_path TEXT,
  cloud_path TEXT,
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_images_spot_id ON images(spot_id);

-- ===============================
-- 13. いいねテーブル（マップとスポット用）
-- ===============================

CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  map_id UUID REFERENCES maps(id) ON DELETE CASCADE,
  spot_id UUID REFERENCES spots(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, map_id, spot_id),
  CHECK (
    (map_id IS NOT NULL AND spot_id IS NULL) OR
    (map_id IS NULL AND spot_id IS NOT NULL)
  )
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_map_id ON likes(map_id);
CREATE INDEX IF NOT EXISTS idx_likes_spot_id ON likes(spot_id);

-- ===============================
-- Row Level Security (RLS) ポリシー
-- ===============================

-- users テーブル
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- maps テーブル
ALTER TABLE maps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public maps are viewable by everyone"
  ON maps FOR SELECT
  TO authenticated
  USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users can create their own maps"
  ON maps FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own maps"
  ON maps FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own maps"
  ON maps FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- spots テーブル
ALTER TABLE spots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Spots are viewable if map is viewable"
  ON spots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM maps
      WHERE maps.id = spots.map_id
      AND (maps.is_public = true OR maps.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create spots in their own maps"
  ON spots FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM maps
      WHERE maps.id = spots.map_id
      AND maps.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update spots in their own maps"
  ON spots FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete spots in their own maps"
  ON spots FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- likes テーブル
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes are viewable by everyone"
  ON likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own likes"
  ON likes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own likes"
  ON likes FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- comments テーブル
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- bookmarks テーブル
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own bookmarks"
  ON bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- images テーブル
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Images are viewable if spot is viewable"
  ON images FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM spots
      JOIN maps ON maps.id = spots.map_id
      WHERE spots.id = images.spot_id
      AND (maps.is_public = true OR maps.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create images in their own spots"
  ON images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM spots
      WHERE spots.id = images.spot_id
      AND spots.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete images in their own spots"
  ON images FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM spots
      WHERE spots.id = images.spot_id
      AND spots.user_id = auth.uid()
    )
  );

-- follows テーブル
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Follows are viewable by everyone"
  ON follows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own follows"
  ON follows FOR INSERT
  TO authenticated
  WITH CHECK (follower_id = auth.uid());

CREATE POLICY "Users can delete their own follows"
  ON follows FOR DELETE
  TO authenticated
  USING (follower_id = auth.uid());

-- visits テーブル
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own visits"
  ON visits FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own visits"
  ON visits FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own visits"
  ON visits FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own visits"
  ON visits FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ===============================
-- 更新日時の自動更新トリガー
-- ===============================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maps_updated_at BEFORE UPDATE ON maps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spots_updated_at BEFORE UPDATE ON spots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON visits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_images_updated_at BEFORE UPDATE ON images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prefectures_updated_at BEFORE UPDATE ON prefectures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cities_updated_at BEFORE UPDATE ON cities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

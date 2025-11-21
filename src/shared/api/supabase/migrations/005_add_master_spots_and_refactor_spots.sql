-- マスタースポットと2テーブル構成への移行
-- Mapbox Geocoding統合のための準備

-- ===============================
-- 1. マスタースポットテーブル作成
-- ===============================

CREATE TABLE IF NOT EXISTS master_spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 基本情報
  name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,

  -- Mapbox情報（グルーピング用）
  mapbox_place_id TEXT UNIQUE,           -- Mapboxの一意ID
  mapbox_place_name TEXT,                 -- Mapbox正式名称
  mapbox_category TEXT[],                 -- カテゴリー（POI, address等）
  mapbox_address TEXT,                    -- 住所
  mapbox_context JSONB,                   -- その他のMapbox情報

  -- メタデータ
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_master_spots_mapbox_place_id ON master_spots(mapbox_place_id);
CREATE INDEX IF NOT EXISTS idx_master_spots_name ON master_spots(name);
CREATE INDEX IF NOT EXISTS idx_master_spots_location ON master_spots(latitude, longitude);

-- ===============================
-- 2. 既存spotsテーブルのバックアップ
-- ===============================

-- 既存データを一時テーブルに保存
CREATE TABLE IF NOT EXISTS spots_backup AS
SELECT * FROM spots;

-- ===============================
-- 3. 既存spotsからmaster_spotsを作成
-- ===============================

-- 重複を除外してマスタースポットを作成
-- （同じ緯度経度・名前のスポットは1つのマスタースポットに）
INSERT INTO master_spots (name, latitude, longitude, created_at)
SELECT DISTINCT ON (name, ROUND(latitude::numeric, 6), ROUND(longitude::numeric, 6))
  name,
  latitude,
  longitude,
  MIN(created_at) OVER (PARTITION BY name, ROUND(latitude::numeric, 6), ROUND(longitude::numeric, 6)) as created_at
FROM spots
ON CONFLICT DO NOTHING;

-- ===============================
-- 4. spotsテーブルを再構築
-- ===============================

-- 古いspotsテーブルを削除（外部キー制約も削除される）
DROP TABLE IF EXISTS spots CASCADE;

-- 新しいuser_spotsテーブルを作成
CREATE TABLE user_spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 関連
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  map_id UUID NOT NULL REFERENCES maps(id) ON DELETE CASCADE,
  master_spot_id UUID NOT NULL REFERENCES master_spots(id) ON DELETE CASCADE,
  machi_id TEXT NOT NULL REFERENCES machi(id),

  -- ユーザーカスタマイズ
  custom_name TEXT,                       -- ユーザー独自の名前（任意）
  description TEXT,                       -- 旧memoカラム
  tags TEXT[],                            -- タグ（将来的な拡張用）

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
CREATE INDEX IF NOT EXISTS idx_user_spots_user_id ON user_spots(user_id);
CREATE INDEX IF NOT EXISTS idx_user_spots_map_id ON user_spots(map_id);
CREATE INDEX IF NOT EXISTS idx_user_spots_master_spot_id ON user_spots(master_spot_id);
CREATE INDEX IF NOT EXISTS idx_user_spots_machi_id ON user_spots(machi_id);
CREATE INDEX IF NOT EXISTS idx_user_spots_created_at ON user_spots(created_at DESC);

-- ===============================
-- 5. バックアップデータを新構造に移行
-- ===============================

-- spots_backupから新しいuser_spotsテーブルにデータを移行
INSERT INTO user_spots (
  id,
  user_id,
  map_id,
  master_spot_id,
  machi_id,
  description,
  images_count,
  likes_count,
  comments_count,
  order_index,
  created_at,
  updated_at
)
SELECT
  sb.id,
  sb.user_id,
  sb.map_id,
  ms.id as master_spot_id,
  sb.machi_id,
  sb.memo as description,
  sb.images_count,
  sb.likes_count,
  sb.comments_count,
  sb.order_index,
  sb.created_at,
  sb.updated_at
FROM spots_backup sb
JOIN master_spots ms ON (
  ms.name = sb.name
  AND ROUND(ms.latitude::numeric, 6) = ROUND(sb.latitude::numeric, 6)
  AND ROUND(ms.longitude::numeric, 6) = ROUND(sb.longitude::numeric, 6)
);

-- バックアップテーブルを削除
DROP TABLE IF EXISTS spots_backup;

-- ===============================
-- 6. Row Level Security (RLS) ポリシー
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

-- user_spots テーブル（新構造）
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
-- 7. 更新日時の自動更新トリガー
-- ===============================

CREATE TRIGGER update_master_spots_updated_at BEFORE UPDATE ON master_spots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- user_spots用のトリガーは再作成
CREATE TRIGGER update_user_spots_updated_at BEFORE UPDATE ON user_spots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================
-- 8. 既存の外部キー制約を持つテーブルの再作成
-- ===============================

-- imagesテーブルは既にspots.idを参照しているので、
-- CASCADE削除により自動的に再作成される必要はない

-- commentsテーブルも同様

-- likesテーブルも同様

-- bookmarksテーブルも同様

-- これらのテーブルはspots.idを参照しているが、
-- UUIDは変わらないので、データの再挿入は不要

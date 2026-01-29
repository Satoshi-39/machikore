-- user_spots に is_public カラムを追加
-- スポットの公開/非公開設定（デフォルト: true = 公開）
-- マップはデフォルト非公開だが、スポットはデフォルト公開

-- ============================================================
-- 1. カラム追加
-- ============================================================

ALTER TABLE public.user_spots
ADD COLUMN is_public boolean DEFAULT true NOT NULL;

COMMENT ON COLUMN public.user_spots.is_public IS 'スポットが公開されているかどうか（デフォルト: true）。マップが公開かつスポットが公開の場合のみ他ユーザーに表示される';

-- インデックス追加
CREATE INDEX idx_user_spots_is_public ON public.user_spots USING btree (is_public);

-- ============================================================
-- 2. RLSポリシーの更新
-- ============================================================

-- 既存のSELECTポリシーを削除
DROP POLICY IF EXISTS user_spots_select_public_or_own ON public.user_spots;

-- 新しいSELECTポリシー:
-- - 自分のマップのスポットは全て表示
-- - 他人の公開マップの公開スポットのみ表示
CREATE POLICY user_spots_select_public_or_own ON public.user_spots
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.maps
            WHERE maps.id = user_spots.map_id
            AND (
                -- 自分のマップなら全スポット表示
                maps.user_id = auth.uid()
                -- 他人の公開マップかつ公開スポットのみ表示
                OR (maps.is_public = true AND user_spots.is_public = true)
            )
        )
    );

-- ============================================================
-- 3. images テーブルのRLSポリシー更新
-- ============================================================

-- 既存のSELECTポリシーを削除
DROP POLICY IF EXISTS images_select_public_or_own ON public.images;

-- 新しいSELECTポリシー: スポットの公開設定も考慮
CREATE POLICY images_select_public_or_own ON public.images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_spots us
            JOIN public.maps m ON m.id = us.map_id
            WHERE us.id = images.user_spot_id
            AND (
                -- 自分のマップなら全画像表示
                m.user_id = auth.uid()
                -- 他人の公開マップかつ公開スポットの画像のみ表示
                OR (m.is_public = true AND us.is_public = true)
            )
        )
    );

-- ============================================================
-- 4. search_public_spots RPC関数の更新
-- ============================================================

-- 既存の関数を削除
DROP FUNCTION IF EXISTS public.search_public_spots(TEXT, INTEGER);

-- 新しい関数を作成（is_public条件を追加）
CREATE OR REPLACE FUNCTION public.search_public_spots(
  search_query TEXT,
  result_limit INTEGER DEFAULT 30
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  map_id UUID,
  master_spot_id UUID,
  machi_id TEXT,
  name JSONB,
  description TEXT,
  spot_color TEXT,
  label_id UUID,
  images_count INTEGER,
  likes_count INTEGER,
  comments_count INTEGER,
  order_index INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  google_formatted_address JSONB,
  google_short_address JSONB,
  is_public BOOLEAN,
  -- master_spot fields
  master_spot_name JSONB,
  master_spot_latitude DOUBLE PRECISION,
  master_spot_longitude DOUBLE PRECISION,
  master_spot_google_place_id TEXT,
  master_spot_google_formatted_address JSONB,
  master_spot_google_short_address JSONB,
  master_spot_google_types TEXT[],
  -- map_label fields
  label_name TEXT,
  label_color TEXT,
  -- user fields
  user_username TEXT,
  user_display_name TEXT,
  user_avatar_url TEXT,
  -- map fields
  map_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (us.id)
    us.id,
    us.user_id,
    us.map_id,
    us.master_spot_id,
    us.machi_id,
    us.name,
    us.description,
    us.spot_color,
    us.label_id,
    us.images_count,
    us.likes_count,
    us.comments_count,
    us.order_index,
    us.created_at,
    us.updated_at,
    us.latitude,
    us.longitude,
    us.google_formatted_address,
    us.google_short_address,
    us.is_public,
    -- master_spot
    ms.name AS master_spot_name,
    ms.latitude AS master_spot_latitude,
    ms.longitude AS master_spot_longitude,
    ms.google_place_id AS master_spot_google_place_id,
    ms.google_formatted_address AS master_spot_google_formatted_address,
    ms.google_short_address AS master_spot_google_short_address,
    ms.google_types AS master_spot_google_types,
    -- map_label
    ml.name AS label_name,
    ml.color AS label_color,
    -- user
    u.username AS user_username,
    u.display_name AS user_display_name,
    u.avatar_url AS user_avatar_url,
    -- map
    m.name AS map_name
  FROM user_spots us
  INNER JOIN maps m ON m.id = us.map_id AND m.is_public = true
  LEFT JOIN master_spots ms ON ms.id = us.master_spot_id
  LEFT JOIN map_labels ml ON ml.id = us.label_id
  LEFT JOIN users u ON u.id = us.user_id
  WHERE
    -- 公開スポットのみ検索対象
    us.is_public = true
    AND (
      -- 1. description検索
      us.description ILIKE '%' || search_query || '%'
      -- 2. master_spots.name検索 (Google検索経由のスポット)
      OR (ms.name IS NOT NULL AND ms.name::text ILIKE '%' || search_query || '%')
      -- 3. user_spots.name検索 (現在地/ピン刺し登録のスポット)
      OR (us.master_spot_id IS NULL AND us.name IS NOT NULL AND us.name::text ILIKE '%' || search_query || '%')
    )
  ORDER BY us.id, us.created_at DESC
  LIMIT result_limit;
END;
$$;

COMMENT ON FUNCTION public.search_public_spots IS '公開スポットをキーワードで検索。マップが公開かつスポットが公開のもののみ対象。description、master_spots.name、user_spots.name（現在地/ピン刺し登録）を検索対象とする';

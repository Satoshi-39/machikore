-- コレクション機能（マップをまとめるマガジン的機能）

-- コレクションテーブル
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  color TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  maps_count INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- コレクションとマップの中間テーブル
CREATE TABLE collection_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  map_id UUID NOT NULL REFERENCES maps(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(collection_id, map_id)
);

-- インデックス
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_collections_is_public ON collections(is_public);
CREATE INDEX idx_collection_maps_collection_id ON collection_maps(collection_id);
CREATE INDEX idx_collection_maps_map_id ON collection_maps(map_id);

-- コレクションのマップ数を更新するトリガー関数
CREATE OR REPLACE FUNCTION update_collection_maps_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE collections SET maps_count = maps_count + 1, updated_at = NOW() WHERE id = NEW.collection_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE collections SET maps_count = maps_count - 1, updated_at = NOW() WHERE id = OLD.collection_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- トリガー
CREATE TRIGGER trigger_update_collection_maps_count
  AFTER INSERT OR DELETE ON collection_maps
  FOR EACH ROW
  EXECUTE FUNCTION update_collection_maps_count();

-- updated_atを自動更新するトリガー
CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLSポリシー
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_maps ENABLE ROW LEVEL SECURITY;

-- collections: 公開コレクションは誰でも閲覧可、自分のは全て閲覧可
CREATE POLICY "Public collections are viewable by everyone"
  ON collections FOR SELECT
  USING (is_public = TRUE OR auth.uid() = user_id);

-- collections: 自分のコレクションのみ作成・更新・削除可
CREATE POLICY "Users can manage own collections"
  ON collections FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- collection_maps: コレクションが閲覧可能なら中間テーブルも閲覧可
CREATE POLICY "Collection maps viewable if collection is viewable"
  ON collection_maps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE id = collection_maps.collection_id
      AND (is_public = TRUE OR user_id = auth.uid())
    )
  );

-- collection_maps: 自分のコレクションのみマップ追加・削除可
CREATE POLICY "Users can manage maps in own collections"
  ON collection_maps FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE id = collection_maps.collection_id
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM collections
      WHERE id = collection_maps.collection_id
      AND user_id = auth.uid()
    )
  );

-- ============================================================
-- コレクション関連
-- ============================================================
-- テーブル: collections, collection_maps
-- 最終更新: 2025-12-23

-- ============================================================
-- collections (コレクション)
-- ============================================================
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    is_public BOOLEAN NOT NULL DEFAULT false,
    maps_count INTEGER NOT NULL DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_collections_is_public ON collections(is_public);
CREATE INDEX idx_collections_user_id ON collections(user_id);

-- RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "collections_select_public_or_own" ON collections
    FOR SELECT USING (is_public = true OR user_id = auth.uid());
CREATE POLICY "collections_insert_own" ON collections
    FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "collections_update_own" ON collections
    FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "collections_delete_own" ON collections
    FOR DELETE USING (user_id = auth.uid());

-- Trigger
CREATE TRIGGER update_collections_updated_at
    BEFORE UPDATE ON collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- collection_maps (コレクションとマップの関連)
-- ============================================================
CREATE TABLE collection_maps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    map_id UUID NOT NULL REFERENCES maps(id) ON DELETE CASCADE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(collection_id, map_id)
);

-- Indexes
CREATE INDEX idx_collection_maps_collection_id ON collection_maps(collection_id);
CREATE INDEX idx_collection_maps_map_id ON collection_maps(map_id);

-- RLS
ALTER TABLE collection_maps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "collection_maps_select_public_or_own" ON collection_maps
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM collections WHERE id = collection_id AND (is_public = true OR user_id = auth.uid()))
    );
CREATE POLICY "collection_maps_insert_own" ON collection_maps
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM collections WHERE id = collection_id AND user_id = auth.uid())
    );
CREATE POLICY "collection_maps_update_own" ON collection_maps
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM collections WHERE id = collection_id AND user_id = auth.uid())
    );
CREATE POLICY "collection_maps_delete_own" ON collection_maps
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM collections WHERE id = collection_id AND user_id = auth.uid())
    );

-- Trigger: コレクションのマップ数を更新
CREATE OR REPLACE FUNCTION update_collection_maps_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE collections SET maps_count = maps_count + 1 WHERE id = NEW.collection_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE collections SET maps_count = GREATEST(0, maps_count - 1) WHERE id = OLD.collection_id;
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_collection_maps_count
    AFTER INSERT OR DELETE ON collection_maps
    FOR EACH ROW EXECUTE FUNCTION update_collection_maps_count();

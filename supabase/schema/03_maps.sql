-- ============================================================
-- マップ関連
-- ============================================================
-- テーブル: categories, tags, maps, map_tags, map_labels
-- 最終更新: 2025-12-23

-- ============================================================
-- categories (カテゴリ)
-- ============================================================
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    name_translations JSONB,
    icon TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_categories_display_order ON categories(display_order);
CREATE INDEX idx_categories_is_active ON categories(is_active);

-- RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_select_all" ON categories FOR SELECT USING (true);

-- Trigger
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- tags (タグ)
-- ============================================================
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_translations JSONB,
    slug TEXT NOT NULL,
    usage_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_usage_count ON tags(usage_count DESC);

-- RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tags_select_all" ON tags FOR SELECT USING (true);

-- Trigger
CREATE TRIGGER update_tags_updated_at
    BEFORE UPDATE ON tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- maps (マップ)
-- ============================================================
CREATE TABLE maps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category_id TEXT REFERENCES categories(id),
    is_public BOOLEAN NOT NULL DEFAULT false,
    is_default BOOLEAN NOT NULL DEFAULT false,
    is_official BOOLEAN NOT NULL DEFAULT false,
    is_article_public BOOLEAN NOT NULL DEFAULT false,
    thumbnail_url TEXT,
    spots_count INTEGER NOT NULL DEFAULT 0,
    likes_count INTEGER NOT NULL DEFAULT 0,
    comments_count INTEGER NOT NULL DEFAULT 0,
    bookmarks_count INTEGER NOT NULL DEFAULT 0,
    article_intro JSONB,
    article_outro JSONB,
    show_label_chips BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_maps_bookmarks_count ON maps(bookmarks_count DESC);
CREATE INDEX idx_maps_category_id ON maps(category_id);
CREATE INDEX idx_maps_created_at ON maps(created_at DESC);
CREATE INDEX idx_maps_is_article_public ON maps(is_article_public);
CREATE INDEX idx_maps_is_public ON maps(is_public);
CREATE INDEX idx_maps_user_id ON maps(user_id);

-- RLS
ALTER TABLE maps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "maps_select_public_or_own" ON maps
    FOR SELECT USING (is_public = true OR user_id = auth.uid());
CREATE POLICY "maps_insert_own" ON maps
    FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "maps_update_own" ON maps
    FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "maps_delete_own" ON maps
    FOR DELETE USING (user_id = auth.uid());

-- Trigger
CREATE TRIGGER update_maps_updated_at
    BEFORE UPDATE ON maps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- map_tags (マップとタグの関連)
-- ============================================================
CREATE TABLE map_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    map_id UUID NOT NULL REFERENCES maps(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(map_id, tag_id)
);

-- Indexes
CREATE INDEX idx_map_tags_map_id ON map_tags(map_id);
CREATE INDEX idx_map_tags_tag_id ON map_tags(tag_id);

-- RLS
ALTER TABLE map_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "map_tags_select_all" ON map_tags FOR SELECT USING (true);
CREATE POLICY "map_tags_insert_own" ON map_tags
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM maps WHERE id = map_id AND user_id = auth.uid())
    );
CREATE POLICY "map_tags_delete_own" ON map_tags
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM maps WHERE id = map_id AND user_id = auth.uid())
    );

-- Trigger: タグ使用回数の更新
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tags SET usage_count = GREATEST(0, usage_count - 1) WHERE id = OLD.tag_id;
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tag_usage_count_trigger
    AFTER INSERT OR DELETE ON map_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();

-- ============================================================
-- map_labels (マップラベル)
-- ============================================================
CREATE TABLE map_labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    map_id UUID NOT NULL REFERENCES maps(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT 'blue',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_map_labels_map_id ON map_labels(map_id);

-- RLS
ALTER TABLE map_labels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "map_labels_select_public_or_own" ON map_labels
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM maps WHERE id = map_id AND (is_public = true OR user_id = auth.uid()))
    );
CREATE POLICY "map_labels_insert_own" ON map_labels
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM maps WHERE id = map_id AND user_id = auth.uid())
    );
CREATE POLICY "map_labels_update_own" ON map_labels
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM maps WHERE id = map_id AND user_id = auth.uid())
    );
CREATE POLICY "map_labels_delete_own" ON map_labels
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM maps WHERE id = map_id AND user_id = auth.uid())
    );

-- Trigger
CREATE TRIGGER update_map_labels_updated_at
    BEFORE UPDATE ON map_labels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- RPC Functions
-- ============================================================

-- マップのuser_spots数+1
CREATE OR REPLACE FUNCTION increment_user_spots_count(map_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE maps SET spots_count = spots_count + 1 WHERE id = map_id;
END;
$$ LANGUAGE plpgsql;

-- マップのuser_spots数-1
CREATE OR REPLACE FUNCTION decrement_user_spots_count(map_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE maps SET spots_count = GREATEST(0, spots_count - 1) WHERE id = map_id;
END;
$$ LANGUAGE plpgsql;

-- マップのいいね数+1
CREATE OR REPLACE FUNCTION increment_map_likes_count(map_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE maps SET likes_count = likes_count + 1 WHERE id = map_id;
END;
$$ LANGUAGE plpgsql;

-- マップのいいね数-1
CREATE OR REPLACE FUNCTION decrement_map_likes_count(map_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE maps SET likes_count = GREATEST(0, likes_count - 1) WHERE id = map_id;
END;
$$ LANGUAGE plpgsql;

-- マップのコメント数+1
CREATE OR REPLACE FUNCTION increment_map_comments_count(map_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE maps SET comments_count = comments_count + 1 WHERE id = map_id;
END;
$$ LANGUAGE plpgsql;

-- マップのコメント数-1
CREATE OR REPLACE FUNCTION decrement_map_comments_count(map_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE maps SET comments_count = GREATEST(0, comments_count - 1) WHERE id = map_id;
END;
$$ LANGUAGE plpgsql;

-- マップのブックマーク数+1
CREATE OR REPLACE FUNCTION increment_map_bookmarks_count(p_map_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE maps SET bookmarks_count = bookmarks_count + 1 WHERE id = p_map_id;
END;
$$ LANGUAGE plpgsql;

-- マップのブックマーク数-1
CREATE OR REPLACE FUNCTION decrement_map_bookmarks_count(p_map_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE maps SET bookmarks_count = GREATEST(0, bookmarks_count - 1) WHERE id = p_map_id;
END;
$$ LANGUAGE plpgsql;

-- マップ閲覧記録
CREATE OR REPLACE FUNCTION record_map_view(p_user_id UUID, p_map_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO view_history (user_id, map_id, viewed_at, view_count)
    VALUES (p_user_id, p_map_id, now(), 1)
    ON CONFLICT (user_id, map_id)
    DO UPDATE SET viewed_at = now(), view_count = view_history.view_count + 1;
END;
$$ LANGUAGE plpgsql;

-- カテゴリ別人気タグ取得
CREATE OR REPLACE FUNCTION get_popular_tags_by_category(p_category_id TEXT, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    name TEXT,
    name_translations JSONB,
    slug TEXT,
    usage_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT t.id, t.name, t.name_translations, t.slug, t.usage_count
    FROM tags t
    INNER JOIN map_tags mt ON mt.tag_id = t.id
    INNER JOIN maps m ON m.id = mt.map_id
    WHERE m.category_id = p_category_id AND m.is_public = true
    ORDER BY t.usage_count DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

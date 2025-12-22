-- ============================================================
-- フィーチャー関連
-- ============================================================
-- テーブル: featured_carousel_items, category_featured_maps, category_featured_tags
-- 最終更新: 2025-12-23

-- ============================================================
-- featured_carousel_items (発見タブカルーセル)
-- ============================================================
CREATE TABLE featured_carousel_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    image_url TEXT NOT NULL,
    link_type TEXT NOT NULL DEFAULT 'tag',  -- tag, map, user, url
    link_value TEXT,
    category_id TEXT REFERENCES categories(id),  -- NULLで全カテゴリ表示
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_featured_carousel_items_active_order ON featured_carousel_items(is_active, display_order)
    WHERE is_active = true;
CREATE INDEX idx_featured_carousel_items_category ON featured_carousel_items(category_id);

-- RLS
ALTER TABLE featured_carousel_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "featured_carousel_items_select_active" ON featured_carousel_items
    FOR SELECT USING (
        is_active = true
        AND (starts_at IS NULL OR starts_at <= now())
        AND (ends_at IS NULL OR ends_at > now())
    );

-- Trigger
CREATE TRIGGER update_featured_carousel_items_updated_at
    BEFORE UPDATE ON featured_carousel_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- category_featured_maps (カテゴリ別おすすめマップ)
-- ============================================================
CREATE TABLE category_featured_maps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    map_id UUID NOT NULL REFERENCES maps(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(category_id, map_id)
);

-- Indexes
CREATE INDEX idx_category_featured_maps_active ON category_featured_maps(is_active) WHERE is_active = true;
CREATE INDEX idx_category_featured_maps_category ON category_featured_maps(category_id);

-- RLS
ALTER TABLE category_featured_maps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "category_featured_maps_select_active" ON category_featured_maps
    FOR SELECT USING (is_active = true);

-- Trigger
CREATE TRIGGER update_category_featured_maps_updated_at
    BEFORE UPDATE ON category_featured_maps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- category_featured_tags (カテゴリ別おすすめタグ)
-- ============================================================
CREATE TABLE category_featured_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(category_id, tag_id)
);

-- Indexes
CREATE INDEX idx_category_featured_tags_active ON category_featured_tags(is_active) WHERE is_active = true;
CREATE INDEX idx_category_featured_tags_category ON category_featured_tags(category_id);

-- RLS
ALTER TABLE category_featured_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "category_featured_tags_select_active" ON category_featured_tags
    FOR SELECT USING (is_active = true);

-- Trigger
CREATE TRIGGER update_category_featured_tags_updated_at
    BEFORE UPDATE ON category_featured_tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

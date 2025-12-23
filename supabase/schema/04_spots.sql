-- ============================================================
-- スポット関連
-- ============================================================
-- テーブル: master_spots, master_spot_favorites, user_spots, spot_tags, images
-- 最終更新: 2025-12-23

-- ============================================================
-- master_spots (マスタースポット)
-- ============================================================
CREATE TABLE master_spots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    machi_id TEXT REFERENCES machi(id) ON DELETE SET NULL,  -- machiが削除されても保持
    google_place_id TEXT,
    google_formatted_address TEXT,
    google_short_address TEXT,
    google_types TEXT[],
    google_phone_number TEXT,
    google_website_uri TEXT,
    google_rating DOUBLE PRECISION,
    google_user_rating_count INTEGER,
    favorites_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_master_spots_google_place_id ON master_spots(google_place_id);
CREATE INDEX idx_master_spots_location ON master_spots(latitude, longitude);
CREATE INDEX idx_master_spots_machi_id ON master_spots(machi_id);
CREATE INDEX idx_master_spots_name ON master_spots(name);

-- RLS
ALTER TABLE master_spots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "master_spots_select_all" ON master_spots FOR SELECT USING (true);
CREATE POLICY "master_spots_insert_authenticated" ON master_spots
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Trigger
CREATE TRIGGER update_master_spots_updated_at
    BEFORE UPDATE ON master_spots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- master_spot_favorites (マスタースポットお気に入り)
-- ============================================================
CREATE TABLE master_spot_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    master_spot_id UUID NOT NULL REFERENCES master_spots(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, master_spot_id)
);

-- Indexes
CREATE INDEX idx_master_spot_favorites_master_spot_id ON master_spot_favorites(master_spot_id);
CREATE INDEX idx_master_spot_favorites_user_id ON master_spot_favorites(user_id);

-- RLS
ALTER TABLE master_spot_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "master_spot_favorites_select_own" ON master_spot_favorites
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "master_spot_favorites_insert_own" ON master_spot_favorites
    FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "master_spot_favorites_delete_own" ON master_spot_favorites
    FOR DELETE USING (user_id = auth.uid());

-- Trigger: お気に入り数の自動更新
CREATE OR REPLACE FUNCTION update_master_spot_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE master_spots SET favorites_count = favorites_count + 1 WHERE id = NEW.master_spot_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE master_spots SET favorites_count = GREATEST(0, favorites_count - 1) WHERE id = OLD.master_spot_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_master_spot_favorites_count
    AFTER INSERT OR DELETE ON master_spot_favorites
    FOR EACH ROW EXECUTE FUNCTION update_master_spot_favorites_count();

-- ============================================================
-- user_spots (ユーザースポット)
-- ============================================================
CREATE TABLE user_spots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    map_id UUID NOT NULL REFERENCES maps(id) ON DELETE CASCADE,
    master_spot_id UUID REFERENCES master_spots(id) ON DELETE CASCADE,
    machi_id TEXT REFERENCES machi(id) ON DELETE SET NULL,  -- machiが削除されても保持
    machi_name TEXT,
    city_id TEXT REFERENCES cities(id) ON DELETE SET NULL,
    city_name TEXT,
    prefecture_id TEXT REFERENCES prefectures(id) ON DELETE SET NULL,
    prefecture_name TEXT,
    custom_name TEXT NOT NULL,
    description TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    google_formatted_address TEXT,
    google_short_address TEXT,
    images_count INTEGER NOT NULL DEFAULT 0,
    likes_count INTEGER NOT NULL DEFAULT 0,
    comments_count INTEGER NOT NULL DEFAULT 0,
    bookmarks_count INTEGER NOT NULL DEFAULT 0,
    order_index INTEGER NOT NULL DEFAULT 0,
    color TEXT,  -- deprecated
    spot_color TEXT DEFAULT 'blue',
    label_id UUID REFERENCES map_labels(id) ON DELETE SET NULL,
    article_content JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_user_spots_bookmarks_count ON user_spots(bookmarks_count DESC);
CREATE INDEX idx_user_spots_created_at ON user_spots(created_at DESC);
CREATE INDEX idx_user_spots_label_id ON user_spots(label_id);
CREATE INDEX idx_user_spots_machi_id ON user_spots(machi_id);
CREATE INDEX idx_user_spots_map_id ON user_spots(map_id);
CREATE INDEX idx_user_spots_master_spot_id ON user_spots(master_spot_id);
CREATE INDEX idx_user_spots_prefecture_id ON user_spots(prefecture_id);
CREATE INDEX idx_user_spots_prefecture_map ON user_spots(prefecture_id, map_id);
CREATE INDEX idx_user_spots_user_id ON user_spots(user_id);

-- RLS
ALTER TABLE user_spots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_spots_select_public_or_own" ON user_spots
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM maps WHERE id = map_id AND (is_public = true OR user_id = auth.uid()))
    );
CREATE POLICY "user_spots_insert_own" ON user_spots
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM maps WHERE id = map_id AND user_id = auth.uid())
    );
CREATE POLICY "user_spots_update_own" ON user_spots
    FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "user_spots_delete_own" ON user_spots
    FOR DELETE USING (user_id = auth.uid());

-- Trigger
CREATE TRIGGER update_user_spots_updated_at
    BEFORE UPDATE ON user_spots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: マップのスポット数を自動更新
DROP TRIGGER IF EXISTS trigger_update_map_spots_count ON user_spots;
CREATE TRIGGER trigger_update_map_spots_count
    AFTER INSERT OR DELETE ON user_spots
    FOR EACH ROW EXECUTE FUNCTION update_map_spots_count();

-- スポット数制限チェック
CREATE OR REPLACE FUNCTION check_spots_limit()
RETURNS TRIGGER AS $$
DECLARE
    current_count INTEGER;
    is_premium BOOLEAN;
    free_limit INTEGER := 30;
BEGIN
    -- 現在のスポット数を取得
    SELECT COUNT(*) INTO current_count
    FROM user_spots
    WHERE map_id = NEW.map_id;

    -- プレミアム会員かどうかをチェック
    SELECT u.is_premium INTO is_premium
    FROM users u
    WHERE u.id = NEW.user_id;

    -- 無料ユーザーの場合、制限をチェック
    IF NOT COALESCE(is_premium, false) AND current_count >= free_limit THEN
        RAISE EXCEPTION 'Free users can only add up to % spots per map', free_limit;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_spots_limit
    BEFORE INSERT ON user_spots
    FOR EACH ROW EXECUTE FUNCTION check_spots_limit();

CREATE OR REPLACE FUNCTION check_spots_limit_on_update()
RETURNS TRIGGER AS $$
DECLARE
    current_count INTEGER;
    is_premium BOOLEAN;
    free_limit INTEGER := 30;
BEGIN
    -- マップIDが変更された場合のみチェック
    IF OLD.map_id = NEW.map_id THEN
        RETURN NEW;
    END IF;

    -- 移動先マップの現在のスポット数を取得
    SELECT COUNT(*) INTO current_count
    FROM user_spots
    WHERE map_id = NEW.map_id AND id != NEW.id;

    -- プレミアム会員かどうかをチェック
    SELECT u.is_premium INTO is_premium
    FROM users u
    WHERE u.id = NEW.user_id;

    -- 無料ユーザーの場合、制限をチェック
    IF NOT COALESCE(is_premium, false) AND current_count >= free_limit THEN
        RAISE EXCEPTION 'Free users can only add up to % spots per map', free_limit;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_spots_limit_on_update
    BEFORE UPDATE ON user_spots
    FOR EACH ROW EXECUTE FUNCTION check_spots_limit_on_update();

-- ============================================================
-- カウンタートリガー関数（自動更新）
-- ============================================================

-- スポットのいいね数を自動更新
CREATE OR REPLACE FUNCTION update_user_spot_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE user_spots SET likes_count = likes_count + 1 WHERE id = NEW.user_spot_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE user_spots SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.user_spot_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- スポットのコメント数を自動更新（トップレベルのみ）
CREATE OR REPLACE FUNCTION update_user_spot_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.parent_id IS NULL THEN
            UPDATE user_spots SET comments_count = comments_count + 1 WHERE id = NEW.user_spot_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.parent_id IS NULL THEN
            UPDATE user_spots SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.user_spot_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- スポットのブックマーク数を自動更新
CREATE OR REPLACE FUNCTION update_user_spot_bookmarks_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE user_spots SET bookmarks_count = bookmarks_count + 1 WHERE id = NEW.user_spot_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE user_spots SET bookmarks_count = GREATEST(0, bookmarks_count - 1) WHERE id = OLD.user_spot_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- スポットの画像数を自動更新
CREATE OR REPLACE FUNCTION update_user_spot_images_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE user_spots SET images_count = images_count + 1 WHERE id = NEW.user_spot_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE user_spots SET images_count = GREATEST(0, images_count - 1) WHERE id = OLD.user_spot_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- RPC Functions（ビジネスロジック用）
-- ============================================================

CREATE OR REPLACE FUNCTION count_user_spots_in_map(p_user_id UUID, p_map_id UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER
        FROM user_spots
        WHERE map_id = p_map_id
    );
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================
-- spot_tags (スポットとタグの関連)
-- ============================================================
CREATE TABLE spot_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_spot_id UUID NOT NULL REFERENCES user_spots(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_spot_id, tag_id)
);

-- Indexes
CREATE INDEX idx_spot_tags_tag_id ON spot_tags(tag_id);
CREATE INDEX idx_spot_tags_user_spot_id ON spot_tags(user_spot_id);

-- RLS
ALTER TABLE spot_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "spot_tags_select_all" ON spot_tags FOR SELECT USING (true);
CREATE POLICY "spot_tags_insert_own" ON spot_tags
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_spots WHERE id = user_spot_id AND user_id = auth.uid())
    );
CREATE POLICY "spot_tags_delete_own" ON spot_tags
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM user_spots WHERE id = user_spot_id AND user_id = auth.uid())
    );

-- Trigger: タグ使用回数の更新
CREATE OR REPLACE FUNCTION update_tag_usage_count_for_spots()
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

CREATE TRIGGER update_tag_usage_count_for_spots_trigger
    AFTER INSERT OR DELETE ON spot_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count_for_spots();

-- ============================================================
-- images (スポット画像)
-- ============================================================
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_spot_id UUID NOT NULL REFERENCES user_spots(id) ON DELETE CASCADE,
    local_path TEXT,
    cloud_path TEXT,
    width INTEGER,
    height INTEGER,
    file_size INTEGER,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_images_user_spot_id ON images(user_spot_id);

-- RLS
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "images_select_public_or_own" ON images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_spots us
            JOIN maps m ON m.id = us.map_id
            WHERE us.id = user_spot_id AND (m.is_public = true OR m.user_id = auth.uid())
        )
    );
CREATE POLICY "images_insert_own" ON images
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_spots WHERE id = user_spot_id AND user_id = auth.uid())
    );
CREATE POLICY "images_delete_own" ON images
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM user_spots WHERE id = user_spot_id AND user_id = auth.uid())
    );

-- Trigger
CREATE TRIGGER update_images_updated_at
    BEFORE UPDATE ON images
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: スポットの画像数を自動更新
DROP TRIGGER IF EXISTS trigger_update_user_spot_images_count ON images;
CREATE TRIGGER trigger_update_user_spot_images_count
    AFTER INSERT OR DELETE ON images
    FOR EACH ROW EXECUTE FUNCTION update_user_spot_images_count();

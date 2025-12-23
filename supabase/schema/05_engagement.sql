-- ============================================================
-- エンゲージメント関連
-- ============================================================
-- テーブル: likes, bookmarks, bookmark_folders, comments, comment_likes, view_history, visits, schedules
-- 最終更新: 2025-12-23

-- ============================================================
-- likes (いいね)
-- ============================================================
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    map_id UUID REFERENCES maps(id) ON DELETE CASCADE,
    user_spot_id UUID REFERENCES user_spots(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- map_id または user_spot_id のどちらか一方のみ
    CHECK ((map_id IS NOT NULL AND user_spot_id IS NULL) OR (map_id IS NULL AND user_spot_id IS NOT NULL))
);

-- Unique Indexes
CREATE UNIQUE INDEX likes_user_map_unique ON likes(user_id, map_id) WHERE map_id IS NOT NULL;
CREATE UNIQUE INDEX likes_user_spot_unique ON likes(user_id, user_spot_id) WHERE user_spot_id IS NOT NULL;

-- Indexes
CREATE INDEX idx_likes_map_id ON likes(map_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_user_spot_id ON likes(user_spot_id);

-- RLS
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "likes_select_authenticated" ON likes
    FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "likes_insert_own" ON likes
    FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "likes_delete_own" ON likes
    FOR DELETE USING (user_id = auth.uid());

-- Trigger: マップいいね通知
CREATE OR REPLACE FUNCTION create_like_map_notification()
RETURNS TRIGGER AS $$
DECLARE
    map_owner_id UUID;
BEGIN
    SELECT user_id INTO map_owner_id FROM maps WHERE id = NEW.map_id;

    IF map_owner_id IS NOT NULL AND map_owner_id != NEW.user_id THEN
        INSERT INTO notifications (user_id, actor_id, type, map_id)
        VALUES (map_owner_id, NEW.user_id, 'like_map', NEW.map_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_map_like_create_notification
    AFTER INSERT ON likes
    FOR EACH ROW
    WHEN (NEW.map_id IS NOT NULL)
    EXECUTE FUNCTION create_like_map_notification();

-- Trigger: スポットいいね通知
CREATE OR REPLACE FUNCTION create_like_spot_notification()
RETURNS TRIGGER AS $$
DECLARE
    spot_owner_id UUID;
BEGIN
    SELECT user_id INTO spot_owner_id FROM user_spots WHERE id = NEW.user_spot_id;

    IF spot_owner_id IS NOT NULL AND spot_owner_id != NEW.user_id THEN
        INSERT INTO notifications (user_id, actor_id, type, user_spot_id)
        VALUES (spot_owner_id, NEW.user_id, 'like_spot', NEW.user_spot_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_spot_like_create_notification
    AFTER INSERT ON likes
    FOR EACH ROW
    WHEN (NEW.user_spot_id IS NOT NULL)
    EXECUTE FUNCTION create_like_spot_notification();

-- Trigger: マップいいね数の自動更新
DROP TRIGGER IF EXISTS trigger_update_map_likes_count ON likes;
CREATE TRIGGER trigger_update_map_likes_count
    AFTER INSERT OR DELETE ON likes
    FOR EACH ROW
    WHEN (NEW.map_id IS NOT NULL OR OLD.map_id IS NOT NULL)
    EXECUTE FUNCTION update_map_likes_count();

-- Trigger: スポットいいね数の自動更新
DROP TRIGGER IF EXISTS trigger_update_user_spot_likes_count ON likes;
CREATE TRIGGER trigger_update_user_spot_likes_count
    AFTER INSERT OR DELETE ON likes
    FOR EACH ROW
    WHEN (NEW.user_spot_id IS NOT NULL OR OLD.user_spot_id IS NOT NULL)
    EXECUTE FUNCTION update_user_spot_likes_count();

-- ============================================================
-- bookmark_folders (ブックマークフォルダ)
-- ============================================================
CREATE TABLE bookmark_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    folder_type TEXT NOT NULL DEFAULT 'spots' CHECK (folder_type IN ('spots', 'maps')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_bookmark_folders_type ON bookmark_folders(folder_type);
CREATE INDEX idx_bookmark_folders_user_id ON bookmark_folders(user_id);

-- RLS
ALTER TABLE bookmark_folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookmark_folders_select_own" ON bookmark_folders
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "bookmark_folders_insert_own" ON bookmark_folders
    FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "bookmark_folders_update_own" ON bookmark_folders
    FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "bookmark_folders_delete_own" ON bookmark_folders
    FOR DELETE USING (user_id = auth.uid());

-- Trigger
CREATE TRIGGER update_bookmark_folders_updated_at
    BEFORE UPDATE ON bookmark_folders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- bookmarks (ブックマーク)
-- ============================================================
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    map_id UUID REFERENCES maps(id) ON DELETE CASCADE,
    user_spot_id UUID REFERENCES user_spots(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES bookmark_folders(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- map_id または user_spot_id のどちらか一方のみ
    CHECK ((map_id IS NOT NULL AND user_spot_id IS NULL) OR (map_id IS NULL AND user_spot_id IS NOT NULL))
);

-- Unique Indexes
CREATE UNIQUE INDEX bookmarks_user_map_folder_unique ON bookmarks(user_id, map_id, folder_id) WHERE map_id IS NOT NULL;
CREATE UNIQUE INDEX bookmarks_user_spot_folder_unique ON bookmarks(user_id, user_spot_id, folder_id) WHERE user_spot_id IS NOT NULL;

-- Indexes
CREATE INDEX idx_bookmarks_folder_id ON bookmarks(folder_id);
CREATE INDEX idx_bookmarks_map_id ON bookmarks(map_id);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_user_spot_id ON bookmarks(user_spot_id);

-- RLS
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookmarks_select_own" ON bookmarks
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "bookmarks_insert_own" ON bookmarks
    FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "bookmarks_delete_own" ON bookmarks
    FOR DELETE USING (user_id = auth.uid());

-- Trigger: マップブックマーク数の自動更新
DROP TRIGGER IF EXISTS trigger_update_map_bookmarks_count ON bookmarks;
CREATE TRIGGER trigger_update_map_bookmarks_count
    AFTER INSERT OR DELETE ON bookmarks
    FOR EACH ROW
    WHEN (NEW.map_id IS NOT NULL OR OLD.map_id IS NOT NULL)
    EXECUTE FUNCTION update_map_bookmarks_count();

-- Trigger: スポットブックマーク数の自動更新
DROP TRIGGER IF EXISTS trigger_update_user_spot_bookmarks_count ON bookmarks;
CREATE TRIGGER trigger_update_user_spot_bookmarks_count
    AFTER INSERT OR DELETE ON bookmarks
    FOR EACH ROW
    WHEN (NEW.user_spot_id IS NOT NULL OR OLD.user_spot_id IS NOT NULL)
    EXECUTE FUNCTION update_user_spot_bookmarks_count();

-- ============================================================
-- comments (コメント)
-- ============================================================
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    map_id UUID REFERENCES maps(id) ON DELETE CASCADE,
    user_spot_id UUID REFERENCES user_spots(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    root_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    depth INTEGER NOT NULL DEFAULT 0,
    likes_count INTEGER NOT NULL DEFAULT 0,
    replies_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- map_id または user_spot_id のどちらか一方のみ
    CHECK ((map_id IS NOT NULL AND user_spot_id IS NULL) OR (map_id IS NULL AND user_spot_id IS NOT NULL))
);

-- Indexes
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX idx_comments_depth ON comments(depth);
CREATE INDEX idx_comments_map_id ON comments(map_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_root_id ON comments(root_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_user_spot_id ON comments(user_spot_id);

-- RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments_select_authenticated" ON comments
    FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "comments_insert_own" ON comments
    FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "comments_update_own" ON comments
    FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "comments_delete_own" ON comments
    FOR DELETE USING (user_id = auth.uid());

-- Trigger
CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: マップコメント通知
CREATE OR REPLACE FUNCTION create_comment_map_notification()
RETURNS TRIGGER AS $$
DECLARE
    map_owner_id UUID;
BEGIN
    SELECT user_id INTO map_owner_id FROM maps WHERE id = NEW.map_id;

    IF map_owner_id IS NOT NULL AND map_owner_id != NEW.user_id THEN
        INSERT INTO notifications (user_id, actor_id, type, map_id, comment_id)
        VALUES (map_owner_id, NEW.user_id, 'comment_map', NEW.map_id, NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_map_comment_create_notification
    AFTER INSERT ON comments
    FOR EACH ROW
    WHEN (NEW.map_id IS NOT NULL)
    EXECUTE FUNCTION create_comment_map_notification();

-- Trigger: スポットコメント通知
CREATE OR REPLACE FUNCTION create_comment_spot_notification()
RETURNS TRIGGER AS $$
DECLARE
    spot_owner_id UUID;
BEGIN
    SELECT user_id INTO spot_owner_id FROM user_spots WHERE id = NEW.user_spot_id;

    IF spot_owner_id IS NOT NULL AND spot_owner_id != NEW.user_id THEN
        INSERT INTO notifications (user_id, actor_id, type, user_spot_id, comment_id)
        VALUES (spot_owner_id, NEW.user_id, 'comment_spot', NEW.user_spot_id, NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_spot_comment_create_notification
    AFTER INSERT ON comments
    FOR EACH ROW
    WHEN (NEW.user_spot_id IS NOT NULL)
    EXECUTE FUNCTION create_comment_spot_notification();

-- Trigger: マップコメント数の自動更新
DROP TRIGGER IF EXISTS trigger_update_map_comments_count ON comments;
CREATE TRIGGER trigger_update_map_comments_count
    AFTER INSERT OR DELETE ON comments
    FOR EACH ROW
    WHEN (NEW.map_id IS NOT NULL OR OLD.map_id IS NOT NULL)
    EXECUTE FUNCTION update_map_comments_count();

-- Trigger: スポットコメント数の自動更新
DROP TRIGGER IF EXISTS trigger_update_user_spot_comments_count ON comments;
CREATE TRIGGER trigger_update_user_spot_comments_count
    AFTER INSERT OR DELETE ON comments
    FOR EACH ROW
    WHEN (NEW.user_spot_id IS NOT NULL OR OLD.user_spot_id IS NOT NULL)
    EXECUTE FUNCTION update_user_spot_comments_count();

-- Trigger: 返信数の更新
CREATE OR REPLACE FUNCTION increment_comment_replies_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.parent_id IS NOT NULL THEN
        UPDATE comments SET replies_count = replies_count + 1 WHERE id = NEW.parent_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_comment_replies
    AFTER INSERT ON comments
    FOR EACH ROW EXECUTE FUNCTION increment_comment_replies_count();

CREATE OR REPLACE FUNCTION decrement_comment_replies_count()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.parent_id IS NOT NULL THEN
        UPDATE comments SET replies_count = GREATEST(0, replies_count - 1) WHERE id = OLD.parent_id;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_decrement_comment_replies
    AFTER DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION decrement_comment_replies_count();

-- ============================================================
-- comment_likes (コメントいいね)
-- ============================================================
CREATE TABLE comment_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, comment_id)
);

-- Indexes
CREATE INDEX idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user_id ON comment_likes(user_id);

-- RLS
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comment_likes_select_all" ON comment_likes FOR SELECT USING (true);
CREATE POLICY "comment_likes_insert_own" ON comment_likes
    FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "comment_likes_delete_own" ON comment_likes
    FOR DELETE USING (user_id = auth.uid());

-- Trigger: コメントいいね数の更新
CREATE OR REPLACE FUNCTION increment_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_comment_likes
    AFTER INSERT ON comment_likes
    FOR EACH ROW EXECUTE FUNCTION increment_comment_likes_count();

CREATE OR REPLACE FUNCTION decrement_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE comments SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.comment_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_decrement_comment_likes
    AFTER DELETE ON comment_likes
    FOR EACH ROW EXECUTE FUNCTION decrement_comment_likes_count();

-- ============================================================
-- view_history (マップ閲覧履歴)
-- ============================================================
CREATE TABLE view_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    map_id UUID NOT NULL REFERENCES maps(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    view_count INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, map_id)
);

-- Indexes
CREATE INDEX idx_view_history_map_id ON view_history(map_id);
CREATE INDEX idx_view_history_user_id ON view_history(user_id);
CREATE INDEX idx_view_history_user_viewed ON view_history(user_id, viewed_at DESC);
CREATE INDEX idx_view_history_viewed_at ON view_history(viewed_at DESC);

-- RLS
ALTER TABLE view_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view_history_select_own" ON view_history
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "view_history_insert_own" ON view_history
    FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "view_history_update_own" ON view_history
    FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "view_history_delete_own" ON view_history
    FOR DELETE USING (user_id = auth.uid());

-- Trigger: updated_at
CREATE OR REPLACE FUNCTION update_view_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_view_history_updated_at
    BEFORE UPDATE ON view_history
    FOR EACH ROW EXECUTE FUNCTION update_view_history_updated_at();

-- Trigger: 古い履歴を削除（100件超過分）
CREATE OR REPLACE FUNCTION cleanup_old_view_history()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM view_history
    WHERE user_id = NEW.user_id
    AND id NOT IN (
        SELECT id FROM view_history
        WHERE user_id = NEW.user_id
        ORDER BY viewed_at DESC
        LIMIT 100
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cleanup_view_history
    AFTER INSERT OR UPDATE ON view_history
    FOR EACH ROW EXECUTE FUNCTION cleanup_old_view_history();

-- ============================================================
-- visits (街訪問記録)
-- ============================================================
CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    machi_id TEXT NOT NULL REFERENCES machi(id) ON DELETE CASCADE,
    visited_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, machi_id)
);

-- Indexes
CREATE INDEX idx_visits_machi_id ON visits(machi_id);
CREATE INDEX idx_visits_user_id ON visits(user_id);
CREATE INDEX idx_visits_user_machi ON visits(user_id, machi_id);
CREATE INDEX idx_visits_visited_at ON visits(visited_at DESC);

-- RLS
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "visits_select_own" ON visits
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "visits_insert_own" ON visits
    FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "visits_update_own" ON visits
    FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "visits_delete_own" ON visits
    FOR DELETE USING (user_id = auth.uid());

-- ============================================================
-- schedules (訪問予定)
-- ============================================================
CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    machi_id TEXT NOT NULL REFERENCES machi(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMPTZ NOT NULL,
    title TEXT NOT NULL,
    memo TEXT,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_schedules_machi_id ON schedules(machi_id);
CREATE INDEX idx_schedules_scheduled_at ON schedules(scheduled_at);
CREATE INDEX idx_schedules_user_id ON schedules(user_id);
CREATE INDEX idx_schedules_user_scheduled ON schedules(user_id, scheduled_at);

-- RLS
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "schedules_select_own" ON schedules
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "schedules_insert_own" ON schedules
    FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "schedules_update_own" ON schedules
    FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "schedules_delete_own" ON schedules
    FOR DELETE USING (user_id = auth.uid());

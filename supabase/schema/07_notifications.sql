-- ============================================================
-- 通知・システム関連
-- ============================================================
-- テーブル: notifications, system_announcements, system_announcement_reads, reports
-- 最終更新: 2025-12-23

-- ============================================================
-- notifications (通知)
-- ============================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('like_spot', 'like_map', 'comment_spot', 'comment_map', 'follow', 'system')),
    user_spot_id UUID REFERENCES user_spots(id) ON DELETE CASCADE,
    map_id UUID REFERENCES maps(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    -- type と対応するIDの整合性チェック
    CHECK (
        (type IN ('like_spot', 'comment_spot') AND user_spot_id IS NOT NULL) OR
        (type IN ('like_map', 'comment_map') AND map_id IS NOT NULL) OR
        (type = 'follow' AND actor_id IS NOT NULL) OR
        (type = 'system')
    )
);

-- Indexes
CREATE INDEX idx_notifications_actor_id ON notifications(actor_id);
CREATE INDEX idx_notifications_created_at ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_user_spot_id ON notifications(user_spot_id);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_select_own" ON notifications
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifications_insert_system" ON notifications
    FOR INSERT WITH CHECK (true);  -- システムから作成可能
CREATE POLICY "notifications_update_own" ON notifications
    FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "notifications_delete_own" ON notifications
    FOR DELETE USING (user_id = auth.uid());

-- ============================================================
-- system_announcements (システムお知らせ)
-- ============================================================
CREATE TABLE system_announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    is_active BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_system_announcements_published ON system_announcements(is_active, published_at DESC);

-- RLS
ALTER TABLE system_announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "system_announcements_select_active" ON system_announcements
    FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- ============================================================
-- system_announcement_reads (お知らせ既読)
-- ============================================================
CREATE TABLE system_announcement_reads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    announcement_id UUID NOT NULL REFERENCES system_announcements(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, announcement_id)
);

-- Indexes
CREATE INDEX idx_user_announcement_reads_announcement_id ON system_announcement_reads(announcement_id);
CREATE INDEX idx_user_announcement_reads_user_id ON system_announcement_reads(user_id);

-- RLS
ALTER TABLE system_announcement_reads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "system_announcement_reads_select_own" ON system_announcement_reads
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "system_announcement_reads_insert_own" ON system_announcement_reads
    FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "system_announcement_reads_delete_own" ON system_announcement_reads
    FOR DELETE USING (user_id = auth.uid());

-- ============================================================
-- reports (通報)
-- ============================================================

-- ENUM types
CREATE TYPE report_reason AS ENUM ('spam', 'inappropriate', 'harassment', 'misinformation', 'copyright', 'other');
CREATE TYPE report_status AS ENUM ('pending', 'reviewing', 'resolved', 'dismissed');
CREATE TYPE report_target_type AS ENUM ('map', 'spot', 'user', 'comment');

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type report_target_type NOT NULL,
    target_id UUID NOT NULL,
    reason report_reason NOT NULL DEFAULT 'other',
    description TEXT,
    status report_status NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_target ON reports(target_type, target_id);
CREATE UNIQUE INDEX idx_reports_unique_report ON reports(reporter_id, target_type, target_id)
    WHERE status IN ('pending', 'reviewing');

-- RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports_select_own" ON reports
    FOR SELECT USING (reporter_id = auth.uid());
CREATE POLICY "reports_insert_own" ON reports
    FOR INSERT WITH CHECK (reporter_id = auth.uid());

-- Trigger
CREATE TRIGGER update_reports_updated_at
    BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

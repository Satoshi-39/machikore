-- ============================================================
-- 規約関連
-- ============================================================
-- テーブル: terms_versions, terms_agreements
-- 最終更新: 2025-12-23

-- ============================================================
-- terms_versions (利用規約バージョン)
-- ============================================================
CREATE TABLE terms_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('terms_of_service', 'privacy_policy')),
    version TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    effective_at TIMESTAMPTZ NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_terms_versions_effective_at ON terms_versions(effective_at DESC);
CREATE INDEX idx_terms_versions_type ON terms_versions(type);
CREATE INDEX idx_terms_versions_type_effective ON terms_versions(type, effective_at DESC);

-- RLS（規約は公開データ）
ALTER TABLE terms_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "terms_versions_select_all" ON terms_versions FOR SELECT USING (true);

-- ============================================================
-- terms_agreements (ユーザー規約同意)
-- ============================================================
CREATE TABLE terms_agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    terms_version_id UUID NOT NULL REFERENCES terms_versions(id),
    privacy_version_id UUID NOT NULL REFERENCES terms_versions(id),
    agreed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_terms_agreements_agreed_at ON terms_agreements(agreed_at DESC);
CREATE INDEX idx_terms_agreements_user_agreed ON terms_agreements(user_id, agreed_at DESC);
CREATE INDEX idx_terms_agreements_user_id ON terms_agreements(user_id);

-- RLS
ALTER TABLE terms_agreements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "terms_agreements_select_own" ON terms_agreements
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "terms_agreements_insert_own" ON terms_agreements
    FOR INSERT WITH CHECK (user_id = auth.uid());

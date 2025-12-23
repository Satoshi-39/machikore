-- ============================================================
-- 利用規約（terms_versions, terms_agreements）
-- ============================================================
-- 利用規約・プライバシーポリシーのバージョン管理と同意履歴
-- 最終更新: 2025-12-23

-- ============================================================
-- terms_versions（利用規約バージョン）
-- ============================================================

CREATE TABLE public.terms_versions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type text NOT NULL,
    version text NOT NULL,
    content text NOT NULL,
    summary text,
    effective_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    CONSTRAINT terms_versions_type_check CHECK ((type = ANY (ARRAY['terms_of_service'::text, 'privacy_policy'::text])))
);

COMMENT ON TABLE public.terms_versions IS '利用規約・プライバシーポリシーのバージョン管理';
COMMENT ON COLUMN public.terms_versions.type IS '文書タイプ: terms_of_service（利用規約）, privacy_policy（プライバシーポリシー）';
COMMENT ON COLUMN public.terms_versions.version IS 'バージョン番号（例: 1.0.0）';
COMMENT ON COLUMN public.terms_versions.content IS '規約本文（マークダウン形式）';
COMMENT ON COLUMN public.terms_versions.summary IS '変更概要（更新時のユーザー通知用）';
COMMENT ON COLUMN public.terms_versions.effective_at IS '発効日時';

ALTER TABLE ONLY public.terms_versions ADD CONSTRAINT terms_versions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.terms_versions ADD CONSTRAINT terms_versions_type_version_key UNIQUE (type, version);
ALTER TABLE ONLY public.terms_versions ADD CONSTRAINT terms_versions_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES public.users(id);

CREATE INDEX idx_terms_versions_effective_at ON public.terms_versions USING btree (effective_at DESC);
CREATE INDEX idx_terms_versions_type ON public.terms_versions USING btree (type);
CREATE INDEX idx_terms_versions_type_effective ON public.terms_versions USING btree (type, effective_at DESC);

ALTER TABLE public.terms_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY terms_versions_select_policy ON public.terms_versions FOR SELECT USING (true);

-- ============================================================
-- terms_agreements（利用規約同意履歴）
-- ============================================================

CREATE TABLE public.terms_agreements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    terms_version_id uuid NOT NULL,
    privacy_version_id uuid NOT NULL,
    agreed_at timestamp with time zone DEFAULT now() NOT NULL,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.terms_agreements IS 'ユーザーの利用規約・プライバシーポリシー同意履歴';
COMMENT ON COLUMN public.terms_agreements.user_id IS '同意したユーザーID';
COMMENT ON COLUMN public.terms_agreements.terms_version_id IS '同意した利用規約のバージョンID';
COMMENT ON COLUMN public.terms_agreements.privacy_version_id IS '同意したプライバシーポリシーのバージョンID';
COMMENT ON COLUMN public.terms_agreements.agreed_at IS '同意日時';
COMMENT ON COLUMN public.terms_agreements.ip_address IS '同意時のIPアドレス';
COMMENT ON COLUMN public.terms_agreements.user_agent IS '同意時のUser-Agent';

ALTER TABLE ONLY public.terms_agreements ADD CONSTRAINT terms_agreements_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.terms_agreements ADD CONSTRAINT terms_agreements_privacy_version_id_fkey
    FOREIGN KEY (privacy_version_id) REFERENCES public.terms_versions(id);
ALTER TABLE ONLY public.terms_agreements ADD CONSTRAINT terms_agreements_terms_version_id_fkey
    FOREIGN KEY (terms_version_id) REFERENCES public.terms_versions(id);
ALTER TABLE ONLY public.terms_agreements ADD CONSTRAINT terms_agreements_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

CREATE INDEX idx_terms_agreements_agreed_at ON public.terms_agreements USING btree (agreed_at DESC);
CREATE INDEX idx_terms_agreements_user_agreed ON public.terms_agreements USING btree (user_id, agreed_at DESC);
CREATE INDEX idx_terms_agreements_user_id ON public.terms_agreements USING btree (user_id);

ALTER TABLE public.terms_agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY terms_agreements_insert_own_policy ON public.terms_agreements
    FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY terms_agreements_select_own_policy ON public.terms_agreements
    FOR SELECT USING ((auth.uid() = user_id));

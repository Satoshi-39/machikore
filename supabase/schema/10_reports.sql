-- ============================================================
-- 通報（reports）
-- ============================================================
-- 不適切なコンテンツの通報機能
-- 最終更新: 2025-12-23

-- ============================================================
-- reports（通報）
-- ============================================================

CREATE TABLE public.reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reporter_id uuid NOT NULL,
    target_type public.report_target_type NOT NULL,
    target_id uuid NOT NULL,
    reason public.report_reason DEFAULT 'other'::public.report_reason NOT NULL,
    description text,
    status public.report_status DEFAULT 'pending'::public.report_status NOT NULL,
    admin_notes text,
    resolved_at timestamp with time zone,
    resolved_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.reports IS '報告機能テーブル';
COMMENT ON COLUMN public.reports.reporter_id IS '報告したユーザーID';
COMMENT ON COLUMN public.reports.target_type IS '報告対象のタイプ（map, spot, user, comment）';
COMMENT ON COLUMN public.reports.target_id IS '報告対象のID';
COMMENT ON COLUMN public.reports.reason IS '報告理由';
COMMENT ON COLUMN public.reports.description IS '報告の詳細説明';
COMMENT ON COLUMN public.reports.status IS '報告のステータス';
COMMENT ON COLUMN public.reports.admin_notes IS '管理者のメモ';
COMMENT ON COLUMN public.reports.resolved_at IS '解決日時';
COMMENT ON COLUMN public.reports.resolved_by IS '解決した管理者のID';

ALTER TABLE ONLY public.reports ADD CONSTRAINT reports_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.reports ADD CONSTRAINT reports_reporter_id_fkey
    FOREIGN KEY (reporter_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.reports ADD CONSTRAINT reports_resolved_by_fkey
    FOREIGN KEY (resolved_by) REFERENCES public.users(id);

CREATE INDEX idx_reports_created_at ON public.reports USING btree (created_at DESC);
CREATE INDEX idx_reports_reporter_id ON public.reports USING btree (reporter_id);
CREATE INDEX idx_reports_status ON public.reports USING btree (status);
CREATE INDEX idx_reports_target ON public.reports USING btree (target_type, target_id);

-- 同一ユーザーが同一対象に対して未解決の報告を重複して作成できないようにする
CREATE UNIQUE INDEX idx_reports_unique_report ON public.reports
    USING btree (reporter_id, target_type, target_id)
    WHERE (status = ANY (ARRAY['pending'::public.report_status, 'reviewing'::public.report_status]));

CREATE TRIGGER update_reports_updated_at
    BEFORE UPDATE ON public.reports
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports" ON public.reports
    FOR INSERT TO authenticated WITH CHECK ((auth.uid() = reporter_id));
CREATE POLICY "Users can view own reports" ON public.reports
    FOR SELECT TO authenticated USING ((auth.uid() = reporter_id));

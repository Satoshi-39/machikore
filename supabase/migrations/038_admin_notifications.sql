-- 管理者通知テーブル（通知本体）
CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    type text NOT NULL,
    title text NOT NULL,
    body text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT admin_notifications_type_check CHECK (
        type = ANY (ARRAY[
            'report'::text,
            'system'::text,
            'inquiry'::text
        ])
    )
);

COMMENT ON TABLE public.admin_notifications IS '管理者向け通知（全管理者共通）';
COMMENT ON COLUMN public.admin_notifications.type IS '通知種別: report(通報), system(システムエラー), inquiry(お問い合わせ)';
COMMENT ON COLUMN public.admin_notifications.metadata IS '関連リソースのID等を格納（例: {"user_id": "xxx", "spot_id": "yyy"}）';

-- 管理者ごとの既読管理テーブル
CREATE TABLE IF NOT EXISTS public.admin_notification_reads (
    notification_id uuid NOT NULL REFERENCES public.admin_notifications(id) ON DELETE CASCADE,
    admin_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    read_at timestamptz DEFAULT now() NOT NULL,
    PRIMARY KEY (notification_id, admin_user_id)
);

COMMENT ON TABLE public.admin_notification_reads IS '管理者ごとの通知既読状態';

-- インデックス
CREATE INDEX idx_admin_notifications_created_at ON public.admin_notifications(created_at DESC);
CREATE INDEX idx_admin_notifications_type ON public.admin_notifications(type);
CREATE INDEX idx_admin_notification_reads_admin_user_id ON public.admin_notification_reads(admin_user_id);

-- RLS有効化
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notification_reads ENABLE ROW LEVEL SECURITY;

-- admin_notifications: 管理者のみSELECT可能（INSERT/UPDATE/DELETEはservice_roleのみ）
CREATE POLICY admin_notifications_select ON public.admin_notifications
    FOR SELECT TO authenticated
    USING (is_admin_user((SELECT auth.uid())));

-- admin_notification_reads: 管理者は自分のレコードのみ操作可能
CREATE POLICY admin_notification_reads_select ON public.admin_notification_reads
    FOR SELECT TO authenticated
    USING (
        admin_user_id = (SELECT auth.uid())
        AND is_admin_user((SELECT auth.uid()))
    );

CREATE POLICY admin_notification_reads_insert ON public.admin_notification_reads
    FOR INSERT TO authenticated
    WITH CHECK (
        admin_user_id = (SELECT auth.uid())
        AND is_admin_user((SELECT auth.uid()))
    );

CREATE POLICY admin_notification_reads_delete ON public.admin_notification_reads
    FOR DELETE TO authenticated
    USING (
        admin_user_id = (SELECT auth.uid())
        AND is_admin_user((SELECT auth.uid()))
    );

-- GRANT
GRANT SELECT ON public.admin_notifications TO authenticated;
GRANT ALL ON public.admin_notifications TO service_role;

GRANT SELECT, INSERT, DELETE ON public.admin_notification_reads TO authenticated;
GRANT ALL ON public.admin_notification_reads TO service_role;

-- 未読通知数を取得するヘルパー関数
CREATE OR REPLACE FUNCTION public.get_admin_unread_notification_count()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
    SELECT COUNT(*)
    FROM public.admin_notifications an
    WHERE NOT EXISTS (
        SELECT 1
        FROM public.admin_notification_reads anr
        WHERE anr.notification_id = an.id
        AND anr.admin_user_id = auth.uid()
    );
$$;

COMMENT ON FUNCTION public.get_admin_unread_notification_count() IS '現在の管理者ユーザーの未読通知数を返す';

REVOKE EXECUTE ON FUNCTION public.get_admin_unread_notification_count() FROM public;
GRANT EXECUTE ON FUNCTION public.get_admin_unread_notification_count() TO authenticated, service_role;

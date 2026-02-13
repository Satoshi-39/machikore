-- 管理者通知の未読数を、管理者の登録日以降の通知のみ対象にする

CREATE OR REPLACE FUNCTION public.get_admin_unread_notification_count()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
    SELECT COUNT(*)
    FROM public.admin_notifications an
    WHERE an.created_at >= (
        SELECT au.created_at
        FROM public.admin_users au
        WHERE au.user_id = auth.uid()
    )
    AND NOT EXISTS (
        SELECT 1
        FROM public.admin_notification_reads anr
        WHERE anr.notification_id = an.id
        AND anr.admin_user_id = auth.uid()
    );
$$;

COMMENT ON FUNCTION public.get_admin_unread_notification_count() IS '現在の管理者ユーザーの未読通知数を返す（管理者登録日以降の通知のみ）';

-- 通報作成時に管理者通知を自動生成するトリガー

CREATE OR REPLACE FUNCTION public.create_admin_notification_on_report()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  target_label TEXT;
  reason_label TEXT;
  notification_title TEXT;
  notification_body TEXT;
BEGIN
  -- 対象タイプの日本語ラベル
  target_label := CASE NEW.target_type
    WHEN 'map' THEN 'マップ'
    WHEN 'spot' THEN 'スポット'
    WHEN 'user' THEN 'ユーザー'
    WHEN 'comment' THEN 'コメント'
    ELSE NEW.target_type::text
  END;

  -- 通報理由の日本語ラベル
  reason_label := CASE NEW.reason
    WHEN 'spam' THEN 'スパム'
    WHEN 'inappropriate' THEN '不適切'
    WHEN 'harassment' THEN 'ハラスメント'
    WHEN 'misinformation' THEN '誤情報'
    WHEN 'copyright' THEN '著作権侵害'
    WHEN 'other' THEN 'その他'
    ELSE NEW.reason::text
  END;

  notification_title := target_label || 'が' || reason_label || 'として通報されました';
  notification_body := NEW.description;

  INSERT INTO public.admin_notifications (type, title, body, metadata)
  VALUES (
    'report',
    notification_title,
    notification_body,
    jsonb_build_object(
      'report_id', NEW.id,
      'reporter_id', NEW.reporter_id,
      'target_type', NEW.target_type,
      'target_id', NEW.target_id,
      'reason', NEW.reason
    )
  );

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.create_admin_notification_on_report() IS '通報作成時に管理者向け通知を自動生成する';

DROP TRIGGER IF EXISTS on_report_create_admin_notification ON public.reports;
CREATE TRIGGER on_report_create_admin_notification
  AFTER INSERT ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.create_admin_notification_on_report();

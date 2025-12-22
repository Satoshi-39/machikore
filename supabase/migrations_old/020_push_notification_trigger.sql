-- =====================================================
-- プッシュ通知送信トリガー
-- =====================================================
-- notificationsテーブルにINSERTされたら
-- Edge Functionを呼び出してプッシュ通知を送信
-- =====================================================

-- pg_net拡張が必要（Supabaseではデフォルトで利用可能）
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 通知作成時にプッシュ通知を送信するトリガー関数
CREATE OR REPLACE FUNCTION send_push_notification()
RETURNS TRIGGER AS $$
DECLARE
  supabase_url TEXT;
  service_role_key TEXT;
BEGIN
  -- 環境変数からSupabase URLとService Role Keyを取得
  -- 注意: これらは実際のSupabaseプロジェクトで設定が必要
  supabase_url := current_setting('app.settings.supabase_url', true);
  service_role_key := current_setting('app.settings.service_role_key', true);

  -- Edge Functionを非同期で呼び出し
  PERFORM net.http_post(
    url := supabase_url || '/functions/v1/send-push-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    ),
    body := jsonb_build_object(
      'notification_id', NEW.id,
      'user_id', NEW.user_id,
      'actor_id', NEW.actor_id,
      'type', NEW.type,
      'spot_id', NEW.spot_id,
      'map_id', NEW.map_id
    )
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- エラーが発生しても通知の作成は続行
    RAISE WARNING 'Failed to send push notification: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガー作成
DROP TRIGGER IF EXISTS on_notification_send_push ON notifications;
CREATE TRIGGER on_notification_send_push
  AFTER INSERT ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION send_push_notification();

-- =====================================================
-- 代替方法: Supabase Database Webhookを使用
-- =====================================================
-- pg_netが使えない場合や、よりシンプルな方法として
-- Supabase DashboardからDatabase Webhookを設定することも可能
--
-- 設定方法:
-- 1. Supabase Dashboard > Database > Webhooks
-- 2. "Create a new webhook"
-- 3. Table: notifications
-- 4. Events: INSERT
-- 5. URL: https://[PROJECT_REF].supabase.co/functions/v1/send-push-notification
-- 6. Headers: Authorization: Bearer [SERVICE_ROLE_KEY]
-- =====================================================

-- メール通知設定カラムを追加
-- 将来のメール通知機能に備えて設定項目を追加

-- メール通知用カラムを追加
ALTER TABLE user_notification_settings
ADD COLUMN IF NOT EXISTS email_enabled BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS email_like_enabled BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS email_comment_enabled BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS email_follow_enabled BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS email_system_enabled BOOLEAN NOT NULL DEFAULT true;

-- コメント追加
COMMENT ON COLUMN user_notification_settings.email_enabled IS 'メール通知のマスター設定';
COMMENT ON COLUMN user_notification_settings.email_like_enabled IS 'いいねのメール通知';
COMMENT ON COLUMN user_notification_settings.email_comment_enabled IS 'コメントのメール通知';
COMMENT ON COLUMN user_notification_settings.email_follow_enabled IS 'フォローのメール通知';
COMMENT ON COLUMN user_notification_settings.email_system_enabled IS 'システムのメール通知';

-- RPC関数を更新（メール設定対応）
CREATE OR REPLACE FUNCTION get_notification_settings()
RETURNS user_notification_settings AS $$
DECLARE
  settings user_notification_settings;
BEGIN
  -- 既存の設定を取得
  SELECT * INTO settings
  FROM user_notification_settings
  WHERE user_id = auth.uid();

  -- なければ作成
  IF settings IS NULL THEN
    INSERT INTO user_notification_settings (user_id)
    VALUES (auth.uid())
    RETURNING * INTO settings;
  END IF;

  RETURN settings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 通知設定を更新するRPC関数（メール設定追加）
CREATE OR REPLACE FUNCTION update_notification_settings(
  -- プッシュ通知設定
  p_push_enabled BOOLEAN DEFAULT NULL,
  p_like_enabled BOOLEAN DEFAULT NULL,
  p_comment_enabled BOOLEAN DEFAULT NULL,
  p_follow_enabled BOOLEAN DEFAULT NULL,
  p_system_enabled BOOLEAN DEFAULT NULL,
  -- メール通知設定
  p_email_enabled BOOLEAN DEFAULT NULL,
  p_email_like_enabled BOOLEAN DEFAULT NULL,
  p_email_comment_enabled BOOLEAN DEFAULT NULL,
  p_email_follow_enabled BOOLEAN DEFAULT NULL,
  p_email_system_enabled BOOLEAN DEFAULT NULL
)
RETURNS user_notification_settings AS $$
DECLARE
  settings user_notification_settings;
BEGIN
  -- 設定がなければ作成
  INSERT INTO user_notification_settings (user_id)
  VALUES (auth.uid())
  ON CONFLICT (user_id) DO NOTHING;

  -- 更新（NULLの場合は現在値を維持）
  UPDATE user_notification_settings
  SET
    -- プッシュ通知
    push_enabled = COALESCE(p_push_enabled, push_enabled),
    like_enabled = COALESCE(p_like_enabled, like_enabled),
    comment_enabled = COALESCE(p_comment_enabled, comment_enabled),
    follow_enabled = COALESCE(p_follow_enabled, follow_enabled),
    system_enabled = COALESCE(p_system_enabled, system_enabled),
    -- メール通知
    email_enabled = COALESCE(p_email_enabled, email_enabled),
    email_like_enabled = COALESCE(p_email_like_enabled, email_like_enabled),
    email_comment_enabled = COALESCE(p_email_comment_enabled, email_comment_enabled),
    email_follow_enabled = COALESCE(p_email_follow_enabled, email_follow_enabled),
    email_system_enabled = COALESCE(p_email_system_enabled, email_system_enabled)
  WHERE user_id = auth.uid()
  RETURNING * INTO settings;

  RETURN settings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

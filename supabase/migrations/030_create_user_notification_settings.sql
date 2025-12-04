-- ユーザー通知設定テーブル
-- 通知タイプごとにON/OFF設定を管理

-- テーブル作成
CREATE TABLE IF NOT EXISTS user_notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- マスター設定（これがOFFなら全ての通知を送信しない）
  push_enabled BOOLEAN NOT NULL DEFAULT true,

  -- 通知タイプ別設定
  like_enabled BOOLEAN NOT NULL DEFAULT true,        -- いいね通知
  comment_enabled BOOLEAN NOT NULL DEFAULT true,     -- コメント通知
  follow_enabled BOOLEAN NOT NULL DEFAULT true,      -- フォロー通知
  system_enabled BOOLEAN NOT NULL DEFAULT true,      -- システム通知

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- 1ユーザーにつき1レコード
  UNIQUE(user_id)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_user_notification_settings_user_id
  ON user_notification_settings(user_id);

-- RLS有効化
ALTER TABLE user_notification_settings ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分の設定のみ閲覧・更新可能
CREATE POLICY "Users can view own notification settings"
  ON user_notification_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification settings"
  ON user_notification_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification settings"
  ON user_notification_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- 更新日時の自動更新トリガー
CREATE OR REPLACE FUNCTION update_notification_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_notification_settings_updated_at
  BEFORE UPDATE ON user_notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_settings_updated_at();

-- ユーザー作成時に自動で通知設定を作成するトリガー
CREATE OR REPLACE FUNCTION create_default_notification_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_notification_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_default_notification_settings
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_notification_settings();

-- 既存ユーザーに対してデフォルト設定を作成
INSERT INTO user_notification_settings (user_id)
SELECT id FROM users
ON CONFLICT (user_id) DO NOTHING;

-- 通知設定を取得・更新するRPC関数
-- 設定がない場合はデフォルト値で作成して返す
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

-- 通知設定を更新するRPC関数
CREATE OR REPLACE FUNCTION update_notification_settings(
  p_push_enabled BOOLEAN DEFAULT NULL,
  p_like_enabled BOOLEAN DEFAULT NULL,
  p_comment_enabled BOOLEAN DEFAULT NULL,
  p_follow_enabled BOOLEAN DEFAULT NULL,
  p_system_enabled BOOLEAN DEFAULT NULL
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
    push_enabled = COALESCE(p_push_enabled, push_enabled),
    like_enabled = COALESCE(p_like_enabled, like_enabled),
    comment_enabled = COALESCE(p_comment_enabled, comment_enabled),
    follow_enabled = COALESCE(p_follow_enabled, follow_enabled),
    system_enabled = COALESCE(p_system_enabled, system_enabled)
  WHERE user_id = auth.uid()
  RETURNING * INTO settings;

  RETURN settings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- プッシュ通知トークン管理
-- =====================================================
-- Expo Push Tokenを保存するためのカラムを追加
-- 1ユーザーが複数デバイスを持つ可能性があるため、
-- 別テーブルで管理することも検討できるが、
-- シンプルさを優先して最新のトークンのみ保存する
-- =====================================================

-- usersテーブルにpush_tokenカラムを追加
ALTER TABLE users ADD COLUMN IF NOT EXISTS push_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS push_token_updated_at TIMESTAMPTZ;

-- インデックス（プッシュ通知送信時に使用）
CREATE INDEX IF NOT EXISTS idx_users_push_token ON users(push_token) WHERE push_token IS NOT NULL;

-- プッシュトークン更新用のRPCファンクション
-- ユーザーは自分のトークンのみ更新可能
CREATE OR REPLACE FUNCTION update_push_token(token TEXT)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET
    push_token = token,
    push_token_updated_at = NOW()
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- プッシュトークン削除用のRPCファンクション（ログアウト時など）
CREATE OR REPLACE FUNCTION clear_push_token()
RETURNS void AS $$
BEGIN
  UPDATE users
  SET
    push_token = NULL,
    push_token_updated_at = NOW()
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

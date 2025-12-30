-- 削除リクエストテーブルに退会理由とメールアドレスを追加
-- email: 退会後30日間は同じメールアドレスでの再登録を防ぐため
-- reason: 退会理由（任意、サービス改善の参考用）

-- email列を追加
ALTER TABLE deletion_requests
ADD COLUMN IF NOT EXISTS email TEXT;

-- reason列を追加
ALTER TABLE deletion_requests
ADD COLUMN IF NOT EXISTS reason TEXT;

-- emailにインデックスを追加（pending状態のメールアドレス検索用）
CREATE INDEX IF NOT EXISTS idx_deletion_requests_email
ON deletion_requests(email)
WHERE status = 'pending';

COMMENT ON COLUMN deletion_requests.email IS '削除対象ユーザーのメールアドレス（再登録防止用）';
COMMENT ON COLUMN deletion_requests.reason IS '退会理由（任意）';

-- 退会リクエスト中のメールアドレスかチェックするRPC関数
-- 認証不要（サインアップ時に使用するため）
CREATE OR REPLACE FUNCTION check_email_has_pending_deletion(check_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM deletion_requests
    WHERE LOWER(email) = LOWER(check_email)
    AND status = 'pending'
  );
END;
$$;

COMMENT ON FUNCTION check_email_has_pending_deletion(TEXT) IS '指定されたメールアドレスが退会リクエスト中かチェック';

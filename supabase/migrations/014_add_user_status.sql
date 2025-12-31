-- usersテーブルにステータス管理カラムを追加
-- 排他的な状態 + タイムスタンプで堅牢に管理
-- deletion_requestsの外部キー制約を変更（履歴保持のため）

-- ステータス列を追加（排他的な状態）
ALTER TABLE users
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active'
  CHECK (status IN ('active', 'deletion_pending', 'suspended', 'banned'));

-- 各イベントのタイムスタンプ（事実の記録）
ALTER TABLE users
ADD COLUMN IF NOT EXISTS deletion_requested_at TIMESTAMPTZ;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS suspended_reason TEXT;

-- インデックスを追加（RLSでの高速チェック用）
CREATE INDEX IF NOT EXISTS idx_users_status
ON users(status)
WHERE status != 'active';

-- コメント
COMMENT ON COLUMN users.status IS 'ユーザーステータス: active=通常, deletion_pending=退会手続き中, suspended=一時停止, banned=永久BAN';
COMMENT ON COLUMN users.deletion_requested_at IS '退会リクエスト日時';
COMMENT ON COLUMN users.suspended_at IS '一時停止日時';
COMMENT ON COLUMN users.suspended_reason IS '一時停止理由（管理者メモ）';

-- ============================================================
-- 既存のRLSポリシーを更新して、アクティブでないユーザーをブロック
-- ============================================================

-- usersテーブル: 更新をアクティブユーザーのみに制限
DROP POLICY IF EXISTS users_update_own ON users;
CREATE POLICY users_update_own ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id AND status = 'active')
  WITH CHECK (auth.uid() = id AND status = 'active');

-- mapsテーブル: アクティブでないユーザーは作成・更新・削除をブロック
DROP POLICY IF EXISTS maps_insert_own ON maps;
CREATE POLICY maps_insert_own ON maps
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND status = 'active'
    )
  );

DROP POLICY IF EXISTS maps_update_own ON maps;
CREATE POLICY maps_update_own ON maps
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND status = 'active'
    )
  );

DROP POLICY IF EXISTS maps_delete_own ON maps;
CREATE POLICY maps_delete_own ON maps
  FOR DELETE TO authenticated
  USING (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND status = 'active'
    )
  );

-- user_spotsテーブル: アクティブでないユーザーは作成・更新・削除をブロック
DROP POLICY IF EXISTS user_spots_insert_own_with_limit ON user_spots;
CREATE POLICY user_spots_insert_own_with_limit ON user_spots
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM maps WHERE maps.id = user_spots.map_id AND maps.user_id = auth.uid())
    AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND status = 'active')
    AND (
      (public.is_user_premium(auth.uid()) AND public.count_user_spots_in_map(auth.uid(), map_id) < 100)
      OR (NOT public.is_user_premium(auth.uid()) AND public.count_user_spots_in_map(auth.uid(), map_id) < 30)
    )
  );

DROP POLICY IF EXISTS user_spots_update_own ON user_spots;
CREATE POLICY user_spots_update_own ON user_spots
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND status = 'active'
    )
  );

DROP POLICY IF EXISTS user_spots_delete_own ON user_spots;
CREATE POLICY user_spots_delete_own ON user_spots
  FOR DELETE TO authenticated
  USING (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND status = 'active'
    )
  );

-- ============================================================
-- deletion_requestsの外部キー制約を変更（履歴保持のため）
-- ON DELETE CASCADE → ON DELETE SET NULL
-- ============================================================

-- 既存の外部キー制約を削除
ALTER TABLE deletion_requests
DROP CONSTRAINT IF EXISTS deletion_requests_user_id_fkey;

-- user_idをNULLABLEに変更
ALTER TABLE deletion_requests
ALTER COLUMN user_id DROP NOT NULL;

-- 新しい外部キー制約を追加（ON DELETE SET NULL）
ALTER TABLE deletion_requests
ADD CONSTRAINT deletion_requests_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

COMMENT ON COLUMN deletion_requests.user_id IS '削除対象のユーザーID（削除完了後はNULL）';

-- ============================================================
-- RPC関数を更新: users.statusを見るように変更
-- ============================================================

CREATE OR REPLACE FUNCTION check_email_has_pending_deletion(check_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE LOWER(email) = LOWER(check_email)
    AND status = 'deletion_pending'
  );
END;
$$;

COMMENT ON FUNCTION check_email_has_pending_deletion(TEXT) IS 'メールアドレスが退会手続き中かチェック（users.statusを参照）';

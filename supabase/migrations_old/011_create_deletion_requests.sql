-- アカウント削除リクエストテーブル
-- 30日後に自動削除される仕組みを実現するためのテーブル

CREATE TABLE IF NOT EXISTS deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  scheduled_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'cancelled', 'completed')),
  cancelled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- インデックス
CREATE INDEX idx_deletion_requests_user_id ON deletion_requests(user_id);
CREATE INDEX idx_deletion_requests_status ON deletion_requests(status);
CREATE INDEX idx_deletion_requests_scheduled_at ON deletion_requests(scheduled_at) WHERE status = 'pending';

-- updated_at自動更新トリガー（汎用関数を使用）
CREATE TRIGGER update_deletion_requests_updated_at
  BEFORE UPDATE ON deletion_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS（すべての操作はEdge Function経由のservice_roleで行うため、ポリシーは不要）
ALTER TABLE deletion_requests ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE deletion_requests IS 'アカウント削除リクエスト管理テーブル';
COMMENT ON COLUMN deletion_requests.user_id IS '削除対象のユーザーID';
COMMENT ON COLUMN deletion_requests.requested_at IS '削除リクエスト日時';
COMMENT ON COLUMN deletion_requests.scheduled_at IS '削除予定日時（デフォルト: リクエストから30日後）';
COMMENT ON COLUMN deletion_requests.status IS 'ステータス: pending(保留中), cancelled(キャンセル), completed(完了)';
COMMENT ON COLUMN deletion_requests.cancelled_at IS 'キャンセル日時';
COMMENT ON COLUMN deletion_requests.completed_at IS '削除完了日時';

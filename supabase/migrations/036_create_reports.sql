-- 報告機能テーブルの作成

-- 報告ステータスのenum
CREATE TYPE report_status AS ENUM ('pending', 'reviewing', 'resolved', 'dismissed');

-- 報告対象タイプのenum
CREATE TYPE report_target_type AS ENUM ('map', 'spot', 'user', 'comment');

-- 報告理由のenum
CREATE TYPE report_reason AS ENUM (
  'spam',           -- スパム
  'inappropriate',  -- 不適切なコンテンツ
  'harassment',     -- 嫌がらせ
  'misinformation', -- 誤った情報
  'copyright',      -- 著作権侵害
  'other'           -- その他
);

-- reportsテーブル
CREATE TABLE reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type report_target_type NOT NULL,
  target_id uuid NOT NULL,
  reason report_reason NOT NULL DEFAULT 'other',
  description text,
  status report_status NOT NULL DEFAULT 'pending',
  admin_notes text,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- インデックス
CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_target ON reports(target_type, target_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

-- 同じユーザーが同じ対象を重複報告しないようにするユニーク制約
CREATE UNIQUE INDEX idx_reports_unique_report ON reports(reporter_id, target_type, target_id)
  WHERE status IN ('pending', 'reviewing');

-- updated_atを自動更新するトリガー
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS有効化
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 報告者は自分の報告のみ作成・閲覧可能
CREATE POLICY "Users can create reports"
  ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);

-- 管理者は全ての報告を閲覧・更新可能（将来の管理画面用）
-- 注: 管理者ロールの実装時に追加
-- CREATE POLICY "Admins can view all reports"
--   ON reports
--   FOR ALL
--   TO authenticated
--   USING (is_admin(auth.uid()));

COMMENT ON TABLE reports IS '報告機能テーブル';
COMMENT ON COLUMN reports.reporter_id IS '報告したユーザーID';
COMMENT ON COLUMN reports.target_type IS '報告対象のタイプ（map, spot, user, comment）';
COMMENT ON COLUMN reports.target_id IS '報告対象のID';
COMMENT ON COLUMN reports.reason IS '報告理由';
COMMENT ON COLUMN reports.description IS '報告の詳細説明';
COMMENT ON COLUMN reports.status IS '報告のステータス';
COMMENT ON COLUMN reports.admin_notes IS '管理者のメモ';
COMMENT ON COLUMN reports.resolved_at IS '解決日時';
COMMENT ON COLUMN reports.resolved_by IS '解決した管理者のID';

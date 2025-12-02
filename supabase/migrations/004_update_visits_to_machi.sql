-- マイグレーション004: visitsテーブルを街訪問記録に変更
-- map_id → machi_id に変更し、visit_count を追加

-- ===============================
-- 1. visitsテーブルを削除して再作成
-- ===============================

DROP TABLE IF EXISTS visits;

CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  machi_id TEXT NOT NULL REFERENCES machi(id),
  visit_count INTEGER DEFAULT 1,
  visited_at TIMESTAMPTZ NOT NULL,
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- ユーザーと街の組み合わせは一意
  UNIQUE(user_id, machi_id)
);

-- ===============================
-- 2. インデックス作成
-- ===============================

CREATE INDEX IF NOT EXISTS idx_visits_user_id ON visits(user_id);
CREATE INDEX IF NOT EXISTS idx_visits_machi_id ON visits(machi_id);
CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON visits(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_visits_user_machi ON visits(user_id, machi_id);

-- ===============================
-- 3. コメント追加
-- ===============================

COMMENT ON TABLE visits IS 'ユーザーが訪問した街の記録（街ごとに1レコード、訪問回数をカウント）';
COMMENT ON COLUMN visits.machi_id IS '訪問した街（駅）のID';
COMMENT ON COLUMN visits.visit_count IS 'この街への訪問回数';
COMMENT ON COLUMN visits.visited_at IS '最後に訪問した日時';

-- ===============================
-- 注意事項
-- ===============================

-- このマイグレーションは破壊的変更です。
-- 既存のマップ訪問記録データは削除されます。

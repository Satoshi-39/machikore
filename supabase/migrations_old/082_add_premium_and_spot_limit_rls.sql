-- ===============================
-- プレミアム機能 & スポット上限 RLS
-- ===============================

-- 1. users テーブルに is_premium カラムを追加（is_subscribed から名前変更）
-- 既存の is_subscribed を is_premium にリネーム
ALTER TABLE users RENAME COLUMN is_subscribed TO is_premium;

-- premium_expires_at カラムを追加（subscription_expires_at から名前変更）
-- 既存の subscription_expires_at がある場合はリネーム
ALTER TABLE users RENAME COLUMN subscription_expires_at TO premium_expires_at;

-- subscription_started_at を premium_started_at にリネーム
ALTER TABLE users RENAME COLUMN subscription_started_at TO premium_started_at;

-- 2. is_premium のインデックスを作成（検索高速化）
CREATE INDEX IF NOT EXISTS idx_users_is_premium ON users(is_premium);

-- 3. user_spots テーブルのスポット上限 RLS ポリシーを作成
-- 既存の INSERT ポリシーを削除（あれば）
DROP POLICY IF EXISTS "user_spots_insert_policy" ON user_spots;
DROP POLICY IF EXISTS "user_spots_insert_with_limit" ON user_spots;

-- 新しい INSERT ポリシー（スポット上限付き）
CREATE POLICY "user_spots_insert_with_limit" ON user_spots
  FOR INSERT WITH CHECK (
    -- 自分のスポットのみ追加可能
    auth.uid() = user_id
    AND
    -- スポット数の制限チェック
    (
      -- プレミアムユーザーは100個まで
      (
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid()
          AND users.is_premium = true
        )
        AND
        (
          SELECT COUNT(*) FROM user_spots
          WHERE user_spots.user_id = auth.uid()
          AND user_spots.map_id = map_id
        ) < 100
      )
      OR
      -- 無料ユーザーは30個まで
      (
        NOT EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid()
          AND users.is_premium = true
        )
        AND
        (
          SELECT COUNT(*) FROM user_spots
          WHERE user_spots.user_id = auth.uid()
          AND user_spots.map_id = map_id
        ) < 30
      )
    )
  );

-- 4. プレミアム状態を更新する関数（Webhook から呼び出す用）
CREATE OR REPLACE FUNCTION update_user_premium_status(
  p_user_id UUID,
  p_is_premium BOOLEAN,
  p_expires_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET
    is_premium = p_is_premium,
    premium_expires_at = p_expires_at,
    premium_started_at = CASE
      WHEN p_is_premium = true AND premium_started_at IS NULL
      THEN NOW()
      ELSE premium_started_at
    END,
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. 期限切れのプレミアムを自動で無効化する関数（定期実行用）
CREATE OR REPLACE FUNCTION expire_premium_subscriptions()
RETURNS INTEGER AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  UPDATE users
  SET
    is_premium = false,
    updated_at = NOW()
  WHERE
    is_premium = true
    AND premium_expires_at IS NOT NULL
    AND premium_expires_at < NOW();

  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  RETURN affected_rows;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

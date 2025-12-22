-- ===============================
-- user_spots RLS の無限再帰を修正
-- ===============================

-- 問題: サブクエリ内で user_spots を参照すると RLS が再帰的に評価されてしまう
-- 解決: SECURITY DEFINER 関数を使って RLS をバイパスしてカウントする

-- 1. スポット数をカウントする関数を作成（SECURITY DEFINER で RLS をバイパス）
CREATE OR REPLACE FUNCTION count_user_spots_in_map(p_user_id UUID, p_map_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM user_spots
    WHERE user_id = p_user_id
    AND map_id = p_map_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. プレミアム状態をチェックする関数（SECURITY DEFINER で RLS をバイパス）
CREATE OR REPLACE FUNCTION is_user_premium(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT COALESCE(is_premium, false)
    FROM users
    WHERE id = p_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 既存のポリシーを削除
DROP POLICY IF EXISTS "user_spots_insert_with_limit" ON user_spots;

-- 4. 新しい INSERT ポリシー（関数を使用して無限再帰を回避）
CREATE POLICY "user_spots_insert_with_limit" ON user_spots
  FOR INSERT WITH CHECK (
    -- 自分のスポットのみ追加可能
    auth.uid() = user_id
    AND
    -- スポット数の制限チェック
    (
      -- プレミアムユーザーは100個まで
      (
        is_user_premium(auth.uid())
        AND count_user_spots_in_map(auth.uid(), map_id) < 100
      )
      OR
      -- 無料ユーザーは30個まで
      (
        NOT is_user_premium(auth.uid())
        AND count_user_spots_in_map(auth.uid(), map_id) < 30
      )
    )
  );

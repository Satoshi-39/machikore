-- フォロー数を未ログインユーザーでも閲覧可能にする
-- 既存のポリシーは TO authenticated のため、匿名ユーザーはfollowsを参照できない

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Follows are viewable by everyone" ON follows;

-- 匿名ユーザーも含めて全員が閲覧可能にする
CREATE POLICY "Follows are viewable by everyone"
  ON follows FOR SELECT
  USING (true);

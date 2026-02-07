-- ============================================================
-- コレクション上限制限のマイグレーション
-- ============================================================
-- 制限値:
--   無料ユーザー: 3個
--   プレミアムユーザー: 10個
-- ============================================================

-- ============================================================
-- Step 1: コレクション数カウント関数
-- ============================================================
CREATE OR REPLACE FUNCTION public.count_user_collections(p_user_id uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN (SELECT COUNT(*)::INTEGER FROM collections
    WHERE user_id = p_user_id);
END;
$$;

COMMENT ON FUNCTION public.count_user_collections(uuid) IS 'ユーザーのコレクション数をカウント';

-- ============================================================
-- Step 2: 既存のINSERTポリシーを削除
-- ============================================================
DROP POLICY IF EXISTS collections_insert_own ON public.collections;

-- ============================================================
-- Step 3: 上限付きINSERTポリシーを作成
-- ============================================================
-- 無料ユーザー: 3個まで
-- プレミアムユーザー: 10個まで
CREATE POLICY collections_insert_own_with_limit ON public.collections
  FOR INSERT TO authenticated WITH CHECK (
    user_id = (SELECT auth.uid())
    AND (
      (is_user_premium((SELECT auth.uid()))
        AND count_user_collections((SELECT auth.uid())) < 10)
      OR (NOT is_user_premium((SELECT auth.uid()))
        AND count_user_collections((SELECT auth.uid())) < 3)
    )
  );

COMMENT ON POLICY collections_insert_own_with_limit ON public.collections IS 'コレクション作成: 自分のみ、上限付き（無料3個/プレミアム10個）';

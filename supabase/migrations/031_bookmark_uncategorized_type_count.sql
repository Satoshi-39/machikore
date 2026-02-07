-- =====================================================
-- 「後で見る」ブックマークのカウントをマップ/スポット別に分離
-- =====================================================
-- 変更前: folder_id IS NULL のブックマークを全件カウント（マップ+スポット合算）
-- 変更後: bookmark_type ('maps'/'spots') でフィルタしてカウント
-- 旧シグネチャ count_bookmarks_uncategorized(uuid) は互換性のため残す

-- -----------------------------------------------------
-- 1. オーバーロード版: タイプ別カウント関数
-- -----------------------------------------------------

CREATE OR REPLACE FUNCTION public.count_bookmarks_uncategorized(p_user_id uuid, p_bookmark_type text)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF p_bookmark_type = 'maps' THEN
    RETURN (SELECT COUNT(*)::INTEGER FROM bookmarks
      WHERE user_id = p_user_id AND folder_id IS NULL AND map_id IS NOT NULL);
  ELSIF p_bookmark_type = 'spots' THEN
    RETURN (SELECT COUNT(*)::INTEGER FROM bookmarks
      WHERE user_id = p_user_id AND folder_id IS NULL AND user_spot_id IS NOT NULL);
  ELSE
    RAISE EXCEPTION 'Invalid bookmark_type: %. Must be ''maps'' or ''spots''.', p_bookmark_type;
  END IF;
END;
$$;

-- -----------------------------------------------------
-- 2. ブックマーク INSERT RLS ポリシー差し替え
-- -----------------------------------------------------
-- マップ/スポット別にカウントするように変更

DROP POLICY IF EXISTS bookmarks_insert_own_with_limit ON public.bookmarks;

CREATE POLICY bookmarks_insert_own_with_limit ON public.bookmarks
  FOR INSERT TO authenticated WITH CHECK (
    user_id = (SELECT auth.uid())
    AND (
      CASE
        WHEN folder_id IS NULL AND map_id IS NOT NULL THEN
          -- マップブックマーク（後で見る）: マップのみカウント
          (is_user_premium((SELECT auth.uid()))
            AND count_bookmarks_uncategorized((SELECT auth.uid()), 'maps') < 300)
          OR (NOT is_user_premium((SELECT auth.uid()))
            AND count_bookmarks_uncategorized((SELECT auth.uid()), 'maps') < 100)
        WHEN folder_id IS NULL AND user_spot_id IS NOT NULL THEN
          -- スポットブックマーク（後で見る）: スポットのみカウント
          (is_user_premium((SELECT auth.uid()))
            AND count_bookmarks_uncategorized((SELECT auth.uid()), 'spots') < 300)
          OR (NOT is_user_premium((SELECT auth.uid()))
            AND count_bookmarks_uncategorized((SELECT auth.uid()), 'spots') < 100)
        ELSE
          -- フォルダ内ブックマーク（既にタイプ別なので変更なし）
          (is_user_premium((SELECT auth.uid()))
            AND count_bookmarks_in_folder((SELECT auth.uid()), folder_id) < 30)
          OR (NOT is_user_premium((SELECT auth.uid()))
            AND count_bookmarks_in_folder((SELECT auth.uid()), folder_id) < 15)
      END
    )
  );

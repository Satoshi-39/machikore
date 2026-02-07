-- =====================================================
-- ブックマークフォルダのfolder_type別カウント対応
-- =====================================================
-- マップとスポットのフォルダを別々にカウントするように修正
-- =====================================================

-- -----------------------------------------------------
-- 1. count_bookmark_folders関数を修正（folder_type対応）
-- -----------------------------------------------------

CREATE OR REPLACE FUNCTION public.count_bookmark_folders(p_user_id uuid, p_folder_type text)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN (SELECT COUNT(*)::INTEGER FROM bookmark_folders
    WHERE user_id = p_user_id AND folder_type = p_folder_type);
END;
$$;

-- -----------------------------------------------------
-- 2. フォルダ INSERT RLS ポリシーを修正（folder_type別カウント）
-- -----------------------------------------------------

DROP POLICY IF EXISTS bookmark_folders_insert_own_with_limit ON public.bookmark_folders;

CREATE POLICY bookmark_folders_insert_own_with_limit ON public.bookmark_folders
  FOR INSERT TO authenticated WITH CHECK (
    user_id = (SELECT auth.uid())
    AND (
      (is_user_premium((SELECT auth.uid()))
        AND count_bookmark_folders((SELECT auth.uid()), folder_type) < 30)
      OR (NOT is_user_premium((SELECT auth.uid()))
        AND count_bookmark_folders((SELECT auth.uid()), folder_type) < 10)
    )
  );

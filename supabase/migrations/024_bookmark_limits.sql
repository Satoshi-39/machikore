-- =====================================================
-- ブックマーク制限機能
-- =====================================================
-- 制限値:
--   | | 無料 | プレミアム |
--   |---|---|---|
--   | 通常フォルダ（1フォルダあたり） | 15件 | 30件 |
--   | 後で見る（folder_id = NULL） | 100件 | 300件 |
--   | フォルダ数（合計） | 10個 | 30個 |
-- =====================================================

-- -----------------------------------------------------
-- 1. ヘルパー関数
-- -----------------------------------------------------

-- フォルダ内のブックマーク数をカウント
CREATE OR REPLACE FUNCTION public.count_bookmarks_in_folder(p_user_id uuid, p_folder_id uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN (SELECT COUNT(*)::INTEGER FROM bookmarks
    WHERE user_id = p_user_id AND folder_id = p_folder_id);
END;
$$;

-- 未分類（後で見る）のブックマーク数をカウント
CREATE OR REPLACE FUNCTION public.count_bookmarks_uncategorized(p_user_id uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN (SELECT COUNT(*)::INTEGER FROM bookmarks
    WHERE user_id = p_user_id AND folder_id IS NULL);
END;
$$;

-- ブックマークフォルダ数をカウント（全folder_type合計）
CREATE OR REPLACE FUNCTION public.count_bookmark_folders(p_user_id uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN (SELECT COUNT(*)::INTEGER FROM bookmark_folders
    WHERE user_id = p_user_id);
END;
$$;

-- フォルダ削除時の重複カウント用RPC関数
-- フォルダ内のアイテムが既に「後で見る」にあるかをチェック
CREATE OR REPLACE FUNCTION public.count_bookmark_duplicates_on_folder_delete(
  p_user_id uuid,
  p_folder_id uuid
) RETURNS integer LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM bookmarks b1
    WHERE b1.user_id = p_user_id
      AND b1.folder_id = p_folder_id
      AND EXISTS (
        SELECT 1 FROM bookmarks b2
        WHERE b2.user_id = p_user_id
          AND b2.folder_id IS NULL
          AND (
            (b1.map_id IS NOT NULL AND b1.map_id = b2.map_id)
            OR (b1.user_spot_id IS NOT NULL AND b1.user_spot_id = b2.user_spot_id)
          )
      )
  );
END;
$$;

-- -----------------------------------------------------
-- 2. ブックマーク INSERT RLS ポリシー差し替え
-- -----------------------------------------------------

DROP POLICY IF EXISTS bookmarks_insert_own ON public.bookmarks;

CREATE POLICY bookmarks_insert_own_with_limit ON public.bookmarks
  FOR INSERT TO authenticated WITH CHECK (
    user_id = (SELECT auth.uid())
    AND (
      CASE
        WHEN folder_id IS NULL THEN
          (is_user_premium((SELECT auth.uid()))
            AND count_bookmarks_uncategorized((SELECT auth.uid())) < 300)
          OR (NOT is_user_premium((SELECT auth.uid()))
            AND count_bookmarks_uncategorized((SELECT auth.uid())) < 100)
        ELSE
          (is_user_premium((SELECT auth.uid()))
            AND count_bookmarks_in_folder((SELECT auth.uid()), folder_id) < 30)
          OR (NOT is_user_premium((SELECT auth.uid()))
            AND count_bookmarks_in_folder((SELECT auth.uid()), folder_id) < 15)
      END
    )
  );

-- -----------------------------------------------------
-- 3. フォルダ INSERT RLS ポリシー差し替え
-- -----------------------------------------------------

DROP POLICY IF EXISTS bookmark_folders_insert_own ON public.bookmark_folders;

CREATE POLICY bookmark_folders_insert_own_with_limit ON public.bookmark_folders
  FOR INSERT TO authenticated WITH CHECK (
    user_id = (SELECT auth.uid())
    AND (
      (is_user_premium((SELECT auth.uid()))
        AND count_bookmark_folders((SELECT auth.uid())) < 30)
      OR (NOT is_user_premium((SELECT auth.uid()))
        AND count_bookmark_folders((SELECT auth.uid())) < 10)
    )
  );

-- -----------------------------------------------------
-- 4. FK を ON DELETE CASCADE → ON DELETE SET NULL に修正
-- -----------------------------------------------------
-- 既存のバグ修正: フォルダ削除時にブックマークが完全に削除される
-- 正しい動作: フォルダ削除時にブックマークは「後で見る」に移動する

ALTER TABLE public.bookmarks DROP CONSTRAINT bookmarks_folder_id_fkey;
ALTER TABLE public.bookmarks ADD CONSTRAINT bookmarks_folder_id_fkey
  FOREIGN KEY (folder_id) REFERENCES public.bookmark_folders(id) ON DELETE SET NULL;

-- -----------------------------------------------------
-- 5. SET NULL 時の重複削除トリガー
-- -----------------------------------------------------
-- フォルダ削除時に folder_id = NULL になるブックマークが、
-- 既に後で見るに存在する場合は重複を削除する

CREATE OR REPLACE FUNCTION public.handle_bookmark_folder_null()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  -- 新しい folder_id が NULL になる場合のみチェック
  IF NEW.folder_id IS NULL AND OLD.folder_id IS NOT NULL THEN
    -- 同じ user_id + map_id/user_spot_id で既に folder_id = NULL のレコードがあれば削除
    IF NEW.map_id IS NOT NULL THEN
      DELETE FROM bookmarks
      WHERE user_id = NEW.user_id
        AND map_id = NEW.map_id
        AND folder_id IS NULL
        AND id != NEW.id;
    ELSIF NEW.user_spot_id IS NOT NULL THEN
      DELETE FROM bookmarks
      WHERE user_id = NEW.user_id
        AND user_spot_id = NEW.user_spot_id
        AND folder_id IS NULL
        AND id != NEW.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- トリガーが存在する場合は削除してから作成
DROP TRIGGER IF EXISTS trigger_bookmark_folder_null ON public.bookmarks;

CREATE TRIGGER trigger_bookmark_folder_null
  BEFORE UPDATE ON public.bookmarks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_bookmark_folder_null();

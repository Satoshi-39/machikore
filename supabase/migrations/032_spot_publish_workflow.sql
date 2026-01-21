-- スポット公開ワークフローの実装
--
-- 変更点:
-- 1. user_spots.is_public のデフォルトを false に変更（下書き状態で作成）
-- 2. maps.is_article_public カラムを削除（不要になったため）
-- 3. maps_public ビューを更新（is_article_public 削除）
-- 4. スポット公開時にマップも自動公開するトリガーを作成
-- 5. マップ非公開時の動作はRLSで制御（既存のRLSで対応済み）

-- ============================================================
-- 1. user_spots.is_public のデフォルトを false に変更
-- ============================================================

-- デフォルト値を変更（既存データは影響なし）
ALTER TABLE public.user_spots
ALTER COLUMN is_public SET DEFAULT false;

COMMENT ON COLUMN public.user_spots.is_public IS 'スポットが公開されているかどうか（デフォルト: false = 下書き）。記事（article_content）を書いて公開ボタンを押すとtrueになる';

-- ============================================================
-- 2. maps_public ビューを削除（is_article_public カラム削除の前に必要）
-- ============================================================
-- ※ビューはデータを持たない「保存されたクエリ」なので削除しても元データは消えない

DROP VIEW IF EXISTS public.maps_public;

-- ============================================================
-- 3. maps.is_article_public カラムを削除
-- ============================================================

ALTER TABLE public.maps
DROP COLUMN IF EXISTS is_article_public;

-- ============================================================
-- 4. maps_public ビューを再作成（is_article_public なし）
-- ============================================================

CREATE VIEW public.maps_public AS
SELECT
  m.id,
  m.user_id,
  m.name,
  m.description,
  m.thumbnail_url,
  m.is_public,
  m.is_official,
  m.show_label_chips,
  m.category_id,
  m.language,
  m.created_at,
  m.updated_at,
  m.likes_count,
  m.comments_count,
  m.bookmarks_count,
  m.article_intro,
  m.article_outro,
  -- 公開スポットのみをカウント（spots_countを上書き）
  (SELECT COUNT(*)::INT FROM user_spots us WHERE us.map_id = m.id AND us.is_public = true) AS spots_count
FROM maps m
WHERE m.is_public = true;

COMMENT ON VIEW public.maps_public IS '公開マップ一覧（spots_countは公開スポット数のみ）';

-- ============================================================
-- 3. スポット公開時にマップも自動公開するトリガー
-- ============================================================

-- トリガー関数: スポットが公開されたらマップも公開
CREATE OR REPLACE FUNCTION public.auto_publish_map_on_spot_publish()
RETURNS TRIGGER AS $$
BEGIN
  -- スポットが非公開から公開に変わった場合
  IF OLD.is_public = false AND NEW.is_public = true THEN
    -- マップが非公開なら公開に変更
    UPDATE public.maps
    SET is_public = true, updated_at = now()
    WHERE id = NEW.map_id AND is_public = false;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.auto_publish_map_on_spot_publish IS 'スポットが公開されたときにマップも自動的に公開するトリガー関数';

-- 既存のトリガーがあれば削除
DROP TRIGGER IF EXISTS trigger_auto_publish_map_on_spot_publish ON public.user_spots;

-- トリガー作成
CREATE TRIGGER trigger_auto_publish_map_on_spot_publish
  AFTER UPDATE ON public.user_spots
  FOR EACH ROW
  WHEN (OLD.is_public IS DISTINCT FROM NEW.is_public)
  EXECUTE FUNCTION public.auto_publish_map_on_spot_publish();

-- ============================================================
-- 4. スポット公開用のRPC関数
-- ============================================================

-- スポットを公開する関数（article_contentが入力されているかチェック）
CREATE OR REPLACE FUNCTION public.publish_spot(
  p_spot_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_article_content JSONB;
  v_user_id UUID;
  v_spot_user_id UUID;
BEGIN
  -- 認証チェック
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- スポットの所有者チェックとarticle_content取得
  SELECT user_id, article_content INTO v_spot_user_id, v_article_content
  FROM public.user_spots
  WHERE id = p_spot_id;

  IF v_spot_user_id IS NULL THEN
    RAISE EXCEPTION 'Spot not found';
  END IF;

  IF v_spot_user_id != v_user_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- article_contentが入力されているかチェック
  IF v_article_content IS NULL OR v_article_content = '{}'::jsonb OR v_article_content = 'null'::jsonb THEN
    RAISE EXCEPTION 'Article content is required to publish';
  END IF;

  -- スポットを公開
  UPDATE public.user_spots
  SET is_public = true, updated_at = now()
  WHERE id = p_spot_id;

  -- トリガーによりマップも自動公開される

  RETURN true;
END;
$$;

COMMENT ON FUNCTION public.publish_spot IS 'スポットを公開する。article_contentが入力されている必要がある。公開時にマップも自動的に公開される';

-- スポットを非公開にする関数
CREATE OR REPLACE FUNCTION public.unpublish_spot(
  p_spot_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_spot_user_id UUID;
BEGIN
  -- 認証チェック
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- スポットの所有者チェック
  SELECT user_id INTO v_spot_user_id
  FROM public.user_spots
  WHERE id = p_spot_id;

  IF v_spot_user_id IS NULL THEN
    RAISE EXCEPTION 'Spot not found';
  END IF;

  IF v_spot_user_id != v_user_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- スポットを非公開
  UPDATE public.user_spots
  SET is_public = false, updated_at = now()
  WHERE id = p_spot_id;

  RETURN true;
END;
$$;

COMMENT ON FUNCTION public.unpublish_spot IS 'スポットを非公開にする';

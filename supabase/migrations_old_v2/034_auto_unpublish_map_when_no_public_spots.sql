-- マップ公開ワークフローの制約
--
-- 1. マップを公開するには公開スポットが1つ以上必要
-- 2. スポットが公開→非公開に変わった時、公開スポットが0件ならマップも自動非公開
-- 3. 公開スポットが削除されて0件になったらマップも自動非公開

-- ============================================================
-- マップ公開時に公開スポットがあるかチェック
-- ============================================================

CREATE OR REPLACE FUNCTION public.check_public_spots_before_map_publish()
RETURNS TRIGGER AS $$
DECLARE
  v_public_spot_count INT;
BEGIN
  -- マップが非公開から公開に変わる場合のみチェック
  IF (OLD.is_public = false OR OLD.is_public IS NULL) AND NEW.is_public = true THEN
    -- 公開スポット数をカウント
    SELECT COUNT(*) INTO v_public_spot_count
    FROM public.user_spots
    WHERE map_id = NEW.id
      AND is_public = true;

    -- 公開スポットが0件ならエラー
    IF v_public_spot_count = 0 THEN
      RAISE EXCEPTION 'Cannot publish map without any public spots';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.check_public_spots_before_map_publish IS 'マップ公開時に公開スポットが1つ以上あるかチェックするトリガー関数';

-- 既存のトリガーがあれば削除
DROP TRIGGER IF EXISTS trigger_check_public_spots_before_map_publish ON public.maps;

-- トリガー作成
CREATE TRIGGER trigger_check_public_spots_before_map_publish
  BEFORE UPDATE ON public.maps
  FOR EACH ROW
  WHEN (OLD.is_public IS DISTINCT FROM NEW.is_public)
  EXECUTE FUNCTION public.check_public_spots_before_map_publish();

-- ============================================================
-- トリガー関数: 公開スポットがなくなったらマップを非公開に
-- ============================================================

CREATE OR REPLACE FUNCTION public.auto_unpublish_map_when_no_public_spots()
RETURNS TRIGGER AS $$
DECLARE
  v_public_spot_count INT;
BEGIN
  -- スポットが公開から非公開に変わった場合のみチェック
  IF OLD.is_public = true AND NEW.is_public = false THEN
    -- そのマップの公開スポット数をカウント
    SELECT COUNT(*) INTO v_public_spot_count
    FROM public.user_spots
    WHERE map_id = NEW.map_id
      AND is_public = true
      AND id != NEW.id;  -- 今変更中のスポットは除外

    -- 公開スポットが0件ならマップを非公開に
    IF v_public_spot_count = 0 THEN
      UPDATE public.maps
      SET is_public = false, updated_at = now()
      WHERE id = NEW.map_id AND is_public = true;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.auto_unpublish_map_when_no_public_spots IS '公開スポットがなくなったときにマップも自動的に非公開にするトリガー関数';

-- 既存のトリガーがあれば削除
DROP TRIGGER IF EXISTS trigger_auto_unpublish_map_when_no_public_spots ON public.user_spots;

-- トリガー作成
CREATE TRIGGER trigger_auto_unpublish_map_when_no_public_spots
  AFTER UPDATE ON public.user_spots
  FOR EACH ROW
  WHEN (OLD.is_public = true AND NEW.is_public = false)
  EXECUTE FUNCTION public.auto_unpublish_map_when_no_public_spots();

-- ============================================================
-- スポット削除時も同様にチェック
-- ============================================================

CREATE OR REPLACE FUNCTION public.auto_unpublish_map_on_spot_delete()
RETURNS TRIGGER AS $$
DECLARE
  v_public_spot_count INT;
BEGIN
  -- 削除されたスポットが公開だった場合のみチェック
  IF OLD.is_public = true THEN
    -- そのマップの残りの公開スポット数をカウント
    SELECT COUNT(*) INTO v_public_spot_count
    FROM public.user_spots
    WHERE map_id = OLD.map_id
      AND is_public = true;

    -- 公開スポットが0件ならマップを非公開に
    IF v_public_spot_count = 0 THEN
      UPDATE public.maps
      SET is_public = false, updated_at = now()
      WHERE id = OLD.map_id AND is_public = true;
    END IF;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.auto_unpublish_map_on_spot_delete IS '公開スポットが削除されて0件になったときにマップも自動的に非公開にするトリガー関数';

-- 既存のトリガーがあれば削除
DROP TRIGGER IF EXISTS trigger_auto_unpublish_map_on_spot_delete ON public.user_spots;

-- トリガー作成
CREATE TRIGGER trigger_auto_unpublish_map_on_spot_delete
  AFTER DELETE ON public.user_spots
  FOR EACH ROW
  WHEN (OLD.is_public = true)
  EXECUTE FUNCTION public.auto_unpublish_map_on_spot_delete();

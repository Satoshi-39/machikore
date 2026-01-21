-- スポット新規作成時にもマップを自動公開するトリガー
--
-- 032では AFTER UPDATE のみだったため、
-- スポットを公開状態で新規作成した場合にマップが自動公開されなかった

CREATE OR REPLACE FUNCTION public.auto_publish_map_on_spot_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- スポットが公開状態で作成された場合
  IF NEW.is_public = true THEN
    -- マップが非公開なら公開に変更
    UPDATE public.maps
    SET is_public = true, updated_at = now()
    WHERE id = NEW.map_id AND is_public = false;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.auto_publish_map_on_spot_insert IS 'スポットが公開状態で新規作成されたときにマップも自動的に公開するトリガー関数';

DROP TRIGGER IF EXISTS trigger_auto_publish_map_on_spot_insert ON public.user_spots;

CREATE TRIGGER trigger_auto_publish_map_on_spot_insert
  AFTER INSERT ON public.user_spots
  FOR EACH ROW
  WHEN (NEW.is_public = true)
  EXECUTE FUNCTION public.auto_publish_map_on_spot_insert();

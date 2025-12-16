-- 閲覧履歴のローテーション（古い履歴を自動削除）
-- ユーザーごとに最新100件のみ保持する
-- 閾値方式: 110件を超えたら100件まで削除（10件のバッファ）

-- 古い履歴を削除する関数
CREATE OR REPLACE FUNCTION public.cleanup_old_view_history()
RETURNS trigger AS $$
DECLARE
  history_count INTEGER;
BEGIN
  -- 同一ユーザーの履歴件数を取得
  SELECT COUNT(*) INTO history_count
  FROM public.view_history
  WHERE user_id = NEW.user_id;

  -- 110件を超えたら100件まで削除（10件ごとにまとめて削除）
  IF history_count > 110 THEN
    DELETE FROM public.view_history
    WHERE id IN (
      SELECT id FROM public.view_history
      WHERE user_id = NEW.user_id
      ORDER BY viewed_at DESC
      OFFSET 100
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- INSERT/UPDATE後にローテーションを実行するトリガー
DROP TRIGGER IF EXISTS trigger_cleanup_view_history ON public.view_history;

CREATE TRIGGER trigger_cleanup_view_history
  AFTER INSERT OR UPDATE ON public.view_history
  FOR EACH ROW
  EXECUTE FUNCTION public.cleanup_old_view_history();

-- コメント追加
COMMENT ON FUNCTION public.cleanup_old_view_history() IS '閲覧履歴を100件に制限するクリーンアップ関数（閾値方式: 110件超で削除）';

-- マップあたりのスポット数上限（100）を強制するトリガー

-- 関数を作成
CREATE OR REPLACE FUNCTION check_spots_limit()
RETURNS TRIGGER AS $$
BEGIN
  -- 現在のマップのスポット数をチェック
  IF (SELECT COUNT(*) FROM user_spots WHERE map_id = NEW.map_id) >= 100 THEN
    RAISE EXCEPTION 'マップあたりのスポット数上限（100）に達しています';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガーを作成（INSERT時のみ）
CREATE TRIGGER enforce_spots_limit
  BEFORE INSERT ON user_spots
  FOR EACH ROW
  EXECUTE FUNCTION check_spots_limit();

-- UPDATE時にmap_idが変更された場合もチェック
CREATE OR REPLACE FUNCTION check_spots_limit_on_update()
RETURNS TRIGGER AS $$
BEGIN
  -- map_idが変更された場合のみチェック
  IF OLD.map_id IS DISTINCT FROM NEW.map_id THEN
    IF (SELECT COUNT(*) FROM user_spots WHERE map_id = NEW.map_id) >= 100 THEN
      RAISE EXCEPTION '移動先のマップはスポット数上限（100）に達しています';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_spots_limit_on_update
  BEFORE UPDATE ON user_spots
  FOR EACH ROW
  EXECUTE FUNCTION check_spots_limit_on_update();

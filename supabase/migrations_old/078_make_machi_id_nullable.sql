-- machi_id を nullable に変更
-- 街情報が見つからない場所でもスポット登録を可能にする

-- user_spots テーブルの machi_id を nullable に
ALTER TABLE user_spots ALTER COLUMN machi_id DROP NOT NULL;

-- master_spots テーブルの machi_id を nullable に（既に nullable の可能性あり）
ALTER TABLE master_spots ALTER COLUMN machi_id DROP NOT NULL;

COMMENT ON COLUMN user_spots.machi_id IS '紐づく街のID（街が見つからない場合はnull）';
COMMENT ON COLUMN master_spots.machi_id IS '紐づく街のID（街が見つからない場合はnull）';

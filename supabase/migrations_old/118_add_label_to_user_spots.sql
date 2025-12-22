-- user_spots に label カラムを追加
-- マップ内でスポットを種類分けするため（例: カフェマップで「ドトール」「スタバ」など）

ALTER TABLE user_spots
ADD COLUMN label TEXT NULL;

COMMENT ON COLUMN user_spots.label IS 'スポットのラベル（自由入力、例: ドトール、スタバ、行きたい）';

-- ラベルでの検索・フィルタリングを高速化するためのインデックス
CREATE INDEX idx_user_spots_label ON user_spots(label);

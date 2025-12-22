-- マップテーブルにラベルチップ表示設定を追加
-- ラベルチップはマップ画面のヘッダー下に表示され、タップでフィルタリング可能

ALTER TABLE maps ADD COLUMN show_label_chips BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN maps.show_label_chips IS 'ラベルチップをマップ上部に表示するかどうか';

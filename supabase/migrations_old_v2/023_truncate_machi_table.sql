-- =============================================
-- machi テーブルのデータを削除
-- =============================================
--
-- 目的:
-- - 駅ベースの詳細すぎるデータを削除し、白紙の状態にする
-- - リリース後に需要のある市から段階的にエリアデータを追加する方針に変更
--
-- 影響:
-- - user_spots, master_spots の machi_id は ON DELETE SET NULL により NULL になる
-- - schedules, visits の machi_id は NOT NULL 制約があるため、
--   既存データがある場合はエラーになる可能性がある
--
-- 注意:
-- - 本番環境で実行前に、schedules, visits テーブルのデータを確認すること
-- - 必要に応じて schedules, visits のデータも削除すること
-- =============================================

-- schedules テーブルのデータを削除（machi_id が NOT NULL のため）
DELETE FROM public.schedules;

-- visits テーブルのデータを削除（machi_id が NOT NULL のため）
DELETE FROM public.visits;

-- machi テーブルのデータを削除
-- CASCADE により、外部キー制約のある関連データも処理される
DELETE FROM public.machi;

-- 確認用コメント
COMMENT ON TABLE public.machi IS 'エリア（街）マスター。リリース後に需要のある市から段階的にデータを追加。ポリゴンデータは将来追加予定。';

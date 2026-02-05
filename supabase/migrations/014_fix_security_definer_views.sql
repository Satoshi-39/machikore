-- SECURITY DEFINER → SECURITY INVOKER に変更
-- Supabase Security Advisorで検出された脆弱性の修正
-- SECURITY DEFINERはビュー作成者（postgres）の権限でRLSを評価するため、
-- RLSポリシーがバイパスされる問題がある。
-- SECURITY INVOKERに変更することで、クエリ実行者の権限でRLSが適用される。

-- current_terms_versions:
--   参照テーブル: terms_versions (SELECT USING (true) → 全員閲覧可)
--   影響なし
ALTER VIEW "public"."current_terms_versions" SET (security_invoker = on);

-- user_latest_agreements:
--   参照テーブル: terms_agreements (自分のデータのみ閲覧可), terms_versions (全員閲覧可)
--   SECURITY INVOKERにより、他人の同意情報は正しく非表示になる
ALTER VIEW "public"."user_latest_agreements" SET (security_invoker = on);

-- maps_public:
--   参照テーブル: maps (公開 or 自分のマップ), user_spots (公開マップの公開スポット or 自分のマップ)
--   ビュー自体がWHERE is_public = trueでフィルタ済みのため影響なし
ALTER VIEW "public"."maps_public" SET (security_invoker = on);

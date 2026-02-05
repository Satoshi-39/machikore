-- maps_public: GRANT ALL → SELECT のみに制限
-- 公開マップの読み取り専用ビューなので、SELECT以外の権限は不要
REVOKE ALL ON "public"."maps_public" FROM "anon";
REVOKE ALL ON "public"."maps_public" FROM "authenticated";
GRANT SELECT ON "public"."maps_public" TO "anon";
GRANT SELECT ON "public"."maps_public" TO "authenticated";

-- user_latest_agreements: anon からのアクセスを禁止し、authenticated は SELECT のみ
-- ユーザーの同意情報は認証済みユーザーのみが参照すべき
REVOKE ALL ON "public"."user_latest_agreements" FROM "anon";
REVOKE ALL ON "public"."user_latest_agreements" FROM "authenticated";
GRANT SELECT ON "public"."user_latest_agreements" TO "authenticated";

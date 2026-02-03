-- コメントの閲覧を未ログインユーザーにも許可する
-- INSERT/UPDATE/DELETEは引き続きauthenticatedのみ

DROP POLICY IF EXISTS "comments_select_all" ON "public"."comments";
CREATE POLICY "comments_select_all" ON "public"."comments" FOR SELECT USING (true);

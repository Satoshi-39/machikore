-- ============================================================
-- search_users RPC関数を新規作成
-- ブロック済みユーザーを検索結果から除外
-- ============================================================

CREATE OR REPLACE FUNCTION "public"."search_users"(
  "search_query" "text" DEFAULT NULL::"text",
  "result_limit" integer DEFAULT 30,
  "p_current_user_id" "uuid" DEFAULT NULL::"uuid"
)
RETURNS TABLE(
  "id" "uuid",
  "username" "text",
  "display_name" "text",
  "bio" "text",
  "avatar_url" "text",
  "created_at" timestamp with time zone
)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.username, u.display_name, u.bio, u.avatar_url, u.created_at
  FROM users u
  WHERE
    (search_query IS NULL OR search_query = ''
     OR u.username ILIKE '%' || search_query || '%'
     OR u.display_name ILIKE '%' || search_query || '%')
    AND (p_current_user_id IS NULL
         OR NOT EXISTS (
           SELECT 1 FROM user_blocks ub
           WHERE ub.blocker_id = p_current_user_id AND ub.blocked_id = u.id
         ))
  ORDER BY u.created_at DESC
  LIMIT result_limit;
END;
$$;

COMMENT ON FUNCTION "public"."search_users" IS 'ユーザー検索。ブロック済みユーザー除外。';

-- 権限設定
GRANT ALL ON FUNCTION "public"."search_users"("text", integer, "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."search_users"("text", integer, "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_users"("text", integer, "uuid") TO "service_role";

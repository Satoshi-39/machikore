import { createServerClient } from "@/shared/api";
import { getPaginationRange, buildPaginatedResult } from "@/shared/lib";
import type { PaginatedResult } from "@/shared/types";
import type { User, GetUsersParams } from "../model/types";

export async function getUsers(params: GetUsersParams = {}): Promise<PaginatedResult<User>> {
  const { query, status } = params;
  const { from, to, page, perPage } = getPaginationRange(params.page, params.perPage);
  const supabase = await createServerClient();

  let queryBuilder = supabase
    .from("users")
    .select("id, username, display_name, email, avatar_url, status, is_premium, created_at", {
      count: "exact",
    });

  // テキスト検索（ユーザー名、表示名、メールアドレス）
  if (query) {
    queryBuilder = queryBuilder.or(
      `username.ilike.%${query}%,display_name.ilike.%${query}%,email.ilike.%${query}%`
    );
  }

  // ステータスフィルター
  if (status) {
    queryBuilder = queryBuilder.eq("status", status);
  }

  const { data, error, count } = await queryBuilder
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Failed to fetch users:", error);
    return buildPaginatedResult([], 0, page, perPage);
  }

  return buildPaginatedResult(data ?? [], count, page, perPage);
}

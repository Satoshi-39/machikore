import { createServerClient } from "@/shared/api";

export type User = {
  id: string;
  username: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  status: string;
  is_premium: boolean | null;
  created_at: string;
};

export type GetUsersParams = {
  query?: string;
  status?: string;
  limit?: number;
};

export async function getUsers(params: GetUsersParams = {}): Promise<User[]> {
  const { query, status, limit = 50 } = params;
  const supabase = await createServerClient();

  let queryBuilder = supabase
    .from("users")
    .select("id, username, display_name, email, avatar_url, status, is_premium, created_at");

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

  const { data, error } = await queryBuilder
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }

  return data ?? [];
}

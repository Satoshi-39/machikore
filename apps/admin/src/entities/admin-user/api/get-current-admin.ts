import { createServerClient } from "@/shared/api";
import type { CurrentAdmin } from "../model/types";

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const supabase = await createServerClient();

  // 現在のセッションを取得
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // admin_usersテーブルからロールを取得
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!adminUser) {
    return null;
  }

  // usersテーブルから詳細情報を取得
  const { data: userData } = await supabase
    .from("users")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? "",
    displayName: userData?.display_name ?? user.email ?? "管理者",
    avatarUrl: userData?.avatar_url ?? null,
    role: adminUser.role,
  };
}

import { createServerClient } from "@/shared/api";
import type { AdminUser } from "../model/types";

export async function getAdminUsers(): Promise<AdminUser[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("admin_users")
    .select(`
      id,
      user_id,
      role,
      created_at,
      user:users!admin_users_user_id_public_users_fkey(email, display_name, avatar_url)
    `)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch admin users:", error);
    return [];
  }

  return (data ?? []) as AdminUser[];
}

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

export async function getUsers(): Promise<User[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("users")
    .select("id, username, display_name, email, avatar_url, status, is_premium, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }

  return data ?? [];
}

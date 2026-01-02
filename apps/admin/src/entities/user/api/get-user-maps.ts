import { createServerClient } from "@/shared/api";

export type UserMap = {
  id: string;
  name: string;
  is_public: boolean;
  created_at: string;
};

export async function getUserMaps(userId: string): Promise<UserMap[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("maps")
    .select("id, name, is_public, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Failed to fetch user maps:", error);
    return [];
  }

  return data ?? [];
}

import { createServerClient } from "@/shared/api";

export type UserSpotSummary = {
  id: string;
  custom_name: string;
  created_at: string;
};

export async function getUserSpots(userId: string): Promise<UserSpotSummary[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("user_spots")
    .select("id, custom_name, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Failed to fetch user spots:", error);
    return [];
  }

  return data ?? [];
}

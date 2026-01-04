import { createServerClient } from "@/shared/api";
import type { Map } from "../model/types";

export async function getMaps(): Promise<Map[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("maps")
    .select(`
      id,
      name,
      description,
      is_public,
      is_official,
      spots_count,
      likes_count,
      comments_count,
      bookmarks_count,
      category_id,
      created_at,
      user:users!maps_user_id_fkey(display_name, username),
      category:categories!maps_category_id_fkey(name)
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Failed to fetch maps:", error);
    return [];
  }

  return (data ?? []) as Map[];
}

import { createServerClient } from "@/shared/api";
import type { Spot } from "../model/types";

export async function getSpots(): Promise<Spot[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("user_spots")
    .select(`
      id,
      description,
      likes_count,
      comments_count,
      bookmarks_count,
      created_at,
      user:users!user_spots_user_id_fkey(display_name, username),
      machi:machi!user_spots_machi_id_fkey(name, prefecture_name)
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Failed to fetch spots:", error);
    return [];
  }

  // machiテーブルからのJOIN結果を元の型に変換
  return (data ?? []).map((row) => ({
    id: row.id,
    description: row.description,
    prefecture_name: row.machi?.prefecture_name ?? null,
    machi_name: row.machi?.name ?? null,
    likes_count: row.likes_count,
    comments_count: row.comments_count,
    bookmarks_count: row.bookmarks_count,
    created_at: row.created_at,
    user: row.user,
  }));
}

import { createServerClient } from "@/shared/api";

export type Spot = {
  id: string;
  description: string;
  prefecture_name: string | null;
  machi_name: string | null;
  likes_count: number;
  comments_count: number;
  bookmarks_count: number;
  created_at: string;
  user: {
    display_name: string;
    username: string;
  } | null;
};

export async function getSpots(): Promise<Spot[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("user_spots")
    .select(`
      id,
      description,
      prefecture_name,
      machi_name,
      likes_count,
      comments_count,
      bookmarks_count,
      created_at,
      user:users!user_spots_user_id_fkey(display_name, username)
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Failed to fetch spots:", error);
    return [];
  }

  return (data ?? []) as Spot[];
}

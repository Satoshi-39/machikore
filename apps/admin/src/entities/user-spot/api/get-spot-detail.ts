import { createServerClient } from "@/shared/api";
import type { SpotDetail } from "../model/types";

export async function getSpotDetail(spotId: string): Promise<SpotDetail | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("user_spots")
    .select(`
      id,
      description,
      google_formatted_address,
      latitude,
      longitude,
      likes_count,
      comments_count,
      bookmarks_count,
      images_count,
      created_at,
      updated_at,
      user:users!user_spots_user_id_fkey(id, display_name, username),
      map:maps!user_spots_map_id_fkey(id, name),
      machi:machi!user_spots_machi_id_fkey(name, prefecture_name, city_name)
    `)
    .eq("id", spotId)
    .single();

  if (error) {
    console.error("Failed to fetch spot:", error);
    return null;
  }

  // machiテーブルからのJOIN結果を元の型に変換
  const address = data.google_formatted_address as Record<string, string> | null;

  return {
    id: data.id,
    description: data.description,
    prefecture_name: data.machi?.prefecture_name ?? null,
    city_name: data.machi?.city_name ?? null,
    machi_name: data.machi?.name ?? null,
    google_formatted_address: address?.['ja'] ?? null,
    latitude: data.latitude,
    longitude: data.longitude,
    likes_count: data.likes_count,
    comments_count: data.comments_count,
    bookmarks_count: data.bookmarks_count,
    images_count: data.images_count,
    created_at: data.created_at,
    updated_at: data.updated_at,
    user: data.user,
    map: data.map,
  };
}

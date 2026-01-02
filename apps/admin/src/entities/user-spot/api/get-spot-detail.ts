import { createServerClient } from "@/shared/api";

export type SpotDetail = {
  id: string;
  custom_name: string;
  description: string | null;
  prefecture_name: string | null;
  city_name: string | null;
  machi_name: string | null;
  google_formatted_address: string | null;
  latitude: number;
  longitude: number;
  likes_count: number;
  comments_count: number;
  bookmarks_count: number;
  images_count: number;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    display_name: string;
    username: string;
  } | null;
  map: {
    id: string;
    name: string;
  } | null;
};

export async function getSpotDetail(spotId: string): Promise<SpotDetail | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("user_spots")
    .select(`
      id,
      custom_name,
      description,
      prefecture_name,
      city_name,
      machi_name,
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
      map:maps!user_spots_map_id_fkey(id, name)
    `)
    .eq("id", spotId)
    .single();

  if (error) {
    console.error("Failed to fetch spot:", error);
    return null;
  }

  return data as SpotDetail;
}

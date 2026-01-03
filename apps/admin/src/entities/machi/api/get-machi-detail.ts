import { createServerClient } from "@/shared/api";

export type MachiDetail = {
  id: string;
  name: string;
  name_kana: string | null;
  name_translations: Record<string, string> | null;
  latitude: number | null;
  longitude: number | null;
  prefecture_id: string;
  prefecture_name: string;
  prefecture_name_translations: Record<string, string> | null;
  city_id: string | null;
  city_name: string | null;
  city_name_translations: Record<string, string> | null;
  osm_id: number | null;
  place_type: string | null;
  tile_id: string | null;
  created_at: string;
  updated_at: string;
  spots_count: number;
};

export async function getMachiDetail(id: string): Promise<MachiDetail | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("machi")
    .select(`
      id,
      name,
      name_kana,
      name_translations,
      latitude,
      longitude,
      prefecture_id,
      prefecture_name,
      prefecture_name_translations,
      city_id,
      city_name,
      city_name_translations,
      osm_id,
      place_type,
      tile_id,
      created_at,
      updated_at
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to fetch machi detail:", error);
    return null;
  }

  // この街のスポット数を取得
  const { count } = await supabase
    .from("user_spots")
    .select("*", { count: "exact", head: true })
    .eq("machi_id", id);

  return {
    ...data,
    spots_count: count ?? 0,
  } as MachiDetail;
}

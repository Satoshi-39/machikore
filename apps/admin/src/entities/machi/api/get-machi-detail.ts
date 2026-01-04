import { createServerClient } from "@/shared/api";
import type { MachiDetail } from "../model/types";

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

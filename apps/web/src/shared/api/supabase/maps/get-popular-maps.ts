import { createClient } from "../server";
import type { MapWithUser } from "@/shared/types";
import { mvRowToMapWithUser } from "./types";

/**
 * 人気マップを取得（mv_popular_maps マテリアライズドビューから）
 */
export async function getPopularMaps(
  limit: number = 10
): Promise<MapWithUser[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mv_popular_maps")
    .select("*")
    .limit(limit);

  if (error) {
    console.error("[getPopularMaps] Error:", error);
    return [];
  }

  if (!data || data.length === 0) return [];

  return data.map((row) => mvRowToMapWithUser(row));
}

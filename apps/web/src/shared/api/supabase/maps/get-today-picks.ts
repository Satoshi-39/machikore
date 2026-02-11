import { createClient } from "../server";
import type { MapWithUser } from "@/shared/types";
import { mvRowToMapWithUser } from "./types";

/**
 * 本日のピックアップマップを取得（mv_today_picks_maps から）
 */
export async function getTodayPicks(
  limit: number = 10
): Promise<MapWithUser[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mv_today_picks_maps")
    .select("*")
    .limit(limit);

  if (error) {
    console.error("[getTodayPicks] Error:", error);
    return [];
  }

  if (!data || data.length === 0) return [];

  return data.map((row) => mvRowToMapWithUser(row));
}

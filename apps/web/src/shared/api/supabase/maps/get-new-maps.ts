import { createClient } from "../server";
import { FEED_PAGE_SIZE } from "@/shared/config";
import type { MapWithUser } from "@/shared/types";
import { mapPublicResponseToMapWithUser } from "./types";

/**
 * 新着マップを取得（maps_public ビュー + JOINs）
 * Server Component用
 */
export async function getNewMaps(
  limit: number = FEED_PAGE_SIZE,
  cursor?: string
): Promise<MapWithUser[]> {
  const supabase = await createClient();

  let query = supabase
    .from("maps_public")
    .select(
      `
      *,
      users (
        id,
        username,
        display_name,
        avatar_url,
        avatar_crop
      ),
      map_tags (
        tags (
          id,
          name,
          slug
        )
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[getNewMaps] Error:", error);
    return [];
  }

  return (data || []).map((map) => mapPublicResponseToMapWithUser(map));
}

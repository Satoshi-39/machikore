import { createClient } from "../client";
import { FEED_PAGE_SIZE } from "@/shared/config";
import type { MapWithUser } from "@/shared/types";
import { mapPublicResponseToMapWithUser } from "./types";

/**
 * 新着マップを取得（クライアントサイド用、Load More）
 */
export async function getNewMapsClient(
  cursor: string,
  limit: number = FEED_PAGE_SIZE
): Promise<MapWithUser[]> {
  const supabase = createClient();

  const { data, error } = await supabase
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
    .lt("created_at", cursor)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((map) => mapPublicResponseToMapWithUser(map));
}

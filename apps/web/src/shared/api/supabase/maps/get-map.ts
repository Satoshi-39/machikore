import { createClient } from "../server";
import type { MapWithUser } from "@/shared/types";
import { mapResponseToMapWithUser } from "./types";

/**
 * 単体マップ取得（generateMetadata共用）
 */
export async function getMap(mapId: string): Promise<MapWithUser | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("maps")
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
    .eq("id", mapId)
    .eq("is_public", true)
    .single();

  if (error || !data) return null;

  return mapResponseToMapWithUser(data);
}

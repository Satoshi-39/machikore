import { createClient } from "../server";
import type { MapArticleData, SpotWithImages } from "@/shared/types";
import { parseProseMirrorDoc, parseThumbnailCrop } from "@/shared/types";
import { getMap } from "./get-map";

/**
 * マップ記事データを取得（マップ + 公開スポット一覧 + 画像）
 * Web版は匿名閲覧のため、公開スポットのみ
 */
export async function getMapArticle(
  mapId: string
): Promise<MapArticleData | null> {
  const map = await getMap(mapId);
  if (!map) return null;

  const supabase = await createClient();

  const { data: spotsData, error: spotsError } = await supabase
    .from("user_spots")
    .select(
      `
      *,
      master_spots (*),
      users (
        id,
        username,
        display_name,
        avatar_url,
        avatar_crop
      ),
      images!images_user_spot_id_fkey (
        id,
        cloud_path,
        order_index
      )
    `
    )
    .eq("map_id", mapId)
    .eq("is_public", true)
    .order("order_index", { ascending: true });

  if (spotsError) {
    console.error("[getMapArticle] Error fetching spots:", spotsError);
    return { map, spots: [] };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const spots: SpotWithImages[] = (spotsData || []).map((spot: any) => ({
    id: spot.id,
    user_id: spot.user_id,
    map_id: spot.map_id,
    master_spot_id: spot.master_spot_id,
    machi_id: spot.machi_id,
    description: spot.description,
    spot_color: spot.spot_color || null,
    name: spot.name || null,
    language: spot.language || "ja",
    images_count: spot.images_count,
    likes_count: spot.likes_count,
    bookmarks_count: spot.bookmarks_count ?? 0,
    comments_count: spot.comments_count,
    order_index: spot.order_index,
    created_at: spot.created_at,
    updated_at: spot.updated_at,
    latitude: spot.latitude,
    longitude: spot.longitude,
    google_formatted_address: spot.google_formatted_address,
    google_short_address: spot.google_short_address,
    master_spot: spot.master_spots
      ? {
          id: spot.master_spots.id,
          name: spot.master_spots.name,
          latitude: spot.master_spots.latitude,
          longitude: spot.master_spots.longitude,
          google_place_id: spot.master_spots.google_place_id,
          google_formatted_address: spot.master_spots.google_formatted_address,
          google_short_address: spot.master_spots.google_short_address,
          google_types: spot.master_spots.google_types,
        }
      : null,
    user: spot.users || null,
    is_public: spot.is_public,
    article_content: parseProseMirrorDoc(spot.article_content),
    images: (spot.images || []).sort(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (a: any, b: any) => a.order_index - b.order_index
    ),
    thumbnail_image_id: spot.thumbnail_image_id || null,
    thumbnail_crop: parseThumbnailCrop(spot.thumbnail_crop),
  }));

  return { map, spots };
}

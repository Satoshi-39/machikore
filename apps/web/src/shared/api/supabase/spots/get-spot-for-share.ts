import type { Json } from "@machikore/database";
import { createClient } from "../server";
import { extractLocalizedValue } from "@/shared/lib/multilang";

export type SpotShareData = {
  spotName: string;
  description: string;
  mapName: string;
  authorName: string;
  imageUrl: string | null;
};

/**
 * スポット共有ページ用のデータを取得
 * username/mapIdの一致確認、公開マップ確認を含む
 */
export async function getSpotForShare(
  username: string,
  mapId: string,
  spotId: string
): Promise<SpotShareData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_spots")
    .select(
      `
      id,
      description,
      map_id,
      master_spots!inner(name),
      maps!inner(id, name, is_public, users!inner(username, display_name))
    `
    )
    .eq("id", spotId)
    .eq("map_id", mapId)
    .single();

  if (error || !data) return null;

  const maps = data.maps as unknown as {
    id: string;
    name: string;
    is_public: boolean;
    users: { username: string; display_name: string };
  };

  if (!maps.is_public || maps.users.username !== username) return null;

  // スポットの最初の画像を取得
  const { data: images } = await supabase
    .from("images")
    .select("cloud_path")
    .eq("user_spot_id", spotId)
    .order("order_index", { ascending: true })
    .limit(1);

  const masterSpots = data.master_spots as unknown as { name: Json };
  const spotName = extractLocalizedValue(masterSpots.name) || "スポット";

  return {
    spotName,
    description: data.description,
    mapName: maps.name,
    authorName: maps.users.display_name,
    imageUrl: images?.[0]?.cloud_path || null,
  };
}

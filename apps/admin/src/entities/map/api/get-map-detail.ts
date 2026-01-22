import { createServerClient } from "@/shared/api";
import type { MapDetail } from "../model/types";

export async function getMapDetail(id: string): Promise<MapDetail | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("maps")
    .select(`
      id,
      name,
      description,
      is_public,
      is_official,
      thumbnail_url,
      spots_count,
      likes_count,
      comments_count,
      bookmarks_count,
      category_id,
      language,
      show_label_chips,
      created_at,
      updated_at,
      user:users!maps_user_id_fkey(id, display_name, username, avatar_url),
      category:categories!maps_category_id_fkey(id, name)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to fetch map detail:", error);
    return null;
  }

  // タグを取得
  const { data: tagData } = await supabase
    .from("map_tags")
    .select(`
      tag:tags!map_tags_tag_id_fkey(id, name, slug)
    `)
    .eq("map_id", id);

  const tags = (tagData ?? [])
    .map((item) => item.tag)
    .filter((tag): tag is NonNullable<typeof tag> => tag !== null);

  // ラベルを取得
  const { data: labelData } = await supabase
    .from("map_labels")
    .select("id, name, color, sort_order")
    .eq("map_id", id)
    .order("sort_order", { ascending: true });

  return {
    ...data,
    tags,
    labels: labelData ?? [],
  } as MapDetail;
}

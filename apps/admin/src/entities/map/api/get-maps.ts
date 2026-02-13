import { createServerClient } from "@/shared/api";
import { getPaginationRange, buildPaginatedResult } from "@/shared/lib";
import type { PaginatedResult } from "@/shared/types";
import type { Map, GetMapsParams } from "../model/types";

export async function getMaps(params: GetMapsParams = {}): Promise<PaginatedResult<Map>> {
  const { query, visibility, official } = params;
  const { from, to, page, perPage } = getPaginationRange(params.page, params.perPage);
  const supabase = await createServerClient();

  let q = supabase
    .from("maps")
    .select(`
      id,
      name,
      description,
      is_public,
      is_official,
      spots_count,
      likes_count,
      comments_count,
      bookmarks_count,
      category_id,
      created_at,
      user:users!maps_user_id_fkey(display_name, username),
      category:categories!maps_category_id_fkey(name)
    `, { count: "exact" });

  // 名前検索
  if (query) {
    q = q.ilike("name", `%${query}%`);
  }

  // 公開状態フィルター（1つだけ選択されている場合のみ適用）
  if (visibility && visibility.length === 1) {
    q = q.eq("is_public", visibility[0] === "public");
  }

  // 公式フィルター（1つだけ選択されている場合のみ適用）
  if (official && official.length === 1) {
    q = q.eq("is_official", official[0] === "official");
  }

  const { data, error, count } = await q
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Failed to fetch maps:", error);
    return buildPaginatedResult([], 0, page, perPage);
  }

  return buildPaginatedResult((data ?? []) as Map[], count, page, perPage);
}

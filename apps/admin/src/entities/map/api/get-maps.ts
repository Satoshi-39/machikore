import { createServerClient } from "@/shared/api";
import { getPaginationRange, buildPaginatedResult } from "@/shared/lib";
import type { PaginatedResult, PaginationParams } from "@/shared/types";
import type { Map } from "../model/types";

export async function getMaps(params: PaginationParams = {}): Promise<PaginatedResult<Map>> {
  const { from, to, page, perPage } = getPaginationRange(params.page, params.perPage);
  const supabase = await createServerClient();

  const { data, error, count } = await supabase
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
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Failed to fetch maps:", error);
    return buildPaginatedResult([], 0, page, perPage);
  }

  return buildPaginatedResult((data ?? []) as Map[], count, page, perPage);
}

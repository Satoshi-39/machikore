import { createServerClient } from "@/shared/api";
import { getPaginationRange, buildPaginatedResult } from "@/shared/lib";
import type { PaginatedResult } from "@/shared/types";
import type { Spot, GetSpotsParams } from "../model/types";

export async function getSpots(params: GetSpotsParams = {}): Promise<PaginatedResult<Spot>> {
  const { query, visibility } = params;
  const { from, to, page, perPage } = getPaginationRange(params.page, params.perPage);
  const supabase = await createServerClient();

  let q = supabase
    .from("user_spots")
    .select(`
      id,
      description,
      likes_count,
      comments_count,
      bookmarks_count,
      created_at,
      user:users!user_spots_user_id_fkey(display_name, username),
      machi:machi!user_spots_machi_id_fkey(name, prefecture_name)
    `, { count: "exact" });

  // 説明文検索
  if (query) {
    q = q.ilike("description", `%${query}%`);
  }

  // 公開状態フィルター（1つだけ選択されている場合のみ適用）
  if (visibility && visibility.length === 1) {
    q = q.eq("is_public", visibility[0] === "public");
  }

  const { data, error, count } = await q
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Failed to fetch spots:", error);
    return buildPaginatedResult([], 0, page, perPage);
  }

  // machiテーブルからのJOIN結果を元の型に変換
  const spots: Spot[] = (data ?? []).map((row) => ({
    id: row.id,
    description: row.description,
    prefecture_name: row.machi?.prefecture_name ?? null,
    machi_name: row.machi?.name ?? null,
    likes_count: row.likes_count,
    comments_count: row.comments_count,
    bookmarks_count: row.bookmarks_count,
    created_at: row.created_at,
    user: row.user,
  }));

  return buildPaginatedResult(spots, count, page, perPage);
}

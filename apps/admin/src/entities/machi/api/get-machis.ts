import { createServerClient } from "@/shared/api";
import { getPaginationRange, buildPaginatedResult } from "@/shared/lib";
import type { PaginatedResult, PaginationParams } from "@/shared/types";
import type { Machi } from "../model/types";

export async function getMachis(params: PaginationParams = {}): Promise<PaginatedResult<Machi>> {
  const { from, to, page, perPage } = getPaginationRange(params.page, params.perPage);
  const supabase = await createServerClient();

  const { data, error, count } = await supabase
    .from("machi")
    .select(`
      id,
      name,
      name_kana,
      latitude,
      longitude,
      prefecture_id,
      prefecture_name,
      city_id,
      city_name,
      place_type,
      created_at
    `, { count: "exact" })
    .order("prefecture_id", { ascending: true })
    .order("name", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Failed to fetch machis:", error);
    return buildPaginatedResult([], 0, page, perPage);
  }

  return buildPaginatedResult((data ?? []) as Machi[], count, page, perPage);
}

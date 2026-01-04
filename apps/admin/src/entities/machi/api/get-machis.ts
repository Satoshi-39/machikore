import { createServerClient } from "@/shared/api";
import type { Machi } from "../model/types";

export async function getMachis(): Promise<Machi[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
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
    `)
    .order("prefecture_id", { ascending: true })
    .order("name", { ascending: true })
    .limit(100);

  if (error) {
    console.error("Failed to fetch machis:", error);
    return [];
  }

  return (data ?? []) as Machi[];
}

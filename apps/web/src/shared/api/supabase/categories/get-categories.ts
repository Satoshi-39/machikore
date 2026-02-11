import { createClient } from "../server";
import type { Database } from "@machikore/database";

export type Category = Database["public"]["Tables"]["categories"]["Row"];

/**
 * 全てのアクティブなカテゴリを取得
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    console.error("[getCategories] Error:", error);
    return [];
  }

  return data || [];
}

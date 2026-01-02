import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Supabaseクライアントを作成
 * 各アプリで環境変数から値を渡して使用する
 */
export function createSupabaseClient(supabaseUrl: string, supabaseKey: string) {
  return createClient<Database>(supabaseUrl, supabaseKey);
}

export type SupabaseClient = ReturnType<typeof createSupabaseClient>;

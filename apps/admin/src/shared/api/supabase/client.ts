import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import type { Database } from "@machikore/database";

/**
 * クライアントコンポーネント用のSupabaseクライアント
 * ブラウザ環境で使用する
 */
export function createClient() {
  return createSupabaseBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// エイリアス
export const createBrowserClient = createClient;

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@machikore/database";

/**
 * サーバーコンポーネント用のSupabaseクライアント
 * Server Components, Route Handlers, Server Actionsで使用する
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Componentから呼び出された場合は無視
            // Route Handlers や Server Actions では正常に動作
          }
        },
      },
    }
  );
}

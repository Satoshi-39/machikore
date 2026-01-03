import { createClient } from "@supabase/supabase-js";
import type { Database } from "@machikore/database";
import { ENV, getServerEnv } from "@/shared/config";

/**
 * 管理者用Supabaseクライアント（Service Role Key使用）
 * RLSをバイパスして管理操作を行う
 * API Routesでのみ使用すること
 */
export function createAdminClient() {
  const serverEnv = getServerEnv();

  return createClient<Database>(
    ENV.SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

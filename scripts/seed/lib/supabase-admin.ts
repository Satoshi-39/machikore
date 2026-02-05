/**
 * Supabase Admin Client (Service Role Key)
 *
 * RLSをバイパスするための管理用クライアント
 */

import { createClient } from "@supabase/supabase-js";

function getEnvOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`環境変数 ${key} が設定されていません`);
  }
  return value;
}

export function createAdminClient() {
  const supabaseUrl = getEnvOrThrow("EXPO_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getEnvOrThrow("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

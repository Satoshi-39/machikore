/**
 * 環境変数の型安全なアクセス
 *
 * Next.js では process.env から環境変数を取得
 * サーバーサイドのみで使用する変数は NEXT_PUBLIC_ プレフィックスなし
 */

// ===============================
// 環境変数の取得ヘルパー
// ===============================

function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key];
  return value || fallback || "";
}

// ===============================
// 公開環境変数 (クライアント + サーバー)
// ===============================

export const ENV = {
  // Supabase (公開)
  SUPABASE_URL: getEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
  SUPABASE_ANON_KEY: getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),

  // Mapbox (公開)
  MAPBOX_ACCESS_TOKEN: getEnvVar("NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN"),

  // 環境
  NODE_ENV: process.env.NODE_ENV || "development",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
} as const;

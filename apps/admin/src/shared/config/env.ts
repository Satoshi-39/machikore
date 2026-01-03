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

function getRequiredEnvVar(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(
      `Environment variable ${key} is not defined. ` +
        `Please add it to your .env.local file.`
    );
  }

  return value;
}

// ===============================
// 公開環境変数 (クライアント + サーバー)
// ===============================

export const ENV = {
  // Supabase (公開)
  SUPABASE_URL: getEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
  SUPABASE_ANON_KEY: getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),

  // Google OAuth
  GOOGLE_CLIENT_ID: getEnvVar("NEXT_PUBLIC_GOOGLE_CLIENT_ID", ""),
  GOOGLE_CLIENT_SECRET: getEnvVar("GOOGLE_CLIENT_SECRET", ""),

  // 環境
  NODE_ENV: process.env.NODE_ENV || "development",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
} as const;

// ===============================
// サーバーサイド専用環境変数（遅延評価）
// ===============================

/**
 * サーバーサイド専用の環境変数を取得
 * ランタイム時に評価されるため、ビルド時のエラーを回避
 */
export function getServerEnv() {
  return {
    SUPABASE_SERVICE_ROLE_KEY: getRequiredEnvVar("SUPABASE_SERVICE_ROLE_KEY"),
    GOOGLE_PLACES_API_KEY: getEnvVar("GOOGLE_PLACES_API_KEY", ""),
  };
}

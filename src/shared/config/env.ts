/**
 * 環境変数の型安全なアクセス
 *
 * Expoでは環境変数は process.env.EXPO_PUBLIC_* でアクセス可能
 * ビルド時に埋め込まれるため、実行時変更不可
 */

// ===============================
// 環境変数の型定義
// ===============================

interface Env {
  EXPO_PUBLIC_SUPABASE_URL: string;
  EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
  EXPO_PUBLIC_API_BASE_URL?: string;
  EXPO_PUBLIC_ENV?: 'development' | 'staging' | 'production';
}

// ===============================
// 環境変数の取得
// ===============================

function getEnvVar(key: keyof Env, fallback?: string): string {
  const value = process.env[key];

  if (! value && !fallback) {
    throw new Error(
      `Environment variable ${key} is not defined. ` +
        `Please add it to your .env file.`
    );
  }

  return value || fallback || '';
}

// ===============================
// エクスポート
// ===============================

export const ENV = {
  // Supabase
  SUPABASE_URL: getEnvVar('EXPO_PUBLIC_SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnvVar('EXPO_PUBLIC_SUPABASE_ANON_KEY'),

  // API
  API_BASE_URL: getEnvVar(
    'EXPO_PUBLIC_API_BASE_URL',
    'https://api.machilog.app'
  ),

  // 環境
  ENV: getEnvVar('EXPO_PUBLIC_ENV', 'development') as
    | 'development'
    | 'staging'
    | 'production',

  // 開発環境判定
  isDevelopment: getEnvVar('EXPO_PUBLIC_ENV', 'development') === 'development',
  isProduction: getEnvVar('EXPO_PUBLIC_ENV', 'development') === 'production',
} as const;

// ===============================
// デバッグ用
// ===============================

if (__DEV__) {
  console.log('[ENV] Environment variables loaded:', {
    ENV: ENV.ENV,
    SUPABASE_URL: ENV.SUPABASE_URL ? '✅ Set' : '❌ Not set',
    SUPABASE_ANON_KEY: ENV.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set',
  });
}

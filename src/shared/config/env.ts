/**
 * 環境変数の型安全なアクセス
 *
 * Release ビルドでも動作するように、expo-constants 経由で環境変数を取得
 * フォールバックとして process.env も使用（開発時）
 */

import Constants from 'expo-constants';

// ===============================
// 環境変数の型定義
// ===============================

interface Env {
  EXPO_PUBLIC_SUPABASE_URL: string;
  EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
  EXPO_PUBLIC_API_BASE_URL?: string;
  EXPO_PUBLIC_ENV?: 'development' | 'staging' | 'production';
  EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN?: string;
  EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID?: string;
  EXPO_PUBLIC_GOOGLE_OAUTH_ANDROID_CLIENT_ID?: string;
}

// ===============================
// 環境変数の取得
// ===============================

function getEnvVar(key: keyof Env, fallback?: string): string {
  // 1. Constants.expoConfig?.extra から取得（Release ビルドで使用）
  const extraValue = Constants.expoConfig?.extra?.[key];

  // 2. process.env から取得（開発時のフォールバック）
  const processValue = process.env[key];

  const value = extraValue || processValue;

  if (!value && !fallback) {
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
    'https://api.machikore.app'
  ),

  // Mapbox
  MAPBOX_ACCESS_TOKEN: getEnvVar('EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN', ''),

  // Google OAuth
  GOOGLE_OAUTH_IOS_CLIENT_ID: getEnvVar('EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID', ''),
  GOOGLE_OAUTH_ANDROID_CLIENT_ID: getEnvVar('EXPO_PUBLIC_GOOGLE_OAUTH_ANDROID_CLIENT_ID', ''),

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

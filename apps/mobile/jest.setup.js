/**
 * Jest セットアップファイル
 * テスト実行前のグローバル設定
 */

// React Native グローバル変数
global.__DEV__ = true;

// Expo モジュールのモック
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      EXPO_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      EXPO_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
      EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN: 'test-mapbox-token',
      EXPO_PUBLIC_ENV: 'development',
    },
  },
  __esModule: true,
  default: {
    expoConfig: {
      extra: {
        EXPO_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
        EXPO_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
        EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN: 'test-mapbox-token',
        EXPO_PUBLIC_ENV: 'development',
      },
    },
  },
}));

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageTag: 'ja-JP', languageCode: 'ja' }],
}));

// console.warn を抑制（必要に応じて）
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Require cycle')
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

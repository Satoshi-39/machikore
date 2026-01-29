/**
 * Jest セットアップファイル
 * テスト実行前のグローバル設定
 */

// React Native グローバル変数
global.__DEV__ = true;


// AsyncStorage のモック
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// expo-secure-store のモック
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

// Expo モジュールのモック
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      EXPO_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      EXPO_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
      EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN: 'test-mapbox-token',
      EXPO_PUBLIC_ENV: 'development',
      EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID: 'test-ios-client-id',
      EXPO_PUBLIC_GOOGLE_OAUTH_ANDROID_CLIENT_ID: 'test-android-client-id',
      EXPO_PUBLIC_GOOGLE_OAUTH_WEB_CLIENT_ID: 'test-web-client-id',
      EXPO_PUBLIC_SENTRY_DSN: 'test-sentry-dsn',
      EXPO_PUBLIC_POSTHOG_API_KEY: 'test-posthog-api-key',
      EXPO_PUBLIC_REVENUECAT_API_KEY: 'test-revenuecat-api-key',
      EXPO_PUBLIC_GOOGLE_PLACES_API_KEY: 'test-google-places-api-key',
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
        EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID: 'test-ios-client-id',
        EXPO_PUBLIC_GOOGLE_OAUTH_ANDROID_CLIENT_ID: 'test-android-client-id',
        EXPO_PUBLIC_GOOGLE_OAUTH_WEB_CLIENT_ID: 'test-web-client-id',
        EXPO_PUBLIC_SENTRY_DSN: 'test-sentry-dsn',
        EXPO_PUBLIC_POSTHOG_API_KEY: 'test-posthog-api-key',
        EXPO_PUBLIC_REVENUECAT_API_KEY: 'test-revenuecat-api-key',
        EXPO_PUBLIC_GOOGLE_PLACES_API_KEY: 'test-google-places-api-key',
      },
    },
  },
}));

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageTag: 'ja-JP', languageCode: 'ja' }],
}));

// expo-file-system のモック
jest.mock('expo-file-system/legacy', () => ({
  documentDirectory: 'file:///test/documents/',
  getInfoAsync: jest.fn().mockResolvedValue({ exists: true }),
  makeDirectoryAsync: jest.fn().mockResolvedValue(undefined),
  copyAsync: jest.fn().mockResolvedValue(undefined),
  deleteAsync: jest.fn().mockResolvedValue(undefined),
}));

// expo-asset のモック
jest.mock('expo-asset', () => ({
  Asset: {
    fromModule: jest.fn().mockReturnValue({
      downloadAsync: jest.fn().mockResolvedValue(undefined),
      localUri: 'file:///test/asset.jpg',
    }),
  },
}));

// react-native-purchases のモック
jest.mock('react-native-purchases', () => ({
  __esModule: true,
  default: {
    configure: jest.fn(),
    getCustomerInfo: jest.fn().mockResolvedValue({}),
    setLogLevel: jest.fn(),
  },
  LOG_LEVEL: { DEBUG: 'DEBUG', INFO: 'INFO' },
}));

// react-native-get-random-values のモック
jest.mock('react-native-get-random-values', () => ({}));

// react-native-google-mobile-ads のモック
jest.mock('react-native-google-mobile-ads', () => ({
  __esModule: true,
  default: {
    initialize: jest.fn().mockResolvedValue(undefined),
    setRequestConfiguration: jest.fn().mockResolvedValue(undefined),
  },
  MaxAdContentRating: { T: 'T', G: 'G', MA: 'MA', PG: 'PG' },
  BannerAd: 'BannerAd',
  BannerAdSize: { BANNER: 'BANNER', FULL_BANNER: 'FULL_BANNER' },
  TestIds: { BANNER: 'test-banner-id' },
}));

// uuid のモック
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234-5678-9012-345678901234',
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

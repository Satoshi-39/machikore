import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
export type AdUnitType = 'banner' | 'interstitial' | 'native';

/**
 * 広告表示設定
 */
export const AD_CONFIG = {
  /** フィード内で広告を表示する間隔（何件ごとに1広告） */
  FEED_AD_INTERVAL: 5,
  /** 検索結果内で広告を表示する間隔（何件ごとに1広告） */
  SEARCH_AD_INTERVAL: 5,
} as const;

const TEST_AD_UNITS = {
  banner: {
    ios: 'ca-app-pub-3940256099942544/2934735716',
    android: 'ca-app-pub-3940256099942544/6300978111',
  },
  interstitial: {
    ios: 'ca-app-pub-3940256099942544/4411468910',
    android: 'ca-app-pub-3940256099942544/1033173712',
  },
  native: {
    ios: 'ca-app-pub-3940256099942544/3986624511',
    android: 'ca-app-pub-3940256099942544/2247696110',
  },
};

/**
 * AdMobを初期化
 * アプリ起動時に一度だけ呼び出す
 */
export async function initializeAdMob(): Promise<void> {
  try {
    await mobileAds().initialize();

    // 広告のコンテンツレーティングを設定
    await mobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.G,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
    });

  } catch {
    // 初期化失敗時もアプリは動作継続
  }
}

/**
 * 広告ユニットIDを取得
 * 開発環境ではテスト広告IDを返す
 * 本番環境でIDが未設定の場合はnullを返す（広告を表示しない）
 */
export function getAdUnitId(type: AdUnitType): string | null {
  const extra = Constants.expoConfig?.extra;
  const isDev = extra?.EXPO_PUBLIC_ENV === 'development' || __DEV__;

  // 開発環境ではテスト広告を使用
  if (isDev) {
    return Platform.select({
      ios: TEST_AD_UNITS[type].ios,
      android: TEST_AD_UNITS[type].android,
      default: TEST_AD_UNITS[type].android,
    });
  }

  // 本番環境では環境変数から取得（iOS/Android別）
  const AD_UNIT_KEYS: Record<AdUnitType, { ios: string; android: string }> = {
    banner: {
      ios: 'EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID_IOS',
      android: 'EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID_ANDROID',
    },
    interstitial: {
      ios: 'EXPO_PUBLIC_ADMOB_INTERSTITIAL_UNIT_ID_IOS',
      android: 'EXPO_PUBLIC_ADMOB_INTERSTITIAL_UNIT_ID_ANDROID',
    },
    native: {
      ios: 'EXPO_PUBLIC_ADMOB_NATIVE_UNIT_ID_IOS',
      android: 'EXPO_PUBLIC_ADMOB_NATIVE_UNIT_ID_ANDROID',
    },
  };

  const keys = AD_UNIT_KEYS[type];
  const unitId = Platform.select({
    ios: extra?.[keys.ios],
    android: extra?.[keys.android],
  });

  return unitId || null;
}

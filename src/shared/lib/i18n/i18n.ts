/**
 * i18n設定
 *
 * デバイスのロケールを自動検出し、対応する言語で表示
 * 対応言語: 日本語（デフォルト）、英語
 */

import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ja, en, cn, tw } from './locales';

// サポートする言語
export const SUPPORTED_LOCALES = ['ja', 'en', 'cn', 'tw'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

// 言語の表示名
export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  ja: '日本語',
  en: 'English',
  cn: '简体中文',
  tw: '繁體中文',
};

// デフォルト言語
export const DEFAULT_LOCALE: SupportedLocale = 'ja';

// AsyncStorageのキー
const LOCALE_STORAGE_KEY = '@machikore/locale';

// i18nインスタンスを作成
const i18n = new I18n({
  ja,
  en,
  cn,
  tw,
});

// デフォルト設定
i18n.defaultLocale = DEFAULT_LOCALE;
i18n.enableFallback = true; // 翻訳がない場合はデフォルト言語にフォールバック

/**
 * デバイスのロケールからサポートする言語を取得
 */
function getDeviceLocale(): SupportedLocale {
  const locales = getLocales();
  const locale = locales[0];
  const deviceLocale = locale?.languageCode ?? DEFAULT_LOCALE;

  // 直接サポートしている言語かチェック
  if (SUPPORTED_LOCALES.includes(deviceLocale as SupportedLocale)) {
    return deviceLocale as SupportedLocale;
  }

  // 中国語の判定（簡体字 vs 繁体字）
  if (deviceLocale === 'zh' || deviceLocale.startsWith('zh')) {
    const region = locale?.regionCode?.toUpperCase();
    const script = locale?.languageTag?.includes('Hant') ? 'Hant' : locale?.languageTag?.includes('Hans') ? 'Hans' : null;

    // 繁体字: 台湾、香港、マカオ、または Hant スクリプト
    if (region === 'TW' || region === 'HK' || region === 'MO' || script === 'Hant') {
      return 'tw';
    }
    // それ以外は簡体字
    return 'cn';
  }

  return DEFAULT_LOCALE;
}

/**
 * 保存されたユーザー設定のロケールを取得
 */
async function getSavedLocale(): Promise<SupportedLocale | null> {
  try {
    const savedLocale = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
    if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale as SupportedLocale)) {
      return savedLocale as SupportedLocale;
    }
  } catch (error) {
    console.warn('Failed to get saved locale:', error);
  }
  return null;
}

/**
 * ロケールを保存
 */
async function saveLocale(locale: SupportedLocale): Promise<void> {
  try {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch (error) {
    console.warn('Failed to save locale:', error);
  }
}

/**
 * 現在のロケールを取得
 */
export function getCurrentLocale(): SupportedLocale {
  return i18n.locale as SupportedLocale;
}

/**
 * ロケールを設定
 */
export async function setLocale(locale: SupportedLocale): Promise<void> {
  i18n.locale = locale;
  await saveLocale(locale);
}

/**
 * i18nを初期化（アプリ起動時に呼び出す）
 */
export async function initializeI18n(): Promise<void> {
  // 1. 保存されたユーザー設定を確認
  const savedLocale = await getSavedLocale();

  if (savedLocale) {
    i18n.locale = savedLocale;
  } else {
    // 2. デバイスのロケールを使用
    i18n.locale = getDeviceLocale();
  }
}

/**
 * ユーザー設定をクリア（デバイスロケールに戻す）
 */
export async function resetLocale(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LOCALE_STORAGE_KEY);
    i18n.locale = getDeviceLocale();
  } catch (error) {
    console.warn('Failed to reset locale:', error);
  }
}

// デフォルトでデバイスロケールを設定（同期的に初期化）
i18n.locale = getDeviceLocale();

export { i18n };
export default i18n;

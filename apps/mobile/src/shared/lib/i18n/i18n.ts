/**
 * i18n設定
 *
 * デバイス（OS）のロケール設定に従って言語を表示
 * 対応言語: 日本語（デフォルト）、英語、簡体字中国語、繁体字中国語
 *
 * 注意: 表示言語はOS設定に委ねる（設定 > アプリ > 街コレ > 言語）
 */

import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import { ja, en, cn, tw } from './locales';
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  type SupportedLocale,
} from '@/shared/config/constants';

// Re-export from config for convenience
export { SUPPORTED_LOCALES, DEFAULT_LOCALE, type SupportedLocale };

// 言語の表示名
export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  ja: '日本語',
  en: 'English',
  cn: '简体中文',
  tw: '繁體中文',
};

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
 * 現在のロケールを取得
 */
export function getCurrentLocale(): SupportedLocale {
  return i18n.locale as SupportedLocale;
}

// モジュール読み込み時にデバイスロケールを設定
i18n.locale = getDeviceLocale();

export { i18n };
export default i18n;

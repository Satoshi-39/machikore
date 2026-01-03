/**
 * DBデータの多言語翻訳ヘルパー
 *
 * name_translations JSONBカラムから現在の言語に対応する翻訳を取得
 */

import { type SupportedLocale, DEFAULT_LOCALE } from '@/shared/config/constants';

// Re-export for convenience
export type { SupportedLocale };

/**
 * 翻訳データの型定義
 * DBのname_translations JSONBカラムの形式
 */
export type TranslationsData = {
  en?: string;
  cn?: string;
  tw?: string;
  [key: string]: string | undefined;
} | null;

/**
 * DBの翻訳データから指定された言語に対応する値を取得
 *
 * @param defaultName - デフォルトの名前（日本語）
 * @param translations - name_translations JSONBの値
 * @param locale - 使用するロケール（デフォルト: 'ja'）
 * @returns 翻訳された名前、なければデフォルト名
 *
 * @example
 * // カテゴリ名の取得（コンポーネント内で使用する場合）
 * import { getCurrentLocale } from '@/shared/lib/i18n';
 * const locale = getCurrentLocale();
 * const categoryName = getTranslatedName(
 *   category.name,           // "グルメ"
 *   category.name_translations, // { "en": "Gourmet", "zh": "美食" }
 *   locale
 * );
 */
export function getTranslatedName(
  defaultName: string,
  translations: TranslationsData | string,
  locale: SupportedLocale = DEFAULT_LOCALE
): string {
  const currentLocale = locale;

  // 日本語の場合はデフォルト名を返す
  if (currentLocale === 'ja') {
    return defaultName;
  }

  // 翻訳データがなければデフォルト名
  if (!translations) {
    return defaultName;
  }

  // 文字列の場合はパースする（キャッシュからのデータ対応）
  let parsed: TranslationsData;
  if (typeof translations === 'string') {
    try {
      parsed = JSON.parse(translations);
    } catch {
      return defaultName;
    }
  } else {
    parsed = translations;
  }

  if (!parsed) {
    return defaultName;
  }

  // 現在のロケールの翻訳を取得
  const translated = parsed[currentLocale];
  if (translated) {
    return translated;
  }

  // フォールバック: 英語 → デフォルト名
  if (currentLocale !== 'en' && parsed.en) {
    return parsed.en;
  }

  return defaultName;
}

/**
 * 複数フィールドの翻訳を一括取得するヘルパー
 *
 * @example
 * const translated = getTranslatedFields(machi, {
 *   name: 'name_translations',
 *   prefecture_name: 'prefecture_name_translations',
 *   city_name: 'city_name_translations',
 * });
 * // { name: "Shibuya", prefecture_name: "Tokyo", city_name: "Shibuya City" }
 */
export function getTranslatedFields<T extends Record<string, unknown>>(
  data: T,
  fieldMappings: Record<string, keyof T>,
  locale: SupportedLocale = DEFAULT_LOCALE
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [outputKey, translationsKey] of Object.entries(fieldMappings)) {
    const defaultKey = outputKey as keyof T;
    const defaultValue = data[defaultKey];
    const translations = data[translationsKey] as TranslationsData;

    if (typeof defaultValue === 'string') {
      result[outputKey] = getTranslatedName(defaultValue, translations, locale);
    }
  }

  return result;
}

/**
 * 地理データ（machi等）用の翻訳ヘルパー
 */
export interface GeoDataWithTranslations {
  name: string;
  name_translations?: TranslationsData;
  prefecture_name?: string;
  prefecture_name_translations?: TranslationsData;
  city_name?: string;
  city_name_translations?: TranslationsData;
}

export function getTranslatedGeoData(
  data: GeoDataWithTranslations,
  locale: SupportedLocale = DEFAULT_LOCALE
): {
  name: string;
  prefectureName?: string;
  cityName?: string;
} {
  return {
    name: getTranslatedName(data.name, data.name_translations ?? null, locale),
    prefectureName: data.prefecture_name
      ? getTranslatedName(data.prefecture_name, data.prefecture_name_translations ?? null, locale)
      : undefined,
    cityName: data.city_name
      ? getTranslatedName(data.city_name, data.city_name_translations ?? null, locale)
      : undefined,
  };
}

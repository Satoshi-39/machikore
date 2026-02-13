/**
 * 国際化・言語設定
 * 全アプリ共通（mobile / web / admin）
 */

/**
 * アプリがサポートするUIロケール
 */
export const SUPPORTED_LOCALES = ['ja', 'en', 'cn', 'tw'] as const;

/**
 * サポートされるロケールの型
 */
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * デフォルトロケール
 */
export const DEFAULT_LOCALE: SupportedLocale = 'ja';

/**
 * コンテンツ言語の選択肢（フィード/検索結果のフィルタリング用）
 * ISO 639-1コード
 */
export const CONTENT_LANGUAGES = {
  ja: { code: 'ja', labelKey: 'contentLanguageName.ja' },
  en: { code: 'en', labelKey: 'contentLanguageName.en' },
  zh: { code: 'zh', labelKey: 'contentLanguageName.zh' },
  ko: { code: 'ko', labelKey: 'contentLanguageName.ko' },
} as const;

export type ContentLanguageCode = keyof typeof CONTENT_LANGUAGES;

export const CONTENT_LANGUAGE_LIST = Object.values(CONTENT_LANGUAGES);

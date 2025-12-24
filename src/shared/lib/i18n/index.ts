/**
 * i18n エクスポート
 */

export {
  i18n,
  initializeI18n,
  getCurrentLocale,
  setLocale,
  resetLocale,
  SUPPORTED_LOCALES,
  LOCALE_NAMES,
  DEFAULT_LOCALE,
  type SupportedLocale,
} from './i18n';

export { useI18n, useLocaleChange } from './useI18n';

export {
  getTranslatedName,
  getTranslatedFields,
  getTranslatedGeoData,
  type TranslationsData,
  type GeoDataWithTranslations,
} from './translate';

// 便利なショートカット: t関数
import { i18n } from './i18n';
export const t = i18n.t.bind(i18n);

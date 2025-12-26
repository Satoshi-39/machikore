/**
 * i18n エクスポート
 */

export {
  i18n,
  getCurrentLocale,
  SUPPORTED_LOCALES,
  LOCALE_NAMES,
  DEFAULT_LOCALE,
  type SupportedLocale,
} from './i18n';

export { I18nProvider, useI18n } from '../providers/I18nProvider';

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

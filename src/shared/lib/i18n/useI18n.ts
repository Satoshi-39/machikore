/**
 * i18n React Hook
 *
 * 言語変更をUIに反映させるためのフック
 */

import { useState, useCallback, useEffect } from 'react';
import {
  i18n,
  getCurrentLocale,
  setLocale,
  resetLocale,
  SUPPORTED_LOCALES,
  LOCALE_NAMES,
  type SupportedLocale,
} from './i18n';

/**
 * i18n用のReactフック
 *
 * @returns {Object} i18n関連の値と関数
 *
 * @example
 * function MyComponent() {
 *   const { t, locale, changeLocale } = useI18n();
 *
 *   return (
 *     <View>
 *       <Text>{t('common.save')}</Text>
 *       <Text>Current: {locale}</Text>
 *       <Button onPress={() => changeLocale('en')} title="English" />
 *     </View>
 *   );
 * }
 */
export function useI18n() {
  const [locale, setLocaleState] = useState<SupportedLocale>(getCurrentLocale());

  // 言語変更ハンドラ
  const changeLocale = useCallback(async (newLocale: SupportedLocale) => {
    await setLocale(newLocale);
    setLocaleState(newLocale);
  }, []);

  // デバイスロケールにリセット
  const resetToDeviceLocale = useCallback(async () => {
    await resetLocale();
    setLocaleState(getCurrentLocale());
  }, []);

  // 翻訳関数（現在のロケールでバインド）
  const t = useCallback(
    (key: string, options?: Record<string, unknown>) => {
      return i18n.t(key, options);
    },
    // locale を依存配列に含めることで、言語変更時に t が更新される
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale]
  );

  return {
    /** 翻訳関数 */
    t,
    /** 現在のロケール */
    locale,
    /** ロケールの表示名 */
    localeName: LOCALE_NAMES[locale],
    /** 言語を変更 */
    changeLocale,
    /** デバイスロケールにリセット */
    resetToDeviceLocale,
    /** サポートしている言語一覧 */
    supportedLocales: SUPPORTED_LOCALES,
    /** 言語の表示名マップ */
    localeNames: LOCALE_NAMES,
  };
}

/**
 * 言語変更を監視するフック
 * グローバルな言語変更に反応するコンポーネントで使用
 */
export function useLocaleChange(callback: (locale: SupportedLocale) => void) {
  const [locale, setLocaleState] = useState<SupportedLocale>(getCurrentLocale());

  useEffect(() => {
    // 定期的に現在のロケールをチェック（i18n-jsには変更イベントがないため）
    const checkLocale = () => {
      const current = getCurrentLocale();
      if (current !== locale) {
        setLocaleState(current);
        callback(current);
      }
    };

    const interval = setInterval(checkLocale, 100);
    return () => clearInterval(interval);
  }, [locale, callback]);

  return locale;
}

/**
 * i18n プロバイダー
 *
 * アプリ全体の言語設定を管理し、言語変更時に全コンポーネントを再レンダリング
 */

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import {
  i18n,
  getCurrentLocale,
  setLocale as setI18nLocale,
  initializeI18n,
  SUPPORTED_LOCALES,
  LOCALE_NAMES,
  type SupportedLocale,
} from '../i18n/i18n';

// ===============================
// Types
// ===============================

interface I18nContextValue {
  /** 翻訳関数 */
  t: (key: string, options?: Record<string, unknown>) => string;
  /** 現在のロケール */
  locale: SupportedLocale;
  /** ロケールの表示名 */
  localeName: string;
  /** 言語を変更 */
  changeLocale: (newLocale: SupportedLocale) => Promise<void>;
  /** サポートしている言語一覧 */
  supportedLocales: readonly SupportedLocale[];
  /** 言語の表示名マップ */
  localeNames: Record<SupportedLocale, string>;
  /** 初期化完了フラグ */
  isInitialized: boolean;
}

// ===============================
// Context
// ===============================

const I18nContext = createContext<I18nContextValue | null>(null);

// ===============================
// Provider
// ===============================

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocale] = useState<SupportedLocale>(getCurrentLocale());
  const [isInitialized, setIsInitialized] = useState(false);

  // アプリ起動時にi18nを初期化
  useEffect(() => {
    async function init() {
      await initializeI18n();
      setLocale(getCurrentLocale());
      setIsInitialized(true);
    }
    init();
  }, []);

  // 言語変更ハンドラ
  const changeLocale = useCallback(async (newLocale: SupportedLocale) => {
    await setI18nLocale(newLocale);
    setLocale(newLocale);
  }, []);

  // 翻訳関数
  const t = useCallback(
    (key: string, options?: Record<string, unknown>) => {
      return i18n.t(key, options);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale] // localeが変わったらtも更新
  );

  const value: I18nContextValue = {
    t,
    locale,
    localeName: LOCALE_NAMES[locale],
    changeLocale,
    supportedLocales: SUPPORTED_LOCALES,
    localeNames: LOCALE_NAMES,
    isInitialized,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// ===============================
// Hook
// ===============================

/**
 * i18n用のReactフック
 *
 * I18nProvider内で使用する必要があります
 */
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }

  return context;
}

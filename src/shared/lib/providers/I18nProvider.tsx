/**
 * i18n プロバイダー
 *
 * アプリ全体の言語設定を管理
 * 表示言語はOS設定に委ねる（設定 > アプリ > 街コレ > 言語）
 */

import React, { createContext, useContext, useCallback, type ReactNode } from 'react';
import {
  i18n,
  getCurrentLocale,
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
  /** サポートしている言語一覧 */
  supportedLocales: readonly SupportedLocale[];
  /** 言語の表示名マップ */
  localeNames: Record<SupportedLocale, string>;
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
  // i18n.tsのモジュール読み込み時に既にlocaleは設定済み
  const locale = getCurrentLocale();

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
    supportedLocales: SUPPORTED_LOCALES,
    localeNames: LOCALE_NAMES,
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

/**
 * アプリ設定 Store (Zustand)
 *
 * ダークモードなどアプリ全体のローカル設定を管理
 * 注意: 通知設定はサーバー側（user_notification_settings テーブル）で管理
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/shared/config/constants';

// ===============================
// Types
// ===============================

export type ThemeMode = 'light' | 'dark' | 'system';

interface AppSettingsState {
  // 表示設定
  themeMode: ThemeMode;

  // 利用規約・プライバシーポリシー同意状態（ローカルキャッシュ）
  // サーバー側の terms_agreements テーブルが信頼できる情報源
  agreedTermsVersion: string | null;
  agreedPrivacyVersion: string | null;

  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  agreeToTerms: (termsVersion: string, privacyVersion: string) => void;
  hasAgreedToVersion: (termsVersion: string, privacyVersion: string) => boolean;
  resetSettings: () => void;
}

// ===============================
// Initial State
// ===============================

const initialState = {
  themeMode: 'light' as ThemeMode,
  agreedTermsVersion: null as string | null,
  agreedPrivacyVersion: null as string | null,
};

// ===============================
// Store
// ===============================

export const useAppSettingsStore = create<AppSettingsState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setThemeMode: (themeMode) => set({ themeMode }),

      agreeToTerms: (termsVersion, privacyVersion) =>
        set({
          agreedTermsVersion: termsVersion,
          agreedPrivacyVersion: privacyVersion,
        }),

      hasAgreedToVersion: (termsVersion, privacyVersion) => {
        const state = get();
        return (
          state.agreedTermsVersion === termsVersion &&
          state.agreedPrivacyVersion === privacyVersion
        );
      },

      resetSettings: () => set(initialState),
    }),
    {
      name: STORAGE_KEYS.APP_SETTINGS,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// ===============================
// Selectors
// ===============================

export const useThemeMode = () => useAppSettingsStore((state) => state.themeMode);
export const useIsDarkMode = () =>
  useAppSettingsStore((state) => state.themeMode === 'dark');

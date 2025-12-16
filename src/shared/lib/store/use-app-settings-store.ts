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
import {
  TERMS_OF_SERVICE_VERSION,
  PRIVACY_POLICY_VERSION,
} from '@/shared/content';

// ===============================
// Types
// ===============================

export type ThemeMode = 'light' | 'dark' | 'system';

interface AppSettingsState {
  // 表示設定
  themeMode: ThemeMode;

  // 利用規約・プライバシーポリシー同意状態
  agreedTermsVersion: string | null;
  agreedPrivacyVersion: string | null;

  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  agreeToTerms: () => void;
  hasAgreedToLatestTerms: () => boolean;
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

      agreeToTerms: () =>
        set({
          agreedTermsVersion: TERMS_OF_SERVICE_VERSION,
          agreedPrivacyVersion: PRIVACY_POLICY_VERSION,
        }),

      hasAgreedToLatestTerms: () => {
        const state = get();
        return (
          state.agreedTermsVersion === TERMS_OF_SERVICE_VERSION &&
          state.agreedPrivacyVersion === PRIVACY_POLICY_VERSION
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

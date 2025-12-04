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

  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  resetSettings: () => void;
}

// ===============================
// Initial State
// ===============================

const initialState = {
  themeMode: 'light' as ThemeMode,
};

// ===============================
// Store
// ===============================

export const useAppSettingsStore = create<AppSettingsState>()(
  persist(
    (set) => ({
      ...initialState,

      setThemeMode: (themeMode) => set({ themeMode }),

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

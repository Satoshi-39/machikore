/**
 * アプリ設定 Store (Zustand)
 *
 * ダークモード、通知設定などアプリ全体の設定を管理
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

  // 通知設定
  pushNotificationsEnabled: boolean;
  likeNotificationsEnabled: boolean;
  commentNotificationsEnabled: boolean;
  followNotificationsEnabled: boolean;

  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  setPushNotificationsEnabled: (enabled: boolean) => void;
  setLikeNotificationsEnabled: (enabled: boolean) => void;
  setCommentNotificationsEnabled: (enabled: boolean) => void;
  setFollowNotificationsEnabled: (enabled: boolean) => void;
  resetSettings: () => void;
}

// ===============================
// Initial State
// ===============================

const initialState = {
  themeMode: 'light' as ThemeMode,
  pushNotificationsEnabled: true,
  likeNotificationsEnabled: true,
  commentNotificationsEnabled: true,
  followNotificationsEnabled: true,
};

// ===============================
// Store
// ===============================

export const useAppSettingsStore = create<AppSettingsState>()(
  persist(
    (set) => ({
      ...initialState,

      setThemeMode: (themeMode) => set({ themeMode }),

      setPushNotificationsEnabled: (pushNotificationsEnabled) =>
        set({ pushNotificationsEnabled }),

      setLikeNotificationsEnabled: (likeNotificationsEnabled) =>
        set({ likeNotificationsEnabled }),

      setCommentNotificationsEnabled: (commentNotificationsEnabled) =>
        set({ commentNotificationsEnabled }),

      setFollowNotificationsEnabled: (followNotificationsEnabled) =>
        set({ followNotificationsEnabled }),

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
export const usePushNotificationsEnabled = () =>
  useAppSettingsStore((state) => state.pushNotificationsEnabled);

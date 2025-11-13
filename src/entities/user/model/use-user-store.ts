/**
 * ユーザー状態管理 (Zustand Store)
 *
 * FSD: entities/user/model
 * 設計書: 02_system-design.md - 3.2.3 ユーザー Store (userStore)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, AuthState } from './types';

// ===============================
// State Interface
// ===============================

interface UserState {
  // State
  user: User | null; // <- 永続化対象（基本情報のみ）
  authState: AuthState; // 認証状態
  isSubscribed: boolean; // <- 永続化対象
  friends: User[];

  // Actions
  setUser: (user: User | null) => void;
  setAuthState: (state: AuthState) => void;
  updateProfile: (data: Partial<User>) => void;
  setSubscriptionStatus: (status: boolean) => void;
  addFriend: (friend: User) => void;
  removeFriend: (friendId: string) => void;
  clearUser: () => void;
}

// ===============================
// Zustand Store (永続化あり)
// ===============================

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 初期状態
      user: null,
      authState: 'loading',
      isSubscribed: false,
      friends: [],

      // ユーザー設定
      setUser: (user) => {
        set({
          user,
          authState: user ? 'authenticated' : 'unauthenticated',
          isSubscribed: user?.is_subscribed ?? false,
        });
      },

      // 認証状態設定
      setAuthState: (authState) => {
        set({ authState });
      },

      // プロフィール更新
      updateProfile: (data) => {
        const currentUser = get().user;
        if (!currentUser) return;

        set({
          user: {
            ...currentUser,
            ...data,
            updated_at: new Date().toISOString(),
          },
        });
      },

      // サブスクリプション状態設定
      setSubscriptionStatus: (status) => {
        const currentUser = get().user;
        if (!currentUser) return;

        set({
          isSubscribed: status,
          user: {
            ...currentUser,
            is_subscribed: status,
          },
        });
      },

      // 友達追加
      addFriend: (friend) => {
        const currentFriends = get().friends;
        const exists = currentFriends.some((f) => f.id === friend.id);

        if (!exists) {
          set({ friends: [...currentFriends, friend] });
        }
      },

      // 友達削除
      removeFriend: (friendId) => {
        const currentFriends = get().friends;
        set({ friends: currentFriends.filter((f) => f.id !== friendId) });
      },

      // ユーザー情報をクリア
      clearUser: () => {
        set({
          user: null,
          authState: 'unauthenticated',
          isSubscribed: false,
          friends: [],
        });
      },
    }),
    {
      name: 'user-storage', // AsyncStorageのキー名
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // 永続化する項目のみ指定
        user: state.user,
        isSubscribed: state.isSubscribed,
      }),
    }
  )
);

// ===============================
// Selectors (パフォーマンス最適化)
// ===============================

/**
 * 認証状態を取得
 */
export const selectIsAuthenticated = (state: UserState) =>
  state.authState === 'authenticated' && state.user !== null;

/**
 * 認証中状態を取得
 */
export const selectIsLoading = (state: UserState) =>
  state.authState === 'loading';

/**
 * 匿名ユーザーかどうかを取得
 */
export const selectIsAnonymous = (state: UserState) =>
  state.user !== null && !state.user.email;

/**
 * 有料版ユーザーかどうかを取得
 */
export const selectIsSubscribed = (state: UserState) => state.isSubscribed;

/**
 * 現在のユーザーIDを取得
 */
export const selectUserId = (state: UserState) => state.user?.id ?? null;

/**
 * 現在のユーザー名を取得
 */
export const selectUsername = (state: UserState) =>
  state.user?.display_name ?? state.user?.username ?? '';

/**
 * 友達の数を取得
 */
export const selectFriendsCount = (state: UserState) => state.friends.length;

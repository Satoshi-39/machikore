/**
 * 現在のログインユーザー管理
 *
 * FSD: entities/user/model
 * Zustand Storeと統合済み
 */

import { useUserStore, selectUserId } from './use-user-store';

/**
 * 現在のログインユーザーIDを取得
 *
 * @returns 現在のユーザーID（未認証の場合はnull）
 */
export function getCurrentUserId(): string | null {
  return useUserStore.getState().user?.id ?? null;
}

/**
 * 現在のログインユーザーIDを取得するhook
 *
 * @returns 現在のユーザーID（未認証の場合はnull）
 */
export function useCurrentUserId(): string | null {
  return useUserStore(selectUserId);
}

/**
 * 現在のログインユーザー情報を取得するhook
 *
 * @returns 現在のユーザー情報（未認証の場合はnull）
 */
export function useCurrentUser() {
  return useUserStore((state) => state.user);
}

/**
 * 認証状態を取得するhook
 *
 * @returns 認証状態
 */
export function useAuthState() {
  return useUserStore((state) => state.authState);
}

/**
 * 認証済みかどうかを取得するhook
 *
 * @returns 認証済みの場合true
 */
export function useIsAuthenticated(): boolean {
  const user = useUserStore((state) => state.user);
  const authState = useUserStore((state) => state.authState);
  return authState === 'authenticated' && user !== null;
}

/**
 * 認証関連のユーティリティ
 */

import { router } from 'expo-router';

/**
 * ログインが必要な操作を試みた時に認証モーダルを表示
 * @param action - 操作名（例: 'いいね', '保存'）
 */
export function showLoginRequiredAlert(action: string = 'この機能'): void {
  // 認証要求モーダルを表示（メッセージをクエリパラメータで渡す）
  const message = `${action}を利用するにはログインが必要です`;
  router.push({
    pathname: '/auth/auth-required',
    params: { message },
  });
}

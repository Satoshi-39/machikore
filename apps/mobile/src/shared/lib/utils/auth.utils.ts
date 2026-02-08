/**
 * 認証関連のユーティリティ
 */

import { router } from 'expo-router';
import { t } from '@/shared/lib/i18n';

/**
 * ログインが必要な操作を試みた時に認証モーダルを表示
 * @param action - 操作名（例: 'いいね', '保存'）
 */
export function showLoginRequiredAlert(action: string): void {
  // 認証要求モーダルを表示（メッセージをクエリパラメータで渡す）
  const message = t('authRequired.loginRequiredAction', { action });
  router.push({
    pathname: '/auth/auth-required',
    params: { message },
  });
}

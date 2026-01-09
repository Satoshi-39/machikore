/**
 * プッシュ通知プロバイダー
 *
 * アプリ起動時にプッシュ通知を初期化
 * - Androidの通知チャンネル設定
 * - プッシュトークンの取得・Supabaseへの保存
 * - 通知リスナーの登録（受信時、タップ時）
 * - バッジ数の更新
 */

import React from 'react';
import { usePushNotifications } from '@/features/notification-settings';

interface PushNotificationProviderProps {
  children: React.ReactNode;
}

export function PushNotificationProvider({ children }: PushNotificationProviderProps) {
  // 認証済みユーザーの場合のみ初期化される
  usePushNotifications();

  return <>{children}</>;
}

/**
 * プッシュ通知管理フック
 *
 * トークンの取得・保存、通知リスナーの管理
 */

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { AppState, AppStateStatus } from 'react-native';
import * as Notifications from 'expo-notifications';
import {
  markNotificationAsRead,
  getUnreadNotificationCount,
} from '@/shared/api/supabase/notifications';
import {
  updatePushToken,
  clearPushToken as clearPushTokenApi,
} from '@/shared/api/supabase/users';
import { useUserStore } from '@/entities/user';
import {
  getExpoPushToken,
  setupAndroidNotificationChannel,
  addNotificationReceivedListener,
  addNotificationResponseListener,
  setBadgeCount,
} from '../lib/notifications';

interface NotificationData {
  type?: string;
  spotId?: string;
  mapId?: string;
  userId?: string;
  notificationId?: string;
}

/**
 * プッシュ通知を初期化・管理するフック
 */
export function usePushNotifications() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  // プッシュトークンをSupabaseに保存
  const savePushToken = useCallback(async (token: string) => {
    if (!user?.id) return;

    try {
      await updatePushToken(token);
      console.log('Push token saved successfully');
    } catch (error) {
      console.error('Failed to save push token:', error);
    }
  }, [user?.id]);

  // プッシュトークンをクリア（ログアウト時用）
  const clearPushToken = useCallback(async () => {
    try {
      await clearPushTokenApi();
    } catch (error) {
      console.error('Failed to clear push token:', error);
    }
  }, []);

  // 未読通知数を取得してバッジを更新
  const updateBadgeCount = useCallback(async () => {
    if (!user?.id) return;

    try {
      const count = await getUnreadNotificationCount(user.id);
      await setBadgeCount(count);
    } catch (error) {
      console.error('Failed to update badge count:', error);
    }
  }, [user?.id]);

  // 通知タップ時のナビゲーション
  const handleNotificationResponse = useCallback(
    async (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data as NotificationData;
      console.log('Notification tapped:', data);

      // 通知を既読にしてバッジを更新
      if (data.notificationId) {
        try {
          await markNotificationAsRead(data.notificationId);
          await updateBadgeCount();
        } catch (error) {
          console.error('Failed to mark notification as read:', error);
        }
      }

      // 通知タイプに応じて遷移
      if (data.type === 'follow' && data.userId) {
        router.push(`/(tabs)/notifications/users/${data.userId}`);
      } else if (data.spotId) {
        router.push(`/(tabs)/notifications/spots/${data.spotId}`);
      } else if (data.mapId) {
        router.push(`/(tabs)/notifications/maps/${data.mapId}`);
      } else {
        // デフォルトは通知タブへ
        router.push('/(tabs)/notifications');
      }
    },
    [router, updateBadgeCount]
  );

  // 初期化
  useEffect(() => {
    if (!user?.id) return;

    const initializePushNotifications = async () => {
      // Android用チャンネル設定
      await setupAndroidNotificationChannel();

      // トークン取得・保存
      const token = await getExpoPushToken();
      if (token) {
        await savePushToken(token);
      }

      // アプリ起動時にバッジを更新
      await updateBadgeCount();

      // アプリが通知から起動された場合の処理
      const lastNotificationResponse = await Notifications.getLastNotificationResponseAsync();
      if (lastNotificationResponse) {
        console.log('App launched from notification:', lastNotificationResponse);
        handleNotificationResponse(lastNotificationResponse);
      }
    };

    initializePushNotifications();

    // 通知受信リスナー（アプリがフォアグラウンドの時）
    notificationListener.current = addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
      // フォアグラウンドで受信した場合もバッジを更新
      updateBadgeCount();
    });

    // 通知タップリスナー
    responseListener.current = addNotificationResponseListener(handleNotificationResponse);

    // アプリがフォアグラウンドに戻った時にバッジを更新
    const appStateSubscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        updateBadgeCount();
      }
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
      appStateSubscription.remove();
    };
  }, [user?.id, savePushToken, handleNotificationResponse, updateBadgeCount]);

  return {
    clearPushToken,
    setBadgeCount,
    updateBadgeCount,
  };
}

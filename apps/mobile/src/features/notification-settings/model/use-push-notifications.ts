/**
 * プッシュ通知管理フック
 *
 * トークンの取得・保存、通知リスナーの管理
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';
import { AppState, AppStateStatus } from 'react-native';
import * as Notifications from 'expo-notifications';
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
} from '@/shared/lib/notifications';
import { invalidateNotifications } from '@/shared/api/query-client';
import { log } from '@/shared/config/logger';

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
  const rootNavigationState = useRootNavigationState();
  const isRouterReady = rootNavigationState?.key != null;
  const user = useUserStore((state) => state.user);
  const authState = useUserStore((state) => state.authState);
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const pendingNavigation = useRef<NotificationData | null>(null);
  const [hasPendingNavigation, setHasPendingNavigation] = useState(false);

  // プッシュトークンをSupabaseに保存
  const savePushToken = useCallback(async (token: string) => {
    if (!user?.id) return;

    try {
      await updatePushToken(token);
      log.info('[PushNotifications] Push token saved successfully');
    } catch (error) {
      log.error('[PushNotifications] Failed to save push token:', error);
    }
  }, [user?.id]);

  // プッシュトークンをクリア（ログアウト時用）
  const clearPushToken = useCallback(async () => {
    try {
      await clearPushTokenApi();
    } catch (error) {
      log.error('[PushNotifications] Failed to clear push token:', error);
    }
  }, []);

  // 通知データからナビゲーションを実行
  // 通知タブの既存スタックを保持し、その上にpushする
  const navigateToNotification = useCallback(
    (data: NotificationData) => {
      if (data.spotId) {
        router.push(`/(tabs)/notifications/articles/spots/${data.spotId}`);
      } else if (data.mapId) {
        router.push(`/(tabs)/notifications/articles/maps/${data.mapId}`);
      } else {
        router.navigate('/(tabs)/notifications');
      }
    },
    [router]
  );

  // 通知タップ時のナビゲーション
  // 既読にはせず、コンテンツへのナビゲーションのみ行う
  // ユーザーが通知リストで明示的に操作して既読にする
  const handleNotificationResponse = useCallback(
    (response: Notifications.NotificationResponse, isFromColdStart = false) => {
      const data = response.notification.request.content.data as NotificationData;
      log.debug('[PushNotifications] Notification tapped:', data, { isFromColdStart });

      // コールドスタートの場合はauthState初期化完了を待つ
      if (isFromColdStart) {
        log.debug('[PushNotifications] Cold start: queuing navigation until auth ready');
        pendingNavigation.current = data;
        setHasPendingNavigation(true);
      } else {
        navigateToNotification(data);
      }
    },
    [navigateToNotification]
  );

  // コールドスタート時: authStateとルーターの初期化完了を待ってからナビゲーション実行
  useEffect(() => {
    if (!hasPendingNavigation) return;
    if (authState === 'loading') return;
    if (!isRouterReady) return;

    const data = pendingNavigation.current;
    pendingNavigation.current = null;
    setHasPendingNavigation(false);

    if (data) {
      log.debug('[PushNotifications] Auth & router ready, executing pending navigation:', data);
      navigateToNotification(data);
    }
  }, [authState, hasPendingNavigation, isRouterReady, navigateToNotification]);

  // コールドスタート時のタイムアウト: 5秒経っても初期化が完了しない場合はデフォルト遷移
  useEffect(() => {
    if (!hasPendingNavigation) return;

    const timeout = setTimeout(() => {
      if (pendingNavigation.current) {
        log.warn('[PushNotifications] Navigation timeout: falling back to notifications tab');
        pendingNavigation.current = null;
        setHasPendingNavigation(false);
        router.push('/(tabs)/notifications');
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [hasPendingNavigation, router]);

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

      // アプリが通知から起動された場合の処理（コールドスタート）
      const lastNotificationResponse = await Notifications.getLastNotificationResponseAsync();
      if (lastNotificationResponse) {
        log.debug('[PushNotifications] App launched from notification:', lastNotificationResponse);
        handleNotificationResponse(lastNotificationResponse, true);
      }
    };

    initializePushNotifications();

    // 通知受信リスナー（アプリがフォアグラウンドの時）
    notificationListener.current = addNotificationReceivedListener((notification) => {
      log.debug('[PushNotifications] Notification received:', notification);
      // フォアグラウンドで受信した場合、通知キャッシュを更新
      // → TanStack Queryの未読カウントが更新され、_layout.tsxのuseEffectでアプリアイコンバッジも同期される
      invalidateNotifications();
    });

    // 通知タップリスナー
    responseListener.current = addNotificationResponseListener(handleNotificationResponse);

    // アプリがフォアグラウンドに戻った時に通知キャッシュを更新
    const appStateSubscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        invalidateNotifications();
      }
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
      appStateSubscription.remove();
    };
  }, [user?.id, savePushToken, handleNotificationResponse]);

  return {
    clearPushToken,
  };
}

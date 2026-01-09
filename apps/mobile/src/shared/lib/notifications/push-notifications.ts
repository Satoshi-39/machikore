/**
 * Expo Push Notifications ユーティリティ
 *
 * プッシュ通知の権限取得、トークン取得、通知設定を管理
 */

import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { log } from '@/shared/config/logger';

// 通知の表示設定
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * プッシュ通知の権限を取得
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  // 現在の権限状態を確認
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // まだ許可されていない場合はリクエスト
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    log.debug('[PushNotifications] Notification permission not granted');
    return false;
  }

  return true;
}

/**
 * Expo Push Tokenを取得
 * 注意: 既に許可されている場合のみトークンを取得する
 * 許可されていない場合は許可をリクエストせずにnullを返す
 */
export async function getExpoPushToken(): Promise<string | null> {
  try {
    // 現在の権限状態を確認（リクエストはしない）
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      log.debug('[PushNotifications] Notification permission not granted yet');
      return null;
    }

    // projectIdを取得（EAS Build用）
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      log.warn('[PushNotifications] EAS projectId not found. Push notifications may not work correctly.');
    }

    // トークンを取得
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: projectId,
    });

    return tokenData.data;
  } catch (error) {
    log.error('[PushNotifications] Failed to get push token:', error);
    return null;
  }
}

/**
 * Android用の通知チャンネルを設定
 */
export async function setupAndroidNotificationChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}

/**
 * 通知受信リスナーを追加
 * @param callback 通知受信時のコールバック
 * @returns リスナー解除関数
 */
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
): Notifications.EventSubscription {
  return Notifications.addNotificationReceivedListener(callback);
}

/**
 * 通知タップリスナーを追加
 * @param callback 通知タップ時のコールバック
 * @returns リスナー解除関数
 */
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.EventSubscription {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * バッジ数を設定
 */
export async function setBadgeCount(count: number): Promise<void> {
  await Notifications.setBadgeCountAsync(count);
}

/**
 * バッジ数を取得
 */
export async function getBadgeCount(): Promise<number> {
  return Notifications.getBadgeCountAsync();
}

/**
 * 通知の許可状態を取得
 * @returns 'granted' | 'denied' | 'undetermined'
 */
export async function getNotificationPermissionStatus(): Promise<'granted' | 'denied' | 'undetermined'> {
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}

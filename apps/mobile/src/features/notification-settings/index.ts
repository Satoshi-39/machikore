/**
 * 通知設定 Feature
 *
 * - プッシュ通知の初期化・トークン管理
 * - メール通知設定
 * - 通知設定画面UI
 */

export {
  NotificationPermissionPrompt,
  PushNotificationSettings,
  EmailNotificationSettings,
} from './ui';

export { usePushNotifications } from './model';

// shared/lib/notificationsから再エクスポート
export {
  getExpoPushToken,
  requestNotificationPermissions,
  setBadgeCount,
  getBadgeCount,
} from '@/shared/lib/notifications';

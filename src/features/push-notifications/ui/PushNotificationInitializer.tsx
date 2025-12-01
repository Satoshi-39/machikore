/**
 * プッシュ通知初期化コンポーネント
 *
 * アプリ起動時にプッシュ通知を初期化
 */

import { usePushNotifications } from '../api/use-push-notifications';

export function PushNotificationInitializer() {
  // フックを呼び出すだけで初期化される
  usePushNotifications();
  return null;
}

/**
 * プッシュ通知許可モーダル
 *
 * スポット投稿後に表示されるプッシュ通知許可の事前説明UI
 * Zustandストアを監視し、全ての処理を内包
 *
 * _layout.tsxでは単に <PushNotificationPrompt /> を置くだけでOK
 */

import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePostTriggerStore } from '@/features/create-spot/model/post-trigger-store';
import { usePermissionPrompt } from '../model/use-permission-prompt';
import { requestNotificationPermissions, getExpoPushToken } from '@/features/notification-settings';
import { updatePushToken } from '@/shared/api/supabase/users';
import { PUSH_NOTIFICATION_CONFIG } from '@/shared/config';
import { log } from '@/shared/config/logger';
import { PermissionPromptModal } from './PermissionPromptModal';

const PUSH_DECLINED_KEY = 'push_notification_declined';

export function PushNotificationPrompt() {
  // Zustandストアから状態を取得
  const isPushPromptVisible = usePostTriggerStore((state) => state.isPushPromptVisible);
  const hidePushPrompt = usePostTriggerStore((state) => state.hidePushPrompt);

  // 事前説明UIで「許可する」を押した後の処理
  const permissionPrompt = usePermissionPrompt('pushNotification', async () => {
    const granted = await requestNotificationPermissions();
    if (granted) {
      const token = await getExpoPushToken();
      if (token) {
        try {
          await updatePushToken(token);
          log.info('[PushNotificationPrompt] Push token saved after permission granted');
        } catch (error) {
          log.error('[PushNotificationPrompt] Failed to save push token:', error);
        }
      }
    }
  });

  const handleAccept = useCallback(() => {
    hidePushPrompt();
    permissionPrompt.onAccept();
  }, [hidePushPrompt, permissionPrompt]);

  const handleLater = useCallback(async () => {
    hidePushPrompt();
    permissionPrompt.onLater();
    // 「あとで」を選んだことを記録（5回目投稿時に再表示するため）
    await AsyncStorage.setItem(PUSH_DECLINED_KEY, 'true');
  }, [hidePushPrompt, permissionPrompt]);

  const { prePromptKeys } = PUSH_NOTIFICATION_CONFIG;

  return (
    <PermissionPromptModal
      visible={isPushPromptVisible}
      titleKey={prePromptKeys.title}
      messageKey={prePromptKeys.message}
      acceptButtonKey={prePromptKeys.acceptButton}
      laterButtonKey={prePromptKeys.laterButton}
      iconName="notifications-outline"
      onAccept={handleAccept}
      onLater={handleLater}
    />
  );
}

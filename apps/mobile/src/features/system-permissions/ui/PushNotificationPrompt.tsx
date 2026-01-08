/**
 * プッシュ通知許可の事前説明UI
 *
 * プッシュ通知の許可を求める前に表示するモーダル
 */

import React from 'react';
import { PUSH_NOTIFICATION_CONFIG } from '@/shared/config';
import { PermissionPromptModal } from './PermissionPromptModal';

interface PushNotificationPromptProps {
  /** モーダルを表示するか */
  visible: boolean;
  /** 許可ボタンが押された時 */
  onAccept: () => void;
  /** あとでボタンが押された時 */
  onLater: () => void;
}

export function PushNotificationPrompt({
  visible,
  onAccept,
  onLater,
}: PushNotificationPromptProps) {
  const { prePromptKeys } = PUSH_NOTIFICATION_CONFIG;

  return (
    <PermissionPromptModal
      visible={visible}
      titleKey={prePromptKeys.title}
      messageKey={prePromptKeys.message}
      acceptButtonKey={prePromptKeys.acceptButton}
      laterButtonKey={prePromptKeys.laterButton}
      iconName="notifications-outline"
      onAccept={onAccept}
      onLater={onLater}
    />
  );
}

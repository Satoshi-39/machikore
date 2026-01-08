/**
 * 許可の事前説明ダイアログ管理hook
 *
 * プッシュ通知などの許可を求める前に、
 * ユーザーに許可の必要性を説明するダイアログを表示する
 */

import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  PUSH_NOTIFICATION_PROMPTED: 'permission_push_notification_prompted',
  PUSH_NOTIFICATION_DECLINED: 'permission_push_notification_declined',
};

export type PermissionType = 'pushNotification';

interface UsePermissionPromptReturn {
  /** 事前説明ダイアログを表示中か */
  isPromptVisible: boolean;
  /** 事前説明ダイアログを表示する */
  showPrompt: () => void;
  /** 許可するボタンが押された時 */
  onAccept: () => void;
  /** あとでボタンが押された時 */
  onLater: () => void;
  /** 既にプロンプトを表示済みか確認 */
  checkIfAlreadyPrompted: () => Promise<boolean>;
  /** ユーザーが「あとで」を選択したか確認 */
  checkIfDeclined: () => Promise<boolean>;
}

/**
 * 許可の事前説明ダイアログを管理するhook
 */
export function usePermissionPrompt(
  permissionType: PermissionType,
  onAcceptCallback?: () => void | Promise<void>
): UsePermissionPromptReturn {
  const [isPromptVisible, setIsPromptVisible] = useState(false);

  const getStorageKey = useCallback(
    (suffix: 'prompted' | 'declined') => {
      switch (permissionType) {
        case 'pushNotification':
          return suffix === 'prompted'
            ? STORAGE_KEYS.PUSH_NOTIFICATION_PROMPTED
            : STORAGE_KEYS.PUSH_NOTIFICATION_DECLINED;
        default:
          return `permission_${permissionType}_${suffix}`;
      }
    },
    [permissionType]
  );

  const showPrompt = useCallback(() => {
    setIsPromptVisible(true);
  }, []);

  const onAccept = useCallback(async () => {
    setIsPromptVisible(false);
    // プロンプト表示済みとしてマーク
    await AsyncStorage.setItem(getStorageKey('prompted'), 'true');
    // 「あとで」フラグをクリア
    await AsyncStorage.removeItem(getStorageKey('declined'));
    // コールバックを実行（OSの許可ダイアログを表示）
    if (onAcceptCallback) {
      await onAcceptCallback();
    }
  }, [getStorageKey, onAcceptCallback]);

  const onLater = useCallback(async () => {
    setIsPromptVisible(false);
    // 「あとで」を選択したことを記録
    await AsyncStorage.setItem(getStorageKey('declined'), 'true');
  }, [getStorageKey]);

  const checkIfAlreadyPrompted = useCallback(async (): Promise<boolean> => {
    const value = await AsyncStorage.getItem(getStorageKey('prompted'));
    return value === 'true';
  }, [getStorageKey]);

  const checkIfDeclined = useCallback(async (): Promise<boolean> => {
    const value = await AsyncStorage.getItem(getStorageKey('declined'));
    return value === 'true';
  }, [getStorageKey]);

  return {
    isPromptVisible,
    showPrompt,
    onAccept,
    onLater,
    checkIfAlreadyPrompted,
    checkIfDeclined,
  };
}

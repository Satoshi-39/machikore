/**
 * ATT（App Tracking Transparency）管理モジュール
 *
 * iOSでATTダイアログを表示し、ユーザーのトラッキング許可状態を管理する。
 * 許可状態に応じてパーソナライズド広告 / 非パーソナライズド広告を切り替える。
 */

import { Platform } from 'react-native';
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
  PermissionStatus,
} from 'expo-tracking-transparency';
import { log } from '@/shared/config/logger';

/** トラッキングが許可されているかどうか（グローバル状態） */
let _trackingAllowed = false;

/**
 * ATTダイアログを表示し、トラッキング許可を取得する。
 * Androidではトラッキングは常に許可扱い。
 *
 * 広告SDK初期化の前に呼び出すこと。
 */
export async function requestTrackingPermission(): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    // Androidは常にパーソナライズド広告を許可
    _trackingAllowed = true;
    return true;
  }

  try {
    // まず現在のステータスを確認
    const { status: currentStatus } = await getTrackingPermissionsAsync();

    if (currentStatus === PermissionStatus.GRANTED) {
      _trackingAllowed = true;
      return true;
    }

    if (currentStatus === PermissionStatus.DENIED) {
      // 既に拒否済み（再度ダイアログは表示されない）
      _trackingAllowed = false;
      return false;
    }

    // まだ聞いていない場合はダイアログを表示
    const { status } = await requestTrackingPermissionsAsync();
    _trackingAllowed = status === PermissionStatus.GRANTED;

    log.info(
      `[ATT] Tracking permission: ${status} (personalized ads: ${_trackingAllowed ? 'enabled' : 'disabled'})`,
    );

    return _trackingAllowed;
  } catch (error) {
    log.warn('[ATT] Failed to request tracking permission:', error);
    _trackingAllowed = false;
    return false;
  }
}

/**
 * 現在のトラッキング許可状態を取得する。
 * 広告リクエスト時に `requestNonPersonalizedAdsOnly` の値として使用する。
 */
export function isTrackingAllowed(): boolean {
  return _trackingAllowed;
}

/**
 * 非パーソナライズド広告のみにすべきかどうかを返す。
 * 広告コンポーネントで `requestNonPersonalizedAdsOnly` に渡す。
 */
export function shouldRequestNonPersonalizedAdsOnly(): boolean {
  return !_trackingAllowed;
}

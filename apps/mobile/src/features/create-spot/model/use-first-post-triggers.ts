/**
 * 投稿後のトリガー管理hook
 *
 * - 初投稿: プッシュ通知の許可リクエスト（OS許可ダイアログを直接表示）
 * - 2回目投稿: アプリレビュー依頼
 */

import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppReview } from '@/features/app-review';
import {
  getNotificationPermissionStatus,
  requestNotificationPermissions,
  getExpoPushToken,
} from '@/shared/lib/notifications';
import { updatePushToken } from '@/shared/api/supabase/users';
import { log } from '@/shared/config/logger';

const STORAGE_KEYS = {
  /** 投稿回数 */
  POST_COUNT: 'user_post_count',
  /** レビュー依頼表示済みフラグ（2回目投稿時） */
  REVIEW_PROMPTED_SECOND_POST: 'review_prompted_second_post',
};

interface UsePostTriggersReturn {
  /** 投稿完了後のトリガーを実行 */
  triggerPostActions: () => Promise<void>;
}

/**
 * 投稿後のトリガーを管理するhook
 *
 * triggerPostActionsを呼ぶと、投稿回数に応じて
 * - 初投稿: OS通知許可ダイアログを直接表示（undeterminedの場合のみ）
 * - 2回目: アプリレビュー依頼
 */
export function useFirstPostTriggers(): UsePostTriggersReturn {
  const { requestReviewIfEligible } = useAppReview();

  /**
   * 投稿回数をインクリメントして返す
   */
  const incrementPostCount = useCallback(async (): Promise<number> => {
    const countStr = await AsyncStorage.getItem(STORAGE_KEYS.POST_COUNT);
    const count = countStr ? parseInt(countStr, 10) : 0;
    const newCount = count + 1;
    await AsyncStorage.setItem(STORAGE_KEYS.POST_COUNT, newCount.toString());
    return newCount;
  }, []);

  /**
   * OS通知許可ダイアログを表示すべきか判定
   * undetermined の場合のみ true を返す
   */
  const shouldRequestPushPermission = useCallback(async (): Promise<boolean> => {
    const permissionStatus = await getNotificationPermissionStatus();
    return permissionStatus === 'undetermined';
  }, []);

  /**
   * OS通知許可ダイアログを直接表示し、許可されたらトークンを保存
   */
  const requestPushPermissionDirectly = useCallback(async () => {
    const granted = await requestNotificationPermissions();
    if (granted) {
      const token = await getExpoPushToken();
      if (token) {
        try {
          await updatePushToken(token);
          log.info('[PostTriggers] Push token saved after permission granted');
        } catch (error) {
          log.error('[PostTriggers] Failed to save push token:', error);
        }
      }
    }
  }, []);

  /**
   * 投稿完了後のトリガーを実行
   */
  const triggerPostActions = useCallback(async () => {
    log.info('[PostTriggers] triggerPostActions called');
    try {
      const postCount = await incrementPostCount();
      log.info('[PostTriggers] Post count:', postCount);

      if (postCount === 1) {
        // 初投稿: OS通知許可ダイアログを直接表示（undeterminedの場合のみ）
        const shouldRequest = await shouldRequestPushPermission();
        log.info('[PostTriggers] First post - shouldRequestPushPermission:', shouldRequest);
        if (shouldRequest) {
          log.info('[PostTriggers] Requesting OS notification permission directly');
          await requestPushPermissionDirectly();
        }
      } else if (postCount === 2) {
        // 2回目投稿: レビュー依頼
        const alreadyPrompted = await AsyncStorage.getItem(STORAGE_KEYS.REVIEW_PROMPTED_SECOND_POST);
        log.info('[PostTriggers] Second post - alreadyPrompted:', alreadyPrompted);
        if (alreadyPrompted !== 'true') {
          log.info('[PostTriggers] Requesting app review');
          const reviewResult = await requestReviewIfEligible();
          log.info('[PostTriggers] Review request result:', reviewResult);
          await AsyncStorage.setItem(STORAGE_KEYS.REVIEW_PROMPTED_SECOND_POST, 'true');
        }
      }
    } catch (error) {
      log.error('[PostTriggers] Error:', error);
    }
  }, [incrementPostCount, requestReviewIfEligible, shouldRequestPushPermission, requestPushPermissionDirectly]);

  return {
    triggerPostActions,
  };
}

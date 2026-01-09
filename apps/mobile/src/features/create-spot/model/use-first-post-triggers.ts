/**
 * 投稿後のトリガー管理hook
 *
 * - 初投稿: プッシュ通知の許可リクエスト（事前説明UI付き）
 * - 2回目投稿: アプリレビュー依頼
 * - 5回目投稿: プッシュ通知を「あとで」にした場合、再度プロンプト表示
 */

import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppReview } from '@/features/app-review';
import { getNotificationPermissionStatus } from '@/shared/lib/notifications';
import { PUSH_NOTIFICATION_CONFIG } from '@/shared/config';
import { log } from '@/shared/config/logger';
import { usePostTriggerStore } from './post-trigger-store';

const STORAGE_KEYS = {
  /** 投稿回数 */
  POST_COUNT: 'user_post_count',
  /** プッシュ通知を「あとで」にしたフラグ */
  PUSH_DECLINED: 'push_notification_declined',
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
 * - 初投稿: プッシュ通知プロンプトを表示（Zustandストア経由）
 * - 2回目: アプリレビュー依頼
 * - 5回目: 「あとで」を選んだ場合、再度プッシュ通知プロンプトを表示
 */
export function useFirstPostTriggers(): UsePostTriggersReturn {
  const showPushPrompt = usePostTriggerStore((state) => state.showPushPrompt);
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
   * プッシュ通知プロンプトを表示すべきか判定
   */
  const shouldShowPushPrompt = useCallback(async (): Promise<boolean> => {
    // 既にOSで許可されている場合は表示しない
    const permissionStatus = await getNotificationPermissionStatus();
    if (permissionStatus === 'granted') {
      return false;
    }
    return true;
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
        // 初投稿: プッシュ通知の許可リクエスト
        const shouldShow = await shouldShowPushPrompt();
        log.info('[PostTriggers] First post - shouldShowPushPrompt:', shouldShow);
        if (shouldShow) {
          log.info('[PostTriggers] Showing push notification prompt (first post)');
          showPushPrompt();
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
      } else if (postCount === PUSH_NOTIFICATION_CONFIG.retryAfterPostCount) {
        // 5回目投稿: 「あとで」を選んだ場合、再度プッシュ通知プロンプトを表示
        const declined = await AsyncStorage.getItem(STORAGE_KEYS.PUSH_DECLINED);
        log.info('[PostTriggers] 5th post - declined flag:', declined);
        if (declined === 'true') {
          const shouldShow = await shouldShowPushPrompt();
          log.info('[PostTriggers] 5th post - shouldShowPushPrompt:', shouldShow);
          if (shouldShow) {
            log.info('[PostTriggers] Showing push notification prompt (retry after decline)');
            showPushPrompt();
            // 再表示したらフラグをクリア（次回は表示しない）
            await AsyncStorage.removeItem(STORAGE_KEYS.PUSH_DECLINED);
          }
        }
      }
    } catch (error) {
      log.error('[PostTriggers] Error:', error);
    }
  }, [incrementPostCount, requestReviewIfEligible, shouldShowPushPrompt, showPushPrompt]);

  return {
    triggerPostActions,
  };
}

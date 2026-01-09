/**
 * 投稿後のトリガー管理hook
 *
 * - 初投稿: プッシュ通知の許可リクエスト（事前説明UI付き）
 * - 2回目投稿: アプリレビュー依頼
 */

import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePermissionPrompt } from '@/features/system-permissions';
import { useAppReview } from '@/features/app-review';
import { requestNotificationPermissions } from '@/features/push-notifications';
import { log } from '@/shared/config/logger';
import { usePostTriggerStore } from './post-trigger-store';

const STORAGE_KEYS = {
  /** 投稿回数 */
  POST_COUNT: 'user_post_count',
  /** プッシュ通知のプロンプト表示済みフラグ */
  PUSH_PROMPTED: 'push_notification_prompted',
  /** レビュー依頼表示済みフラグ（2回目投稿時） */
  REVIEW_PROMPTED_SECOND_POST: 'review_prompted_second_post',
};

interface UsePostTriggersReturn {
  /** 投稿完了後のトリガーを実行 */
  triggerPostActions: () => Promise<void>;
  /** プッシュ通知の事前説明モーダルが表示中か */
  isPushPromptVisible: boolean;
  /** プッシュ通知許可を承諾 */
  onPushPromptAccept: () => void;
  /** プッシュ通知許可を後回し */
  onPushPromptLater: () => void;
}

/**
 * 投稿後のトリガーを管理するhook
 */
export function useFirstPostTriggers(): UsePostTriggersReturn {
  // グローバルストアで状態管理（画面遷移後もモーダルを表示するため）
  const isPushPromptVisible = usePostTriggerStore((state) => state.isPushPromptVisible);
  const showPushPrompt = usePostTriggerStore((state) => state.showPushPrompt);
  const hidePushPrompt = usePostTriggerStore((state) => state.hidePushPrompt);
  const { requestReviewIfEligible } = useAppReview();

  const permissionPrompt = usePermissionPrompt('pushNotification', async () => {
    // 事前説明UIで「許可する」を押した後、OSの許可ダイアログを表示
    await requestNotificationPermissions();
  });

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
   * 投稿完了後のトリガーを実行
   */
  const triggerPostActions = useCallback(async () => {
    try {
      const postCount = await incrementPostCount();
      log.debug('[PostTriggers] Post count:', postCount);

      if (postCount === 1) {
        // 初投稿: プッシュ通知の許可リクエスト
        const alreadyPrompted = await AsyncStorage.getItem(STORAGE_KEYS.PUSH_PROMPTED);
        if (alreadyPrompted !== 'true') {
          log.debug('[PostTriggers] Showing push notification prompt');
          showPushPrompt();
          await AsyncStorage.setItem(STORAGE_KEYS.PUSH_PROMPTED, 'true');
        }
      } else if (postCount === 2) {
        // 2回目投稿: レビュー依頼
        const alreadyPrompted = await AsyncStorage.getItem(STORAGE_KEYS.REVIEW_PROMPTED_SECOND_POST);
        if (alreadyPrompted !== 'true') {
          log.debug('[PostTriggers] Requesting app review');
          await requestReviewIfEligible();
          await AsyncStorage.setItem(STORAGE_KEYS.REVIEW_PROMPTED_SECOND_POST, 'true');
        }
      }
      // 3回目以降は何もしない（APP_REVIEW_CONFIGの間隔設定に従う）
    } catch (error) {
      log.error('[PostTriggers] Error:', error);
    }
  }, [incrementPostCount, requestReviewIfEligible]);

  /**
   * プッシュ通知許可を承諾
   */
  const onPushPromptAccept = useCallback(() => {
    hidePushPrompt();
    permissionPrompt.onAccept();
  }, [hidePushPrompt, permissionPrompt]);

  /**
   * プッシュ通知許可を後回し
   */
  const onPushPromptLater = useCallback(() => {
    hidePushPrompt();
    permissionPrompt.onLater();
  }, [hidePushPrompt, permissionPrompt]);

  return {
    triggerPostActions,
    isPushPromptVisible,
    onPushPromptAccept,
    onPushPromptLater,
  };
}

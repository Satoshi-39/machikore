/**
 * アプリレビュー依頼hook
 *
 * App Store / Google Play のレビュー依頼を管理
 *
 * 制限事項:
 * - iOS: StoreKit API により年3回まで（超えると表示されない）
 * - Android: 制限なし
 */

import { useCallback } from 'react';
import * as StoreReview from 'expo-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_REVIEW_CONFIG } from '@/shared/config';
import { log } from '@/shared/config/logger';

const { storageKeys, minIntervalDays } = APP_REVIEW_CONFIG;

interface UseAppReviewReturn {
  /** レビュー依頼を表示（条件を満たす場合のみ） */
  requestReviewIfEligible: () => Promise<boolean>;
  /** レビュー依頼が可能かチェック */
  canRequestReview: () => Promise<boolean>;
}

/**
 * アプリレビュー依頼を管理するhook
 */
export function useAppReview(): UseAppReviewReturn {
  /**
   * レビュー依頼が可能かチェック
   * - 前回のリクエストから一定期間経過しているか
   * - StoreReviewが利用可能か
   */
  const canRequestReview = useCallback(async (): Promise<boolean> => {
    try {
      // StoreReviewが利用可能か確認
      const isAvailable = await StoreReview.isAvailableAsync();
      if (!isAvailable) {
        log.debug('[AppReview] StoreReview is not available');
        return false;
      }

      // 前回のリクエスト日時を取得
      const lastRequestedAt = await AsyncStorage.getItem(
        storageKeys.lastRequestedAt
      );

      if (lastRequestedAt) {
        const lastDate = new Date(lastRequestedAt);
        const now = new Date();
        const diffDays = Math.floor(
          (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays < minIntervalDays) {
          log.debug(
            `[AppReview] Too soon to request again. Days since last: ${diffDays}, min interval: ${minIntervalDays}`
          );
          return false;
        }
      }

      return true;
    } catch (error) {
      log.error('[AppReview] Error checking eligibility:', error);
      return false;
    }
  }, []);

  /**
   * レビュー依頼を表示（条件を満たす場合のみ）
   */
  const requestReviewIfEligible = useCallback(async (): Promise<boolean> => {
    const eligible = await canRequestReview();
    if (!eligible) {
      return false;
    }

    try {
      await StoreReview.requestReview();

      // リクエスト日時と回数を記録
      await AsyncStorage.setItem(
        storageKeys.lastRequestedAt,
        new Date().toISOString()
      );

      const countStr = await AsyncStorage.getItem(storageKeys.requestCount);
      const count = countStr ? parseInt(countStr, 10) : 0;
      await AsyncStorage.setItem(
        storageKeys.requestCount,
        (count + 1).toString()
      );

      log.debug('[AppReview] Review requested successfully');
      return true;
    } catch (error) {
      log.error('[AppReview] Error requesting review:', error);
      return false;
    }
  }, [canRequestReview]);

  return {
    requestReviewIfEligible,
    canRequestReview,
  };
}

/**
 * コレクション上限チェックガード
 *
 * コレクション作成前に上限に達しているかを判定し、
 * 上限に達している場合はアラートを表示する。
 * 無料ユーザーの場合はプレミアムアップグレード導線を表示。
 * チェック時にSupabaseから直接COUNTとis_premiumを取得するため、
 * RLSポリシーと同じDB値を参照し、常に正確。
 */

import { useState, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/entities/user';
import { SUBSCRIPTION } from '@/shared/config/constants';
import { supabase } from '@/shared/api/supabase';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';

/** DBのis_premiumからコレクション上限を算出 */
function getCollectionLimit(isPremium: boolean): number {
  return isPremium ? SUBSCRIPTION.PREMIUM_COLLECTION_LIMIT : SUBSCRIPTION.FREE_COLLECTION_LIMIT;
}

/**
 * コレクション上限チェックを提供するhook
 *
 * @returns checkCollectionLimit - DBから最新のカウントとis_premiumを取得してチェック。作成可能ならtrue、上限到達ならfalse（アラート表示）
 * @returns showCollectionLimitAlert - コレクション上限アラートを直接表示する（RLSエラー時のフォールバック用）
 * @returns isChecking - チェック中かどうか（ボタン無効化用）
 */
export function useCollectionLimitGuard() {
  const userId = useUserStore((state) => state.user?.id ?? null);
  const [isChecking, setIsChecking] = useState(false);
  const isCheckingRef = useRef(false);
  const router = useRouter();
  const { t } = useI18n();

  /**
   * プレミアム画面へ遷移
   */
  const navigateToPremium = useCallback(() => {
    router.push('/premium');
  }, [router]);

  /**
   * コレクション上限アラートを表示
   * @param isPremium - プレミアムユーザーかどうか
   * @param limit - 上限値
   */
  const showCollectionLimitAlert = useCallback((isPremium: boolean, limit?: number) => {
    const collectionLimit = limit ?? SUBSCRIPTION.FREE_COLLECTION_LIMIT;

    if (isPremium) {
      Alert.alert(
        t('usageLimit.collectionLimitTitle'),
        t('usageLimit.collectionLimitMessage', { limit: collectionLimit })
      );
    } else {
      Alert.alert(
        t('usageLimit.collectionLimitTitle'),
        t('usageLimit.collectionLimitUpgradeMessage', { limit: collectionLimit, premiumLimit: SUBSCRIPTION.PREMIUM_COLLECTION_LIMIT }),
        [
          { text: t('usageLimit.close'), style: 'cancel' },
          { text: t('usageLimit.upgrade'), onPress: navigateToPremium },
        ]
      );
    }
  }, [navigateToPremium, t]);

  /**
   * Supabaseからコレクション数とis_premiumを直接取得してコレクション上限をチェック
   * @returns 作成可能ならtrue、上限到達ならfalse
   */
  const checkCollectionLimit = useCallback(async (): Promise<boolean> => {
    // 連打防止
    if (isCheckingRef.current) return false;
    isCheckingRef.current = true;
    setIsChecking(true);

    try {
      if (!userId) {
        log.error('[useCollectionLimitGuard] userId not found');
        return true;
      }

      // コレクション数とis_premiumを並行取得（RLSと同じDB値を参照）
      const [countResult, userResult] = await Promise.all([
        supabase.rpc('count_user_collections', { p_user_id: userId }),
        supabase.from('users').select('is_premium').eq('id', userId).single(),
      ]);

      if (countResult.error) {
        log.error('[useCollectionLimitGuard] コレクション数取得エラー:', countResult.error);
        // 取得失敗時は通過させる（DB側のRLSで最終防御）
        return true;
      }

      const isPremium = userResult.data?.is_premium ?? false;
      const collectionLimit = getCollectionLimit(isPremium);

      if ((countResult.data ?? 0) >= collectionLimit) {
        showCollectionLimitAlert(isPremium, collectionLimit);
        return false;
      }

      return true;
    } finally {
      isCheckingRef.current = false;
      setIsChecking(false);
    }
  }, [userId, showCollectionLimitAlert]);

  return {
    checkCollectionLimit,
    showCollectionLimitAlert,
    isChecking,
  };
}

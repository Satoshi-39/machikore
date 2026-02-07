/**
 * 画像上限チェックガード
 *
 * スポットへの画像追加時に上限を判定し、
 * 無料ユーザーが上限に達した場合はプレミアムアップグレード導線を表示する。
 * チェック時にSupabaseからis_premiumを取得するため、
 * RLSポリシーと同じDB値を参照し、常に正確。
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/entities/user';
import { SUBSCRIPTION } from '@/shared/config/constants';
import { supabase } from '@/shared/api/supabase';
import { log } from '@/shared/config/logger';

/**
 * 画像上限チェックを提供するhook
 *
 * マウント時にSupabaseからis_premiumを取得し、DBと一致した上限を返す。
 *
 * @returns imageLimit - プランに応じた画像上限枚数
 * @returns handleUpgradePress - Paywall画面へ遷移するコールバック（無料ユーザー向け）
 * @returns isPremium - プレミアム会員かどうか
 */
export function useImageLimitGuard() {
  const userId = useUserStore((state) => state.user?.id ?? null);
  const [isPremium, setIsPremium] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;

    supabase
      .from('users')
      .select('is_premium')
      .eq('id', userId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          log.error('[useImageLimitGuard] is_premium取得エラー:', error);
          return;
        }
        setIsPremium(data?.is_premium ?? false);
      });
  }, [userId]);

  const imageLimit = isPremium
    ? SUBSCRIPTION.PREMIUM_IMAGE_LIMIT
    : SUBSCRIPTION.FREE_IMAGE_LIMIT;

  const handleUpgradePress = useCallback(() => {
    router.push('/premium');
  }, [router]);

  return {
    imageLimit,
    isPremium,
    /** 無料ユーザーのみ: Paywall画面へ遷移するコールバック */
    handleUpgradePress: isPremium ? undefined : handleUpgradePress,
  };
}

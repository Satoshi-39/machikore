/**
 * 画像上限チェックガード
 *
 * スポットへの画像追加時に上限を判定し、
 * 無料ユーザーが上限に達した場合はプレミアムアップグレード導線を表示する。
 */

import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useIsPremium } from '@/entities/subscription';
import { SUBSCRIPTION } from '@/shared/config/constants';

/**
 * 画像上限チェックを提供するhook
 *
 * @returns imageLimit - プランに応じた画像上限枚数
 * @returns handleUpgradePress - Paywall画面へ遷移するコールバック（無料ユーザー向け）
 * @returns isPremium - プレミアム会員かどうか
 */
export function useImageLimitGuard() {
  const isPremium = useIsPremium();
  const router = useRouter();

  const imageLimit = isPremium
    ? SUBSCRIPTION.PREMIUM_IMAGE_LIMIT
    : SUBSCRIPTION.FREE_IMAGE_LIMIT;

  const handleUpgradePress = useCallback(() => {
    router.push('/settings/premium');
  }, [router]);

  return {
    imageLimit,
    isPremium,
    /** 無料ユーザーのみ: Paywall画面へ遷移するコールバック */
    handleUpgradePress: isPremium ? undefined : handleUpgradePress,
  };
}

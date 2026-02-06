/**
 * スポット上限チェックガード
 *
 * スポット作成・移動前に上限に達しているかを判定し、
 * 上限に達している場合はアラートを表示する。
 * 無料ユーザーにはプレミアムアップグレード導線を表示。
 * チェック時にSupabaseからspots_countとis_premiumを直接取得するため、
 * RLSポリシーと同じDB値を参照し、常に正確。
 */

import { useState, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/entities/user';
import { SUBSCRIPTION } from '@/shared/config/constants';
import { supabase } from '@/shared/api/supabase';
import { log } from '@/shared/config/logger';

/** DBのis_premiumからスポット上限を算出 */
function getSpotLimit(isPremium: boolean): number {
  return isPremium ? SUBSCRIPTION.PREMIUM_SPOT_LIMIT : SUBSCRIPTION.FREE_SPOT_LIMIT;
}

/**
 * スポット上限チェックを提供するhook
 *
 * @returns checkSpotLimit - mapIdを受け取り、DBから最新のspots_countとis_premiumを取得してチェック。作成可能ならtrue、上限到達ならfalse（アラート表示）
 * @returns showSpotLimitAlert - 上限アラートを直接表示する（RLSエラー時のフォールバック用）
 * @returns isChecking - チェック中かどうか（ボタン無効化用）
 */
export function useSpotLimitGuard() {
  const userId = useUserStore((state) => state.user?.id ?? null);
  const [isChecking, setIsChecking] = useState(false);
  const isCheckingRef = useRef(false);
  const router = useRouter();

  /**
   * プレミアム画面へ遷移
   */
  const navigateToPremium = useCallback(() => {
    router.push('/settings/premium');
  }, [router]);

  /**
   * スポット上限アラートを表示
   * 無料ユーザーにはアップグレード訴求、プレミアムユーザーには整理を促す
   */
  const showSpotLimitAlert = useCallback((isPremium: boolean, limit?: number) => {
    const spotLimit = limit ?? getSpotLimit(isPremium);

    if (isPremium) {
      Alert.alert(
        'スポット数の上限',
        `1つのマップに登録できるスポットは${spotLimit}件までです。\n既存のスポットを削除するか、新しいマップに追加してください。`
      );
    } else {
      Alert.alert(
        'スポット数の上限',
        `1つのマップに登録できるスポットは${spotLimit}件までです。\nプレミアムにアップグレードすると${SUBSCRIPTION.PREMIUM_SPOT_LIMIT}件まで登録できます。`,
        [
          { text: '閉じる', style: 'cancel' },
          { text: 'アップグレード', onPress: navigateToPremium },
        ]
      );
    }
  }, [navigateToPremium]);

  /**
   * Supabaseからspots_countとis_premiumを直接取得してスポット上限をチェック
   * @param mapId - チェック対象のマップID
   * @returns 作成可能ならtrue、上限到達ならfalse
   */
  const checkSpotLimit = useCallback(async (mapId: string): Promise<boolean> => {
    // 連打防止
    if (isCheckingRef.current) return false;
    isCheckingRef.current = true;
    setIsChecking(true);

    try {
      if (!userId) {
        log.error('[useSpotLimitGuard] userId not found');
        return true;
      }

      // spots_countとis_premiumを並行取得（RLSと同じDB値を参照）
      const [mapResult, userResult] = await Promise.all([
        supabase.from('maps').select('spots_count').eq('id', mapId).single(),
        supabase.from('users').select('is_premium').eq('id', userId).single(),
      ]);

      if (mapResult.error) {
        log.error('[useSpotLimitGuard] spots_count取得エラー:', mapResult.error);
        // 取得失敗時は通過させる（DB側のRLSで最終防御）
        return true;
      }

      const isPremium = userResult.data?.is_premium ?? false;
      const spotLimit = getSpotLimit(isPremium);

      if ((mapResult.data.spots_count ?? 0) >= spotLimit) {
        showSpotLimitAlert(isPremium, spotLimit);
        return false;
      }

      return true;
    } finally {
      isCheckingRef.current = false;
      setIsChecking(false);
    }
  }, [userId, showSpotLimitAlert]);

  return { checkSpotLimit, showSpotLimitAlert, isChecking };
}

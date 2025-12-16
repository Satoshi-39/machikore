/**
 * スポットを作成するhook（Supabase版）
 */

import { useMutation } from '@tanstack/react-query';
import { invalidateSpots, invalidateMaps } from '@/shared/api/query-client';
import { createSpot, type CreateSpotInput } from '@/shared/api/supabase/user-spots';
import { log } from '@/shared/config/logger';

/**
 * スポットを作成
 */
export function useCreateSpot() {
  return useMutation({
    mutationFn: async (params: CreateSpotInput) => {
      log.debug('[Spot] 作成開始', params);

      // バリデーション
      if (!params.userId) {
        throw new Error('ユーザーIDが必要です');
      }
      if (!params.mapId) {
        throw new Error('マップIDが必要です');
      }
      if (!params.name) {
        throw new Error('スポット名が必要です');
      }
      // machiIdは街が見つからない場合はnullでも可
      // googlePlaceIdはピン刺し・現在地登録の場合はnullでも可

      log.debug('[Spot] バリデーション成功');

      // Supabaseにスポットを作成
      const spotId = await createSpot(params);
      log.debug('[Spot] Supabase挿入完了', spotId);

      return spotId;
    },
    onSuccess: (spotId) => {
      log.info('[Spot] 成功コールバック実行', spotId);
      invalidateSpots();
      invalidateMaps(); // spots_countを更新するためにマップキャッシュも無効化
    },
    onError: (error) => {
      log.error('[Spot] エラーコールバック実行', error);
    },
  });
}

/**
 * スポットを作成するhook（Supabase版）
 */

import { useMutation } from '@tanstack/react-query';
import { invalidateSpots } from '@/shared/api/query-client';
import { createSpot, type CreateSpotInput } from '@/shared/api/supabase/user-spots';

/**
 * スポットを作成
 */
export function useCreateSpot() {
  return useMutation({
    mutationFn: async (params: CreateSpotInput) => {
      console.log('🔍 useCreateSpot: 作成開始', params);

      // バリデーション
      if (!params.userId) {
        throw new Error('ユーザーIDが必要です');
      }
      if (!params.mapId) {
        throw new Error('マップIDが必要です');
      }
      if (!params.machiId) {
        throw new Error('街IDが必要です');
      }
      if (!params.name) {
        throw new Error('スポット名が必要です');
      }
      // googlePlaceIdはピン刺し・現在地登録の場合はnullでも可

      console.log('✅ useCreateSpot: バリデーション成功');

      // Supabaseにスポットを作成
      const spotId = await createSpot(params);
      console.log('💾 useCreateSpot: Supabase挿入完了', spotId);

      return spotId;
    },
    onSuccess: (spotId) => {
      console.log('🎊 useCreateSpot: 成功コールバック実行', spotId);
      invalidateSpots();
    },
    onError: (error) => {
      console.error('💥 useCreateSpot: エラーコールバック実行', error);
    },
  });
}

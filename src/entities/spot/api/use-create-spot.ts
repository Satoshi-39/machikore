/**
 * スポットを作成するhook
 */

import { useMutation } from '@tanstack/react-query';
import { invalidateSpots } from '@/shared/api/query-client';
import { insertSpot } from '@/shared/api/sqlite';
import { createSpotData, validateCreateSpotParams } from '../model';
import type { CreateSpotParams } from '../model/types';

/**
 * スポットを作成
 */
export function useCreateSpot() {
  return useMutation({
    mutationFn: async (params: CreateSpotParams) => {
      console.log('🔍 useCreateSpot: バリデーション開始', params);

      // バリデーション
      const validation = validateCreateSpotParams(params);
      if (!validation.valid) {
        console.error('❌ useCreateSpot: バリデーションエラー', validation.error);
        throw new Error(validation.error);
      }

      console.log('✅ useCreateSpot: バリデーション成功');

      // スポットを作成
      const newSpot = createSpotData(params);
      console.log('📝 useCreateSpot: スポットデータ作成完了', newSpot);

      try {
        insertSpot(newSpot);
        console.log('💾 useCreateSpot: DB挿入完了');
      } catch (error) {
        console.error('❌ useCreateSpot: DB挿入エラー', error);
        throw error;
      }

      return newSpot.id;
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

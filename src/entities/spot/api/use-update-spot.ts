/**
 * スポットを更新するhook
 */

import { useMutation } from '@tanstack/react-query';
import { invalidateSpots } from '@/shared/api/query-client';
import { updateSpot } from '@/shared/api/sqlite';
import type { UpdateSpotParams } from '../model/types';

/**
 * スポットを更新（新スキーマ対応）
 * ユーザーカスタマイズ可能なフィールドのみ更新
 */
export function useUpdateSpot() {
  return useMutation({
    mutationFn: async (params: UpdateSpotParams) => {
      updateSpot(params.spotId, {
        custom_name: params.customName,
        description: params.description,
        tags: params.tags ? JSON.stringify(params.tags) : undefined,
        order_index: params.orderIndex,
      });

      return params.spotId;
    },
    onSuccess: () => {
      invalidateSpots();
    },
  });
}

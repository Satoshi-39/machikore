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
      // バリデーション
      const validation = validateCreateSpotParams(params);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // スポットを作成
      const newSpot = createSpotData(params);
      insertSpot(newSpot);

      return newSpot.id;
    },
    onSuccess: () => {
      invalidateSpots();
    },
  });
}

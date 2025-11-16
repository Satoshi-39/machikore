/**
 * スポットを更新するhook
 */

import { useMutation } from '@tanstack/react-query';
import { invalidateSpots } from '@/shared/api/query-client';
import { updateSpot } from '@/shared/api/sqlite';
import type { UpdateSpotParams } from '../model/types';

/**
 * スポットを更新
 */
export function useUpdateSpot() {
  return useMutation({
    mutationFn: async (params: UpdateSpotParams) => {
      updateSpot(params.spotId, {
        name: params.name,
        address: params.address,
        latitude: params.latitude,
        longitude: params.longitude,
        memo: params.memo,
      });

      return params.spotId;
    },
    onSuccess: () => {
      invalidateSpots();
    },
  });
}

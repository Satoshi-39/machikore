/**
 * スポット画像を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { getSpotImages } from '@/shared/api/sqlite';
import type { ImageRow } from '@/shared/types/database.types';

/**
 * スポットの画像一覧を取得
 */
export function useSpotImages(spotId: string | null) {
  return useQuery<ImageRow[], Error>({
    queryKey: ['spot-images', spotId],
    queryFn: () => {
      if (!spotId) return [];
      return getSpotImages(spotId);
    },
    enabled: !!spotId,
  });
}

/**
 * スポット画像を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getSpotImages } from '@/shared/api/supabase/images';
import type { ImageRow } from '@/shared/types';

/**
 * スポットの画像一覧を取得（Supabase）
 */
export function useSpotImages(spotId: string | null) {
  return useQuery<ImageRow[], Error>({
    queryKey: QUERY_KEYS.spotsImages(spotId || ''),
    queryFn: () => {
      if (!spotId) return [];
      return getSpotImages(spotId);
    },
    enabled: !!spotId,
  });
}

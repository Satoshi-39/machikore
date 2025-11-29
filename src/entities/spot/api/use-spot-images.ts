/**
 * スポット画像を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { getSpotImages } from '@/shared/api/supabase/images';
import type { Database } from '@/shared/types/supabase.generated';

type ImageRow = Database['public']['Tables']['images']['Row'];

/**
 * スポットの画像一覧を取得（Supabase）
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

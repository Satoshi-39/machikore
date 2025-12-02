/**
 * スポットを詳細情報付きで取得するhook
 * SpotWithDetails型を返す（SpotCardで使用可能）
 */

import { useQuery } from '@tanstack/react-query';
import { getSpotWithDetails } from '@/shared/api/supabase';
import type { SpotWithDetails } from '@/shared/types';

/**
 * IDでスポットを詳細情報付きで取得
 * @param spotId - スポットID
 * @param currentUserId - 現在のユーザーID（いいね状態を取得するため）
 */
export function useSpotWithDetails(spotId: string | null, currentUserId?: string | null) {
  return useQuery<SpotWithDetails | null, Error>({
    queryKey: ['spots', 'details', spotId, currentUserId],
    queryFn: () => {
      if (!spotId) return null;
      return getSpotWithDetails(spotId, currentUserId);
    },
    enabled: !!spotId,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}

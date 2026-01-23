/**
 * スポット公開/非公開用hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateSpots, QUERY_KEYS } from '@/shared/api/query-client';
import { publishSpot, unpublishSpot } from '@/shared/api/supabase/user-spots';

interface PublishSpotParams {
  spotId: string;
  mapId: string;
}

/**
 * スポットを公開する
 * - article_contentが入力されている必要がある
 * - 公開時にマップも自動的に公開される
 */
export function usePublishSpot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ spotId }: PublishSpotParams) => {
      await publishSpot(spotId);
    },
    onSuccess: () => {
      // スポット関連の全キャッシュを無効化
      invalidateSpots();
      // マップ関連も無効化（公開スポット数が変わる）
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.maps });
    },
  });
}

/**
 * スポットを非公開にする
 */
export function useUnpublishSpot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ spotId }: PublishSpotParams) => {
      await unpublishSpot(spotId);
    },
    onSuccess: () => {
      // スポット関連の全キャッシュを無効化
      invalidateSpots();
      // マップ関連も無効化（公開スポット数が変わる）
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.maps });
    },
  });
}

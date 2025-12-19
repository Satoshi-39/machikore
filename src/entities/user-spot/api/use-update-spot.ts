/**
 * スポットを更新するhook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateSpots } from '@/shared/api/query-client';
import { updateSpot } from '@/shared/api/supabase/user-spots';
import type { UpdateSpotParams } from '../model/types';

/**
 * スポットを更新（新スキーマ対応）
 * ユーザーカスタマイズ可能なフィールドのみ更新
 * tagsは中間テーブル(spot_tags)で管理するため、useUpdateSpotTagsを使用
 */
export function useUpdateSpot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateSpotParams) => {
      await updateSpot({
        id: params.spotId,
        custom_name: params.customName,
        description: params.description,
        article_content: params.articleContent,
        order_index: params.orderIndex,
        map_id: params.mapId,
      });

      return params;
    },
    onSuccess: (params) => {
      invalidateSpots();
      // 記事キャッシュを完全に削除（staleTimeに関係なく次回アクセス時に再取得）
      if (params.mapId) {
        queryClient.removeQueries({
          queryKey: ['map-article', params.mapId],
        });
      }
    },
  });
}

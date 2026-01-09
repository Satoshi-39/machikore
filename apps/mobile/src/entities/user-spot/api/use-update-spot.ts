/**
 * スポットを更新するhook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateSpots, QUERY_KEYS } from '@/shared/api/query-client';
import { updateSpot } from '@/shared/api/supabase/user-spots';
import { getCurrentLocale } from '@/shared/lib/i18n';
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
      // スポット名をJSONB形式に変換（現在地/ピン刺し登録の場合のみ）
      const spotNameJsonb = params.spotName
        ? { [getCurrentLocale()]: params.spotName }
        : undefined;

      await updateSpot({
        id: params.spotId,
        description: params.description,
        article_content: params.articleContent,
        order_index: params.orderIndex,
        map_id: params.mapId,
        spot_color: params.spotColor,
        label_id: params.labelId,
        name: spotNameJsonb,
      });

      return params;
    },
    onSuccess: (params) => {
      invalidateSpots();
      // 記事キャッシュを完全に削除（staleTimeに関係なく次回アクセス時に再取得）
      if (params.mapId) {
        queryClient.removeQueries({
          queryKey: QUERY_KEYS.mapsArticle(params.mapId),
        });
      }
    },
  });
}

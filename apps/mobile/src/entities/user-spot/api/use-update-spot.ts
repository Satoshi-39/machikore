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
        is_public: params.isPublic,
        thumbnail_image_id: params.thumbnailImageId,
      });

      return params;
    },
    onSuccess: () => {
      // スポット関連の全キャッシュを無効化
      invalidateSpots();
      // マップ関連も無効化（スポット数などが変わる可能性）
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.maps });
    },
  });
}

/**
 * スポットを作成するhook（Supabase版）
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateSpots, QUERY_KEYS } from '@/shared/api/query-client';
import { createSpot, type CreateSpotInput } from '@/shared/api/supabase/user-spots';
import { log } from '@/shared/config/logger';

/**
 * スポットを作成
 */
export function useCreateSpot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateSpotInput) => {
      log.debug('[Spot] 作成開始', params);
      // バリデーションはmodel層（use-spot-form.ts）で実施済み
      const spotId = await createSpot(params);
      log.debug('[Spot] Supabase挿入完了', spotId);
      return spotId;
    },
    onSuccess: (spotId) => {
      log.info('[Spot] 成功コールバック実行', spotId);
      // スポット関連の全キャッシュを無効化
      invalidateSpots();
      // マップ関連も無効化（スポット数が変わる）
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.maps });
    },
    onError: (error) => {
      log.error('[Spot] エラーコールバック実行', error);
    },
  });
}

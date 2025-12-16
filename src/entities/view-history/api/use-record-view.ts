/**
 * マップ閲覧を記録するhook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { log } from '@/shared/config/logger';
import { supabase } from '@/shared/api/supabase';
import type { RecordViewParams } from '../model/types';

/**
 * マップ閲覧を記録（UPSERT）
 */
async function recordMapView({ userId, mapId }: RecordViewParams): Promise<void> {
  // Supabaseの関数を呼び出し
  const { error } = await supabase.rpc('record_map_view', {
    p_user_id: userId,
    p_map_id: mapId,
  });

  if (error) {
    log.error('[ViewHistory] recordMapView Error:', error);
    throw error;
  }
}

/**
 * マップ閲覧を記録するhook
 */
export function useRecordView() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recordMapView,
    onSuccess: (_, variables) => {
      // 閲覧履歴のキャッシュを無効化
      queryClient.invalidateQueries({
        queryKey: ['view-history', 'recent', variables.userId],
      });
    },
    onError: (error) => {
      // エラーは静かに処理（閲覧記録が失敗してもUXには影響しない）
      log.warn('[ViewHistory] useRecordView Failed to record view:', error);
    },
  });
}

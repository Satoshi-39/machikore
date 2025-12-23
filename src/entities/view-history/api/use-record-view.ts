/**
 * マップ閲覧を記録するhook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { log } from '@/shared/config/logger';
import { supabase } from '@/shared/api/supabase';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { useCurrentUser } from '@/entities/user';
import type { RecordViewParams } from '../model/types';

/**
 * マップ閲覧を記録（UPSERT）
 */
async function recordMapView({ mapId }: RecordViewParams): Promise<void> {
  // Supabaseの関数を呼び出し（user_idはサーバー側でauth.uid()から取得）
  const { error } = await supabase.rpc('record_map_view', {
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
  const user = useCurrentUser();

  return useMutation({
    mutationFn: recordMapView,
    onSuccess: () => {
      // 閲覧履歴のキャッシュを無効化
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.viewHistoryRecent(user.id),
        });
      }
    },
    onError: (error) => {
      // エラーは静かに処理（閲覧記録が失敗してもUXには影響しない）
      log.warn('[ViewHistory] useRecordView Failed to record view:', error);
    },
  });
}

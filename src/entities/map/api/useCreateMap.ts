/**
 * マップ作成mutation hook
 *
 * Supabaseにマップを作成（UUID使用）
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { createMap } from '@/shared/api/supabase';
import type { MapWithUser } from '@/shared/types';

interface CreateMapParams {
  userId: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  isPublic: boolean;
  thumbnailUrl?: string;
}

/**
 * 新しいマップを作成
 */
export function useCreateMap() {
  const queryClient = useQueryClient();

  return useMutation<MapWithUser, Error, CreateMapParams>({
    mutationFn: async (params) => {
      const mapId = uuidv4();

      return createMap({
        id: mapId,
        user_id: params.userId,
        name: params.name,
        description: params.description || null,
        category: params.category || null,
        tags: params.tags && params.tags.length > 0 ? params.tags : null,
        is_public: params.isPublic,
        thumbnail_url: params.thumbnailUrl || null,
      });
    },
    onSuccess: (_data, variables) => {
      // ユーザーのマップ一覧キャッシュを無効化
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mapsList(variables.userId),
      });
      // フィードも更新
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.maps, 'feed'],
      });
    },
  });
}

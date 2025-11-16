/**
 * マップ作成mutation hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { insertMap } from '@/shared/api/sqlite/maps';
import type { MapInsert, MapRow } from '@/shared/types/database.types';

interface CreateMapParams {
  userId: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  isPublic: boolean;
}

/**
 * 新しいマップを作成
 */
export function useCreateMap() {
  const queryClient = useQueryClient();

  return useMutation<MapRow, Error, CreateMapParams>({
    mutationFn: async (params) => {
      const now = new Date().toISOString();
      const mapId = `map_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

      const mapData: MapInsert = {
        id: mapId,
        user_id: params.userId,
        name: params.name,
        description: params.description || null,
        category: params.category || null,
        tags: params.tags && params.tags.length > 0 ? JSON.stringify(params.tags) : null,
        is_public: params.isPublic ? 1 : 0,
        is_default: 0,
        is_official: 0,
        thumbnail_url: null,
        spots_count: 0,
        likes_count: 0,
        created_at: now,
        updated_at: now,
        synced_at: null,
        is_synced: 0,
      };

      insertMap(mapData);

      return {
        ...mapData,
        is_public: mapData.is_public!,
        is_default: mapData.is_default!,
        is_official: mapData.is_official!,
        spots_count: mapData.spots_count!,
        likes_count: mapData.likes_count!,
      } as MapRow;
    },
    onSuccess: (_data, variables) => {
      // ユーザーのマップ一覧キャッシュを無効化
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mapsList(variables.userId),
      });
    },
  });
}

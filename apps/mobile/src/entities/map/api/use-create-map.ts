/**
 * マップ作成mutation hook
 *
 * Supabaseにマップを作成（UUID使用）
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { createMap, setMapTags } from '@/shared/api/supabase';
import type { MapWithUser } from '@/shared/types';

interface CreateMapParams {
  userId: string;
  name: string;
  description?: string;
  categoryId: string;
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

      // マップを作成
      const map = await createMap({
        id: mapId,
        user_id: params.userId,
        name: params.name,
        description: params.description || null,
        category_id: params.categoryId,
        is_public: params.isPublic,
        thumbnail_url: params.thumbnailUrl || null,
      });

      // タグを中間テーブルに保存
      if (params.tags && params.tags.length > 0) {
        await setMapTags(mapId, params.tags);
      }

      return map;
    },
    onSuccess: () => {
      // マップ関連の全キャッシュを無効化（新規作成なので全リスト更新が必要）
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.maps,
      });
    },
  });
}

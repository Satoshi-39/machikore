/**
 * マップラベル用フック
 *
 * FSD: entities/map-label/model に配置
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMapLabels,
  createMapLabel,
  updateMapLabel,
  deleteMapLabel,
} from '../api';

import { QUERY_KEYS } from '@/shared/api/query-client';

// クエリキー（QUERY_KEYSを使用）
export const mapLabelsQueryKey = (mapId: string) => QUERY_KEYS.mapsLabels(mapId);

/**
 * マップのラベル一覧を取得するフック
 */
export function useMapLabels(mapId: string | null | undefined) {
  return useQuery({
    queryKey: mapLabelsQueryKey(mapId ?? ''),
    queryFn: () => getMapLabels(mapId!),
    enabled: !!mapId,
  });
}

/**
 * ラベル作成ミューテーション
 */
export function useCreateMapLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      map_id: string;
      name: string;
      color?: string;
      sort_order?: number;
    }) => createMapLabel(params),
    onSuccess: (data) => {
      // キャッシュを更新
      queryClient.invalidateQueries({
        queryKey: mapLabelsQueryKey(data.map_id),
      });
    },
  });
}

/**
 * ラベル更新ミューテーション
 */
export function useUpdateMapLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      id: string;
      mapId: string;
      name?: string;
      color?: string;
      sort_order?: number;
    }) => {
      const { id, mapId, ...updateParams } = params;
      return updateMapLabel(id, updateParams);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: mapLabelsQueryKey(data.map_id),
      });
    },
  });
}

/**
 * ラベル削除ミューテーション
 */
export function useDeleteMapLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; mapId: string }) =>
      deleteMapLabel(params.id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: mapLabelsQueryKey(variables.mapId),
      });
    },
  });
}

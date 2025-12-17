/**
 * タグ取得フック
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPopularTags,
  searchTags,
  getTagsByMapId,
  getTagsBySpotId,
  setMapTags,
  setSpotTags,
  type Tag,
} from '@/shared/api/supabase/tags';

const TAG_QUERY_KEYS = {
  all: ['tags'] as const,
  popular: () => [...TAG_QUERY_KEYS.all, 'popular'] as const,
  search: (query: string) => [...TAG_QUERY_KEYS.all, 'search', query] as const,
  byMap: (mapId: string) => [...TAG_QUERY_KEYS.all, 'map', mapId] as const,
  bySpot: (spotId: string) => [...TAG_QUERY_KEYS.all, 'spot', spotId] as const,
};

/**
 * 人気タグを取得
 */
export function usePopularTags(limit: number = 20) {
  return useQuery<Tag[], Error>({
    queryKey: TAG_QUERY_KEYS.popular(),
    queryFn: () => getPopularTags(limit),
    staleTime: 1000 * 60 * 5, // 5分キャッシュ
  });
}

/**
 * タグを検索（オートコンプリート用）
 */
export function useTagSearch(query: string) {
  return useQuery<Tag[], Error>({
    queryKey: TAG_QUERY_KEYS.search(query),
    queryFn: () => searchTags(query),
    enabled: query.length >= 1,
    staleTime: 1000 * 60, // 1分キャッシュ
  });
}

/**
 * マップのタグを取得
 */
export function useMapTags(mapId: string) {
  return useQuery<Tag[], Error>({
    queryKey: TAG_QUERY_KEYS.byMap(mapId),
    queryFn: () => getTagsByMapId(mapId),
    enabled: !!mapId,
  });
}

/**
 * スポットのタグを取得
 */
export function useSpotTags(spotId: string) {
  return useQuery<Tag[], Error>({
    queryKey: TAG_QUERY_KEYS.bySpot(spotId),
    queryFn: () => getTagsBySpotId(spotId),
    enabled: !!spotId,
  });
}

/**
 * マップのタグを更新
 */
export function useUpdateMapTags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ mapId, tagNames }: { mapId: string; tagNames: string[] }) =>
      setMapTags(mapId, tagNames),
    onSuccess: (_, { mapId }) => {
      // キャッシュを無効化
      queryClient.invalidateQueries({ queryKey: TAG_QUERY_KEYS.byMap(mapId) });
      queryClient.invalidateQueries({ queryKey: TAG_QUERY_KEYS.popular() });
    },
  });
}

/**
 * スポットのタグを更新
 */
export function useUpdateSpotTags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spotId, tagNames }: { spotId: string; tagNames: string[] }) =>
      setSpotTags(spotId, tagNames),
    onSuccess: (_, { spotId }) => {
      // キャッシュを無効化
      queryClient.invalidateQueries({ queryKey: TAG_QUERY_KEYS.bySpot(spotId) });
      queryClient.invalidateQueries({ queryKey: TAG_QUERY_KEYS.popular() });
    },
  });
}

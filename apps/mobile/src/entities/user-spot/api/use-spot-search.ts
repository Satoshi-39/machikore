/**
 * スポット検索hook（Supabase版）
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import {
  searchPublicUserSpots,
  searchPublicSpotsByTag,
  type UserSpotSearchResult,
} from '@/shared/api/supabase';

/**
 * キーワードで公開スポットを検索（発見タブ用）
 */
export function useSpotSearch(query: string) {
  return useQuery<UserSpotSearchResult[], Error>({
    queryKey: [...QUERY_KEYS.spots, 'search', query],
    queryFn: () => searchPublicUserSpots(query),
    enabled: query.length > 0,
  });
}

/**
 * タグ名で公開スポットを検索（タグタップ時の検索）
 */
export function useSpotTagSearch(tagName: string) {
  return useQuery<UserSpotSearchResult[], Error>({
    queryKey: [...QUERY_KEYS.spots, 'search', 'tag', tagName],
    queryFn: () => searchPublicSpotsByTag(tagName),
    enabled: tagName.length > 0,
  });
}

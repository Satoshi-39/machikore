/**
 * 最近見たマップを取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { log } from '@/shared/config/logger';
import { supabase } from '@/shared/api/supabase';
import type { ViewHistoryWithMap } from '../model/types';
import type { MapWithUser } from '@/shared/types';

/**
 * 最近見たマップを取得
 */
async function getRecentViewHistory(
  userId: string,
  limit: number = 10
): Promise<ViewHistoryWithMap[]> {
  const { data, error } = await supabase
    .from('view_history')
    .select(
      `
      *,
      map:maps(
        *,
        user:users!maps_user_id_fkey(id, username, display_name, avatar_url),
        likes(id, user_id),
        bookmarks(id, user_id)
      )
    `
    )
    .eq('user_id', userId)
    .order('viewed_at', { ascending: false })
    .limit(limit);

  if (error) {
    log.error('[ViewHistory] getRecentViewHistory Error:', error);
    throw error;
  }

  // mapがnullの場合（削除されたマップなど）をフィルタリング
  return (data ?? [])
    .filter((item: any) => item.map !== null)
    .map((item: any) => {
      const isLiked = userId
        ? (item.map.likes || []).some((like: any) => like.user_id === userId)
        : false;
      const isBookmarked = userId
        ? (item.map.bookmarks || []).some(
            (bookmark: any) => bookmark.user_id === userId
          )
        : false;

      return {
        ...item,
        map: {
          ...item.map,
          user: item.map.user || null,
          is_liked: isLiked,
          is_bookmarked: isBookmarked,
        } as MapWithUser,
      };
    });
}

/**
 * 最近見たマップを取得するhook
 */
export function useRecentViewHistory(
  userId: string | null | undefined,
  limit: number = 10
) {
  return useQuery<ViewHistoryWithMap[], Error>({
    queryKey: QUERY_KEYS.viewHistoryRecent(userId || '', limit),
    queryFn: () => {
      if (!userId) return [];
      return getRecentViewHistory(userId, limit);
    },
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1分（頻繁に更新されるため短め）
  });
}

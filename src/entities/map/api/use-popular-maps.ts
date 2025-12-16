/**
 * 人気マップ取得hooks
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import type { MapWithUser } from '@/shared/types';
import { log } from '@/shared/config/logger';

/**
 * 人気マップを取得（いいね数順）
 * @param currentUserId 現在のユーザーID（いいね状態・ブックマーク状態を取得するため）
 */
async function getPopularMaps(limit: number = 10, currentUserId?: string | null): Promise<MapWithUser[]> {
  const { data, error } = await supabase
    .from('maps')
    .select(`
      *,
      user:users!maps_user_id_fkey(id, username, display_name, avatar_url),
      likes(id, user_id),
      bookmarks(id, user_id)
    `)
    .eq('is_public', true)
    .order('likes_count', { ascending: false })
    .limit(limit);

  if (error) {
    log.error('[Map] Error:', error);
    throw error;
  }

  // いいね状態・ブックマーク状態を判定してマップ
  return (data ?? []).map((map: any) => {
    const isLiked = currentUserId
      ? (map.likes || []).some((like: any) => like.user_id === currentUserId)
      : false;
    const isBookmarked = currentUserId
      ? (map.bookmarks || []).some((bookmark: any) => bookmark.user_id === currentUserId)
      : false;

    return {
      ...map,
      user: map.user || null,
      is_liked: isLiked,
      is_bookmarked: isBookmarked,
    };
  });
}

/**
 * 人気マップを取得するhook
 * @param currentUserId 現在のユーザーID（いいね状態を取得するため）
 */
export function usePopularMaps(limit: number = 10, currentUserId?: string | null) {
  return useQuery<MapWithUser[], Error>({
    queryKey: ['popular-maps', limit, currentUserId],
    queryFn: () => getPopularMaps(limit, currentUserId),
    staleTime: 5 * 60 * 1000, // 5分
  });
}

/**
 * 本日のピックアップマップを取得（最近作成 + いいね数考慮）
 * 将来的には今日のいいね数でランキングする
 * @param currentUserId 現在のユーザーID（いいね状態・ブックマーク状態を取得するため）
 */
async function getTodayPicksMaps(limit: number = 10, currentUserId?: string | null): Promise<MapWithUser[]> {
  // 24時間以内に作成されたマップ、またはいいね数が多いマップ
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const { data, error } = await supabase
    .from('maps')
    .select(`
      *,
      user:users!maps_user_id_fkey(id, username, display_name, avatar_url),
      likes(id, user_id),
      bookmarks(id, user_id)
    `)
    .eq('is_public', true)
    .gte('created_at', oneDayAgo.toISOString())
    .order('likes_count', { ascending: false })
    .limit(limit);

  if (error) {
    log.error('[Map] Error:', error);
    throw error;
  }

  // いいね状態・ブックマーク状態を判定するヘルパー
  const mapWithStatus = (maps: any[]) =>
    maps.map((map: any) => {
      const isLiked = currentUserId
        ? (map.likes || []).some((like: any) => like.user_id === currentUserId)
        : false;
      const isBookmarked = currentUserId
        ? (map.bookmarks || []).some((bookmark: any) => bookmark.user_id === currentUserId)
        : false;
      return {
        ...map,
        user: map.user || null,
        is_liked: isLiked,
        is_bookmarked: isBookmarked,
      };
    });

  // 24時間以内のマップが少ない場合は、全体から人気順で補完
  if (data.length < limit) {
    const { data: popularData, error: popularError } = await supabase
      .from('maps')
      .select(`
        *,
        user:users!maps_user_id_fkey(id, username, display_name, avatar_url),
        likes(id, user_id),
        bookmarks(id, user_id)
      `)
      .eq('is_public', true)
      .order('likes_count', { ascending: false })
      .limit(limit);

    if (popularError) {
      log.error('[Map] Popular fallback error:', popularError);
      return mapWithStatus(data ?? []);
    }

    return mapWithStatus(popularData ?? []);
  }

  return mapWithStatus(data ?? []);
}

/**
 * 本日のピックアップマップを取得するhook
 * @param currentUserId 現在のユーザーID（いいね状態を取得するため）
 */
export function useTodayPicksMaps(limit: number = 10, currentUserId?: string | null) {
  return useQuery<MapWithUser[], Error>({
    queryKey: ['today-picks-maps', limit, currentUserId],
    queryFn: () => getTodayPicksMaps(limit, currentUserId),
    staleTime: 5 * 60 * 1000, // 5分
  });
}

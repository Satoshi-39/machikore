/**
 * 人気マップ取得hooks
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { supabase } from '@/shared/api/supabase';
import type { MapWithUser } from '@/shared/types';
import { log } from '@/shared/config/logger';
import { calculatePopularityScore, countByMapId, getTopMapIds, getPickupPeriodStart } from '../model/scoring';

/**
 * 人気マップを取得（複合スコア: いいね数 + 閲覧数 + 鮮度）
 * @param currentUserId 現在のユーザーID（いいね状態・ブックマーク状態を取得するため）
 */
async function getPopularMaps(limit: number = 10, currentUserId?: string | null): Promise<MapWithUser[]> {
  // マップと閲覧数を取得
  const [mapsResult, viewsResult] = await Promise.all([
    supabase
      .from('maps')
      .select(`
        *,
        user:users!maps_user_id_fkey(id, username, display_name, avatar_url),
        likes(id, user_id),
        bookmarks(id, user_id)
      `)
      .eq('is_public', true)
      .limit(limit * 5), // 多めに取得してスコアでソート
    supabase
      .from('view_history')
      .select('map_id'),
  ]);

  if (mapsResult.error) {
    log.error('[Map] Error:', mapsResult.error);
    throw mapsResult.error;
  }

  // マップごとの閲覧数をカウント
  const viewsCount = countByMapId(viewsResult.data ?? []);

  // 複合スコアを計算してソート
  const mapsWithScore = (mapsResult.data ?? []).map((map: any) => {
    const totalScore = calculatePopularityScore(
      map.likes_count || 0,
      viewsCount[map.id] || 0,
      map.created_at
    );

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
      _score: totalScore,
    };
  });

  // スコア順でソートしてlimit件を返す
  return mapsWithScore
    .sort((a: any, b: any) => b._score - a._score)
    .slice(0, limit);
}

/**
 * 人気マップを取得するhook
 * @param currentUserId 現在のユーザーID（いいね状態を取得するため）
 */
export function usePopularMaps(limit: number = 10, currentUserId?: string | null) {
  return useQuery<MapWithUser[], Error>({
    queryKey: [...QUERY_KEYS.mapsPopular(limit), currentUserId],
    queryFn: () => getPopularMaps(limit, currentUserId),
    staleTime: 5 * 60 * 1000, // 5分
  });
}

/**
 * 本日のピックアップマップを取得（過去7日間のいいね増加数が多い順）
 * 最近注目されているマップをピックアップ
 * @param currentUserId 現在のユーザーID（いいね状態・ブックマーク状態を取得するため）
 */
async function getTodayPicksMaps(limit: number = 10, currentUserId?: string | null): Promise<MapWithUser[]> {
  const periodStart = getPickupPeriodStart();

  // ピックアップ期間内のいいね数をマップごとに集計
  const { data: recentLikes, error: likesError } = await supabase
    .from('likes')
    .select('map_id')
    .not('map_id', 'is', null)
    .gte('created_at', periodStart.toISOString());

  if (likesError) {
    log.error('[Map] Recent likes error:', likesError);
    throw likesError;
  }

  // マップごとの過去7日間いいね数をカウント
  const recentLikesCount = countByMapId(recentLikes ?? []);

  // いいね数が多いマップIDを取得（上位を多めに取得してからソート）
  const topMapIds = getTopMapIds(recentLikesCount, limit * 3);

  // 過去7日間にいいねがない場合は、累計いいね数でフォールバック
  if (topMapIds.length === 0) {
    const { data: fallbackData, error: fallbackError } = await supabase
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

    if (fallbackError) {
      log.error('[Map] Fallback error:', fallbackError);
      throw fallbackError;
    }

    return (fallbackData ?? []).map((map: any) => ({
      ...map,
      user: map.user || null,
      is_liked: currentUserId ? (map.likes || []).some((like: any) => like.user_id === currentUserId) : false,
      is_bookmarked: currentUserId ? (map.bookmarks || []).some((bookmark: any) => bookmark.user_id === currentUserId) : false,
    }));
  }

  // 該当するマップを取得
  const { data, error } = await supabase
    .from('maps')
    .select(`
      *,
      user:users!maps_user_id_fkey(id, username, display_name, avatar_url),
      likes(id, user_id),
      bookmarks(id, user_id)
    `)
    .eq('is_public', true)
    .in('id', topMapIds);

  if (error) {
    log.error('[Map] Error:', error);
    throw error;
  }

  // 過去7日間のいいね数でソートしてlimit件を返す
  const sortedMaps = (data ?? [])
    .map((map: any) => ({
      ...map,
      user: map.user || null,
      is_liked: currentUserId ? (map.likes || []).some((like: any) => like.user_id === currentUserId) : false,
      is_bookmarked: currentUserId ? (map.bookmarks || []).some((bookmark: any) => bookmark.user_id === currentUserId) : false,
      _recentLikes: recentLikesCount[map.id] || 0,
    }))
    .sort((a: any, b: any) => b._recentLikes - a._recentLikes)
    .slice(0, limit);

  return sortedMaps;
}

/**
 * 本日のピックアップマップを取得するhook
 * @param currentUserId 現在のユーザーID（いいね状態を取得するため）
 */
export function useTodayPicksMaps(limit: number = 10, currentUserId?: string | null) {
  return useQuery<MapWithUser[], Error>({
    queryKey: [...QUERY_KEYS.mapsTodayPicks(limit), currentUserId],
    queryFn: () => getTodayPicksMaps(limit, currentUserId),
    staleTime: 5 * 60 * 1000, // 5分
  });
}

/**
 * 人気マップ取得hooks
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import type { MapWithUser } from '@/shared/types';

/**
 * 人気マップを取得（いいね数順）
 */
async function getPopularMaps(limit: number = 10): Promise<MapWithUser[]> {
  const { data, error } = await supabase
    .from('maps')
    .select(`
      *,
      user:users!maps_user_id_fkey(id, username, display_name, avatar_url)
    `)
    .eq('is_public', true)
    .order('likes_count', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getPopularMaps] Error:', error);
    throw error;
  }

  return data ?? [];
}

/**
 * 人気マップを取得するhook
 */
export function usePopularMaps(limit: number = 10) {
  return useQuery<MapWithUser[], Error>({
    queryKey: ['popular-maps', limit],
    queryFn: () => getPopularMaps(limit),
    staleTime: 5 * 60 * 1000, // 5分
  });
}

/**
 * 本日のピックアップマップを取得（最近作成 + いいね数考慮）
 * 将来的には今日のいいね数でランキングする
 */
async function getTodayPicksMaps(limit: number = 10): Promise<MapWithUser[]> {
  // 24時間以内に作成されたマップ、またはいいね数が多いマップ
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const { data, error } = await supabase
    .from('maps')
    .select(`
      *,
      user:users!maps_user_id_fkey(id, username, display_name, avatar_url)
    `)
    .eq('is_public', true)
    .gte('created_at', oneDayAgo.toISOString())
    .order('likes_count', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getTodayPicksMaps] Error:', error);
    throw error;
  }

  // 24時間以内のマップが少ない場合は、全体から人気順で補完
  if (data.length < limit) {
    const { data: popularData, error: popularError } = await supabase
      .from('maps')
      .select(`
        *,
        user:users!maps_user_id_fkey(id, username, display_name, avatar_url)
      `)
      .eq('is_public', true)
      .order('likes_count', { ascending: false })
      .limit(limit);

    if (popularError) {
      console.error('[getTodayPicksMaps] Popular fallback error:', popularError);
      return data ?? [];
    }

    return popularData ?? [];
  }

  return data ?? [];
}

/**
 * 本日のピックアップマップを取得するhook
 */
export function useTodayPicksMaps(limit: number = 10) {
  return useQuery<MapWithUser[], Error>({
    queryKey: ['today-picks-maps', limit],
    queryFn: () => getTodayPicksMaps(limit),
    staleTime: 5 * 60 * 1000, // 5分
  });
}

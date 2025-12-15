/**
 * ユーザー統計情報を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { getFollowCounts } from '@/shared/api/supabase/follows';
import type { UUID } from '@/shared/types';

interface UserStats {
  mapsCount: number; // マップ数
  followingCount: number; // フォロー数
  followersCount: number; // フォロワー数
}

/**
 * ユーザーの統計情報を取得
 */
export function useUserStats(userId: UUID) {
  return useQuery<UserStats, Error>({
    queryKey: ['userStats', userId],
    queryFn: async () => {
      // マップ数を取得
      const { count: mapsCount } = await supabase
        .from('maps')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // フォロー数・フォロワー数をSupabaseから取得
      const followCounts = await getFollowCounts(userId);

      return {
        mapsCount: mapsCount ?? 0,
        followingCount: followCounts.following,
        followersCount: followCounts.followers,
      };
    },
    enabled: !!userId,
  });
}

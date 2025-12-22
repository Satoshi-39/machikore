/**
 * ユーザー情報を取得するhook
 *
 * Supabaseからユーザー情報を取得
 */

import { useQuery } from '@tanstack/react-query';
import { getUserById } from '@/shared/api/supabase';
import { QUERY_KEYS } from '@/shared/api/query-client';
import type { Database } from '@/shared/types/supabase.generated';

type UserRow = Database['public']['Tables']['users']['Row'];

/**
 * ユーザー情報を取得（Supabaseから）
 */
export function useUser(userId: string | null) {
  return useQuery<UserRow | null, Error>({
    queryKey: QUERY_KEYS.usersDetail(userId || ''),
    queryFn: () => {
      if (!userId) return null;
      return getUserById(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}

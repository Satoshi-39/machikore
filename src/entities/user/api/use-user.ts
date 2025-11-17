/**
 * ユーザー情報を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { getUserById } from '@/shared/api/sqlite';
import type { UserRow } from '@/shared/types/database.types';

/**
 * ユーザー情報を取得
 */
export function useUser(userId: string | null) {
  return useQuery<UserRow | null, Error>({
    queryKey: ['user', userId || ''],
    queryFn: () => {
      if (!userId) return null;
      return getUserById(userId);
    },
    enabled: !!userId,
  });
}

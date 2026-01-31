/**
 * ユーザー情報を取得するhook
 *
 * Supabaseからユーザー情報を取得
 * UUIDならIDで、それ以外はusernameで検索する
 */

import { useQuery } from '@tanstack/react-query';
import { getUserByIdentifier } from '@/shared/api/supabase';
import { QUERY_KEYS } from '@/shared/api/query-client';
import type { UserRow } from '@/shared/types';

/**
 * ユーザー情報を取得（Supabaseから）
 * identifierはUUIDまたはusername
 */
export function useUser(identifier: string | null) {
  return useQuery<UserRow | null, Error>({
    queryKey: QUERY_KEYS.usersDetail(identifier || ''),
    queryFn: () => {
      if (!identifier) return null;
      return getUserByIdentifier(identifier);
    },
    enabled: !!identifier,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}

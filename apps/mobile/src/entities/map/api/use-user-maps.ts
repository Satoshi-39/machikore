/**
 * ユーザーのマップ一覧取得フック
 *
 * Supabaseからユーザーのマップを取得
 * - 自分のマップ: 公開・非公開両方
 * - 他人のマップ: 公開のみ
 */

import { QUERY_KEYS } from '@/shared/api/query-client';
import { getUserMaps, getUserPublicMaps } from '@/shared/api/supabase';
import type { MapWithUser } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';

interface UseUserMapsOptions {
  /** 現在ログインしているユーザーのID（自分のマップかどうかの判定用） */
  currentUserId?: string | null;
}

/**
 * ユーザーのマップ一覧を取得（Supabaseから）
 * @param userId 取得対象のユーザーID
 * @param options.currentUserId 現在ログイン中のユーザーID（省略時は公開マップのみ取得）
 */
export function useUserMaps(userId: string | null, options?: UseUserMapsOptions) {
  const { currentUserId } = options ?? {};
  const isOwnMaps = currentUserId != null && userId === currentUserId;

  return useQuery<MapWithUser[], Error>({
    queryKey: [...QUERY_KEYS.mapsUser(userId || ''), isOwnMaps ? 'all' : 'public'],
    queryFn: () => {
      if (!userId) return [];
      // 自分のマップなら全部、他人のマップなら公開のみ
      return isOwnMaps ? getUserMaps(userId) : getUserPublicMaps(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}

/**
 * IDで街を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getMachiById } from '@/shared/api/sqlite';
import type { MachiRow } from '@/shared/types/database.types';

/**
 * IDで街を取得
 */
export function useMachiById(machiId: string) {
  return useQuery<MachiRow | null, Error>({
    queryKey: QUERY_KEYS.machiDetail(machiId),
    queryFn: () => {
      return getMachiById(machiId);
    },
    enabled: !!machiId,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

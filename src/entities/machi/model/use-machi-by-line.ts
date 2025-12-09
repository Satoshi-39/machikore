/**
 * 路線で街を絞り込むhook
 */

import { useMemo } from 'react';
import { useCachedMachi } from '../api/use-machi';
import { filterMachiByLine } from './helpers';
import type { MachiRow } from '@/shared/types/database.types';

/**
 * 路線で街を絞り込み
 */
export function useMachiByLine(lineName: string) {
  const { data: allMachi, ...rest } = useCachedMachi();

  const filteredMachi = useMemo<MachiRow[]>(() => {
    if (!allMachi || !lineName) return [];
    return filterMachiByLine(allMachi, lineName);
  }, [allMachi, lineName]);

  return {
    data: filteredMachi,
    ...rest,
  };
}

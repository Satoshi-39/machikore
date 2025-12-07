/**
 * 市区に属する街データを取得するhook
 */

import { useMemo } from 'react';
import { useMachi } from './use-machi';
import type { MachiRow } from '@/shared/types/database.types';

/**
 * 指定された市区IDに属する街データを取得
 */
export function useMachiByCity(cityId: string) {
  const { data: allMachi, isLoading, error } = useMachi();

  const machis = useMemo(() => {
    if (!allMachi) return [];
    return allMachi.filter((machi) => machi.city_id === cityId);
  }, [allMachi, cityId]);

  return {
    data: machis,
    isLoading,
    error,
  };
}

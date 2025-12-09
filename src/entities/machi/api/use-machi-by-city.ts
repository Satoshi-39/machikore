/**
 * 市区に属する街データを取得するhook
 */

import { useMemo } from 'react';
import { useCachedMachi } from './use-machi';

/**
 * 指定された市区IDに属する街データを取得
 *
 * Note: キャッシュされた街データからフィルタリングします。
 * 事前に該当する都道府県のデータが取得されている必要があります。
 */
export function useMachiByCity(cityId: string) {
  const { data: allMachi, isLoading, error } = useCachedMachi();

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

/**
 * 全路線名を取得するhook
 */

import { useMemo } from 'react';
import { useMachi } from '../api/use-machi';

/**
 * 全路線名を取得
 */
export function useLineNames() {
  const { data: machiList, ...rest } = useMachi();

  const lineNames = useMemo<string[]>(() => {
    if (!machiList) return [];

    // TODO: lines JSONフィールドをパースして路線名リストを抽出
    // 現在は空配列を返す
    return [];
  }, [machiList]);

  return {
    data: lineNames,
    ...rest,
  };
}

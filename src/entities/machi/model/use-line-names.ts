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

    const lines = new Set(machiList.map((machi) => machi.line_name));
    return Array.from(lines).sort((a, b) => a.localeCompare(b, 'ja'));
  }, [machiList]);

  return {
    data: lineNames,
    ...rest,
  };
}

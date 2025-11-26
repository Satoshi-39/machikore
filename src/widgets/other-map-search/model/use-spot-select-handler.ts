/**
 * 他人のマップ用：検索結果選択ハンドラー
 *
 * 街コレデータの結果を処理
 */

import { useCallback } from 'react';
import type { MachikorePlaceSearchResult } from '@/features/search-places';

interface UseSpotSelectHandlerProps {
  onSpotSelect?: (spot: MachikorePlaceSearchResult) => void;
  onClose: () => void;
}

export function useSpotSelectHandler({
  onSpotSelect,
  onClose,
}: UseSpotSelectHandlerProps) {
  const handleSpotSelect = useCallback(
    (spot: MachikorePlaceSearchResult) => {
      onSpotSelect?.(spot);
      onClose();
    },
    [onSpotSelect, onClose]
  );

  return { handleSpotSelect };
}

/**
 * 自分のマップ用：検索結果選択ハンドラー
 *
 * Place Details取得後のPlaceSearchResultを処理
 * 重複チェックはown-map-search.tsx側でPlace Details取得前に実行済み
 */

import { useCallback } from 'react';
import type { PlaceSearchResult } from '@/features/search-places';

interface UsePlaceSelectHandlerProps {
  mapId: string | null;
  onPlaceSelect?: (place: PlaceSearchResult) => void;
  onExistingSpotEdit?: (spotId: string) => void;
  onClose: () => void;
  endSession?: () => void;
}

export function usePlaceSelectHandler({
  onPlaceSelect,
  onClose,
  endSession,
}: UsePlaceSelectHandlerProps) {
  const handlePlaceSelect = useCallback(
    (place: PlaceSearchResult) => {
      // 新規スポット → 登録画面へ遷移
      onPlaceSelect?.(place);
      endSession?.();
      onClose();
    },
    [onPlaceSelect, onClose, endSession]
  );

  return { handlePlaceSelect };
}

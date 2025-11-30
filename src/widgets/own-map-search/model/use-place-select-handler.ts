/**
 * 自分のマップ用：検索結果選択ハンドラー
 *
 * Google Places APIの結果を処理
 * - 既存スポット → アラート表示
 * - 新規スポット → onPlaceSelect
 */

import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useSpots } from '@/entities/user-spot';
import type { PlaceSearchResult } from '@/features/search-places';

interface UsePlaceSelectHandlerProps {
  mapId: string | null;
  onPlaceSelect?: (place: PlaceSearchResult) => void;
  onClose: () => void;
  endSession?: () => void;
}

export function usePlaceSelectHandler({
  mapId,
  onPlaceSelect,
  onClose,
  endSession,
}: UsePlaceSelectHandlerProps) {
  const { data: spots = [] } = useSpots(mapId ?? '');

  const handlePlaceSelect = useCallback(
    (place: PlaceSearchResult) => {
      // 既存スポットかチェック（Google Place IDで比較）
      const existingSpot = spots.find(
        (spot) => spot.master_spot?.google_place_id === place.googleData.placeId
      );

      if (existingSpot) {
        Alert.alert(
          '登録済みスポット',
          'このスポットは既にこのマップに登録されています。',
          [{ text: 'OK' }]
        );
        endSession?.();
        onClose();
        return;
      }

      // 新規スポット → 登録画面へ遷移
      onPlaceSelect?.(place);
      endSession?.();
      onClose();
    },
    [spots, onPlaceSelect, onClose, endSession]
  );

  return { handlePlaceSelect };
}

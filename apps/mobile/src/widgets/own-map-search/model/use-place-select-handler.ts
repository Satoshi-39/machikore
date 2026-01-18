/**
 * 自分のマップ用：検索結果選択ハンドラー
 *
 * Google Places APIの結果を処理
 * - 既存スポット → 編集するか確認
 * - 新規スポット → onPlaceSelect
 */

import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useSpots } from '@/entities/user-spot';
import type { PlaceSearchResult } from '@/features/search-places';

interface UsePlaceSelectHandlerProps {
  mapId: string | null;
  onPlaceSelect?: (place: PlaceSearchResult) => void;
  onExistingSpotEdit?: (spotId: string) => void;
  onClose: () => void;
  endSession?: () => void;
}

export function usePlaceSelectHandler({
  mapId,
  onPlaceSelect,
  onExistingSpotEdit,
  onClose,
  endSession,
}: UsePlaceSelectHandlerProps) {
  // 自分のマップ用なのでオーナーとして全スポットを取得
  const { data: spots = [] } = useSpots(mapId ?? '', null, true);

  const handlePlaceSelect = useCallback(
    (place: PlaceSearchResult) => {
      // 既存スポットかチェック（Google Place IDで比較）
      const existingSpot = spots.find(
        (spot) => spot.master_spot?.google_place_id === place.googleData.placeId
      );

      if (existingSpot) {
        Alert.alert(
          '登録済みスポット',
          'このスポットは既にこのマップに登録されています。編集しますか？',
          [
            { text: 'キャンセル', style: 'cancel' },
            {
              text: '編集する',
              onPress: () => {
                endSession?.();
                onClose();
                onExistingSpotEdit?.(existingSpot.id);
              },
            },
          ]
        );
        return;
      }

      // 新規スポット → 登録画面へ遷移
      onPlaceSelect?.(place);
      endSession?.();
      onClose();
    },
    [spots, onPlaceSelect, onExistingSpotEdit, onClose, endSession]
  );

  return { handlePlaceSelect };
}

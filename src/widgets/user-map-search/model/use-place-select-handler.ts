/**
 * 検索結果選択ハンドラー
 *
 * ビジネスロジック：
 * - Google Places APIの結果の重複チェック
 * - 既存スポット → アラート表示（編集可能）
 * - 新規スポット → onPlaceSelect
 * - セッション管理
 */

import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useSpots } from '@/entities/user-spot';
import type { PlaceSearchResult, MachikorePlaceSearchResult } from '@/features/search-places';

interface UsePlaceSelectHandlerProps {
  mapId: string | null;
  onPlaceSelect?: (place: PlaceSearchResult) => void; // 新規スポット
  onClose: () => void;
  endSession?: () => void; // Autocomplete Sessionを終了
}

export function usePlaceSelectHandler({
  mapId,
  onPlaceSelect,
  onClose,
  endSession,
}: UsePlaceSelectHandlerProps) {
  // 現在のマップのスポット一覧を取得（重複チェック用）
  const { data: spots = [] } = useSpots(mapId ?? '');

  const handlePlaceSelect = useCallback(
    (place: PlaceSearchResult | MachikorePlaceSearchResult) => {
      // 型ガード：Google Places APIの結果かどうか判定
      const isGooglePlace = 'googleData' in place;

      if (isGooglePlace) {
        // Google Places APIの結果
        const googlePlace = place as PlaceSearchResult;

        // 既存スポットかチェック（Google Place IDで比較）
        const existingSpot = spots.find(
          (spot) => spot.google_place_id === googlePlace.googleData.placeId
        );

        if (existingSpot) {
          // 既存スポット → アラート表示
          console.log('✅ [PlaceSelectHandler] 既存スポット検出:', existingSpot.name);
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
        console.log('🆕 [PlaceSelectHandler] 新規スポット:', googlePlace.name);
        onPlaceSelect?.(googlePlace);
        endSession?.();
      } else {
        // 街コレデータの結果 → 既存スポット（何もしない、またはアラート）
        const machikorPlace = place as MachikorePlaceSearchResult;
        console.log('✅ [PlaceSelectHandler] 街コレスポット選択:', machikorPlace.name);
        // 街コレの検索結果がタップされた場合の処理（必要に応じて実装）
      }

      onClose();
    },
    [spots, onPlaceSelect, onClose, endSession]
  );

  return { handlePlaceSelect };
}

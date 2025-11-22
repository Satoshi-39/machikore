/**
 * POIタップハンドラー
 *
 * Mapbox POIタップ時のビジネスロジック
 */

import { reverseGeocode, useSelectedPlaceStore } from '@/features/search-places';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import type Mapbox from '@rnmapbox/maps';

interface UsePOIHandlerProps {
  mapViewRef: React.RefObject<Mapbox.MapView | null>;
}

export function usePOIHandler({ mapViewRef }: UsePOIHandlerProps) {
  const router = useRouter();
  const setSelectedPlace = useSelectedPlaceStore((state) => state.setSelectedPlace);

  const handlePOITap = useCallback(
    async (event: any) => {
      // スクリーンポイントを取得
      const screenPointX = event.properties?.screenPointX;
      const screenPointY = event.properties?.screenPointY;

      if (
        !mapViewRef.current ||
        screenPointX === undefined ||
        screenPointY === undefined
      ) {
        console.log('⚠️ [POI Tap] MapViewまたはスクリーンポイントが取得できませんでした');
        return;
      }

      try {
        // タップ位置のfeatureを検索（POIレイヤーのみ）
        const featureCollection = await mapViewRef.current.queryRenderedFeaturesAtPoint(
          [screenPointX, screenPointY],
          undefined,
          ['poi-label'] // POIレイヤーのみをクエリ
        );

        console.log('🔍 [POI Query] features:', featureCollection);

        // POIが見つからなければ何もしない
        if (!featureCollection?.features || featureCollection.features.length === 0) {
          console.log('⚠️ [POI Tap] POIが見つかりませんでした（空白地帯のタップ）');
          return;
        }

        console.log(`✅ [POI Tap] ${featureCollection.features.length}件のPOIを検出`);
        console.log('🔍 [POI Details]:', JSON.stringify(featureCollection.features[0], null, 2));

        // タップ座標を取得
        const coordinates = event.geometry?.coordinates;

        if (!coordinates || coordinates.length < 2) {
          console.warn('⚠️ [Map Tap] 座標が取得できませんでした');
          return;
        }

        const [longitude, latitude] = coordinates;

        console.log(`📍 [Map Tap] 座標: ${latitude}, ${longitude}`);

        // Reverse Geocoding APIで場所情報を取得
        const placeResult = await reverseGeocode(latitude, longitude);

        if (placeResult) {
          // 取得した場所情報をストアに保存
          setSelectedPlace(placeResult);

          // スポット登録画面へ遷移
          router.push('/create-spot');
        } else {
          console.warn('⚠️ [POI Tap] 場所情報が取得できませんでした');
        }
      } catch (error) {
        console.error('❌ [POI Tap] エラー:', error);
      }
    },
    [router, setSelectedPlace, mapViewRef]
  );

  return { handlePOITap };
}

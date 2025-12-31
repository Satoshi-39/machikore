/**
 * Mapboxカメラ操作用hook
 *
 * カメラの移動と現在地ボタンのハンドラーを提供
 */

import { useCallback } from 'react';
import { Alert } from 'react-native';
import type Mapbox from '@rnmapbox/maps';
import type { LocationCoords } from './use-location';
import { MAP_ZOOM } from '@/shared/config';

export interface MapViewHandle {
  flyToLocation: (longitude: number, latitude: number, zoomLevel?: number) => void;
}

interface UseMapLocationParams {
  cameraRef: React.RefObject<Mapbox.Camera | null>;
  currentLocation: LocationCoords | null;
}

export function useMapLocation({ cameraRef, currentLocation }: UseMapLocationParams) {
  // 指定座標にカメラを移動
  const flyToLocation = useCallback(
    (longitude: number, latitude: number, zoomLevel: number = MAP_ZOOM.MACHI) => {
      if (cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: [longitude, latitude],
          zoomLevel,
          animationDuration: 1000,
        });
      }
    },
    [cameraRef]
  );

  // 現在地ボタン押下時のハンドラー
  const handleLocationPress = useCallback(() => {
    if (!currentLocation) {
      Alert.alert(
        '位置情報を取得できません',
        '位置情報サービスをオンにして、アプリに位置情報の使用を許可してください。',
        [{ text: 'OK' }]
      );
      return;
    }

    if (cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [currentLocation.longitude, currentLocation.latitude],
        zoomLevel: MAP_ZOOM.MACHI,
        animationDuration: 1000,
      });
    }
  }, [cameraRef, currentLocation]);

  return {
    flyToLocation,
    handleLocationPress,
  };
}

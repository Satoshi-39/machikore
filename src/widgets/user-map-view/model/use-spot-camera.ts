/**
 * スポット表示用カメラ操作フック
 *
 * 単一スポットまたは複数スポットを表示するためのカメラ制御
 */

import { useCallback } from 'react';
import type Mapbox from '@rnmapbox/maps';
import type { SpotWithMasterSpot } from '@/shared/types/database.types';

interface UseSpotCameraParams {
  cameraRef: React.RefObject<Mapbox.Camera | null>;
}

export function useSpotCamera({ cameraRef }: UseSpotCameraParams) {
  // カメラを単一スポットに移動
  const moveCameraToSingleSpot = useCallback(
    (spot: SpotWithMasterSpot) => {
      console.log('🎥 [moveCameraToSingleSpot] 呼び出し:', {
        spot: spot.name,
        coords: [spot.longitude, spot.latitude],
        cameraRefExists: !!cameraRef.current,
      });

      if (!cameraRef.current) {
        console.warn('⚠️ [moveCameraToSingleSpot] cameraRef.current is null');
        return;
      }

      cameraRef.current.setCamera({
        centerCoordinate: [spot.longitude, spot.latitude],
        zoomLevel: 14,
        animationDuration: 1000,
      });

      console.log('✅ [moveCameraToSingleSpot] setCamera実行完了');
    },
    [cameraRef]
  );

  // カメラを全スポットが入る範囲に移動
  const fitCameraToAllSpots = useCallback(
    (spots: SpotWithMasterSpot[]) => {
      if (!cameraRef.current || spots.length === 0) return;

      const lngs = spots.map((s) => s.longitude);
      const lats = spots.map((s) => s.latitude);

      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);

      cameraRef.current.fitBounds(
        [minLng, minLat], // 南西の座標
        [maxLng, maxLat], // 北東の座標
        [50, 50, 50, 50], // パディング [上, 右, 下, 左]
        1000 // アニメーション時間
      );
    },
    [cameraRef]
  );

  return {
    moveCameraToSingleSpot,
    fitCameraToAllSpots,
  };
}

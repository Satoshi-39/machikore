/**
 * スポット表示用カメラ操作フック
 *
 * 単一スポットまたは複数スポットを表示するためのカメラ制御
 */

import { useCallback } from 'react';
import type Mapbox from '@rnmapbox/maps';
import type { SpotWithDetails } from '@/shared/types';

interface UseSpotCameraParams {
  cameraRef: React.RefObject<Mapbox.Camera | null>;
}

export function useSpotCamera({ cameraRef }: UseSpotCameraParams) {
  // カメラを単一スポットに移動
  const moveCameraToSingleSpot = useCallback(
    (spot: SpotWithDetails) => {
      if (!spot.master_spot || !cameraRef.current) return;

      cameraRef.current.setCamera({
        centerCoordinate: [spot.master_spot.longitude, spot.master_spot.latitude],
        zoomLevel: 14,
        animationDuration: 1000,
      });
    },
    [cameraRef]
  );

  // カメラを全スポットが入る範囲に移動
  const fitCameraToAllSpots = useCallback(
    (spots: SpotWithDetails[]) => {
      if (!cameraRef.current || spots.length === 0) return;

      const validSpots = spots.filter((s) => s.master_spot !== null);
      if (validSpots.length === 0) return;

      const lngs = validSpots.map((s) => s.master_spot!.longitude);
      const lats = validSpots.map((s) => s.master_spot!.latitude);

      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);

      cameraRef.current.fitBounds(
        [minLng, minLat], // 南西の座標
        [maxLng, maxLat], // 北東の座標
        [170, 50, 50, 50], // パディング [上, 右, 下, 左] - 上部はヘッダー分を考慮
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

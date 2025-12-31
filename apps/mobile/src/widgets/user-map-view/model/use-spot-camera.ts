/**
 * スポット表示用カメラ操作フック
 *
 * 単一スポットまたは複数スポットを表示するためのカメラ制御
 */

import { useCallback } from 'react';
import { Dimensions } from 'react-native';
import type Mapbox from '@rnmapbox/maps';
import type { SpotWithDetails } from '@/shared/types';
import { MAP_ZOOM } from '@/shared/config';

// カルーセルの高さ（画面の22%）+ 余裕分
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CAROUSEL_PADDING = Math.round(SCREEN_HEIGHT * 0.30);

interface UseSpotCameraParams {
  cameraRef: React.RefObject<Mapbox.Camera | null>;
}

// スポットから座標を取得するヘルパー関数
function getSpotCoordinates(spot: SpotWithDetails): { latitude: number; longitude: number } | null {
  // master_spotがあればそこから取得
  if (spot.master_spot) {
    return { latitude: spot.master_spot.latitude, longitude: spot.master_spot.longitude };
  }
  // なければuser_spotの座標を使用（ピン刺し・現在地登録の場合）
  if (spot.latitude != null && spot.longitude != null) {
    return { latitude: spot.latitude, longitude: spot.longitude };
  }
  return null;
}

export function useSpotCamera({ cameraRef }: UseSpotCameraParams) {

  // カメラを単一スポットに移動
  const moveCameraToSingleSpot = useCallback(
    (spot: SpotWithDetails) => {
      const coords = getSpotCoordinates(spot);
      if (!coords || !cameraRef.current) return;

      cameraRef.current.setCamera({
        centerCoordinate: [coords.longitude, coords.latitude],
        zoomLevel: MAP_ZOOM.MACHI,
        animationDuration: 1000,
      });
    },
    [cameraRef]
  );

  // カメラを全スポットが入る範囲に移動
  const fitCameraToAllSpots = useCallback(
    (spots: SpotWithDetails[]) => {
      if (!cameraRef.current || spots.length === 0) return;

      const validCoords = spots
        .map(getSpotCoordinates)
        .filter((c): c is { latitude: number; longitude: number } => c !== null);
      if (validCoords.length === 0) return;

      const lngs = validCoords.map((c) => c.longitude);
      const lats = validCoords.map((c) => c.latitude);

      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);

      cameraRef.current.fitBounds(
        [minLng, minLat], // 南西の座標
        [maxLng, maxLat], // 北東の座標
        [170, 50, CAROUSEL_PADDING, 50], // パディング [上, 右, 下, 左] - 上部はヘッダー分、下部はカルーセル分を考慮
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

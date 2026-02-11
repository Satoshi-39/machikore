/**
 * デフォルトマップのビューポート範囲管理フック
 *
 * カメラ移動に応じてビューポート範囲（bounds）を更新し、
 * その範囲内のmaster_spotsを取得するためのロジック
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { calculateBoundsFromCamera } from '@/shared/lib/map';
import { MAP_ZOOM } from '@/shared/config';

interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface CameraState {
  center: { latitude: number; longitude: number };
  zoom: number;
}

interface UseBoundsManagementParams {
  currentLocation?: { latitude: number; longitude: number } | null;
}

const TOKYO_CENTER = { lat: 35.6812, lng: 139.7671 }; // 東京駅付近
const DEBOUNCE_DELAY_MS = 300; // カメラ移動のデバウンス時間

export function useBoundsManagement({ currentLocation }: UseBoundsManagementParams) {
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>({
    center: currentLocation
      ? { latitude: currentLocation.latitude, longitude: currentLocation.longitude }
      : { latitude: TOKYO_CENTER.lat, longitude: TOKYO_CENTER.lng },
    zoom: currentLocation ? MAP_ZOOM.MACHI : MAP_ZOOM.INITIAL,
  });
  const boundsUpdateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 初期bounds設定
  useEffect(() => {
    const center = currentLocation
      ? { lat: currentLocation.latitude, lng: currentLocation.longitude }
      : TOKYO_CENTER;
    const zoom = currentLocation ? MAP_ZOOM.MACHI : MAP_ZOOM.INITIAL;

    const initialBounds = calculateBoundsFromCamera(center, zoom);
    setBounds(initialBounds);

    // クリーンアップ: タイマーをクリア
    return () => {
      if (boundsUpdateTimerRef.current) {
        clearTimeout(boundsUpdateTimerRef.current);
      }
    };
  }, [currentLocation]);

  // カメラ移動時にビューポート範囲を更新（デバウンス付き）
  // cameraState/boundsの更新を統合デバウンスしてCPU負荷を抑制
  const latestCameraEventRef = useRef<any>(null);

  const handleCameraChanged = useCallback((state: any) => {
    latestCameraEventRef.current = state;

    // 前のタイマーをクリア
    if (boundsUpdateTimerRef.current) {
      clearTimeout(boundsUpdateTimerRef.current);
    }

    // カメラ移動が止まってから指定時間後にまとめて更新
    boundsUpdateTimerRef.current = setTimeout(() => {
      const s = latestCameraEventRef.current;
      if (!s) return;

      const cameraCenter = s.properties?.center;
      const cameraZoom = s.properties?.zoom;
      const cameraBounds = s.properties?.bounds;

      // カメラ状態を更新（ヘッダー表示用）
      if (cameraCenter && cameraZoom != null) {
        setCameraState({
          center: { latitude: cameraCenter[1], longitude: cameraCenter[0] },
          zoom: cameraZoom,
        });
      }

      // boundsを更新
      if (cameraBounds?.ne && cameraBounds?.sw) {
        const [neLng, neLat] = cameraBounds.ne;
        const [swLng, swLat] = cameraBounds.sw;
        setBounds({
          minLat: swLat,
          maxLat: neLat,
          minLng: swLng,
          maxLng: neLng,
        });
      }
    }, DEBOUNCE_DELAY_MS);
  }, []);

  return {
    bounds,
    cameraState,
    handleCameraChanged,
  };
}

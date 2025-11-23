/**
 * デフォルトマップのビューポート範囲管理フック
 *
 * カメラ移動に応じてビューポート範囲（bounds）を更新し、
 * その範囲内のmaster_spotsを取得するためのロジック
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { calculateBoundsFromCamera } from '@/shared/lib/map';

interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

interface UseBoundsManagementParams {
  currentLocation?: { latitude: number; longitude: number } | null;
}

const TOKYO_CENTER = { lat: 35.6812, lng: 139.7671 }; // 東京駅付近
const DEBOUNCE_DELAY_MS = 300; // カメラ移動のデバウンス時間

export function useBoundsManagement({ currentLocation }: UseBoundsManagementParams) {
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const boundsUpdateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 初期bounds設定
  useEffect(() => {
    const center = currentLocation
      ? { lat: currentLocation.latitude, lng: currentLocation.longitude }
      : TOKYO_CENTER;
    const zoom = currentLocation ? 14 : 10;

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
  const handleCameraChanged = useCallback((state: any) => {
    const cameraBounds = state?.properties?.bounds;

    // 前のタイマーをクリア
    if (boundsUpdateTimerRef.current) {
      clearTimeout(boundsUpdateTimerRef.current);
    }

    if (cameraBounds?.ne && cameraBounds?.sw) {
      const [neLng, neLat] = cameraBounds.ne; // 北東（経度, 緯度）
      const [swLng, swLat] = cameraBounds.sw; // 南西（経度, 緯度）
      const newBounds: Bounds = {
        minLat: swLat,
        maxLat: neLat,
        minLng: swLng,
        maxLng: neLng,
      };

      // カメラ移動が止まってから指定時間後にboundsを更新
      boundsUpdateTimerRef.current = setTimeout(() => {
        setBounds(newBounds);
      }, DEBOUNCE_DELAY_MS);
    }
  }, []);

  return {
    bounds,
    handleCameraChanged,
  };
}

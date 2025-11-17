/**
 * 現在地取得用hook
 *
 * expo-locationを使用してデバイスの現在地を取得
 */

import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 位置情報の権限をリクエスト
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('位置情報の権限が許可されていません');
          setLoading(false);
          return;
        }

        // 現在地を取得
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : '位置情報の取得に失敗しました');
        setLoading(false);
      }
    })();
  }, []);

  // 現在地を再取得する関数
  const refetchLocation = async (): Promise<LocationCoords | null> => {
    try {
      setLoading(true);
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setLocation(coords);
      setLoading(false);
      return coords;
    } catch (err) {
      setError(err instanceof Error ? err.message : '位置情報の取得に失敗しました');
      setLoading(false);
      return null;
    }
  };

  return {
    location,
    error,
    loading,
    refetchLocation,
  };
}

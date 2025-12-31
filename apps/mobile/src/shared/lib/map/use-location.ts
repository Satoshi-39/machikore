/**
 * 現在地取得用hook
 *
 * expo-locationを使用してデバイスの現在地を取得
 */

import { useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Location from 'expo-location';
import { log } from '@/shared/config/logger';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const appState = useRef(AppState.currentState);

  // 位置情報を取得する共通関数
  const fetchLocation = async () => {
    try {
      setLoading(true);

      // 位置情報の権限をリクエスト
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('位置情報の権限が許可されていません');
        setLoading(false);
        return null;
      }

      // 現在地を取得
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      log.debug('[Location] 現在地を取得:', coords);

      setLocation(coords);
      setError(null);
      setLoading(false);
      return coords;
    } catch (err) {
      setError(err instanceof Error ? err.message : '位置情報の取得に失敗しました');
      setLoading(false);
      return null;
    }
  };

  // 初回マウント時に位置情報を取得
  useEffect(() => {
    fetchLocation();
  }, []);

  // AppStateの変化を監視してフォアグラウンド復帰時に再取得
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      // バックグラウンド → アクティブに変化した時
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        log.debug('[Location] アプリがフォアグラウンドに復帰 - 位置情報を再取得');
        fetchLocation();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // 現在地を再取得する関数（手動再取得用）
  const refetchLocation = async (): Promise<LocationCoords | null> => {
    log.debug('[Location] 現在地を手動で再取得');
    return fetchLocation();
  };

  return {
    location,
    error,
    loading,
    refetchLocation,
  };
}

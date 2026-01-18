/**
 * ユーザーマップデータ取得フック
 *
 * スポット、交通データ、都市データ、都道府県データの取得とGeoJSON変換を管理
 */

import { useState, useRef, useCallback, useMemo } from 'react';
import { useMap } from '@/entities/map';
import { useMapLabels } from '@/entities/map-label';
import { useSpots } from '@/entities/user-spot';
import { useTransportHubsSimple, useTransportHubsGeoJson } from '@/entities/transport-hub';
import type { SpotWithDetails } from '@/shared/types';
import { useCitiesSimple, useCitiesGeoJson } from '@/entities/city';
import { usePrefectures, usePrefecturesGeoJson } from '@/entities/prefecture';
import { LABEL_ZOOM_USER_MAP } from '@/shared/config';
import { useUserSpotsGeoJson } from './use-user-spots-geojson';

interface MapBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

interface UseUserMapDataParams {
  mapId: string | null;
  currentUserId?: string | null;
}

interface UseUserMapDataReturn {
  /** マップ情報 */
  mapData: ReturnType<typeof useMap>['data'];
  /** 全スポット */
  spots: SpotWithDetails[];
  /** フィルタリングされたスポット */
  filteredSpots: SpotWithDetails[];
  /** マップラベル */
  mapLabels: NonNullable<ReturnType<typeof useMapLabels>['data']>;
  /** 選択中のラベルID */
  selectedLabelId: string | null;
  /** ラベル選択を変更 */
  setSelectedLabelId: (labelId: string | null) => void;
  /** ラベルフィルタをリセット */
  resetLabelFilter: () => void;
  /** スポットGeoJSON */
  spotsGeoJson: ReturnType<typeof useUserSpotsGeoJson>;
  /** 交通データGeoJSON */
  transportHubsGeoJson: ReturnType<typeof useTransportHubsGeoJson>;
  /** 都市データGeoJSON */
  citiesGeoJson: ReturnType<typeof useCitiesGeoJson>;
  /** 都道府県データGeoJSON */
  prefecturesGeoJson: ReturnType<typeof usePrefecturesGeoJson>;
  /** 現在のズームレベル */
  zoomLevel: number;
  /** カメラ変更時のハンドラー */
  handleCameraChanged: (state: any) => void;
  /** マップ中心座標 */
  centerCoords: { latitude: number; longitude: number };
}

export function useUserMapData({
  mapId,
  currentUserId,
}: UseUserMapDataParams): UseUserMapDataReturn {
  // マップ情報を取得（currentUserIdを渡していいね・ブックマーク状態も含めて取得）
  const { data: mapData } = useMap(mapId, currentUserId);

  // オーナー判定（オーナーは全スポット、それ以外は公開スポットのみ）
  const isOwner = mapData?.user_id === currentUserId;

  // スポットを取得（currentUserId を渡していいね状態も含めて取得）
  const { data: spots = [] } = useSpots(mapId ?? '', currentUserId, isOwner);

  // ラベルデータを取得
  const { data: mapLabels = [] } = useMapLabels(mapId);

  // ラベルフィルタリング状態
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);

  // フィルタリングされたスポット
  const filteredSpots = useMemo(() => {
    if (selectedLabelId === null) {
      return spots;
    }
    return spots.filter((spot) => spot.label_id === selectedLabelId);
  }, [spots, selectedLabelId]);

  // スポットをGeoJSON形式に変換
  const spotsGeoJson = useUserSpotsGeoJson(filteredSpots);

  // ズームレベル
  const [zoomLevel, setZoomLevel] = useState(12);

  // マップ境界（デバウンスで更新）
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const boundsUpdateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // マップ中心座標（ピン刺し機能で使用）
  const [centerCoords, setCenterCoords] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 35.6812,
    longitude: 139.7671,
  });

  // 交通データをboundsベースで取得
  const { data: transportHubs = [] } = useTransportHubsSimple({
    bounds: mapBounds,
    zoom: zoomLevel,
    minZoomToFetch: LABEL_ZOOM_USER_MAP.TRANSPORT.station.min,
  });
  const transportHubsGeoJson = useTransportHubsGeoJson(transportHubs);

  // 都市データをboundsベースで取得
  const { data: cities = [] } = useCitiesSimple({
    bounds: mapBounds,
    zoom: zoomLevel,
    minZoomToFetch: LABEL_ZOOM_USER_MAP.CITY.min,
  });
  const citiesGeoJson = useCitiesGeoJson(cities);

  // 都道府県データを取得（47件と少ないので全件取得）
  const { data: prefectures = [] } = usePrefectures();
  const prefecturesGeoJson = usePrefecturesGeoJson(prefectures);

  // カメラ変更時のハンドラー
  const handleCameraChanged = useCallback((state: any) => {
    // 中心座標を即座に更新
    if (state?.properties?.center) {
      const [longitude, latitude] = state.properties.center;
      setCenterCoords({ latitude, longitude });
    }

    // ズームレベルを即座に更新
    if (state?.properties?.zoom != null) {
      setZoomLevel(state.properties.zoom);
    }

    // boundsの更新はデバウンス
    const cameraBounds = state?.properties?.bounds;
    if (cameraBounds?.ne && cameraBounds?.sw) {
      if (boundsUpdateTimerRef.current) {
        clearTimeout(boundsUpdateTimerRef.current);
      }

      const [neLng, neLat] = cameraBounds.ne;
      const [swLng, swLat] = cameraBounds.sw;
      const newBounds = {
        minLat: swLat,
        maxLat: neLat,
        minLng: swLng,
        maxLng: neLng,
      };

      // カメラ移動が止まってから300ms後にboundsを更新
      boundsUpdateTimerRef.current = setTimeout(() => {
        setMapBounds(newBounds);
      }, 300);
    }
  }, []);

  // ラベルフィルタをリセット
  const resetLabelFilter = useCallback(() => {
    setSelectedLabelId(null);
  }, []);

  return {
    mapData,
    spots,
    filteredSpots,
    mapLabels,
    selectedLabelId,
    setSelectedLabelId,
    resetLabelFilter,
    spotsGeoJson,
    transportHubsGeoJson,
    citiesGeoJson,
    prefecturesGeoJson,
    zoomLevel,
    handleCameraChanged,
    centerCoords,
  };
}

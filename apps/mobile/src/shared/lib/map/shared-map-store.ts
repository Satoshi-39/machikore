/**
 * SharedMapView用 Zustandストア
 *
 * シングルトンMapViewの状態管理:
 * - Teleport制御（activeHostName）
 * - GeoJSONデータ（各画面から同期）
 * - 選択/フォーカス状態
 * - イベント転送（onCameraChanged, onSpotPress）
 * - カメラ状態保存（mapIdごと）
 */

import { createRef } from 'react';
import { create } from 'zustand';
import type Mapbox from '@rnmapbox/maps';
import type { FeatureCollection } from 'geojson';
import { MAX_SAVED_CAMERA_STATES } from '@/shared/config/cache';

/** Portal描画されるMapView内のCameraを操作するためのref */
export const sharedCameraRef = createRef<Mapbox.Camera>();

interface CameraState {
  centerCoordinate: [number, number];
  zoomLevel: number;
}

interface GeoJsonData {
  spotsGeoJson: FeatureCollection | null;
  transportHubsGeoJson: FeatureCollection | null;
  citiesGeoJson: FeatureCollection | null;
  prefecturesGeoJson: FeatureCollection | null;
}

interface SharedMapState {
  // Teleport制御
  activeHostName: string | null;
  setActiveHostName: (name: string | null) => void;

  // MapView状態
  isMapReady: boolean;
  setIsMapReady: (ready: boolean) => void;
  activeMapId: string | null;
  setActiveMapId: (id: string | null) => void;

  // レイヤーデータ（UserMapLabelsが読み取り）
  spotsGeoJson: FeatureCollection | null;
  transportHubsGeoJson: FeatureCollection | null;
  citiesGeoJson: FeatureCollection | null;
  prefecturesGeoJson: FeatureCollection | null;
  updateGeoJson: (data: Partial<GeoJsonData>) => void;

  // レイヤースタイリング
  selectedSpotId: string | null;
  focusedSpotId: string | null;
  setSelectedSpotId: (id: string | null) => void;
  setFocusedSpotId: (id: string | null) => void;

  // カメライベント転送
  onCameraChanged: ((event: any) => void) | null;
  setOnCameraChanged: (handler: ((event: any) => void) | null) => void;

  // スポットタップイベント転送
  onSpotPress: ((event: any) => void) | null;
  setOnSpotPress: (handler: ((event: any) => void) | null) => void;

  // 現在のカメラ状態（onCameraChangedから更新）
  centerCoords: { latitude: number; longitude: number };
  setCenterCoords: (coords: { latitude: number; longitude: number }) => void;
  currentZoomLevel: number;
  setCurrentZoomLevel: (zoom: number) => void;

  // カメラ状態保存（mapIdごと）
  savedCameraStates: Record<string, CameraState>;
  saveCameraState: (mapId: string, state: CameraState) => void;
  getSavedCameraState: (mapId: string) => CameraState | undefined;

  // 遷移中フラグ（カメラ復元完了までMapViewを非表示にする）
  isTransitioning: boolean;
  setIsTransitioning: (transitioning: boolean) => void;
}

export const useSharedMapStore = create<SharedMapState>((set, get) => ({
  // Teleport制御
  activeHostName: null,
  setActiveHostName: (name) => set({ activeHostName: name }),

  // MapView状態
  isMapReady: false,
  setIsMapReady: (ready) => set({ isMapReady: ready }),
  activeMapId: null,
  setActiveMapId: (id) => set({ activeMapId: id }),

  // レイヤーデータ
  spotsGeoJson: null,
  transportHubsGeoJson: null,
  citiesGeoJson: null,
  prefecturesGeoJson: null,
  updateGeoJson: (data) => set(data),

  // レイヤースタイリング
  selectedSpotId: null,
  focusedSpotId: null,
  setSelectedSpotId: (id) => set({ selectedSpotId: id }),
  setFocusedSpotId: (id) => set({ focusedSpotId: id }),

  // カメライベント転送
  onCameraChanged: null,
  setOnCameraChanged: (handler) => set({ onCameraChanged: handler }),

  // スポットタップイベント転送
  onSpotPress: null,
  setOnSpotPress: (handler) => set({ onSpotPress: handler }),

  // 現在のカメラ状態
  centerCoords: { latitude: 35.6812, longitude: 139.7671 },
  setCenterCoords: (coords) => set({ centerCoords: coords }),
  currentZoomLevel: 12,
  setCurrentZoomLevel: (zoom) => set({ currentZoomLevel: zoom }),

  // カメラ状態保存（上限あり、古いエントリから削除）
  savedCameraStates: {},
  saveCameraState: (mapId, state) =>
    set((prev) => {
      const updated = { ...prev.savedCameraStates, [mapId]: state };
      const keys = Object.keys(updated);
      if (keys.length > MAX_SAVED_CAMERA_STATES) {
        // 古いエントリ（先頭）を削除して上限内に収める
        const keysToRemove = keys.slice(0, keys.length - MAX_SAVED_CAMERA_STATES);
        for (const key of keysToRemove) {
          delete updated[key];
        }
      }
      return { savedCameraStates: updated };
    }),
  getSavedCameraState: (mapId) => get().savedCameraStates[mapId],

  // 遷移中フラグ
  isTransitioning: false,
  setIsTransitioning: (transitioning) => set({ isTransitioning: transitioning }),
}));

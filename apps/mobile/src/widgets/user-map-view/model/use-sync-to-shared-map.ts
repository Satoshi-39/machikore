/**
 * UserMapViewから共有MapViewへのデータ同期hook
 *
 * - フォーカス取得時: activeHostNameを設定、GeoJSONをstoreに書き込み、カメラ復元
 * - フォーカス喪失時: カメラ状態を保存、イベントハンドラをクリア
 * - アンマウント時: activeHostNameをクリア（MapViewをローカルcontentViewに戻す）
 * - GeoJSON変更時: リアクティブにstoreに同期
 *
 * 注意: useFocusEffectのcleanupではactiveHostNameをクリアしない。
 * クリアするとネイティブビューの再配置（teleport解除）が発生し、
 * モーダル表示中のReact Navigationのスタック状態に干渉する。
 * activeHostNameのクリアはアンマウント時（useEffect cleanup）でのみ行う。
 */

import { useCallback, useEffect, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import type { FeatureCollection } from 'geojson';
import { sharedCameraRef, useSharedMapStore } from '@/shared/lib/map';

interface SyncParams {
  /** このPortalHostの名前 */
  hostName: string;
  mapId: string | null;
  spotsGeoJson: FeatureCollection;
  transportHubsGeoJson: FeatureCollection;
  citiesGeoJson: FeatureCollection | undefined;
  prefecturesGeoJson: FeatureCollection | undefined;
  selectedSpotId: string | null;
  focusedSpotId: string | null;
  onCameraChanged: (event: any) => void;
  onSpotPress: (event: any) => void;
}

export function useSyncToSharedMap({
  hostName,
  mapId,
  spotsGeoJson,
  transportHubsGeoJson,
  citiesGeoJson,
  prefecturesGeoJson,
  selectedSpotId,
  focusedSpotId,
  onCameraChanged,
  onSpotPress,
}: SyncParams) {
  // コールバックのrefを維持（useFocusEffectのdepsを安定させるため）
  const onCameraChangedRef = useRef(onCameraChanged);
  onCameraChangedRef.current = onCameraChanged;
  const onSpotPressRef = useRef(onSpotPress);
  onSpotPressRef.current = onSpotPress;

  // フォーカス時: MapViewを「引き寄せる」+ カメラ復元
  useFocusEffect(
    useCallback(() => {
      const store = useSharedMapStore.getState();

      // MapViewをこの画面にテレポート
      store.setActiveHostName(hostName);
      store.setActiveMapId(mapId);
      // イベントハンドラをref経由のラッパーとして登録
      store.setOnCameraChanged((event: any) => onCameraChangedRef.current(event));
      store.setOnSpotPress((event: any) => onSpotPressRef.current(event));

      // GeoJSONを即座に同期
      store.updateGeoJson({
        spotsGeoJson,
        transportHubsGeoJson,
        citiesGeoJson: citiesGeoJson ?? null,
        prefecturesGeoJson: prefecturesGeoJson ?? null,
      });

      // 選択状態を同期
      store.setSelectedSpotId(selectedSpotId);
      store.setFocusedSpotId(focusedSpotId);

      // 保存済みカメラ状態の復元
      if (mapId) {
        const saved = store.getSavedCameraState(mapId);
        if (saved) {
          // 次フレームでカメラを復元（MapViewのteleport完了を待つ）
          requestAnimationFrame(() => {
            sharedCameraRef.current?.setCamera({
              centerCoordinate: saved.centerCoordinate,
              zoomLevel: saved.zoomLevel,
              animationDuration: 0,
            });
          });
        }
      }

      // フォーカス喪失時: カメラ状態保存 + ハンドラクリア
      // activeHostNameはクリアしない（ネイティブ再配置がナビゲーションに干渉するため）
      return () => {
        const currentStore = useSharedMapStore.getState();

        // カメラ状態保存
        if (mapId) {
          const { centerCoords, currentZoomLevel } = currentStore;
          currentStore.saveCameraState(mapId, {
            centerCoordinate: [centerCoords.longitude, centerCoords.latitude],
            zoomLevel: currentZoomLevel,
          });
        }

        // イベントハンドラをクリア（古いコールバックの実行を防止）
        currentStore.setOnCameraChanged(null);
        currentStore.setOnSpotPress(null);
      };
    }, [hostName, mapId]) // eslint-disable-line react-hooks/exhaustive-deps
  );

  // アンマウント時のみactiveHostNameをクリア（PortalHostの消滅に合わせる）
  useEffect(() => {
    return () => {
      const store = useSharedMapStore.getState();
      if (store.activeHostName === hostName) {
        store.setActiveHostName(null);
        store.setActiveMapId(null);
      }
    };
  }, [hostName]); // eslint-disable-line react-hooks/exhaustive-deps

  // GeoJSONデータのリアクティブ同期
  useEffect(() => {
    const store = useSharedMapStore.getState();
    if (store.activeMapId === mapId && mapId !== null) {
      store.updateGeoJson({
        spotsGeoJson,
        transportHubsGeoJson,
        citiesGeoJson: citiesGeoJson ?? null,
        prefecturesGeoJson: prefecturesGeoJson ?? null,
      });
    }
  }, [spotsGeoJson, transportHubsGeoJson, citiesGeoJson, prefecturesGeoJson, mapId]);

  // 選択状態のリアクティブ同期
  useEffect(() => {
    const store = useSharedMapStore.getState();
    if (store.activeMapId === mapId && mapId !== null) {
      store.setSelectedSpotId(selectedSpotId);
      store.setFocusedSpotId(focusedSpotId);
    }
  }, [selectedSpotId, focusedSpotId, mapId]);
}

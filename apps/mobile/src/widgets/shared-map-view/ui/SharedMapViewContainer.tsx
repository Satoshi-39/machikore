/**
 * シングルトンMapViewコンテナ
 *
 * アプリ全体で1つだけ存在するMapbox MapView。
 * react-native-teleportのPortalで各画面のPortalHostに物理的に移動する。
 *
 * - storeからGeoJSON/選択状態を読み取り
 * - onCameraChanged/onSpotPressイベントをstoreのハンドラに転送
 * - activeHostNameがnullの場合、MapViewはPortal内のローカルcontentViewに留まり非表示
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { Portal } from 'react-native-teleport';
import { ENV } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { sharedCameraRef, useSharedMapStore } from '@/shared/lib/map';
import { UserMapLabels } from '@/widgets/user-map-view/ui/layers';

export function SharedMapViewContainer() {
  const isDarkMode = useIsDarkMode();
  const mapViewRef = useRef<Mapbox.MapView>(null);
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const activeHostName = useSharedMapStore((s) => s.activeHostName);
  const setIsMapReady = useSharedMapStore((s) => s.setIsMapReady);
  const isTransitioning = useSharedMapStore((s) => s.isTransitioning);
  const spotsGeoJson = useSharedMapStore((s) => s.spotsGeoJson);
  const transportHubsGeoJson = useSharedMapStore((s) => s.transportHubsGeoJson);
  const citiesGeoJson = useSharedMapStore((s) => s.citiesGeoJson);
  const prefecturesGeoJson = useSharedMapStore((s) => s.prefecturesGeoJson);
  const selectedSpotId = useSharedMapStore((s) => s.selectedSpotId);
  const focusedSpotId = useSharedMapStore((s) => s.focusedSpotId);

  // カメラ変更イベントをstoreのハンドラに転送 + centerCoords更新
  // centerCoords/zoomLevelの更新はデバウンスしてCPU負荷を抑制
  const storeUpdateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestEventRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (storeUpdateTimerRef.current) clearTimeout(storeUpdateTimerRef.current);
    };
  }, []);

  const handleCameraChanged = useCallback(
    (event: any) => {
      const store = useSharedMapStore.getState();
      // アクティブページのハンドラに即時転送（各ページ側でデバウンス）
      store.onCameraChanged?.(event);

      // store の centerCoords/zoomLevel 更新はデバウンス（200ms）
      latestEventRef.current = event;
      if (storeUpdateTimerRef.current) {
        clearTimeout(storeUpdateTimerRef.current);
      }
      storeUpdateTimerRef.current = setTimeout(() => {
        const e = latestEventRef.current;
        if (!e) return;
        const s = useSharedMapStore.getState();
        if (e.properties?.center) {
          const [longitude, latitude] = e.properties.center;
          s.setCenterCoords({ latitude, longitude });
        }
        if (e.properties?.zoom != null) {
          s.setCurrentZoomLevel(e.properties.zoom);
        }
      }, 200);
    },
    []
  );

  // スポットタップイベントをstoreのハンドラに転送
  const handleSpotPress = useCallback((event: any) => {
    useSharedMapStore.getState().onSpotPress?.(event);
  }, []);

  // マップロード完了
  const handleMapReady = useCallback(() => {
    setIsMapReady(true);
  }, [setIsMapReady]);

  // 遷移中はMapViewを非表示、復元完了後にfade-in
  useEffect(() => {
    if (isTransitioning) {
      // 即座に非表示
      opacityAnim.setValue(0);
    } else {
      // fade-inで表示
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [isTransitioning, opacityAnim]);

  // activeHostNameがnullの場合もPortalは描画し続ける（MapViewを維持）
  // hostNameが空文字列の場合、ネイティブ側でnil扱いになりローカルcontentViewに留まる
  return (
    <Portal hostName={activeHostName ?? undefined} name="shared-map-view">
      <Animated.View style={{ flex: 1, opacity: opacityAnim }}>
      <Mapbox.MapView
        ref={mapViewRef}
        style={{ flex: 1 }}
        styleURL={
          isDarkMode
            ? ENV.MAPBOX_USER_MAP_STYLE_URL_DARK
            : ENV.MAPBOX_USER_MAP_STYLE_URL
        }
        onCameraChanged={handleCameraChanged}
        onDidFinishLoadingMap={handleMapReady}
        scaleBarEnabled={false}
      >
        <Mapbox.Camera
          ref={sharedCameraRef}
          defaultSettings={{
            centerCoordinate: [139.7671, 35.6812],
            zoomLevel: 12,
          }}
          animationDuration={0}
        />

        <Mapbox.UserLocation
          visible={true}
          showsUserHeadingIndicator={true}
          animated={false}
        />

        {spotsGeoJson && transportHubsGeoJson && (
          <UserMapLabels
            spotsGeoJson={spotsGeoJson as any}
            transportGeoJson={transportHubsGeoJson as any}
            prefecturesGeoJson={prefecturesGeoJson as any}
            citiesGeoJson={citiesGeoJson as any}
            onSpotPress={handleSpotPress}
            selectedSpotId={selectedSpotId}
            focusedSpotId={focusedSpotId}
          />
        )}
      </Mapbox.MapView>
      </Animated.View>
    </Portal>
  );
}

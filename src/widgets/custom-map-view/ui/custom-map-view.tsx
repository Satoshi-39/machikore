/**
 * カスタムマップビューWidget - Mapbox地図表示
 *
 * FSDの原則：Widget層は複合的なUIコンポーネント
 */

import { useSpots } from '@/entities/spot';
import { QuickAddSpotFacade } from '@/features/quick-add-spot';
import type { MapListViewMode } from '@/features/toggle-view-mode';
import type { SpotRow } from '@/shared/types/database.types';
import { FAB, LocationButton } from '@/shared/ui';
import { SpotDetailCard } from '@/widgets/spot-detail-card';
import { Ionicons } from '@expo/vector-icons';
import Mapbox from '@rnmapbox/maps';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Alert, View } from 'react-native';

export interface MapViewHandle {
  flyToLocation: (longitude: number, latitude: number) => void;
}

interface CustomMapViewProps {
  mapId: string | null;
  userId?: string | null;
  defaultMapId?: string | null;
  onSpotSelect?: (spot: SpotRow | null) => void;
  onSpotDetailSnapChange?: (snapIndex: number) => void;
  currentLocation?: { latitude: number; longitude: number } | null;
  viewMode?: MapListViewMode;
  isSearchFocused?: boolean;
  autoOpenQuickAdd?: boolean;
  quickAddTrigger?: number;
  onSearchRequest?: () => void;
}

export const CustomMapView = forwardRef<MapViewHandle, CustomMapViewProps>(
  (
    {
      mapId,
      userId = null,
      defaultMapId = null,
      onSpotSelect,
      onSpotDetailSnapChange,
      currentLocation = null,
      viewMode = 'map',
      isSearchFocused = false,
      autoOpenQuickAdd = false,
      quickAddTrigger = 0,
      onSearchRequest,
    },
    ref
  ) => {
    const cameraRef = useRef<Mapbox.Camera>(null);
    const { data: spots = [] } = useSpots(mapId ?? '');
    const [selectedSpot, setSelectedSpot] = useState<SpotRow | null>(null);
    const [isMapReady, setIsMapReady] = useState(false);
    const [spotDetailSnapIndex, setSpotDetailSnapIndex] = useState<number>(1);
    const [isQuickAddMenuOpen, setIsQuickAddMenuOpen] = useState(false);
    const [isPinMode, setIsPinMode] = useState(false);
    const [mapTapHandler, setMapTapHandler] = useState<
      ((lat: number, lng: number) => void) | null
    >(null);
    const [cancelPinHandler, setCancelPinHandler] = useState<
      (() => void) | null
    >(null);

    // マップの中心座標を保持
    const [centerCoords, setCenterCoords] = useState<{
      latitude: number;
      longitude: number;
    }>({
      latitude: 35.6812,
      longitude: 139.7671,
    });

    // 選択状態を親に通知
    const handleSpotSelect = (spot: SpotRow | null) => {
      setSelectedSpot(spot);
      onSpotSelect?.(spot);
    };

    // スナップ変更を親に通知して、ローカルstateも更新
    const handleSnapChange = (snapIndex: number) => {
      setSpotDetailSnapIndex(snapIndex);
      onSpotDetailSnapChange?.(snapIndex);
    };

    // 現在地ボタンハンドラー
    const handleLocationPress = () => {
      if (!currentLocation) {
        Alert.alert(
          '位置情報を取得できません',
          '位置情報サービスをオンにして、アプリに位置情報の使用を許可してください。',
          [{ text: 'OK' }]
        );
        return;
      }

      if (cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: [
            currentLocation.longitude,
            currentLocation.latitude,
          ],
          zoomLevel: 14,
          animationDuration: 1000,
        });
      }
    };

    // FABボタンハンドラー
    const handleFABPress = () => {
      setIsQuickAddMenuOpen((prev) => !prev);
    };

    // マップのロード完了ハンドラー
    const handleMapReady = () => {
      setIsMapReady(true);
    };

    // カメラを単一スポットに移動
    const moveCameraToSingleSpot = (spot: SpotRow) => {
      if (!cameraRef.current) return;

      cameraRef.current.setCamera({
        centerCoordinate: [spot.longitude, spot.latitude],
        zoomLevel: 14, // 適度なズームレベル
        animationDuration: 1000,
      });
    };

    // カメラを全スポットが入る範囲に移動
    const fitCameraToAllSpots = (spots: SpotRow[]) => {
      if (!cameraRef.current) return;

      const lngs = spots.map((s) => s.longitude);
      const lats = spots.map((s) => s.latitude);

      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);

      cameraRef.current.fitBounds(
        [minLng, minLat], // 南西の座標
        [maxLng, maxLat], // 北東の座標
        [50, 50, 50, 50], // パディング [上, 右, 下, 左]
        1000 // アニメーション時間
      );
    };

    // mapIdが変更されたらスポット詳細カードを閉じる
    useEffect(() => {
      setSelectedSpot(null);
    }, [mapId]);

    // autoOpenQuickAddがtrueの場合、マウント時にQuickAddSpotMenuを開く
    useEffect(() => {
      if (autoOpenQuickAdd && mapId) {
        // 少し遅延させてマップが準備されるのを待つ
        setTimeout(() => {
          setIsQuickAddMenuOpen(true);
        }, 300);
      }
    }, [autoOpenQuickAdd, mapId, quickAddTrigger]);

    // スポットが読み込まれ、マップの準備ができたら全スポットを表示
    useEffect(() => {
      // 早期リターンでネストを削減
      if (spots.length === 0 || !isMapReady) return;

      // 少し遅延させてカメラが準備されるのを待つ
      setTimeout(() => {
        if (spots.length === 1) {
          moveCameraToSingleSpot(spots[0]!);
        } else {
          fitCameraToAllSpots(spots);
        }
      }, 100);
    }, [spots, mapId, isMapReady]);

    // カメラ変更時に中心座標を更新
    const handleCameraChanged = async (state: any) => {
      if (state?.properties?.center) {
        const [longitude, latitude] = state.properties.center;
        setCenterCoords({ latitude, longitude });
      }
    };

    // 外部から呼び出せるメソッドを公開
    useImperativeHandle(ref, () => ({
      flyToLocation: (longitude: number, latitude: number) => {
        if (cameraRef.current) {
          cameraRef.current.setCamera({
            centerCoordinate: [longitude, latitude],
            zoomLevel: 14,
            animationDuration: 1000,
          });
        }
      },
    }));

    return (
      <View className="flex-1">
        <Mapbox.MapView
          style={{ flex: 1 }}
          styleURL={Mapbox.StyleURL.Street}
          onCameraChanged={handleCameraChanged}
          onDidFinishLoadingMap={handleMapReady}
        >
          <Mapbox.Camera
            ref={cameraRef}
            zoomLevel={12}
            centerCoordinate={[139.7671, 35.6812]} // 東京
            animationDuration={0}
          />

          {/* スポットマーカー表示 */}
          {spots.map((spot) => (
            <Mapbox.PointAnnotation
              key={spot.id}
              id={spot.id}
              coordinate={[spot.longitude, spot.latitude]}
              onSelected={() => {
                console.log('📍 スポット選択:', spot.name);
                handleSpotSelect(spot);
              }}
            >
              <Ionicons name="location" size={40} color="#EF4444" />
            </Mapbox.PointAnnotation>
          ))}
        </Mapbox.MapView>

        {/* マップコントロールボタン（現在地ボタン） - 縮小版またはカードなしの時表示 */}
        {viewMode === 'map' &&
          !isSearchFocused &&
          (!selectedSpot || spotDetailSnapIndex === 0) && (
            <View className="absolute bottom-32 right-6 z-50">
              <LocationButton
                onPress={handleLocationPress}
                testID="location-button"
              />
            </View>
          )}

        {/* 地図上でピン刺しボタン（FAB） - スポット詳細カードがない時だけ表示 */}
        {viewMode === 'map' && !isSearchFocused && !selectedSpot && (
          <View className="absolute bottom-14 right-6 z-50">
            <FAB
              icon="pushpin"
              iconLibrary="antdesign"
              onPress={handleFABPress}
              testID="add-spot-fab"
            />
          </View>
        )}

        {/* 選択されたスポットの詳細カード */}
        {selectedSpot && (
          <SpotDetailCard
            spot={selectedSpot}
            onClose={() => handleSpotSelect(null)}
            onSnapChange={handleSnapChange}
          />
        )}

        {/* クイック追加機能 */}
        <QuickAddSpotFacade
          visible={isQuickAddMenuOpen}
          userId={userId}
          selectedMapId={mapId}
          defaultMapId={defaultMapId}
          currentLocation={currentLocation}
          centerCoords={centerCoords}
          onClose={() => setIsQuickAddMenuOpen(false)}
          onPinModeChange={setIsPinMode}
          onMapTap={(handler) => setMapTapHandler(() => handler)}
          onCancelPinMode={(handler) => setCancelPinHandler(() => handler)}
          onSearchRequest={onSearchRequest}
        />
      </View>
    );
  }
);

/**
 * ユーザーマップビューWidget - Mapbox地図表示
 *
 * FSDの原則：Widget層は複合的なUIコンポーネント
 */

import { useSpots } from '@/entities/user-spot';
import { QuickAddSpotFacade } from '@/features/quick-add-spot';
import type { MapListViewMode } from '@/features/toggle-view-mode';
import { useMapLocation, type MapViewHandle } from '@/shared/lib/map';
import type { SpotWithMasterSpot } from '@/shared/types/database.types';
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
import { View } from 'react-native';
import { usePOIHandler, useSpotCamera } from '../model';

interface UserMapViewProps {
  mapId: string | null;
  userId?: string | null;
  defaultMapId?: string | null;
  onSpotDetailSnapChange?: (snapIndex: number) => void;
  currentLocation?: { latitude: number; longitude: number } | null;
  viewMode?: MapListViewMode;
  isSearchFocused?: boolean;
  autoOpenQuickAdd?: boolean;
  quickAddTrigger?: number;
  onSearchRequest?: () => void;
}

export const UserMapView = forwardRef<MapViewHandle, UserMapViewProps>(
  (
    {
      mapId,
      userId = null,
      defaultMapId = null,
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
    const mapViewRef = useRef<Mapbox.MapView>(null);
    const cameraRef = useRef<Mapbox.Camera>(null);
    const { data: spots = [] } = useSpots(mapId ?? '');
    const [selectedSpot, setSelectedSpot] = useState<SpotWithMasterSpot | null>(
      null
    );
    const [isMapReady, setIsMapReady] = useState(false);
    const [spotDetailSnapIndex, setSpotDetailSnapIndex] = useState<number>(1);
    const [isQuickAddMenuOpen, setIsQuickAddMenuOpen] = useState(false);

    // マップの中心座標を保持
    const [centerCoords, setCenterCoords] = useState<{
      latitude: number;
      longitude: number;
    }>({
      latitude: 35.6812,
      longitude: 139.7671,
    });

    // マップ操作用フック
    const { flyToLocation, handleLocationPress } = useMapLocation({
      cameraRef,
      currentLocation,
    });

    // スポットカメラ操作用フック
    const { moveCameraToSingleSpot, fitCameraToAllSpots } = useSpotCamera({
      cameraRef,
    });

    // POIタップハンドラー
    const { handlePOITap } = usePOIHandler({ mapViewRef });

    // 選択状態を管理
    const handleSpotSelect = (spot: SpotWithMasterSpot | null) => {
      setSelectedSpot(spot);
    };

    // スナップ変更を親に通知して、ローカルstateも更新
    const handleSnapChange = (snapIndex: number) => {
      setSpotDetailSnapIndex(snapIndex);
      onSpotDetailSnapChange?.(snapIndex);
    };

    // FABボタンハンドラー
    const handleFABPress = () => {
      setIsQuickAddMenuOpen((prev) => !prev);
    };

    // マップのロード完了ハンドラー
    const handleMapReady = () => {
      setIsMapReady(true);
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

    // スポットが読み込まれたら全スポットを表示
    useEffect(() => {
      if (spots.length === 0 || !isMapReady) return;

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
      flyToLocation,
    }));

    return (
      <View className="flex-1">
        <Mapbox.MapView
          ref={mapViewRef}
          style={{ flex: 1 }}
          styleURL={Mapbox.StyleURL.Street}
          localizeLabels={true}
          onCameraChanged={handleCameraChanged}
          onDidFinishLoadingMap={handleMapReady}
          onPress={handlePOITap}
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
          onSearchRequest={onSearchRequest}
        />
      </View>
    );
  }
);

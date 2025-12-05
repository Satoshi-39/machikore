/**
 * ユーザーマップビューWidget - Mapbox地図表示
 *
 * FSDの原則：Widget層は複合的なUIコンポーネント
 */

import { useSpots } from '@/entities/user-spot';
import type { MapListViewMode } from '@/features/toggle-view-mode';
import { useSelectedPlaceStore } from '@/features/search-places';
import { useMapLocation, type MapViewHandle } from '@/shared/lib/map';
import { useIsDarkMode } from '@/shared/lib/providers';
import { ENV, colors } from '@/shared/config';
import type { SpotWithDetails } from '@/shared/types';
import { LocationButton, FitAllButton } from '@/shared/ui';
import { SpotDetailCard } from '@/widgets/spot-detail-card';
import { SpotCarousel } from '@/widgets/spot-carousel';
import { Ionicons } from '@expo/vector-icons';
import Mapbox from '@rnmapbox/maps';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSpotCamera } from '../model';

interface UserMapViewProps {
  mapId: string | null;
  userId?: string | null;
  currentUserId?: string | null;
  defaultMapId?: string | null;
  /** 初期表示するスポットID（指定時はカルーセルを非表示にして詳細カードを開く） */
  initialSpotId?: string | null;
  /** 詳細カードが最大化されている時に呼ばれる（ヘッダー非表示用） */
  onDetailCardMaximized?: (isMaximized: boolean) => void;
  currentLocation?: { latitude: number; longitude: number } | null;
  viewMode?: MapListViewMode;
  isSearchFocused?: boolean;
  onEditSpot?: (spotId: string) => void;
}

export const UserMapView = forwardRef<MapViewHandle, UserMapViewProps>(
  (
    {
      mapId,
      userId: _userId = null, // 将来のピン刺し機能で使用予定
      currentUserId = null,
      defaultMapId: _defaultMapId = null, // 将来のピン刺し機能で使用予定
      initialSpotId = null,
      onDetailCardMaximized,
      currentLocation = null,
      viewMode = 'map',
      isSearchFocused = false,
      onEditSpot,
    },
    ref
  ) => {
    const mapViewRef = useRef<Mapbox.MapView>(null);
    const cameraRef = useRef<Mapbox.Camera>(null);
    const isDarkMode = useIsDarkMode();
    // currentUserId を渡していいね状態も含めて取得
    const { data: spots = [] } = useSpots(mapId ?? '', currentUserId);
    // selectedSpotId を管理し、selectedSpot は spots から導出
    // これによりキャッシュの楽観的更新が自動的に反映される
    const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
    const selectedSpot = useMemo(
      () => spots.find((s) => s.id === selectedSpotId) ?? null,
      [spots, selectedSpotId]
    );
    const [isMapReady, setIsMapReady] = useState(false);
    // initialSpotIdがある場合は最初から詳細カードを開く
    const [isDetailCardOpen, setIsDetailCardOpen] = useState(!!initialSpotId);
    // カルーセルの表示状態（initialSpotIdがある場合は非表示）
    const [isCarouselVisible, setIsCarouselVisible] = useState(!initialSpotId);
    // カルーセルで現在フォーカスされているスポットID
    const [focusedSpotId, setFocusedSpotId] = useState<string | null>(null);

    const jumpToSpotId = useSelectedPlaceStore((state) => state.jumpToSpotId);
    const setJumpToSpotId = useSelectedPlaceStore((state) => state.setJumpToSpotId);

    // 初回カメラ移動済みフラグ（マップごとにリセット）
    const hasInitialCameraMoved = useRef(false);

    // マップの中心座標を保持（将来のピン刺し機能で使用予定）
    const [_centerCoords, setCenterCoords] = useState<{
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

    // マーカータップ時：カルーセルを表示してそのスポットにフォーカス
    const handleSpotSelect = (spot: SpotWithDetails | null) => {
      if (spot) {
        setFocusedSpotId(spot.id);
        setIsCarouselVisible(true);
        setIsDetailCardOpen(false);
        moveCameraToSingleSpot(spot);
      } else {
        setFocusedSpotId(null);
      }
    };

    // カルーセルでスワイプしてスポットにフォーカス（カメラ移動のみ）
    const handleCarouselSpotFocus = (spot: SpotWithDetails) => {
      setFocusedSpotId(spot.id);
      moveCameraToSingleSpot(spot);
    };

    // カルーセルでスポットカードをタップ（詳細カードを開く）
    const handleCarouselSpotPress = (spot: SpotWithDetails) => {
      setSelectedSpotId(spot.id);
      setFocusedSpotId(spot.id);
      setIsDetailCardOpen(true);
      moveCameraToSingleSpot(spot);
    };

    // 詳細カードを閉じる
    const handleDetailCardClose = () => {
      setSelectedSpotId(null);
      setIsDetailCardOpen(false);
      // ヘッダーを表示状態に戻す
      onDetailCardMaximized?.(false);
    };

    // スナップ変更時のハンドラー（snapIndex=2で最大化）
    const handleSnapChange = (snapIndex: number) => {
      onDetailCardMaximized?.(snapIndex === 2);
    };

    // マップのロード完了ハンドラー
    const handleMapReady = () => {
      setIsMapReady(true);
    };

    // mapIdが変更されたらスポット詳細カードを閉じる + カメラ移動フラグをリセット + カルーセル表示をリセット
    useEffect(() => {
      setSelectedSpotId(null);
      setIsCarouselVisible(true);
      hasInitialCameraMoved.current = false;
    }, [mapId]);

    // 新規登録したスポット or 発見タブからのジャンプ
    useEffect(() => {
      // console.log('🔍 [Jump useEffect] jumpToSpotId:', jumpToSpotId, 'spots:', spots.length, 'isMapReady:', isMapReady);
      if (!jumpToSpotId || !isMapReady) return;

      const spot = spots.find((s) => s.id === jumpToSpotId);
      if (spot) {
        // const spotName = spot.custom_name || spot.master_spot?.name || '不明';
        // console.log('📍 [Jump] スポットにジャンプ:', spotName);
        // 初回カメラ移動済みフラグを立てて全スポット表示をスキップ
        hasInitialCameraMoved.current = true;
        setTimeout(() => {
          moveCameraToSingleSpot(spot);
          // 詳細カードを開く（カルーセルは非表示）
          setSelectedSpotId(spot.id);
          setIsDetailCardOpen(true);
          setIsCarouselVisible(false);
        }, 100);
        setJumpToSpotId(null);
      } else {
        // console.log('⚠️ [Jump] スポットが見つかりません（spotsロード待ち）');
      }
    }, [jumpToSpotId, spots, isMapReady, moveCameraToSingleSpot, setJumpToSpotId]);

    // 全スポット表示（マップごとに初回のみ、jumpToSpotIdがない場合）
    useEffect(() => {
      // console.log('🔍 [All Spots useEffect]', {
      //   spotsLength: spots.length,
      //   isMapReady,
      //   hasInitialCameraMoved: hasInitialCameraMoved.current,
      //   jumpToSpotId,
      // });

      // jumpToSpotIdがある場合はジャンプ処理に任せる
      if (spots.length === 0 || !isMapReady || hasInitialCameraMoved.current || jumpToSpotId) {
        return;
      }

      setTimeout(() => {
        // console.log('📸 [All Spots] 全スポット表示');
        if (spots.length === 1) {
          moveCameraToSingleSpot(spots[0]!);
        } else {
          fitCameraToAllSpots(spots);
        }
        hasInitialCameraMoved.current = true;
      }, 100);
    }, [spots, isMapReady, jumpToSpotId, moveCameraToSingleSpot, fitCameraToAllSpots]);

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
          styleURL={isDarkMode ? ENV.MAPBOX_STYLE_URL_DARK : ENV.MAPBOX_STYLE_URL}
          localizeLabels={true}
          onCameraChanged={handleCameraChanged}
          onDidFinishLoadingMap={handleMapReady}
          scaleBarEnabled={false}
        >
          <Mapbox.Camera
            ref={cameraRef}
            zoomLevel={12}
            centerCoordinate={[139.7671, 35.6812]} // 東京
            animationDuration={0}
          />

          {/* 現在地マーカー（青い点） */}
          <Mapbox.UserLocation
            visible={true}
            showsUserHeadingIndicator={true}
            animated={true}
          />

          {/* スポットマーカー表示 */}
          {spots.map((spot) => {
            if (!spot.master_spot) return null;
            const spotName = spot.custom_name || spot.master_spot.name;
            const markerColor = isDarkMode ? colors.dark.foreground : colors.primary.light;
            const shadowColor = isDarkMode ? colors.black : colors.white;
            return (
              <Mapbox.MarkerView
                key={spot.id}
                id={spot.id}
                coordinate={[spot.master_spot.longitude, spot.master_spot.latitude]}
              >
                <Pressable
                  onPress={() => {
                    console.log('📍 スポット選択:', spotName);
                    handleSpotSelect(spot);
                  }}
                  className="flex-row items-center"
                >
                  <Ionicons name="location" size={32} color={markerColor} />
                  <Text
                    className="text-xs font-semibold"
                    style={{
                      color: markerColor,
                      textShadowColor: shadowColor,
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    }}
                    numberOfLines={1}
                  >
                    {spotName}
                  </Text>
                </Pressable>
              </Mapbox.MarkerView>
            );
          })}
        </Mapbox.MapView>

        {/* マップコントロールボタン（現在地ボタン・全スポット表示ボタン）
            カルーセルと詳細カードが両方非表示の時に表示 */}
        {viewMode === 'map' && !isSearchFocused && (!isCarouselVisible || spots.length === 0) && !isDetailCardOpen && (
          <View
            className="absolute right-6 z-50"
            style={{
              bottom: 48,
            }}
          >
            <LocationButton
              onPress={handleLocationPress}
              testID="location-button"
            />
            {/* 全スポット表示ボタン */}
            {spots.length > 0 && (
              <View className="mt-3">
                <FitAllButton
                  onPress={() => {
                    if (spots.length === 1) {
                      moveCameraToSingleSpot(spots[0]!);
                    } else {
                      fitCameraToAllSpots(spots);
                    }
                  }}
                  testID="fit-all-button"
                />
              </View>
            )}
          </View>
        )}

        {/* スポットカルーセル（詳細カードが開いていない時のみ表示） */}
        {viewMode === 'map' && !isSearchFocused && !isDetailCardOpen && isCarouselVisible && spots.length > 0 && (
          <SpotCarousel
            spots={spots}
            selectedSpotId={focusedSpotId}
            currentUserId={currentUserId}
            onSpotSelect={handleCarouselSpotFocus}
            onSpotPress={handleCarouselSpotPress}
            onClose={() => setIsCarouselVisible(false)}
          />
        )}

        {/* 選択されたスポットの詳細カード */}
        {selectedSpot && isDetailCardOpen && (
          <SpotDetailCard
            spot={selectedSpot}
            currentUserId={currentUserId}
            onClose={handleDetailCardClose}
            onSnapChange={handleSnapChange}
            onExpandedChange={onDetailCardMaximized}
            onEdit={onEditSpot}
            onSearchBarVisibilityChange={onDetailCardMaximized}
          />
        )}

      </View>
    );
  }
);

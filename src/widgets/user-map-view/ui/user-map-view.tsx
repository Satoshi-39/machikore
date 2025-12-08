/**
 * ユーザーマップビューWidget - Mapbox地図表示
 *
 * FSDの原則：Widget層は複合的なUIコンポーネント
 */

import { useMap } from '@/entities/map';
import { useSpots } from '@/entities/user-spot';
import type { MapListViewMode } from '@/features/toggle-view-mode';
import { useSelectedPlaceStore } from '@/features/search-places';
import { useSelectUserMapCard } from '@/features/select-user-map-card';
import { usePinDropStore, PinDropOverlay } from '@/features/drop-pin';
import { useMapLocation, type MapViewHandle } from '@/shared/lib/map';
import { useIsDarkMode } from '@/shared/lib/providers';
import { ENV, type UserMapThemeColor } from '@/shared/config';
import { LocationButton, FitAllButton } from '@/shared/ui';
import { SpotDetailCard } from './spot-detail-card';
import { UserSpotLabels } from './layers';
import { SpotCarousel } from '@/widgets/spot-carousel';
import Mapbox from '@rnmapbox/maps';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { View, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { useSpotCamera, useUserSpotsGeoJson } from '../model';

// 画面サイズと現在地ボタンの位置計算用定数
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const LOCATION_BUTTON_DEFAULT_BOTTOM = 48;
const LOCATION_BUTTON_CAROUSEL_OFFSET = 16; // カード上端からのオフセット

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
  /** ピン刺しモードで位置確定時のコールバック */
  onPinDropConfirm?: (location: { latitude: number; longitude: number }) => void;
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
      onPinDropConfirm,
    },
    ref
  ) => {
    const mapViewRef = useRef<Mapbox.MapView>(null);
    const cameraRef = useRef<Mapbox.Camera>(null);
    const isDarkMode = useIsDarkMode();
    // マップ情報を取得（テーマカラー用）
    const { data: mapData } = useMap(mapId);
    // currentUserId を渡していいね状態も含めて取得
    const { data: spots = [] } = useSpots(mapId ?? '', currentUserId);
    const [isMapReady, setIsMapReady] = useState(false);

    // スポットをGeoJSON形式に変換
    const spotsGeoJson = useUserSpotsGeoJson(spots);

    // スポットカメラ操作用フック
    const { moveCameraToSingleSpot, fitCameraToAllSpots } = useSpotCamera({
      cameraRef,
    });

    // 現在地ボタン・全スポットボタンの表示状態（アニメーション用）
    const controlButtonsOpacity = useSharedValue(1);
    // カード閉じる処理中フラグ（refで管理して即座に反映）
    const isClosingRef = useRef(false);

    // カード選択状態の管理
    const {
      selectedSpot,
      isDetailCardOpen,
      isCarouselVisible,
      focusedSpotId,
      handleSpotSelect,
      handleCarouselSpotFocus,
      handleCarouselSpotPress: baseHandleCarouselSpotPress,
      handleDetailCardClose: baseHandleDetailCardClose,
      closeCarousel,
      resetSelection,
      openSpotById,
    } = useSelectUserMapCard({
      spots,
      initialSpotId,
      moveCameraToSpot: moveCameraToSingleSpot,
      onDetailCardMaximized,
    });

    // カルーセルからカード表示時のラッパー（初回ちらつき防止）
    const handleCarouselSpotPress = useCallback(
      (spot: Parameters<typeof baseHandleCarouselSpotPress>[0]) => {
        // カード表示前にopacityを0にして、カード表示後にフェードインさせる
        controlButtonsOpacity.value = 0;
        baseHandleCarouselSpotPress(spot);
      },
      [baseHandleCarouselSpotPress, controlButtonsOpacity]
    );

    // 現在地ボタン・全スポットボタンのアニメーションスタイル
    const controlButtonsAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: controlButtonsOpacity.value,
      };
    });

    // 現在地ボタン・全スポットボタンを表示/非表示にする（アニメーション付き）
    const setControlButtonsVisible = useCallback((visible: boolean) => {
      controlButtonsOpacity.value = withTiming(visible ? 1 : 0, { duration: 150 });
    }, [controlButtonsOpacity]);

    const jumpToSpotId = useSelectedPlaceStore((state) => state.jumpToSpotId);
    const setJumpToSpotId = useSelectedPlaceStore((state) => state.setJumpToSpotId);

    // 初回カメラ移動済みフラグ（マップごとにリセット）
    const hasInitialCameraMoved = useRef(false);

    // マップの中心座標を保持（ピン刺し機能で使用）
    const [centerCoords, setCenterCoords] = useState<{
      latitude: number;
      longitude: number;
    }>({
      latitude: 35.6812,
      longitude: 139.7671,
    });

    // ピン刺しモードのストア
    const isPinDropMode = usePinDropStore((state) => state.isActive);
    const endPinDropMode = usePinDropStore((state) => state.endPinDropMode);

    // ピン刺しモード開始時にカルーセル/詳細カードを閉じる
    useEffect(() => {
      if (isPinDropMode) {
        closeCarousel();
        if (isDetailCardOpen) {
          baseHandleDetailCardClose();
        }
      }
    }, [isPinDropMode, closeCarousel, isDetailCardOpen, baseHandleDetailCardClose]);

    // ピン刺し確定時のハンドラー
    const handlePinDropConfirm = useCallback(() => {
      endPinDropMode();
      onPinDropConfirm?.(centerCoords);
    }, [endPinDropMode, onPinDropConfirm, centerCoords]);

    // ピン刺しキャンセル時のハンドラー
    const handlePinDropCancel = useCallback(() => {
      endPinDropMode();
    }, [endPinDropMode]);

    // マップ操作用フック
    const { flyToLocation, handleLocationPress } = useMapLocation({
      cameraRef,
      currentLocation,
    });

    // 詳細カードを閉じる → カルーセルに戻る（閉じるフラグのリセットを追加）
    const handleDetailCardClose = useCallback(() => {
      isClosingRef.current = false;
      baseHandleDetailCardClose();
    }, [baseHandleDetailCardClose]);

    // 現在地ボタン表示/非表示のコールバック（高さベースの判定）
    // 閉じる処理中は無視（refで即座に判定）
    const handleLocationButtonVisibilityChange = useCallback((isVisible: boolean) => {
      if (isClosingRef.current) return;
      setControlButtonsVisible(isVisible);
    }, [setControlButtonsVisible]);

    // カード閉じる前のコールバック（閉じるフラグを立ててボタンを非表示）
    const handleBeforeClose = useCallback(() => {
      isClosingRef.current = true;
      setControlButtonsVisible(false);
    }, [setControlButtonsVisible]);

    // スナップ変更時のハンドラー（snapIndex=2で最大化）
    // snapIndex: 0=小(15%), 1=中(45%), 2=大(90%)
    const handleSnapChange = (snapIndex: number) => {
      onDetailCardMaximized?.(snapIndex === 2);
    };

    // マップのロード完了ハンドラー
    const handleMapReady = () => {
      setIsMapReady(true);
    };

    // スポットマーカータップ時のハンドラー
    const handleSpotPress = (event: any) => {
      const feature = event.features?.[0];
      if (!feature) return;

      const spotId = feature.properties?.id;
      if (spotId) {
        const spot = spots.find((s) => s.id === spotId);
        if (spot) {
          handleSpotSelect(spot);
        }
      }
    };

    // mapIdが変更されたらスポット詳細カードを閉じる + カメラ移動フラグをリセット + カルーセル表示をリセット
    useEffect(() => {
      resetSelection();
      hasInitialCameraMoved.current = false;
    }, [mapId, resetSelection]);

    // 新規登録したスポット or 発見タブからのジャンプ
    useEffect(() => {
      if (!jumpToSpotId || !isMapReady) return;

      const spot = spots.find((s) => s.id === jumpToSpotId);
      if (spot) {
        // 初回カメラ移動済みフラグを立てて全スポット表示をスキップ
        hasInitialCameraMoved.current = true;
        setTimeout(() => {
          moveCameraToSingleSpot(spot);
          // 詳細カードを開く（カルーセルは非表示）
          openSpotById(spot.id);
        }, 100);
        setJumpToSpotId(null);
      }
    }, [jumpToSpotId, spots, isMapReady, moveCameraToSingleSpot, openSpotById, setJumpToSpotId]);

    // 全スポット表示（マップごとに初回のみ、jumpToSpotIdがない場合）
    useEffect(() => {
      // jumpToSpotIdがある場合はジャンプ処理に任せる
      if (spots.length === 0 || !isMapReady || hasInitialCameraMoved.current || jumpToSpotId) {
        return;
      }

      setTimeout(() => {
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

          {/* スポットラベルレイヤー（マップのテーマカラーを使用） */}
          <UserSpotLabels
            geoJson={spotsGeoJson}
            onPress={handleSpotPress}
            themeColor={mapData?.theme_color as UserMapThemeColor}
          />
        </Mapbox.MapView>

        {/* マップコントロールボタン（現在地ボタン・全スポット表示ボタン）
            - カルーセル表示中 → 非表示
            - カルーセル非表示かつ詳細カード非表示 → 通常位置で表示
            - 詳細カード「小」→ カード上に表示、「中」「大」→ フェードアウト */}
        {viewMode === 'map' && !isSearchFocused && !(isCarouselVisible && spots.length > 0) && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                right: 24,
                zIndex: 50,
                bottom: isDetailCardOpen
                  ? SCREEN_HEIGHT * 0.15 + LOCATION_BUTTON_CAROUSEL_OFFSET // 詳細カード「小」の上
                  : LOCATION_BUTTON_DEFAULT_BOTTOM, // 通常位置
              },
              isDetailCardOpen ? controlButtonsAnimatedStyle : {},
            ]}
            pointerEvents={isDetailCardOpen && controlButtonsOpacity.value === 0 ? 'none' : 'auto'}
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
          </Animated.View>
        )}

        {/* スポットカルーセル（詳細カードが開いていない時のみ表示） */}
        {viewMode === 'map' && !isSearchFocused && !isDetailCardOpen && isCarouselVisible && spots.length > 0 && (
          <SpotCarousel
            spots={spots}
            selectedSpotId={focusedSpotId}
            currentUserId={currentUserId}
            onSpotSelect={handleCarouselSpotFocus}
            onSpotPress={handleCarouselSpotPress}
            onClose={closeCarousel}
            themeColor={mapData?.theme_color as UserMapThemeColor}
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
            onBeforeClose={handleBeforeClose}
            onLocationButtonVisibilityChange={handleLocationButtonVisibilityChange}
            themeColor={mapData?.theme_color as UserMapThemeColor}
          />
        )}

        {/* ピン刺しモードのオーバーレイ */}
        {isPinDropMode && mapData && (
          <PinDropOverlay
            onConfirm={handlePinDropConfirm}
            onCancel={handlePinDropCancel}
            themeColor={mapData.theme_color as UserMapThemeColor}
          />
        )}

      </View>
    );
  }
);

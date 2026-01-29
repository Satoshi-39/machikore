/**
 * ユーザーマップビューWidget - Mapbox地図表示
 *
 * FSDの原則：Widget層は複合的なUIコンポーネント
 */

import { PinDropOverlay, usePinDropStore } from '@/features/drop-pin';
import { LabelChipsBar } from '@/features/filter-by-label';
import { useMapUIMode } from '@/features/map-controls';
import { useSelectUserMapCard } from '@/features/select-user-map-card';
import type { MapListViewMode } from '@/features/toggle-view-mode';
import { ENV } from '@/shared/config';
import { useMapLocation, type MapViewHandle } from '@/shared/lib/map';
import { useIsDarkMode } from '@/shared/lib/providers';
import { FitAllButton, LocationButton } from '@/shared/ui';
import Mapbox from '@rnmapbox/maps';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePinDropAutoCancel, useSpotCamera, useUserMapData } from '../model';
import { UserMapLabels } from './layers';
import { SpotCarousel } from './spot-carousel';
import { SpotDetailCard } from './spot-detail-card';

interface DeleteSpotContext {
  isPublic?: boolean;
  publicSpotsCount?: number;
}

interface UserMapViewProps {
  mapId: string | null;
  userId?: string | null;
  currentUserId?: string | null;
  defaultMapId?: string | null;
  /** 初期表示するスポットID（ページ遷移時に使用、カルーセルを非表示にして詳細カードを開く） */
  initialSpotId?: string | null;
  /** 詳細カードが最大化されている時に呼ばれる（ヘッダー非表示用） */
  onDetailCardMaximized?: (isMaximized: boolean) => void;
  /** 詳細カードが最大化されているか（ラベルチップ非表示用） */
  isDetailCardMaximized?: boolean;
  currentLocation?: { latitude: number; longitude: number } | null;
  viewMode?: MapListViewMode;
  isSearchFocused?: boolean;
  onEditSpot?: (spotId: string) => void;
  onDeleteSpot?: (spotId: string, context?: DeleteSpotContext) => void;
  /** ピン刺しモードで位置確定時のコールバック */
  onPinDropConfirm?: (location: {
    latitude: number;
    longitude: number;
  }) => void;
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
      isDetailCardMaximized = false,
      currentLocation = null,
      viewMode = 'map',
      isSearchFocused = false,
      onEditSpot,
      onDeleteSpot,
      onPinDropConfirm,
    },
    ref
  ) => {
    const mapViewRef = useRef<Mapbox.MapView>(null);
    const cameraRef = useRef<Mapbox.Camera>(null);
    const isDarkMode = useIsDarkMode();
    const insets = useSafeAreaInsets();
    const [isMapReady, setIsMapReady] = useState(false);
    // 初回全スポット表示が完了したかどうか（spots更新時の再実行を防止）
    const hasInitialFitDoneRef = useRef(false);

    // マップデータ取得（スポット、交通データ、都市データ、都道府県データ）
    const {
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
      handleCameraChanged,
      centerCoords,
    } = useUserMapData({ mapId, currentUserId });

    // 公開スポット数（最後のスポット削除時の警告用）
    const publicSpotsCount = React.useMemo(
      () => spots.filter((s) => s.is_public).length,
      [spots]
    );

    // スポットカメラ操作用フック
    const { moveCameraToSingleSpot, fitCameraToAllSpots } = useSpotCamera({
      cameraRef,
    });

    // マップUIモード管理（現在地ボタンの位置とopacityを一元管理）
    // useSelectUserMapCardより先に定義（onBeforeCardOpenで使用するため）
    const mapUIMode = useMapUIMode({
      isDetailCardOpen: false, // 初期値、後で更新される
      isCarouselVisible: true,
      hasSpots: spots.length > 0,
    });

    // カード選択状態の管理（スポット選択ロジックを一元管理）
    const {
      selectedSpot,
      isDetailCardOpen,
      isCarouselVisible,
      focusedSpotId,
      handleSpotSelect,
      handleCarouselSpotFocus,
      handleCameraMove,
      handleCarouselSpotPress,
      handleDetailCardClose,
      closeCarousel,
      openCarousel,
      resetSelection,
      resetInitialCameraFlag,
      hasInitialCameraMoved,
    } = useSelectUserMapCard({
      spots,
      initialSpotId,
      isMapReady,
      moveCameraToSpot: moveCameraToSingleSpot,
      onDetailCardMaximized,
      onBeforeCardOpen: mapUIMode.handleCardOpen,
    });

    // マップUIモードを実際の状態で更新
    // initialSpotIdがある場合は最初から現在地ボタンを非表示にする（ちらつき防止）
    const actualMapUIMode = useMapUIMode({
      isDetailCardOpen,
      isCarouselVisible,
      hasSpots: spots.length > 0,
      initiallyHidden: !!initialSpotId,
    });

    // ピン刺しモードのストア
    const isPinDropMode = usePinDropStore((state) => state.isActive);
    const endPinDropMode = usePinDropStore((state) => state.endPinDropMode);

    // ページがフォーカスを失った時にピン刺しモードを自動キャンセル
    usePinDropAutoCancel();

    // ピン刺しモード開始時にカルーセル/詳細カードを閉じる
    useEffect(() => {
      if (isPinDropMode) {
        closeCarousel();
        if (isDetailCardOpen) {
          handleDetailCardClose();
        }
      }
    }, [isPinDropMode, closeCarousel, isDetailCardOpen, handleDetailCardClose]);

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

    // スナップ変更時のハンドラー（useMapUIModeに委譲 + 親への通知）
    const handleSnapChange = useCallback(
      (snapIndex: number) => {
        actualMapUIMode.handleSnapChange(snapIndex);
        onDetailCardMaximized?.(snapIndex === 2);
      },
      [actualMapUIMode, onDetailCardMaximized]
    );

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

    // mapIdが変更されたらリセット
    useEffect(() => {
      if (!initialSpotId) {
        resetSelection();
      }
      resetInitialCameraFlag();
      resetLabelFilter();
      hasInitialFitDoneRef.current = false;
    }, [mapId, initialSpotId, resetSelection, resetInitialCameraFlag, resetLabelFilter]);

    // 全スポット表示（マップごとに初回のみ、initialSpotIdやjumpToSpotIdがない場合）
    useEffect(() => {
      if (
        spots.length === 0 ||
        !isMapReady ||
        hasInitialCameraMoved ||
        hasInitialFitDoneRef.current ||
        initialSpotId
      ) {
        return;
      }

      hasInitialFitDoneRef.current = true;

      setTimeout(() => {
        if (spots.length === 1) {
          moveCameraToSingleSpot(spots[0]!);
        } else {
          fitCameraToAllSpots(spots);
        }
      }, 100);
    }, [
      spots,
      isMapReady,
      hasInitialCameraMoved,
      initialSpotId,
      moveCameraToSingleSpot,
      fitCameraToAllSpots,
    ]);

    // 外部から呼び出せるメソッドを公開
    useImperativeHandle(ref, () => ({
      flyToLocation,
    }));

    return (
      <View className="flex-1">
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

          {/* ユーザマップ専用の統合ラベルレイヤー（スポット+交通データ+地名） */}
          <UserMapLabels
            spotsGeoJson={spotsGeoJson}
            transportGeoJson={transportHubsGeoJson}
            prefecturesGeoJson={prefecturesGeoJson}
            citiesGeoJson={citiesGeoJson}
            onSpotPress={handleSpotPress}
            selectedSpotId={selectedSpot?.id}
            focusedSpotId={focusedSpotId}
          />
        </Mapbox.MapView>

        {/* ラベルチップバー（今後のリリースで有効化予定） */}
        {/* {mapData?.show_label_chips &&
          mapLabels.length > 0 &&
          !isSearchFocused &&
          !isDetailCardMaximized && (
            <View
              className="absolute left-0 right-0"
              style={{ top: insets.top + 80 }}
            >
              <LabelChipsBar
                labels={mapLabels}
                selectedLabelId={selectedLabelId}
                onLabelSelect={setSelectedLabelId}
              />
            </View>
          )} */}

        {/* 全スポット表示ボタン */}
        {viewMode === 'map' &&
          !isSearchFocused &&
          !isDetailCardMaximized &&
          filteredSpots.length > 0 && (
            <View
              className="absolute"
              style={{
                top:
                  insets.top +
                  (mapData?.show_label_chips && mapLabels.length > 0
                    ? 120
                    : 90),
                right: 16,
                zIndex: 50,
              }}
            >
              <FitAllButton
                onPress={() => {
                  if (filteredSpots.length === 1) {
                    moveCameraToSingleSpot(filteredSpots[0]!);
                  } else {
                    fitCameraToAllSpots(filteredSpots);
                  }
                  openCarousel();
                }}
                testID="fit-all-button"
              />
            </View>
          )}

        {/* 現在地ボタン */}
        {viewMode === 'map' &&
          !isSearchFocused &&
          actualMapUIMode.shouldShowLocationButton && (
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  right: 24,
                  zIndex: 50,
                  bottom: actualMapUIMode.locationButtonBottom,
                },
                actualMapUIMode.locationButtonAnimatedStyle,
              ]}
              pointerEvents={
                actualMapUIMode.isLocationButtonTouchable ? 'auto' : 'none'
              }
            >
              <LocationButton
                onPress={handleLocationPress}
                testID="location-button"
              />
            </Animated.View>
          )}

        {/* スポットカルーセル */}
        {viewMode === 'map' &&
          !isSearchFocused &&
          !isDetailCardOpen &&
          isCarouselVisible &&
          filteredSpots.length > 0 && (
            <SpotCarousel
              spots={filteredSpots}
              selectedSpotId={focusedSpotId}
              currentUserId={currentUserId}
              onSpotFocus={handleCarouselSpotFocus}
              onSpotSelect={handleCarouselSpotFocus}
              onSpotPress={handleCarouselSpotPress}
              onCameraMove={handleCameraMove}
              onEdit={onEditSpot}
              onDelete={onDeleteSpot}
              onClose={closeCarousel}
              publicSpotsCount={publicSpotsCount}
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
            onDelete={onDeleteSpot}
            onSearchBarVisibilityChange={onDetailCardMaximized}
            onBeforeClose={actualMapUIMode.handleBeforeCardClose}
            onLocationButtonVisibilityChange={
              actualMapUIMode.handleLocationButtonVisibilityChange
            }
            onCameraMove={() => handleCameraMove(selectedSpot)}
            publicSpotsCount={publicSpotsCount}
          />
        )}

        {/* ピン刺しモードのオーバーレイ */}
        {isPinDropMode && mapData && (
          <PinDropOverlay
            onConfirm={handlePinDropConfirm}
            onCancel={handlePinDropCancel}
          />
        )}
      </View>
    );
  }
);

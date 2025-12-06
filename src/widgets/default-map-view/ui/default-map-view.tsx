/**
 * デフォルトマップビューWidget - マスターデータのmachi表示
 */

import React, { useRef, useImperativeHandle, forwardRef, useMemo, useCallback, useState } from 'react';
import { View, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Mapbox from '@rnmapbox/maps';
import { useMachi, useMachiGeoJson } from '@/entities/machi';
import { useVisits } from '@/entities/visit';
import { useMasterSpotsByBounds, useMasterSpotsGeoJson } from '@/entities/master-spot';
import { useMapJump } from '@/features/map-jump';
import { usePrefectures, usePrefecturesGeoJson } from '@/entities/prefecture';
import { useCities, useCitiesGeoJson } from '@/entities/city';
import { AsyncBoundary, LocationButton } from '@/shared/ui';
import { MapSearchBar } from '@/features/search-places';
import { useMapLocation, type MapViewHandle } from '@/shared/lib/map';
import { ENV } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { MachiDetailCard } from './machi-detail-card';
import { PrefectureLabels, CityLabels, MachiLabels, SpotLabels } from './layers';
import { CountryLabels } from './layers/country-labels';
import { useCountriesGeoJson } from '@/entities/country/model';
import { getCountriesData } from '@/shared/lib/utils/countries.utils';
import { useBoundsManagement } from '../model';
import type { MachiRow } from '@/shared/types/database.types';
import type { MasterSpotDisplay } from '@/shared/api/supabase/master-spots';
import type { MapListViewMode } from '@/features/toggle-view-mode';
import { QuickSearchButtons, type VisitFilter } from '@/features/quick-search-buttons';
import { MasterSpotDetailCard } from '@/widgets/master-spot-detail-card';
import { CityDetailCard } from '@/widgets/city-detail-card';
import { useMapControlsVisibility } from '@/features/map-controls';
import { useSelectDefaultMapCard } from '@/features/select-default-map-card';

// 画面サイズと現在地ボタンの位置計算用定数
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const LOCATION_BUTTON_DEFAULT_BOTTOM = 48;
const CARD_SMALL_HEIGHT = SCREEN_HEIGHT * 0.15; // カード「小」の高さ
const LOCATION_BUTTON_CARD_OFFSET = 16; // カード上端からのオフセット

interface DefaultMapViewProps {
  userId?: string | null;
  currentLocation?: { latitude: number; longitude: number } | null;
  onMachiDetailSnapChange?: (snapIndex: number) => void;
  onCityDetailSnapChange?: (snapIndex: number) => void;
  onSpotDetailSnapChange?: (snapIndex: number) => void;
  viewMode?: MapListViewMode;
  onViewModeChange?: (mode: MapListViewMode) => void;
  onSearchFocus?: () => void;
  onQuickSearch?: (query: string) => void; // クイック検索
  isSearchFocused?: boolean;
}

export const DefaultMapView = forwardRef<MapViewHandle, DefaultMapViewProps>(
  ({ userId = null, currentLocation = null, onMachiDetailSnapChange, onCityDetailSnapChange, onSpotDetailSnapChange, viewMode = 'map', onViewModeChange, onSearchFocus, onQuickSearch, isSearchFocused = false }, ref) => {
    const insets = useSafeAreaInsets();
    const isDarkMode = useIsDarkMode();
    const { data: machiData, isLoading, error } = useMachi();
    const { data: visits = [] } = useVisits(userId ?? '');
    const { data: prefectures = [] } = usePrefectures();
    const { data: cities = [] } = useCities();
    const [visitFilter, setVisitFilter] = useState<VisitFilter>('all');
    const cameraRef = useRef<Mapbox.Camera>(null);

    // 検索バーの表示状態
    const [isSearchBarHidden, setIsSearchBarHidden] = useState(false);
    // カード閉じる処理完了のコールバック（refで保持して循環参照を回避）
    const resetClosingStateRef = useRef<() => void>(() => {});

    // カード選択状態の管理
    const {
      selectedMachi,
      selectedCity,
      selectedSpot,
      handleMachiSelect,
      handleCitySelect,
      handleSpotSelect,
      clearAllSelections,
      hasCard,
    } = useSelectDefaultMapCard({
      showSearchBar: () => setIsSearchBarHidden(false),
      onCloseComplete: () => resetClosingStateRef.current(),
    });

    // マップコントロールの表示制御（現在地ボタン）
    const controlsVisibility = useMapControlsVisibility({ hasCard });

    // resetClosingStateをrefに設定
    resetClosingStateRef.current = controlsVisibility.resetClosingState;

    // 画面がフォーカスされた時に選択状態をリセット
    useFocusEffect(
      useCallback(() => {
        // ジャンプ完了から500ms以内はリセットしない
        const timeSinceLastJump = Date.now() - lastJumpTimeRef.current;
        if (timeSinceLastJump < 500) {
          return;
        }
        clearAllSelections();
      }, [clearAllSelections])
    );

    // ビューポート範囲管理
    const { bounds, handleCameraChanged } = useBoundsManagement({ currentLocation });

    // ビューポート範囲内のmaster_spotsを取得
    const { data: masterSpots = [] } = useMasterSpotsByBounds(bounds);

    // マップ操作用フック
    const { flyToLocation, handleLocationPress } = useMapLocation({
      cameraRef,
      currentLocation,
    });

    // マップジャンプフック（検索結果からのジャンプ処理）
    const { lastJumpTimeRef } = useMapJump({
      cameraRef,
      onMachiSelect: handleMachiSelect,
      onCitySelect: handleCitySelect,
      onSpotSelect: handleSpotSelect,
    });

    // スナップ変更を親に通知
    // snapIndex: 0=小(15%), 1=中(45%), 2=大(90%)
    const handleSnapChange = (snapIndex: number) => {
      onMachiDetailSnapChange?.(snapIndex);
    };

    // 市区カードのスナップ変更
    const handleCitySnapChange = (snapIndex: number) => {
      onCityDetailSnapChange?.(snapIndex);
    };

    // スポットカードのスナップ変更
    const handleSpotSnapChange = (snapIndex: number) => {
      onSpotDetailSnapChange?.(snapIndex);
    };

    // 訪問済みmachiのIDセットを作成
    const visitedMachiIds = useMemo(
      () => new Set(visits.map((visit) => visit.machi_id)),
      [visits]
    );

    // MachiRowのマップを作成（IDからMachiRowへの変換用）
    const machiMap = useMemo(() => {
      if (!machiData) return new Map<string, MachiRow>();
      return new Map(machiData.map((machi) => [machi.id, machi]));
    }, [machiData]);

    // CityRowのマップを作成（IDからCityRowへの変換用）
    const cityMap = useMemo(() => {
      return new Map(cities.map((city) => [city.id, city]));
    }, [cities]);

    // MasterSpotDisplayのマップを作成（IDからMasterSpotDisplayへの変換用）
    const masterSpotMap = useMemo(() => {
      if (!masterSpots) return new Map<string, MasterSpotDisplay>();
      return new Map(masterSpots.map((spot) => [spot.id, spot]));
    }, [masterSpots]);

    // 国データを取得
    const countries = useMemo(() => getCountriesData(), []);

    // フィルタリングされたmachiDataを生成
    const filteredMachiData = useMemo(() => {
      if (!machiData) return null;
      if (visitFilter === 'all') return machiData;
      if (visitFilter === 'visited') {
        return machiData.filter((machi) => visitedMachiIds.has(machi.id));
      }
      if (visitFilter === 'not_visited') {
        return machiData.filter((machi) => !visitedMachiIds.has(machi.id));
      }
      return machiData;
    }, [machiData, visitFilter, visitedMachiIds]);

    // GeoJSON データ生成
    const machiGeoJson = useMachiGeoJson(filteredMachiData ?? undefined, visitedMachiIds);
    const masterSpotsGeoJson = useMasterSpotsGeoJson(masterSpots);
    const prefecturesGeoJson = usePrefecturesGeoJson(prefectures);
    const citiesGeoJson = useCitiesGeoJson(cities);
    const countriesGeoJson = useCountriesGeoJson(countries);


    // 街マーカータップ時のハンドラー
    const handleMarkerPress = (event: any) => {
      const feature = event.features?.[0];
      if (!feature) return;

      const machiId = feature.properties?.id;
      if (machiId) {
        const machi = machiMap.get(machiId);
        if (machi) {
          handleMachiSelect(machi);
        }
      }
    };

    // 市区マーカータップ時のハンドラー
    const handleCityPress = (event: any) => {
      const feature = event.features?.[0];
      if (!feature) return;

      const cityId = feature.properties?.id;
      if (cityId) {
        const city = cityMap.get(cityId);
        if (city) {
          handleCitySelect(city);
        }
      }
    };

    // スポットマーカータップ時のハンドラー
    const handleSpotPress = (event: any) => {
      const feature = event.features?.[0];
      if (!feature) return;

      const spotId = feature.properties?.id;
      if (spotId) {
        const spot = masterSpotMap.get(spotId);
        if (spot) {
          handleSpotSelect(spot);
        }
      }
    };

    // 初期カメラ位置を計算
    const initialCenter = currentLocation
      ? [currentLocation.longitude, currentLocation.latitude]
      : [139.7671, 35.6812]; // フォールバック: 東京駅付近

  // 外部から呼び出せるメソッドを公開
  useImperativeHandle(ref, () => ({
    flyToLocation,
  }));

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      data={machiData}
      loadingMessage="マップを読み込み中..."
      emptyMessage="街データがありません"
      emptyIcon="🗺️"
    >
      {() => (
        <View style={{ flex: 1 }}>
          <Mapbox.MapView
            style={{ flex: 1 }}
            styleURL={isDarkMode ? ENV.MAPBOX_STYLE_URL_DARK : ENV.MAPBOX_STYLE_URL}
            onCameraChanged={handleCameraChanged}
            scaleBarEnabled={false}
          >
            <Mapbox.Camera
              ref={cameraRef}
              zoomLevel={currentLocation ? 14 : 10} // 現在地があれば詳細レベル
              centerCoordinate={initialCenter as [number, number]}
              animationDuration={0}
            />

            {/* 現在地マーカー（青い点） */}
            <Mapbox.UserLocation
              visible={true}
              showsUserHeadingIndicator={true}
              animated={true}
            />

            {/* フィルター中は他のレイヤーを非表示 */}
            {visitFilter === 'all' && (
              <>
                {/* 国ラベル表示（テキストのみ）- ズーム0-5で表示 */}
                <CountryLabels geoJson={countriesGeoJson} />

                {/* 都道府県ラベル表示（テキストのみ）- ズーム5-10で表示 */}
                <PrefectureLabels geoJson={prefecturesGeoJson} />

                {/* 市区ラベル表示（テキストのみ）- ズーム10-12で表示 */}
                <CityLabels geoJson={citiesGeoJson} onPress={handleCityPress} />

                {/* スポットマーカー表示（ラベルのみ、カテゴリ別色分け）- ズーム13以上で表示 */}
                <SpotLabels geoJson={masterSpotsGeoJson} onPress={handleSpotPress} />
              </>
            )}

            {/* 街マーカー表示（アイコン + ラベル）- ズーム12以上で表示 */}
            <MachiLabels
              geoJson={machiGeoJson}
              onPress={handleMarkerPress}
              visitFilter={visitFilter}
            />
          </Mapbox.MapView>

          {/* 検索バー + ViewModeToggle */}
          {viewMode === 'map' && !isSearchFocused && onViewModeChange && onSearchFocus && (
            <View
              className="absolute top-0 left-0 right-0"
              style={{
                paddingTop: insets.top,
                opacity: isSearchBarHidden ? 0 : 1,
              }}
              pointerEvents={isSearchBarHidden ? 'none' : 'auto'}
            >
              <MapSearchBar
                viewMode={viewMode}
                onViewModeChange={onViewModeChange}
                onFocus={onSearchFocus}
                showIcon={true}
                placeholder="スポットを検索"
              />
              {/* クイック検索/フィルタリングボタン */}
              <View className="mt-4">
                <QuickSearchButtons
                  activeFilter={visitFilter}
                  onFilterChange={setVisitFilter}
                  onCategoryPress={onQuickSearch}
                />
              </View>
            </View>
          )}

          {/* マップコントロールボタン（現在地ボタン） */}
          {/* カードなし → 通常位置、カード「小」→ カード上、中/大 → フェードアウト */}
          {viewMode === 'map' && !isSearchFocused && (
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  right: 24,
                  zIndex: 50,
                  // カード表示中はカードの上、それ以外は通常位置
                  bottom: hasCard
                    ? CARD_SMALL_HEIGHT + LOCATION_BUTTON_CARD_OFFSET
                    : LOCATION_BUTTON_DEFAULT_BOTTOM,
                },
                controlsVisibility.controlButtonsAnimatedStyle,
              ]}
              pointerEvents={controlsVisibility.controlButtonsOpacity.value === 0 ? 'none' : 'auto'}
            >
              <LocationButton
                onPress={handleLocationPress}
                testID="location-button"
              />
            </Animated.View>
          )}

          {/* 選択された街の詳細カード */}
          {selectedMachi && (
            <MachiDetailCard
              machi={selectedMachi}
              onClose={() => handleMachiSelect(null)}
              onSnapChange={handleSnapChange}
              onSearchBarVisibilityChange={setIsSearchBarHidden}
              onBeforeClose={controlsVisibility.handleBeforeClose}
              onLocationButtonVisibilityChange={controlsVisibility.handleControlButtonsVisibilityChange}
            />
          )}

          {/* 選択された市区の詳細カード */}
          {selectedCity && (
            <CityDetailCard
              city={selectedCity}
              onClose={() => handleCitySelect(null)}
              onSnapChange={handleCitySnapChange}
              onSearchBarVisibilityChange={setIsSearchBarHidden}
              onBeforeClose={controlsVisibility.handleBeforeClose}
              onLocationButtonVisibilityChange={controlsVisibility.handleControlButtonsVisibilityChange}
            />
          )}

          {/* 選択されたスポットの詳細カード */}
          {selectedSpot && (
            <MasterSpotDetailCard
              spot={selectedSpot}
              onClose={() => handleSpotSelect(null)}
              onSnapChange={handleSpotSnapChange}
              onSearchBarVisibilityChange={setIsSearchBarHidden}
              onBeforeClose={controlsVisibility.handleBeforeClose}
              onLocationButtonVisibilityChange={controlsVisibility.handleControlButtonsVisibilityChange}
            />
          )}
        </View>
      )}
    </AsyncBoundary>
    );
  }
);

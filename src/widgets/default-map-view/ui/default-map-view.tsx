/**
 * デフォルトマップビューWidget - マスターデータのmachi表示
 */

import React, { useRef, useImperativeHandle, forwardRef, useMemo, useCallback, useState } from 'react';
import { View, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Mapbox from '@rnmapbox/maps';
import { useMachiByBounds, useMachiGeoJson } from '@/entities/machi';
import { useVisits } from '@/entities/visit';
import { useMasterSpotsByBounds, useMasterSpotsGeoJson, useUserFavoriteMasterSpotIds } from '@/entities/master-spot';
import { useTransportHubsByBounds, useTransportHubsGeoJson } from '@/entities/transport-hub';
import { useMapJump } from '@/features/map-jump';
import { usePrefectures, usePrefecturesGeoJson } from '@/entities/prefecture';
import { useCitiesByBounds, useCitiesGeoJson } from '@/entities/city';
import { LocationButton, SelectedLocationButton } from '@/shared/ui';
import { useMapLocation, type MapViewHandle } from '@/shared/lib/map';
import { ENV, MAP_ZOOM } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { MachiDetailCard } from './machi-detail-card';
import { PrefectureLabels, RegionLabels, CityLabels, MachiLabels, MachiSpotTransportLabels, SpotLabels } from './layers';
import { CountryLabels } from './layers/country-labels';
import { useRegionsGeoJson } from '@/entities/region';
import { useCountriesGeoJson } from '@/entities/country/model';
import { getCountriesData } from '@/shared/lib/utils/countries.utils';
import { getRegionsData } from '@/shared/lib/utils/regions.utils';
import { useBoundsManagement, useCenterLocationName } from '../model';
import { DefaultMapHeader } from './default-map-header';
import { CountryDetailCard } from './country-detail-card';
import { RegionDetailCard } from './region-detail-card';
import { PrefectureDetailCard } from './prefecture-detail-card';
import type { MachiRow, CityRow, PrefectureRow, RegionRow, CountryRow } from '@/shared/types/database.types';
import type { MasterSpotDisplay } from '@/shared/api/supabase/master-spots';
import type { MapListViewMode } from '@/features/toggle-view-mode';
import { QuickSearchButtons, type VisitFilter } from '@/features/quick-search-buttons';
import { MasterSpotDetailCard } from './master-spot-detail-card';
import { CityDetailCard } from './city-detail-card';
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
  /** 戻るボタンを表示するか */
  showBackButton?: boolean;
  /** 戻るボタン押下時 */
  onBackPress?: () => void;
}

export const DefaultMapView = forwardRef<MapViewHandle, DefaultMapViewProps>(
  ({ userId = null, currentLocation = null, onMachiDetailSnapChange, onCityDetailSnapChange, onSpotDetailSnapChange, viewMode = 'map', onViewModeChange: _onViewModeChange, onSearchFocus, onQuickSearch, isSearchFocused = false, showBackButton = false, onBackPress }, ref) => {
    const insets = useSafeAreaInsets();
    const isDarkMode = useIsDarkMode();
    const { data: visits = [] } = useVisits(userId ?? '');
    const { data: prefectures = [] } = usePrefectures();
    const { data: favoriteMasterSpotIds = [] } = useUserFavoriteMasterSpotIds(userId);
    const [visitFilter, setVisitFilter] = useState<VisitFilter>('all');
    const cameraRef = useRef<Mapbox.Camera>(null);

    // ビューポート範囲管理（先に定義してcameraStateを取得）
    const { bounds, cameraState, handleCameraChanged } = useBoundsManagement({ currentLocation });

    // マップ境界でmachi/cities/transportHubsを取得（タイルベース）
    const { data: machiData } = useMachiByBounds({ bounds, zoom: cameraState.zoom });
    const { data: cities = [] } = useCitiesByBounds({ bounds, zoom: cameraState.zoom });
    const { data: transportHubs = [] } = useTransportHubsByBounds({ bounds, zoom: cameraState.zoom });

    // 検索バーの表示状態
    const [isSearchBarHidden, setIsSearchBarHidden] = useState(false);
    // コールバックをrefで保持して循環参照を回避
    const resetClosingStateRef = useRef<() => void>(() => {});
    const handleCardOpenRef = useRef<() => void>(() => {});

    // カード選択状態の管理
    const {
      selectedCountry,
      selectedRegion,
      selectedPrefecture,
      selectedMachi,
      selectedCity,
      selectedSpot,
      handleCountrySelect,
      handleRegionSelect,
      handlePrefectureSelect,
      handleMachiSelect,
      handleCitySelect,
      handleSpotSelect,
      clearAllSelections,
      hasCard,
    } = useSelectDefaultMapCard({
      showSearchBar: () => setIsSearchBarHidden(false),
      onCloseComplete: () => resetClosingStateRef.current(),
      onCardOpen: () => handleCardOpenRef.current(),
    });

    // マップコントロールの表示制御（現在地ボタン）
    const controlsVisibility = useMapControlsVisibility({ hasCard });

    // コールバックをrefに設定
    resetClosingStateRef.current = controlsVisibility.resetClosingState;
    handleCardOpenRef.current = controlsVisibility.handleCardOpen;

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

    // 国データと地方データを取得
    const countries = useMemo(() => getCountriesData(), []);
    const regions = useMemo(() => getRegionsData(), []);

    // マップ中心の地名を取得
    const centerLocation = useCenterLocationName({
      cameraState,
      machiData,
      cities,
      prefectures,
      regions,
      countries,
    });

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

    // お気に入りマスタースポットIDセットを作成
    const favoriteMasterSpotIdSet = useMemo(
      () => new Set(favoriteMasterSpotIds),
      [favoriteMasterSpotIds]
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

    // PrefectureRowのマップを作成（IDからPrefectureRowへの変換用）
    const prefectureMap = useMemo(() => {
      return new Map(prefectures.map((prefecture) => [prefecture.id, prefecture]));
    }, [prefectures]);

    // RegionRowのマップを作成（IDからRegionRowへの変換用）
    const regionMap = useMemo(() => {
      return new Map(regions.map((region) => [region.id, region]));
    }, [regions]);

    // MasterSpotDisplayのマップを作成（IDからMasterSpotDisplayへの変換用）
    const masterSpotMap = useMemo(() => {
      if (!masterSpots) return new Map<string, MasterSpotDisplay>();
      return new Map(masterSpots.map((spot) => [spot.id, spot]));
    }, [masterSpots]);

    // フィルタリングされたmachiDataを生成
    const filteredMachiData = useMemo(() => {
      if (!machiData) return null;
      if (visitFilter === 'all' || visitFilter === 'favorite') return machiData;
      if (visitFilter === 'visited') {
        return machiData.filter((machi) => visitedMachiIds.has(machi.id));
      }
      if (visitFilter === 'not_visited') {
        return machiData.filter((machi) => !visitedMachiIds.has(machi.id));
      }
      return machiData;
    }, [machiData, visitFilter, visitedMachiIds]);

    // フィルタリングされたmasterSpotsを生成
    const filteredMasterSpots = useMemo(() => {
      if (visitFilter === 'favorite') {
        return masterSpots.filter((spot) => favoriteMasterSpotIdSet.has(spot.id));
      }
      return masterSpots;
    }, [masterSpots, visitFilter, favoriteMasterSpotIdSet]);

    // GeoJSON データ生成
    const machiGeoJson = useMachiGeoJson(filteredMachiData ?? undefined, visitedMachiIds);
    const masterSpotsGeoJson = useMasterSpotsGeoJson(filteredMasterSpots);
    const prefecturesGeoJson = usePrefecturesGeoJson(prefectures);
    const regionsGeoJson = useRegionsGeoJson(regions);
    const citiesGeoJson = useCitiesGeoJson(cities);
    const countriesGeoJson = useCountriesGeoJson(countries);
    const transportHubsGeoJson = useTransportHubsGeoJson(transportHubs);


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

    // 街・スポット統合レイヤーのタップハンドラー
    const handleMachiSpotPress = (event: any) => {
      const feature = event.features?.[0];
      if (!feature) return;

      const featureType = feature.properties?.featureType;
      const id = feature.properties?.id;

      if (featureType === 'machi' && id) {
        const machi = machiMap.get(id);
        if (machi) {
          handleMachiSelect(machi);
        }
      } else if (featureType === 'spot' && id) {
        const spot = masterSpotMap.get(id);
        if (spot) {
          handleSpotSelect(spot);
        }
      }
      // transportは何もしない（タップ無効）
    };

    // 地方ラベルタップ時のハンドラー（ズーム付き）
    const handleRegionLabelPress = useCallback((region: import('@/shared/types/database.types').RegionRow) => {
      handleRegionSelect(region);
      // 座標付きデータからズーム
      const regionCoords = regionMap.get(region.id);
      if (regionCoords) {
        flyToLocation(regionCoords.longitude, regionCoords.latitude, MAP_ZOOM.REGION);
      }
    }, [handleRegionSelect, regionMap, flyToLocation]);

    // 都道府県ラベルタップ時のハンドラー（ズーム付き）
    const handlePrefectureLabelPress = useCallback((prefecture: PrefectureRow) => {
      handlePrefectureSelect(prefecture);
      // 座標がある場合のみズーム
      if (prefecture.longitude != null && prefecture.latitude != null) {
        flyToLocation(prefecture.longitude, prefecture.latitude, MAP_ZOOM.PREFECTURE);
      }
    }, [handlePrefectureSelect, flyToLocation]);

    // ヘッダーの地名クリック時のハンドラー
    const handleHeaderLocationPress = useCallback(() => {
      if (!centerLocation.entity) return;

      if (centerLocation.type === 'machi') {
        handleMachiSelect(centerLocation.entity as MachiRow);
      } else if (centerLocation.type === 'city') {
        handleCitySelect(centerLocation.entity as CityRow);
      } else if (centerLocation.type === 'prefecture') {
        handlePrefectureSelect(centerLocation.entity as PrefectureRow);
      } else if (centerLocation.type === 'region') {
        handleRegionSelect(centerLocation.entity as RegionRow);
      } else if (centerLocation.type === 'country') {
        handleCountrySelect(centerLocation.entity as CountryRow);
      }
    }, [centerLocation, handleMachiSelect, handleCitySelect, handlePrefectureSelect, handleRegionSelect, handleCountrySelect]);

    // 選択中アイテムの座標を取得
    const selectedLocation = useMemo(() => {
      if (selectedSpot) {
        return { lng: selectedSpot.longitude, lat: selectedSpot.latitude, zoom: MAP_ZOOM.SPOT };
      }
      if (selectedMachi) {
        return { lng: selectedMachi.longitude, lat: selectedMachi.latitude, zoom: MAP_ZOOM.MACHI };
      }
      if (selectedCity && selectedCity.longitude != null && selectedCity.latitude != null) {
        return { lng: selectedCity.longitude, lat: selectedCity.latitude, zoom: MAP_ZOOM.CITY };
      }
      if (selectedPrefecture && selectedPrefecture.longitude != null && selectedPrefecture.latitude != null) {
        return { lng: selectedPrefecture.longitude, lat: selectedPrefecture.latitude, zoom: MAP_ZOOM.PREFECTURE };
      }
      if (selectedRegion) {
        return { lng: selectedRegion.longitude, lat: selectedRegion.latitude, zoom: MAP_ZOOM.REGION };
      }
      if (selectedCountry) {
        return { lng: selectedCountry.longitude, lat: selectedCountry.latitude, zoom: MAP_ZOOM.COUNTRY };
      }
      return null;
    }, [selectedSpot, selectedMachi, selectedCity, selectedPrefecture, selectedRegion, selectedCountry]);

    // 選択中アイテムの位置に戻るハンドラー
    const handleSelectedLocationPress = useCallback(() => {
      if (selectedLocation) {
        flyToLocation(selectedLocation.lng, selectedLocation.lat, selectedLocation.zoom);
      }
    }, [selectedLocation, flyToLocation]);

    // 初期カメラ位置を計算
    const initialCenter = currentLocation
      ? [currentLocation.longitude, currentLocation.latitude]
      : [139.7671, 35.6812]; // フォールバック: 東京駅付近

  // 外部から呼び出せるメソッドを公開
  useImperativeHandle(ref, () => ({
    flyToLocation,
  }));

  return (
    <View style={{ flex: 1 }}>
      <Mapbox.MapView
        style={{ flex: 1 }}
        styleURL={isDarkMode ? ENV.MAPBOX_DEFAULT_MAP_STYLE_URL_DARK : ENV.MAPBOX_DEFAULT_MAP_STYLE_URL}
        onCameraChanged={handleCameraChanged}
        scaleBarEnabled={false}
      >
        <Mapbox.Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: initialCenter as [number, number],
            zoomLevel: currentLocation ? MAP_ZOOM.MACHI : MAP_ZOOM.INITIAL,
          }}
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
            <CountryLabels geoJson={countriesGeoJson} onPress={handleCountrySelect} />

            {/* 地方ラベル表示（テキストのみ）- ズーム5-7で表示 */}
            <RegionLabels
              geoJson={regionsGeoJson}
              regionMap={regionMap}
              onPress={handleRegionLabelPress}
            />

            {/* 都道府県ラベル表示（テキストのみ）- ズーム6-11で表示 */}
            <PrefectureLabels
              geoJson={prefecturesGeoJson}
              prefectureMap={prefectureMap}
              onPress={handlePrefectureLabelPress}
            />

            {/* 市区ラベル表示（テキストのみ）- ズーム10-12で表示 */}
            <CityLabels geoJson={citiesGeoJson} onPress={handleCityPress} />

            {/* 街＋スポット＋交通機関統合レイヤー（symbolSortKeyで優先度制御） */}
            <MachiSpotTransportLabels
              machiGeoJson={machiGeoJson}
              spotsGeoJson={masterSpotsGeoJson}
              transportGeoJson={transportHubsGeoJson}
              onPress={handleMachiSpotPress}
              selectedMachiId={selectedMachi?.id}
              selectedSpotId={selectedSpot?.id}
            />
          </>
        )}

        {/* 街マーカー表示（訪問済み/未訪問フィルター時のみ） */}
        {(visitFilter === 'visited' || visitFilter === 'not_visited') && (
          <MachiLabels
            geoJson={machiGeoJson}
            onPress={handleMarkerPress}
            visitFilter={visitFilter}
          />
        )}

        {/* お気に入りスポットのみ表示（お気に入りフィルター時） */}
        {visitFilter === 'favorite' && (
          <SpotLabels
            geoJson={masterSpotsGeoJson}
            onPress={handleMachiSpotPress}
            selectedSpotId={selectedSpot?.id}
          />
        )}
      </Mapbox.MapView>

      {/* ヘッダー（Snapchat風） */}
      {viewMode === 'map' && !isSearchFocused && onSearchFocus && (
        <View
          className="absolute top-0 left-0 right-0"
          style={{ paddingTop: insets.top }}
        >
          <DefaultMapHeader
            locationName={centerLocation.name}
            locationType={centerLocation.type}
            onSearchPress={onSearchFocus}
            onLocationPress={handleHeaderLocationPress}
            isHidden={isSearchBarHidden}
            showBackButton={showBackButton}
            onBackPress={onBackPress}
          />
          {/* クイック検索/フィルタリングボタン */}
          <View
            className="mt-2"
            style={{
              opacity: isSearchBarHidden ? 0 : 1,
            }}
            pointerEvents={isSearchBarHidden ? 'none' : 'auto'}
          >
            <QuickSearchButtons
              activeFilter={visitFilter}
              onFilterChange={setVisitFilter}
              onCategoryPress={onQuickSearch}
            />
          </View>
        </View>
      )}

      {/* マップコントロールボタン（現在地ボタン + 選択位置に戻る） */}
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
          {/* 現在地ボタン */}
          <LocationButton
            onPress={handleLocationPress}
            testID="location-button"
          />
          {/* 選択位置に戻るボタン（カード表示中のみ） */}
          {hasCard && selectedLocation && (
            <View className="mt-3">
              <SelectedLocationButton
                onPress={handleSelectedLocationPress}
                testID="selected-location-button"
              />
            </View>
          )}
        </Animated.View>
      )}

      {/* 選択された国の詳細カード */}
      {selectedCountry && (
        <CountryDetailCard
          country={selectedCountry}
          onClose={() => handleCountrySelect(null)}
          onSnapChange={handleSnapChange}
          onSearchBarVisibilityChange={setIsSearchBarHidden}
          onBeforeClose={controlsVisibility.handleBeforeClose}
          onLocationButtonVisibilityChange={controlsVisibility.handleControlButtonsVisibilityChange}
          onRegionSelect={(region) => {
            // 国カードが閉じた後に地方カードを開く
            handleRegionSelect(region);
            // カメラを地方の位置に移動（座標がある場合のみ）
            const regionCoords = regionMap.get(region.id);
            if (regionCoords) {
              flyToLocation(regionCoords.longitude, regionCoords.latitude, MAP_ZOOM.REGION);
            }
          }}
        />
      )}

      {/* 選択された地方の詳細カード */}
      {selectedRegion && (
        <RegionDetailCard
          region={selectedRegion}
          onClose={() => handleRegionSelect(null)}
          onSnapChange={handleSnapChange}
          onSearchBarVisibilityChange={setIsSearchBarHidden}
          onBeforeClose={controlsVisibility.handleBeforeClose}
          onLocationButtonVisibilityChange={controlsVisibility.handleControlButtonsVisibilityChange}
          onPrefectureSelect={(prefecture) => {
            // 地方カードが閉じた後に都道府県カードを開く
            handlePrefectureSelect(prefecture);
            // カメラを都道府県の位置に移動（座標がある場合のみ）
            if (prefecture.longitude != null && prefecture.latitude != null) {
              flyToLocation(prefecture.longitude, prefecture.latitude, MAP_ZOOM.PREFECTURE);
            }
          }}
        />
      )}

      {/* 選択された都道府県の詳細カード */}
      {selectedPrefecture && (
        <PrefectureDetailCard
          prefecture={selectedPrefecture}
          onClose={() => handlePrefectureSelect(null)}
          onSnapChange={handleSnapChange}
          onSearchBarVisibilityChange={setIsSearchBarHidden}
          onBeforeClose={controlsVisibility.handleBeforeClose}
          onLocationButtonVisibilityChange={controlsVisibility.handleControlButtonsVisibilityChange}
          onCitySelect={(city) => {
            // 都道府県カードが閉じた後に市区カードを開く
            handleCitySelect(city);
            // カメラを市区の位置に移動（座標がある場合のみ）
            if (city.longitude != null && city.latitude != null) {
              flyToLocation(city.longitude, city.latitude, MAP_ZOOM.CITY);
            }
          }}
        />
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
          onSpotSelect={(spot) => {
            // 街カードが閉じた後にスポットカードを開く
            handleSpotSelect(spot);
            // カメラをスポットの位置に移動
            flyToLocation(spot.longitude, spot.latitude, MAP_ZOOM.SPOT);
          }}
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
          onMachiSelect={(machi) => {
            // 市区カードが閉じた後に街カードを開く
            // handleMachiSelect内部でselectedCityもクリアされる
            handleMachiSelect(machi);
            // カメラを街の位置に移動
            flyToLocation(machi.longitude, machi.latitude, MAP_ZOOM.MACHI);
          }}
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
    );
  }
);

/**
 * デフォルトマップビューWidget - マスターデータのmachi表示
 */

import React, { useState, useRef, useImperativeHandle, forwardRef, useMemo, useCallback } from 'react';
import { View } from 'react-native';
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
import type { MachiRow, CityRow } from '@/shared/types/database.types';
import type { MasterSpotDisplay } from '@/shared/api/supabase/spots';
import type { MapListViewMode } from '@/features/toggle-view-mode';
import { QuickSearchButtons, type VisitFilter } from '@/features/quick-search-buttons';
import { MasterSpotDetailCard } from '@/widgets/master-spot-detail-card';
import { CityDetailCard } from '@/widgets/city-detail-card';

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
    const [selectedMachi, setSelectedMachi] = useState<MachiRow | null>(null);
    const [machiDetailSnapIndex, setMachiDetailSnapIndex] = useState<number>(1);
    const [selectedCity, setSelectedCity] = useState<CityRow | null>(null);
    const [cityDetailSnapIndex, setCityDetailSnapIndex] = useState<number>(1);
    const [selectedSpot, setSelectedSpot] = useState<MasterSpotDisplay | null>(null);
    const [spotDetailSnapIndex, setSpotDetailSnapIndex] = useState<number>(1);
    const [visitFilter, setVisitFilter] = useState<VisitFilter>('all');
    const [isSearchBarHidden, setIsSearchBarHidden] = useState(false);
    const cameraRef = useRef<Mapbox.Camera>(null);

    // 画面がフォーカスされた時に選択状態をリセット
    useFocusEffect(
      useCallback(() => {
        // ジャンプ完了から500ms以内はリセットしない
        const timeSinceLastJump = Date.now() - lastJumpTimeRef.current;
        if (timeSinceLastJump < 500) {
          return;
        }
        // 選択状態をリセット
        setSelectedMachi(null);
        setSelectedCity(null);
        setSelectedSpot(null);
        setMachiDetailSnapIndex(1);
        setCityDetailSnapIndex(1);
        setSpotDetailSnapIndex(1);
      }, [])
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

    // 選択状態を管理
    const handleMachiSelect = (machi: MachiRow | null) => {
      setSelectedMachi(machi);
      // 街を選択したら他の選択を解除
      if (machi) {
        setSelectedCity(null);
        setSelectedSpot(null);
      } else {
        // 閉じる時は検索バーを表示
        setIsSearchBarHidden(false);
      }
    };

    // 市区選択状態を管理
    const handleCitySelect = (city: CityRow | null) => {
      setSelectedCity(city);
      // 市区を選択したら他の選択を解除
      if (city) {
        setSelectedMachi(null);
        setSelectedSpot(null);
      } else {
        // 閉じる時は検索バーを表示
        setIsSearchBarHidden(false);
      }
    };

    // スポット選択状態を管理
    const handleSpotSelect = (spot: MasterSpotDisplay | null) => {
      setSelectedSpot(spot);
      // スポットを選択したら他の選択を解除
      if (spot) {
        setSelectedMachi(null);
        setSelectedCity(null);
      } else {
        // 閉じる時は検索バーを表示
        setIsSearchBarHidden(false);
      }
    };

    // マップジャンプフック（検索結果からのジャンプ処理）
    const { lastJumpTimeRef } = useMapJump({
      cameraRef,
      onMachiSelect: handleMachiSelect,
      onCitySelect: handleCitySelect,
      onSpotSelect: handleSpotSelect,
    });

    // スナップ変更を親に通知して、ローカルstateも更新
    const handleSnapChange = (snapIndex: number) => {
      setMachiDetailSnapIndex(snapIndex);
      onMachiDetailSnapChange?.(snapIndex);
    };

    // 市区カードのスナップ変更
    const handleCitySnapChange = (snapIndex: number) => {
      setCityDetailSnapIndex(snapIndex);
      onCityDetailSnapChange?.(snapIndex);
    };

    // スポットカードのスナップ変更
    const handleSpotSnapChange = (snapIndex: number) => {
      setSpotDetailSnapIndex(snapIndex);
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
          {viewMode === 'map' && !isSearchFocused && (
            <View
              className="absolute right-6 z-50"
              style={{
                // カード縮小版（15%）の時は16%の位置に、それ以外は48px
                bottom: (
                  (machiDetailSnapIndex === 0 && selectedMachi) ||
                  (cityDetailSnapIndex === 0 && selectedCity) ||
                  (spotDetailSnapIndex === 0 && selectedSpot)
                ) ? '16%' : 48,
              }}
            >
              <View
                style={{
                  opacity: (
                    (machiDetailSnapIndex === 0 && selectedMachi) ||
                    (cityDetailSnapIndex === 0 && selectedCity) ||
                    (spotDetailSnapIndex === 0 && selectedSpot) ||
                    (!selectedMachi && !selectedCity && !selectedSpot)
                  ) ? 1 : 0,
                }}
                pointerEvents={(
                  (machiDetailSnapIndex === 0 && selectedMachi) ||
                  (cityDetailSnapIndex === 0 && selectedCity) ||
                  (spotDetailSnapIndex === 0 && selectedSpot) ||
                  (!selectedMachi && !selectedCity && !selectedSpot)
                ) ? 'auto' : 'none'}
              >
                <LocationButton
                  onPress={handleLocationPress}
                  testID="location-button"
                />
              </View>
            </View>
          )}

          {/* 選択された街の詳細カード */}
          {selectedMachi && (
            <MachiDetailCard
              machi={selectedMachi}
              onClose={() => handleMachiSelect(null)}
              onSnapChange={handleSnapChange}
              onSearchBarVisibilityChange={setIsSearchBarHidden}
            />
          )}

          {/* 選択された市区の詳細カード */}
          {selectedCity && (
            <CityDetailCard
              city={selectedCity}
              onClose={() => handleCitySelect(null)}
              onSnapChange={handleCitySnapChange}
              onSearchBarVisibilityChange={setIsSearchBarHidden}
            />
          )}

          {/* 選択されたスポットの詳細カード */}
          {selectedSpot && (
            <MasterSpotDetailCard
              spot={selectedSpot}
              onClose={() => handleSpotSelect(null)}
              onSnapChange={handleSpotSnapChange}
              onSearchBarVisibilityChange={setIsSearchBarHidden}
            />
          )}
        </View>
      )}
    </AsyncBoundary>
    );
  }
);

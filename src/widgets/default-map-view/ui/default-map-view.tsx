/**
 * デフォルトマップビューWidget - マスターデータのmachi表示
 */

import React, { useState, useRef, useImperativeHandle, forwardRef, useMemo } from 'react';
import { View } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { useMachi } from '@/entities/machi';
import { useVisits } from '@/entities/visit';
import { useMasterSpotsByBounds } from '@/entities/master-spot';
import { usePrefectures } from '@/entities/prefecture';
import { useCities } from '@/entities/city';
import { AsyncBoundary, LocationButton } from '@/shared/ui';
import { useMapLocation, type MapViewHandle } from '@/shared/lib/map';
import { MachiDetailCard } from './machi-detail-card';
import { useBoundsManagement } from '../model';
import type { MachiRow } from '@/shared/types/database.types';
import type { FeatureCollection, Point } from 'geojson';
import type { MapListViewMode } from '@/features/toggle-view-mode';

interface DefaultMapViewProps {
  userId?: string | null;
  currentLocation?: { latitude: number; longitude: number } | null;
  onMachiDetailSnapChange?: (snapIndex: number) => void;
  viewMode?: MapListViewMode;
  isSearchFocused?: boolean;
}

export const DefaultMapView = forwardRef<MapViewHandle, DefaultMapViewProps>(
  ({ userId = null, currentLocation = null, onMachiDetailSnapChange, viewMode = 'map', isSearchFocused = false }, ref) => {
    const { data: machiData, isLoading, error } = useMachi();
    const { data: visits = [] } = useVisits(userId ?? '');
    const { data: prefectures = [] } = usePrefectures();
    const { data: cities = [] } = useCities();
    const [selectedMachi, setSelectedMachi] = useState<MachiRow | null>(null);
    const [machiDetailSnapIndex, setMachiDetailSnapIndex] = useState<number>(1);
    const cameraRef = useRef<Mapbox.Camera>(null);

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
    };

    // スナップ変更を親に通知して、ローカルstateも更新
    const handleSnapChange = (snapIndex: number) => {
      setMachiDetailSnapIndex(snapIndex);
      onMachiDetailSnapChange?.(snapIndex);
    };

    // 訪問済みmachiのIDセットを作成
    const visitedMachiIds = new Set(visits.map((visit) => visit.machi_id));

    // MachiRowのマップを作成（IDからMachiRowへの変換用）
    const machiMap = useMemo(() => {
      if (!machiData) return new Map<string, MachiRow>();
      return new Map(machiData.map((machi) => [machi.id, machi]));
    }, [machiData]);

    // machiデータをGeoJSON形式に変換
    const geoJsonData: FeatureCollection<Point> = useMemo(() => {
      if (!machiData) return { type: 'FeatureCollection', features: [] };

      return {
        type: 'FeatureCollection',
        features: machiData.map((machi) => ({
          type: 'Feature',
          id: machi.id,
          geometry: {
            type: 'Point',
            coordinates: [machi.longitude, machi.latitude],
          },
          properties: {
            id: machi.id,
            name: machi.name,
            isVisited: visitedMachiIds.has(machi.id),
          },
        })),
      };
    }, [machiData, visitedMachiIds]);

    // master_spotsデータをGeoJSON形式に変換
    const masterSpotsGeoJson: FeatureCollection<Point> = useMemo(() => {
      if (!masterSpots || masterSpots.length === 0) {
        return { type: 'FeatureCollection', features: [] };
      }

      return {
        type: 'FeatureCollection',
        features: masterSpots.map((spot) => ({
          type: 'Feature',
          id: spot.id,
          geometry: {
            type: 'Point',
            coordinates: [spot.longitude, spot.latitude],
          },
          properties: {
            id: spot.id,
            name: spot.name,
          },
        })),
      };
    }, [masterSpots]);

    // 都道府県データをGeoJSON形式に変換（座標を持つもののみ）
    const prefecturesGeoJson: FeatureCollection<Point> = useMemo(() => {
      const prefecturesWithCoords = prefectures.filter(
        (pref) => pref.latitude !== null && pref.longitude !== null
      );

      return {
        type: 'FeatureCollection',
        features: prefecturesWithCoords.map((pref) => ({
          type: 'Feature',
          id: pref.id,
          geometry: {
            type: 'Point',
            coordinates: [pref.longitude!, pref.latitude!],
          },
          properties: {
            id: pref.id,
            name: pref.name,
          },
        })),
      };
    }, [prefectures]);

    // 市区町村データをGeoJSON形式に変換（座標を持つもののみ）
    const citiesGeoJson: FeatureCollection<Point> = useMemo(() => {
      const citiesWithCoords = cities.filter(
        (city) => city.latitude !== null && city.longitude !== null
      );

      return {
        type: 'FeatureCollection',
        features: citiesWithCoords.map((city) => ({
          type: 'Feature',
          id: city.id,
          geometry: {
            type: 'Point',
            coordinates: [city.longitude!, city.latitude!],
          },
          properties: {
            id: city.id,
            name: city.name,
          },
        })),
      };
    }, [cities]);


    // マーカータップ時のハンドラー
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
            styleURL={Mapbox.StyleURL.Light}
            localizeLabels={true}
            onCameraChanged={handleCameraChanged}
          >
            <Mapbox.Camera
              ref={cameraRef}
              zoomLevel={currentLocation ? 14 : 10} // 現在地があれば詳細レベル
              centerCoordinate={initialCenter as [number, number]}
              animationDuration={0}
            />

            {/* 都道府県マーカー表示（紫の円）- ズーム0-10で表示 */}
            <Mapbox.ShapeSource
              id="prefectures-source"
              shape={prefecturesGeoJson}
            >
              <Mapbox.CircleLayer
                id="prefectures"
                maxZoomLevel={11}
                style={{
                  circleColor: '#9333EA',
                  circleRadius: 12,
                  circleStrokeWidth: 2,
                  circleStrokeColor: '#FFFFFF',
                }}
              />
              <Mapbox.SymbolLayer
                id="prefectures-labels"
                maxZoomLevel={11}
                style={{
                  textField: ['get', 'name'],
                  textSize: 14,
                  textColor: '#9333EA',
                  textHaloColor: '#FFFFFF',
                  textHaloWidth: 2,
                  textFont: ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
                  textAnchor: 'top',
                  textOffset: [0, 1.5],
                }}
              />
            </Mapbox.ShapeSource>

            {/* 市区町村マーカー表示（ピンクの円）- ズーム11-13で表示 */}
            <Mapbox.ShapeSource
              id="cities-source"
              shape={citiesGeoJson}
            >
              <Mapbox.CircleLayer
                id="cities"
                minZoomLevel={11}
                maxZoomLevel={14}
                style={{
                  circleColor: '#EC4899',
                  circleRadius: 10,
                  circleStrokeWidth: 2,
                  circleStrokeColor: '#FFFFFF',
                }}
              />
              <Mapbox.SymbolLayer
                id="cities-labels"
                minZoomLevel={11}
                maxZoomLevel={14}
                style={{
                  textField: ['get', 'name'],
                  textSize: 12,
                  textColor: '#EC4899',
                  textHaloColor: '#FFFFFF',
                  textHaloWidth: 2,
                  textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                  textAnchor: 'top',
                  textOffset: [0, 1.2],
                }}
              />
            </Mapbox.ShapeSource>

            {/* 街マーカー表示 */}
            <Mapbox.ShapeSource
              id="machi-source"
              shape={geoJsonData}
              onPress={handleMarkerPress}
            >
              {/* 訪問済みマーカー（緑の円）- ズーム14以上で表示 */}
              {/* 将来の拡張: お気に入りの場合は金色に変更可能 */}
              <Mapbox.CircleLayer
                id="visited-machi"
                filter={['==', ['get', 'isVisited'], true]}
                minZoomLevel={14}
                style={{
                  circleColor: '#10B981',
                  circleRadius: 10,
                  circleStrokeWidth: 2,
                  circleStrokeColor: '#FFFFFF',
                }}
              />

              {/* 未訪問マーカー（青の円）- ズーム14以上で表示 */}
              {/* 将来の拡張: 行きたい度合いで色を変更可能（例: 赤色で優先度高） */}
              <Mapbox.CircleLayer
                id="unvisited-machi"
                filter={['==', ['get', 'isVisited'], false]}
                minZoomLevel={14}
                style={{
                  circleColor: '#3B82F6',
                  circleRadius: 10,
                  circleStrokeWidth: 2,
                  circleStrokeColor: '#FFFFFF',
                }}
              />

              {/* 街名テキスト表示（太字）- ズーム14以上で表示 */}
              <Mapbox.SymbolLayer
                id="machi-labels"
                minZoomLevel={14}
                style={{
                  textField: ['get', 'name'],
                  textSize: 12,
                  textColor: '#000000',
                  textHaloColor: '#FFFFFF',
                  textHaloWidth: 2,
                  textFont: ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
                  textAnchor: 'top',
                  textOffset: [0, 1.2],
                }}
              />
            </Mapbox.ShapeSource>

            {/* スポットマーカー表示（オレンジ色） */}
            <Mapbox.ShapeSource
              id="master-spots-source"
              shape={masterSpotsGeoJson}
            >
              {/* スポットマーカー（オレンジの円）- ズーム15以上で表示 */}
              <Mapbox.CircleLayer
                id="master-spots"
                minZoomLevel={15}
                style={{
                  circleColor: '#F97316',
                  circleRadius: 8,
                  circleStrokeWidth: 2,
                  circleStrokeColor: '#FFFFFF',
                }}
              />

              {/* スポット名テキスト表示 - ズーム15以上で表示 */}
              <Mapbox.SymbolLayer
                id="master-spots-labels"
                minZoomLevel={15}
                style={{
                  textField: ['get', 'name'],
                  textSize: 11,
                  textColor: '#F97316',
                  textHaloColor: '#FFFFFF',
                  textHaloWidth: 2,
                  textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                  textAnchor: 'top',
                  textOffset: [0, 1],
                }}
              />
            </Mapbox.ShapeSource>
          </Mapbox.MapView>

          {/* マップコントロールボタン（現在地ボタン） */}
          {viewMode === 'map' && !isSearchFocused && (
            <View
              className="absolute right-6 z-50"
              style={{
                // 街カード縮小版（15%）の時は16%の位置に、それ以外は48px
                bottom: (machiDetailSnapIndex === 0 && selectedMachi) ? '16%' : 48,
              }}
            >
              <View
                style={{
                  opacity: (machiDetailSnapIndex === 0 && selectedMachi) || !selectedMachi ? 1 : 0,
                }}
                pointerEvents={(machiDetailSnapIndex === 0 && selectedMachi) || !selectedMachi ? 'auto' : 'none'}
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
            />
          )}
        </View>
      )}
    </AsyncBoundary>
    );
  }
);

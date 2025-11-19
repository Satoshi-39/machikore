/**
 * デフォルトマップビューWidget - マスターデータのmachi表示
 */

import React, { useState, useRef, useImperativeHandle, forwardRef, useMemo } from 'react';
import { View } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { useMachi } from '@/entities/machi';
import { useVisits } from '@/entities/visit';
import { AsyncBoundary, LocationButton } from '@/shared/ui';
import { MachiDetailCard } from './machi-detail-card';
import type { MachiRow } from '@/shared/types/database.types';
import type { FeatureCollection, Point } from 'geojson';
import type { MapListViewMode } from '@/features/toggle-view-mode';

export interface MapViewHandle {
  flyToLocation: (longitude: number, latitude: number) => void;
}

interface DefaultMapViewProps {
  userId?: string | null;
  currentLocation?: { latitude: number; longitude: number } | null;
  onMachiSelect?: (machi: MachiRow | null) => void;
  onMachiDetailSnapChange?: (snapIndex: number) => void;
  viewMode?: MapListViewMode;
  isSearchFocused?: boolean;
}

export const DefaultMapView = forwardRef<MapViewHandle, DefaultMapViewProps>(
  ({ userId = null, currentLocation = null, onMachiSelect, onMachiDetailSnapChange, viewMode = 'map', isSearchFocused = false }, ref) => {
    const { data: machiData, isLoading, error } = useMachi();
    const { data: visits = [] } = useVisits(userId ?? '');
    const [selectedMachi, setSelectedMachi] = useState<MachiRow | null>(null);
    const [machiDetailSnapIndex, setMachiDetailSnapIndex] = useState<number>(1);
    const cameraRef = useRef<Mapbox.Camera>(null);

    // 選択状態を親に通知
    const handleMachiSelect = (machi: MachiRow | null) => {
      setSelectedMachi(machi);
      onMachiSelect?.(machi);
    };

    // スナップ変更を親に通知して、ローカルstateも更新
    const handleSnapChange = (snapIndex: number) => {
      setMachiDetailSnapIndex(snapIndex);
      onMachiDetailSnapChange?.(snapIndex);
    };

    // 現在地ボタンハンドラー
    const handleLocationPress = () => {
      if (currentLocation && cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: [currentLocation.longitude, currentLocation.latitude],
          zoomLevel: 14,
          animationDuration: 1000,
        });
      }
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

    // マーカータップ時のハンドラー
    const handleMarkerPress = (event: any) => {
      const feature = event.features?.[0];
      if (!feature) return;

      // クラスターの場合は拡大
      if (feature.properties?.cluster) {
        // クラスターをタップした場合は何もしない（自動的に拡大される）
        return;
      }

      // 個別マーカーの場合は詳細表示
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
      : [139.7671, 35.6812]; // フォールバック: 東京

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
            styleURL={Mapbox.StyleURL.Street}
          >
            <Mapbox.Camera
              ref={cameraRef}
              zoomLevel={currentLocation ? 14 : 10} // 現在地があれば詳細レベル
              centerCoordinate={initialCenter as [number, number]}
              animationDuration={0}
            />

            {/* クラスタリング対応マーカー表示 */}
            <Mapbox.ShapeSource
              id="machi-source"
              shape={geoJsonData}
              cluster
              clusterRadius={50}
              clusterMaxZoomLevel={14}
              onPress={handleMarkerPress}
            >
              {/* クラスター表示（複数マーカーがまとまった円） */}
              <Mapbox.CircleLayer
                id="clusters"
                filter={['has', 'point_count']}
                style={{
                  circleColor: '#3B82F6',
                  circleRadius: 20,
                  circleOpacity: 0.8,
                }}
              />

              {/* クラスター内の数字 */}
              <Mapbox.SymbolLayer
                id="cluster-count"
                filter={['has', 'point_count']}
                style={{
                  textField: ['get', 'point_count_abbreviated'],
                  textSize: 14,
                  textColor: '#FFFFFF',
                  textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                }}
              />

              {/* 訪問済み個別マーカー（緑の円） */}
              {/* 将来の拡張: お気に入りの場合は金色に変更可能 */}
              <Mapbox.CircleLayer
                id="unclustered-visited"
                filter={['all', ['!', ['has', 'point_count']], ['==', ['get', 'isVisited'], true]]}
                style={{
                  circleColor: '#10B981',
                  circleRadius: 10,
                  circleStrokeWidth: 2,
                  circleStrokeColor: '#FFFFFF',
                }}
              />

              {/* 未訪問個別マーカー（青の円） */}
              {/* 将来の拡張: 行きたい度合いで色を変更可能（例: 赤色で優先度高） */}
              <Mapbox.CircleLayer
                id="unclustered-unvisited"
                filter={['all', ['!', ['has', 'point_count']], ['==', ['get', 'isVisited'], false]]}
                style={{
                  circleColor: '#3B82F6',
                  circleRadius: 10,
                  circleStrokeWidth: 2,
                  circleStrokeColor: '#FFFFFF',
                }}
              />
            </Mapbox.ShapeSource>
          </Mapbox.MapView>

          {/* マップコントロールボタン（現在地ボタン） */}
          {viewMode === 'map' && !isSearchFocused && currentLocation && (
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

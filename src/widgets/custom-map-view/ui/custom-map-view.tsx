/**
 * カスタムマップビューWidget - Mapbox地図表示
 *
 * FSDの原則：Widget層は複合的なUIコンポーネント
 */

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { View } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { Ionicons } from '@expo/vector-icons';
import { useSpots } from '@/entities/spot';

export interface MapViewHandle {
  flyToLocation: (longitude: number, latitude: number) => void;
}

interface CustomMapViewProps {
  mapId: string | null;
}

export const CustomMapView = forwardRef<MapViewHandle, CustomMapViewProps>(
  ({ mapId }, ref) => {
    const cameraRef = useRef<Mapbox.Camera>(null);
    const { data: spots = [] } = useSpots(mapId ?? '');

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
      >
        <Mapbox.Camera
          ref={cameraRef}
          zoomLevel={12}
          centerCoordinate={[139.7671, 35.6812]} // 東京
          animationDuration={0}
        />

        {/* スポットマーカー表示 */}
        {spots.map((spot) => {
          // TODO: 訪問済みかどうかで色を変更
          // const isVisited = spot.visited_at !== null;
          // const color = isVisited ? '#10B981' : '#EF4444'; // 緑 or 赤
          const color = '#EF4444'; // 現在は全て赤

          return (
            <Mapbox.PointAnnotation
              key={spot.id}
              id={spot.id}
              coordinate={[spot.longitude, spot.latitude]}
            >
              <Ionicons name="location" size={40} color={color} />
            </Mapbox.PointAnnotation>
          );
        })}
      </Mapbox.MapView>
    </View>
  );
});

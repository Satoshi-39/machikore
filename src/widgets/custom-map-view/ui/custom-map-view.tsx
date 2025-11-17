/**
 * カスタムマップビューWidget - Mapbox地図表示
 *
 * FSDの原則：Widget層は複合的なUIコンポーネント
 */

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { View } from 'react-native';
import Mapbox from '@rnmapbox/maps';

export interface MapViewHandle {
  flyToLocation: (longitude: number, latitude: number) => void;
}

export const CustomMapView = forwardRef<MapViewHandle, {}>((props, ref) => {
  const cameraRef = useRef<Mapbox.Camera>(null);

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
      </Mapbox.MapView>
    </View>
  );
});

/**
 * ユーザーマップWidget - Mapbox地図表示
 *
 * FSDの原則：Widget層は複合的なUIコンポーネント
 */

import React from 'react';
import { View } from 'react-native';
import Mapbox from '@rnmapbox/maps';

export function UserMap() {
  return (
    <View className="flex-1">
      <Mapbox.MapView
        style={{ flex: 1 }}
        styleURL={Mapbox.StyleURL.Street}
      >
        <Mapbox.Camera
          zoomLevel={12}
          centerCoordinate={[139.7671, 35.6812]} // 東京
          animationDuration={0}
        />
      </Mapbox.MapView>
    </View>
  );
}

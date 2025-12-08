/**
 * スポットラベルレイヤー（テキストのみ、カテゴリ別色分け）
 */

import React from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point } from 'geojson';
import type { SpotCategory } from '@/entities/master-spot/model';
import { SPOT_CATEGORY_COLORS } from '@/shared/config';

interface SpotLabelsProps {
  geoJson: FeatureCollection<Point, { id: string; name: string; category: SpotCategory }>;
  onPress: (event: any) => void;
}

export function SpotLabels({ geoJson, onPress }: SpotLabelsProps) {
  return (
    <Mapbox.ShapeSource
      id="master-spots-source"
      shape={geoJson}
      onPress={onPress}
    >
      {/* 飲食店系 - テキストオレンジ */}
      <Mapbox.SymbolLayer
        id="master-spots-food"
        minZoomLevel={13}
        filter={['==', ['get', 'category'], 'food']}
        style={{
          textField: ['get', 'name'],
          textSize: 13,
          textColor: SPOT_CATEGORY_COLORS.food,
          textHaloColor: '#FFFFFF',
          textHaloWidth: 2,
          textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        }}
      />

      {/* ショッピング系 - テキスト紫 */}
      <Mapbox.SymbolLayer
        id="master-spots-shopping"
        minZoomLevel={13}
        filter={['==', ['get', 'category'], 'shopping']}
        style={{
          textField: ['get', 'name'],
          textSize: 13,
          textColor: SPOT_CATEGORY_COLORS.shopping,
          textHaloColor: '#FFFFFF',
          textHaloWidth: 2,
          textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        }}
      />

      {/* 公園・観光地系 - テキスト緑 */}
      <Mapbox.SymbolLayer
        id="master-spots-tourism"
        minZoomLevel={13}
        filter={['==', ['get', 'category'], 'tourism']}
        style={{
          textField: ['get', 'name'],
          textSize: 13,
          textColor: SPOT_CATEGORY_COLORS.tourism,
          textHaloColor: '#FFFFFF',
          textHaloWidth: 2,
          textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        }}
      />

      {/* 交通系 - テキスト青 */}
      <Mapbox.SymbolLayer
        id="master-spots-transit"
        minZoomLevel={13}
        filter={['==', ['get', 'category'], 'transit']}
        style={{
          textField: ['get', 'name'],
          textSize: 13,
          textColor: SPOT_CATEGORY_COLORS.transit,
          textHaloColor: '#FFFFFF',
          textHaloWidth: 2,
          textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        }}
      />

      {/* その他 - テキスト薄紫 */}
      <Mapbox.SymbolLayer
        id="master-spots-other"
        minZoomLevel={13}
        filter={['==', ['get', 'category'], 'other']}
        style={{
          textField: ['get', 'name'],
          textSize: 13,
          textColor: SPOT_CATEGORY_COLORS.other,
          textHaloColor: '#FFFFFF',
          textHaloWidth: 2,
          textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        }}
      />
    </Mapbox.ShapeSource>
  );
}

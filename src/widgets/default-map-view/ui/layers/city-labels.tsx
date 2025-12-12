/**
 * 市区ラベルレイヤー（アイコン + テキスト横並び）
 */

import React from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point } from 'geojson';
import { LABEL_ZOOM, LOCATION_ICONS } from '@/shared/config';

// アイコン画像（オレンジ色）
const businessIcon = require('@assets/icons/business-city.png');

interface CityFeatureProperties {
  id: string;
  name: string;
}

interface CityLabelsProps {
  geoJson: FeatureCollection<Point, CityFeatureProperties>;
  onPress: (event: any) => void;
}

export function CityLabels({ geoJson, onPress }: CityLabelsProps) {
  return (
    <>
      {/* アイコン画像を登録 */}
      <Mapbox.Images images={{ 'city-icon': businessIcon }} />

      <Mapbox.ShapeSource
        id="cities-source"
        shape={geoJson}
        onPress={onPress}
      >
        <Mapbox.SymbolLayer
          id="cities-labels"
          minZoomLevel={LABEL_ZOOM.CITY.min}
          maxZoomLevel={LABEL_ZOOM.CITY.max}
          style={{
            iconImage: 'city-icon',
            iconSize: 0.35,
            textField: ['get', 'name'],
            textSize: 16,
            textColor: LOCATION_ICONS.CITY.color,
            textHaloColor: '#FFFFFF',
            textHaloWidth: 2,
            textFont: ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
            iconTextFit: 'none',
            textAnchor: 'left',
            iconAnchor: 'right',
            textOffset: [0.3, 0],
          }}
        />
      </Mapbox.ShapeSource>
    </>
  );
}

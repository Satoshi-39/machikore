/**
 * 市区ラベルレイヤー（アイコン + テキスト横並び）
 */

import React from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point } from 'geojson';
import { LOCATION_ICONS, MAP_ZOOM } from '@/shared/config';

// アイコン画像（オレンジ色）
const businessIcon = require('@assets/icons/business-city.png');

interface CityLabelsProps {
  geoJson: FeatureCollection<Point, { id: string; name: string }>;
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
        {/* アイコン + テキスト横並び */}
        <Mapbox.SymbolLayer
          id="cities-labels"
          minZoomLevel={MAP_ZOOM.CITY - 1}
          maxZoomLevel={MAP_ZOOM.CITY + 1}
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

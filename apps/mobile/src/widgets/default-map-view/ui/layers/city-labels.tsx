/**
 * 市区ラベルレイヤー（アイコン + テキスト横並び）
 */

import React from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point } from 'geojson';
import { LABEL_ZOOM_DEFAULT_MAP, LOCATION_ICONS, colors } from '@/shared/config';
import type { CityRow } from '@/shared/types/database.types';
import type { MapboxOnPressEvent } from '@/shared/types/common.types';

// アイコン画像（オレンジ色）
const businessIcon = require('@assets/icons/business-city.png');

interface CityFeatureProperties {
  id: string;
  name: string;
}

interface CityLabelsProps {
  geoJson: FeatureCollection<Point, CityFeatureProperties>;
  cityMap?: Map<string, CityRow>;
  onPress?: (city: CityRow) => void;
}

export function CityLabels({ geoJson, cityMap, onPress }: CityLabelsProps) {

  const handlePress = (event: MapboxOnPressEvent) => {
    const feature = event.features?.[0];
    if (!feature || !onPress || !cityMap) return;

    const cityId = feature.properties?.id as string | undefined;
    if (cityId) {
      const city = cityMap.get(cityId);
      if (city) {
        onPress(city);
      }
    }
  };

  return (
    <>
      {/* アイコン画像を登録 */}
      <Mapbox.Images images={{ 'city-icon': businessIcon }} />

      <Mapbox.ShapeSource
        id="cities-source"
        shape={geoJson}
        onPress={handlePress}
      >
        <Mapbox.SymbolLayer
          id="cities-labels"
          minZoomLevel={LABEL_ZOOM_DEFAULT_MAP.CITY.min}
          maxZoomLevel={LABEL_ZOOM_DEFAULT_MAP.CITY.max}
          style={{
            iconImage: 'city-icon',
            iconSize: 0.35,
            textField: ['get', 'name'],
            textSize: 16,
            textColor: LOCATION_ICONS.CITY.color,
            textHaloColor: colors.component['map-label']['halo-light'],
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

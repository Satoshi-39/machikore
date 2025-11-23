/**
 * 市区ラベルレイヤー（テキストのみ）
 */

import React from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point } from 'geojson';

interface CityLabelsProps {
  geoJson: FeatureCollection<Point, { id: string; name: string }>;
  onPress: (event: any) => void;
}

export function CityLabels({ geoJson, onPress }: CityLabelsProps) {
  return (
    <Mapbox.ShapeSource
      id="cities-source"
      shape={geoJson}
      onPress={onPress}
    >
      <Mapbox.SymbolLayer
        id="cities-labels"
        minZoomLevel={11}
        maxZoomLevel={14}
        style={{
          textField: ['get', 'name'],
          textSize: 16,
          textColor: '#000000',
          textHaloColor: '#FFFFFF',
          textHaloWidth: 2,
          textFont: ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
        }}
      />
    </Mapbox.ShapeSource>
  );
}

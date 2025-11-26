/**
 * 国ラベルレイヤー（テキストのみ）
 */

import React from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point } from 'geojson';

interface CountryLabelsProps {
  geoJson: FeatureCollection<Point, { id: string; name: string }>;
}

export function CountryLabels({ geoJson }: CountryLabelsProps) {
  return (
    <Mapbox.ShapeSource
      id="countries-source"
      shape={geoJson}
    >
      <Mapbox.SymbolLayer
        id="countries-labels"
        maxZoomLevel={5}
        style={{
          textField: ['get', 'name'],
          textSize: 18,
          textColor: '#000000',
          textHaloColor: '#FFFFFF',
          textHaloWidth: 2,
          textFont: ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
        }}
      />
    </Mapbox.ShapeSource>
  );
}

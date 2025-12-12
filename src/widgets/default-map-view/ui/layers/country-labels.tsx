/**
 * 国ラベルレイヤー（テキストのみ）
 */

import React from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point } from 'geojson';
import { MAP_ZOOM } from '@/shared/config';

interface CountryLabelsProps {
  geoJson: FeatureCollection<Point, { id: string; name: string; code: string }>;
  onPress?: (country: { id: string; name: string; code: string }) => void;
}

export function CountryLabels({ geoJson, onPress }: CountryLabelsProps) {
  const handlePress = (event: any) => {
    const feature = event.features?.[0];
    if (!feature || !onPress) return;

    const { id, name, code } = feature.properties;
    if (id && name) {
      onPress({ id, name, code });
    }
  };

  return (
    <Mapbox.ShapeSource
      id="countries-source"
      shape={geoJson}
      onPress={handlePress}
    >
      <Mapbox.SymbolLayer
        id="countries-labels"
        maxZoomLevel={MAP_ZOOM.COUNTRY}
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

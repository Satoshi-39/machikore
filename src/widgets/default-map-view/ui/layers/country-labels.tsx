/**
 * 国ラベルレイヤー（テキストのみ）
 */

import React from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point } from 'geojson';
import { LABEL_ZOOM_DEFAULT_MAP } from '@/shared/config';
import type { CountryRow } from '@/shared/types/database.types';
import type { MapboxOnPressEvent } from '@/shared/types/common.types';

interface CountryFeatureProperties {
  id: string;
  name: string;
  code: string;
}

interface CountryLabelsProps {
  geoJson: FeatureCollection<Point, CountryFeatureProperties>;
  onPress?: (country: CountryRow) => void;
  countryMap?: Map<string, CountryRow>;
}

export function CountryLabels({ geoJson, onPress, countryMap }: CountryLabelsProps) {

  const handlePress = (event: MapboxOnPressEvent) => {
    const feature = event.features?.[0];
    if (!feature || !onPress || !countryMap) return;

    const countryId = feature.properties?.id as string | undefined;
    if (countryId) {
      const country = countryMap.get(countryId);
      if (country) {
        onPress(country);
      }
    }
  };

  return (
    <Mapbox.ShapeSource
      id="countries-source"
      shape={geoJson}
      onPress={handlePress}
      hitbox={{ width: 100, height: 50 }}
    >
      <Mapbox.SymbolLayer
        id="countries-labels"
        minZoomLevel={LABEL_ZOOM_DEFAULT_MAP.COUNTRY.min}
        maxZoomLevel={LABEL_ZOOM_DEFAULT_MAP.COUNTRY.max}
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

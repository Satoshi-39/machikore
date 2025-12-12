/**
 * 地方ラベルレイヤー（テキストのみ）
 */

import React from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point } from 'geojson';
import type { RegionRow } from '@/shared/types/database.types';
import { MAP_ZOOM } from '@/shared/config';

interface RegionFeatureProperties {
  id: string;
  name: string;
}

interface RegionLabelsProps {
  geoJson: FeatureCollection<Point, RegionFeatureProperties>;
  onPress?: (region: RegionRow) => void;
  regionMap?: Map<string, RegionRow>;
}

export function RegionLabels({ geoJson, onPress, regionMap }: RegionLabelsProps) {
  const handlePress = (event: any) => {
    const feature = event.features?.[0];
    if (!feature || !onPress || !regionMap) return;

    const regionId = feature.properties?.id;
    if (regionId) {
      const region = regionMap.get(regionId);
      if (region) {
        onPress(region);
      }
    }
  };

  return (
    <Mapbox.ShapeSource
      id="regions-source"
      shape={geoJson}
      onPress={handlePress}
    >
      <Mapbox.SymbolLayer
        id="regions-labels"
        minZoomLevel={MAP_ZOOM.REGION - 3}
        maxZoomLevel={MAP_ZOOM.REGION + 1}
        style={{
          textField: ['get', 'name'],
          textSize: 16,
          textColor: '#0891b2', // cyan-600
          textHaloColor: '#FFFFFF',
          textHaloWidth: 2,
          textFont: ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
        }}
      />
    </Mapbox.ShapeSource>
  );
}

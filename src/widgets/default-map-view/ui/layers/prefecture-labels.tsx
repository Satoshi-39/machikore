/**
 * 都道府県ラベルレイヤー（テキストのみ）
 */

import React from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point } from 'geojson';

interface PrefectureLabelsProps {
  geoJson: FeatureCollection<Point, { id: string; name: string }>;
}

export function PrefectureLabels({ geoJson }: PrefectureLabelsProps) {
  return (
    <Mapbox.ShapeSource
      id="prefectures-source"
      shape={geoJson}
    >
      <Mapbox.SymbolLayer
        id="prefectures-labels"
        minZoomLevel={5}
        maxZoomLevel={10}
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

/**
 * 都道府県ラベルレイヤー（アイコン + テキスト横並び）
 */

import React from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point } from 'geojson';
import { LOCATION_ICONS } from '@/shared/config';

// アイコン画像（紫色）
const shieldIcon = require('@assets/icons/shield-prefecture.png');

interface PrefectureLabelsProps {
  geoJson: FeatureCollection<Point, { id: string; name: string }>;
}

export function PrefectureLabels({ geoJson }: PrefectureLabelsProps) {
  return (
    <>
      {/* アイコン画像を登録 */}
      <Mapbox.Images images={{ 'prefecture-icon': shieldIcon }} />

      <Mapbox.ShapeSource
        id="prefectures-source"
        shape={geoJson}
      >
        {/* アイコン + テキスト横並び */}
        <Mapbox.SymbolLayer
          id="prefectures-labels"
          minZoomLevel={5}
          maxZoomLevel={10}
          style={{
            iconImage: 'prefecture-icon',
            iconSize: 0.35,
            textField: ['get', 'name'],
            textSize: 16,
            textColor: LOCATION_ICONS.PREFECTURE.color,
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

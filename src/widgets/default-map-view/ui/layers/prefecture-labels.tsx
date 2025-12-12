/**
 * 都道府県ラベルレイヤー（アイコン + テキスト横並び）
 */

import React from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point } from 'geojson';
import { LOCATION_ICONS, MAP_ZOOM } from '@/shared/config';
import type { PrefectureRow } from '@/shared/types/database.types';

// アイコン画像（紫色）
const shieldIcon = require('@assets/icons/shield-prefecture.png');

interface PrefectureLabelsProps {
  geoJson: FeatureCollection<Point, { id: string; name: string; name_kana?: string; region_id?: string }>;
  prefectureMap?: Map<string, PrefectureRow>;
  onPress?: (prefecture: PrefectureRow) => void;
}

export function PrefectureLabels({ geoJson, prefectureMap, onPress }: PrefectureLabelsProps) {
  const handlePress = (event: any) => {
    const feature = event.features?.[0];
    if (!feature || !onPress || !prefectureMap) return;

    const prefectureId = feature.properties?.id;
    if (prefectureId) {
      const prefecture = prefectureMap.get(prefectureId);
      if (prefecture) {
        onPress(prefecture);
      }
    }
  };

  return (
    <>
      {/* アイコン画像を登録 */}
      <Mapbox.Images images={{ 'prefecture-icon': shieldIcon }} />

      <Mapbox.ShapeSource
        id="prefectures-source"
        shape={geoJson}
        onPress={handlePress}
      >
        {/* アイコン + テキスト横並び */}
        <Mapbox.SymbolLayer
          id="prefectures-labels"
          minZoomLevel={MAP_ZOOM.PREFECTURE - 3}
          maxZoomLevel={MAP_ZOOM.PREFECTURE + 3}
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

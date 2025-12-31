/**
 * 都道府県ラベルレイヤー（アイコン + テキスト横並び）
 */

import React from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point } from 'geojson';
import { LABEL_ZOOM_DEFAULT_MAP, LOCATION_ICONS } from '@/shared/config';
import type { PrefectureRow } from '@/shared/types/database.types';
import type { MapboxOnPressEvent } from '@/shared/types/common.types';

// アイコン画像（紫色）
const shieldIcon = require('@assets/icons/shield-prefecture.png');

interface PrefectureFeatureProperties {
  id: string;
  name: string;
  name_kana?: string;
  region_id?: string;
}

interface PrefectureLabelsProps {
  geoJson: FeatureCollection<Point, PrefectureFeatureProperties>;
  prefectureMap?: Map<string, PrefectureRow>;
  onPress?: (prefecture: PrefectureRow) => void;
}

export function PrefectureLabels({ geoJson, prefectureMap, onPress }: PrefectureLabelsProps) {

  const handlePress = (event: MapboxOnPressEvent) => {
    const feature = event.features?.[0];
    if (!feature || !onPress || !prefectureMap) return;

    const prefectureId = feature.properties?.id as string | undefined;
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
        <Mapbox.SymbolLayer
          id="prefectures-labels"
          minZoomLevel={LABEL_ZOOM_DEFAULT_MAP.PREFECTURE.min}
          maxZoomLevel={LABEL_ZOOM_DEFAULT_MAP.PREFECTURE.max}
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

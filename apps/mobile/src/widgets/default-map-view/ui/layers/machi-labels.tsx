/**
 * 街ラベルレイヤー（アイコン + テキスト横並び）
 */

import React from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point } from 'geojson';
import { LABEL_ZOOM_DEFAULT_MAP, LOCATION_ICONS, colors } from '@/shared/config';
import type { VisitFilter } from '@/features/quick-search-buttons';
import type { MachiRow } from '@/shared/types/database.types';
import type { MapboxOnPressEvent } from '@/shared/types/common.types';

// アイコン画像（緑色）
const storefrontIcon = require('@assets/icons/storefront.png');

interface MachiFeatureProperties {
  id: string;
  name: string;
  isVisited: boolean;
}

interface MachiLabelsProps {
  geoJson: FeatureCollection<Point, MachiFeatureProperties>;
  machiMap?: Map<string, MachiRow>;
  onPress?: (machi: MachiRow) => void;
  visitFilter?: VisitFilter;
}

export function MachiLabels({
  geoJson,
  machiMap,
  onPress,
  visitFilter = 'all',
}: MachiLabelsProps) {
  const isVisitedFilter = visitFilter === 'visited';
  const isUnvisitedFilter = visitFilter === 'not_visited';
  const isFiltered = isVisitedFilter || isUnvisitedFilter;

  // 色は常に街の色（緑）で統一
  const color = LOCATION_ICONS.MACHI.color;

  const handlePress = (event: MapboxOnPressEvent) => {
    const feature = event.features?.[0];
    if (!feature || !onPress || !machiMap) return;

    const machiId = feature.properties?.id as string | undefined;
    if (machiId) {
      const machi = machiMap.get(machiId);
      if (machi) {
        onPress(machi);
      }
    }
  };

  return (
    <>
      {/* アイコン画像を登録 */}
      <Mapbox.Images images={{ 'machi-icon': storefrontIcon }} />

      <Mapbox.ShapeSource
        id="machi-source"
        shape={geoJson}
        onPress={handlePress}
      >
        {/* 訪問済み街（アイコン + テキスト横並び） */}
        <Mapbox.SymbolLayer
          id="visited-machi-labels"
          filter={['==', ['get', 'isVisited'], true]}
          minZoomLevel={isVisitedFilter ? 0 : LABEL_ZOOM_DEFAULT_MAP.MACHI.min}
          style={{
            iconImage: 'machi-icon',
            iconSize: isFiltered ? 0.4 : 0.35,
            textField: ['get', 'name'],
            textSize: isFiltered ? 18 : 16,
            textColor: color,
            textHaloColor: colors.component['map-label']['halo-light'],
            textHaloWidth: 2,
            textFont: ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
            iconTextFit: 'none',
            textAnchor: 'left',
            iconAnchor: 'right',
            textOffset: [0.3, 0],
            visibility: isUnvisitedFilter ? 'none' : 'visible',
          }}
        />

        {/* 未訪問街（アイコン + テキスト横並び） */}
        <Mapbox.SymbolLayer
          id="unvisited-machi-labels"
          filter={['==', ['get', 'isVisited'], false]}
          minZoomLevel={isUnvisitedFilter ? 0 : LABEL_ZOOM_DEFAULT_MAP.MACHI.min}
          style={{
            iconImage: 'machi-icon',
            iconSize: isFiltered ? 0.4 : 0.35,
            textField: ['get', 'name'],
            textSize: isFiltered ? 18 : 16,
            textColor: color,
            textHaloColor: colors.component['map-label']['halo-light'],
            textHaloWidth: 2,
            textFont: ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
            iconTextFit: 'none',
            textAnchor: 'left',
            iconAnchor: 'right',
            textOffset: [0.3, 0],
            visibility: isVisitedFilter ? 'none' : 'visible',
          }}
        />
      </Mapbox.ShapeSource>
    </>
  );
}

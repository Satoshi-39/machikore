/**
 * 街ラベルレイヤー（アイコン + テキスト横並び）
 */

import React from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point } from 'geojson';
import { LOCATION_ICONS, MAP_ZOOM } from '@/shared/config/constants';
import type { VisitFilter } from '@/features/quick-search-buttons';

// アイコン画像（緑色）
const storefrontIcon = require('@assets/icons/storefront.png');

interface MachiLabelsProps {
  geoJson: FeatureCollection<Point, { id: string; name: string; isVisited: boolean }>;
  onPress: (event: any) => void;
  visitFilter?: VisitFilter;
}

export function MachiLabels({ geoJson, onPress, visitFilter = 'all' }: MachiLabelsProps) {
  const isVisitedFilter = visitFilter === 'visited';
  const isUnvisitedFilter = visitFilter === 'not_visited';
  const isFiltered = isVisitedFilter || isUnvisitedFilter;

  // 色は常に街の色（緑）で統一
  const color = LOCATION_ICONS.MACHI.color;

  return (
    <>
      {/* アイコン画像を登録 */}
      <Mapbox.Images images={{ 'machi-icon': storefrontIcon }} />

      <Mapbox.ShapeSource
        id="machi-source"
        shape={geoJson}
        onPress={onPress}
      >
        {/* 訪問済み街（アイコン + テキスト横並び） */}
        <Mapbox.SymbolLayer
          id="visited-machi-labels"
          filter={['==', ['get', 'isVisited'], true]}
          minZoomLevel={isVisitedFilter ? 0 : MAP_ZOOM.MACHI - 1}
          style={{
            iconImage: 'machi-icon',
            iconSize: isFiltered ? 0.4 : 0.35,
            textField: ['get', 'name'],
            textSize: isFiltered ? 18 : 16,
            textColor: color,
            textHaloColor: '#FFFFFF',
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
          minZoomLevel={isUnvisitedFilter ? 0 : MAP_ZOOM.MACHI - 1}
          style={{
            iconImage: 'machi-icon',
            iconSize: isFiltered ? 0.4 : 0.35,
            textField: ['get', 'name'],
            textSize: isFiltered ? 18 : 16,
            textColor: color,
            textHaloColor: '#FFFFFF',
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

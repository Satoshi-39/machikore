/**
 * 街ラベルレイヤー（アイコン + テキスト）
 */

import React from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point } from 'geojson';
import { MAP_MARKER } from '@/shared/config/constants';
import type { VisitFilter } from '@/features/quick-search-buttons';

interface MachiLabelsProps {
  geoJson: FeatureCollection<Point, { id: string; name: string; isVisited: boolean }>;
  onPress: (event: any) => void;
  visitFilter?: VisitFilter;
}

export function MachiLabels({ geoJson, onPress, visitFilter = 'all' }: MachiLabelsProps) {
  const isVisitedFilter = visitFilter === 'visited';
  const isUnvisitedFilter = visitFilter === 'not_visited';
  const isFiltered = isVisitedFilter || isUnvisitedFilter;

  // テキスト色を決定
  const getTextColor = () => {
    if (isVisitedFilter) return MAP_MARKER.COLOR.VISITED_HIGHLIGHT;
    if (isUnvisitedFilter) return MAP_MARKER.COLOR.UNVISITED_HIGHLIGHT;
    return MAP_MARKER.COLOR.DEFAULT;
  };

  return (
    <Mapbox.ShapeSource
      id="machi-source"
      shape={geoJson}
      onPress={onPress}
    >
      {/* 訪問済み街アイコン */}
      <Mapbox.SymbolLayer
        id="visited-machi-icon"
        filter={['==', ['get', 'isVisited'], true]}
        minZoomLevel={isVisitedFilter ? 0 : 12}
        style={{
          textField: isVisitedFilter
            ? MAP_MARKER.MACHI.VISITED_HIGHLIGHT
            : MAP_MARKER.MACHI.VISITED,
          textSize: isVisitedFilter
            ? MAP_MARKER.SIZE.HIGHLIGHT
            : MAP_MARKER.SIZE.DEFAULT,
          textAnchor: 'bottom',
          textOffset: [0, 0.5],
          visibility: isUnvisitedFilter ? 'none' : 'visible',
        }}
      />

      {/* 未訪問街アイコン */}
      <Mapbox.SymbolLayer
        id="unvisited-machi-icon"
        filter={['==', ['get', 'isVisited'], false]}
        minZoomLevel={isUnvisitedFilter ? 0 : 12}
        style={{
          textField: MAP_MARKER.MACHI.UNVISITED,
          textSize: isUnvisitedFilter
            ? MAP_MARKER.SIZE.HIGHLIGHT
            : MAP_MARKER.SIZE.DEFAULT,
          textAnchor: 'bottom',
          textOffset: [0, 0.5],
          visibility: isVisitedFilter ? 'none' : 'visible',
        }}
      />

      {/* 街名テキスト表示 */}
      <Mapbox.SymbolLayer
        id="machi-labels"
        minZoomLevel={isFiltered ? 0 : 12}
        style={{
          textField: ['get', 'name'],
          textSize: isFiltered ? 18 : 16,
          textColor: getTextColor(),
          textHaloColor: '#FFFFFF',
          textHaloWidth: 2,
          textFont: ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
          textAnchor: 'top',
          textOffset: [0, 1.5],
          visibility: 'visible',
        }}
      />
    </Mapbox.ShapeSource>
  );
}

/**
 * 街ラベルレイヤー（アイコン + テキスト）
 */

import React from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point } from 'geojson';

interface MachiLabelsProps {
  geoJson: FeatureCollection<Point, { id: string; name: string; isVisited: boolean }>;
  onPress: (event: any) => void;
}

export function MachiLabels({ geoJson, onPress }: MachiLabelsProps) {
  return (
    <Mapbox.ShapeSource
      id="machi-source"
      shape={geoJson}
      onPress={onPress}
    >
      {/* 訪問済み街アイコン（緑の家）*/}
      <Mapbox.SymbolLayer
        id="visited-machi-icon"
        filter={['==', ['get', 'isVisited'], true]}
        minZoomLevel={12}
        style={{
          textField: '🏠',
          textSize: 24,
          textAnchor: 'bottom',
          textOffset: [0, 0.5],
        }}
      />

      {/* 未訪問街アイコン（青の建物）*/}
      <Mapbox.SymbolLayer
        id="unvisited-machi-icon"
        filter={['==', ['get', 'isVisited'], false]}
        minZoomLevel={12}
        style={{
          textField: '🏘️',
          textSize: 24,
          textAnchor: 'bottom',
          textOffset: [0, 0.5],
        }}
      />

      {/* 街名テキスト表示（太字）*/}
      <Mapbox.SymbolLayer
        id="machi-labels"
        minZoomLevel={12}
        style={{
          textField: ['get', 'name'],
          textSize: 16,
          textColor: '#000000',
          textHaloColor: '#FFFFFF',
          textHaloWidth: 2,
          textFont: ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
          textAnchor: 'top',
          textOffset: [0, 1.5],
        }}
      />
    </Mapbox.ShapeSource>
  );
}

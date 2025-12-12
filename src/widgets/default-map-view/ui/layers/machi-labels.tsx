/**
 * 街ラベルレイヤー（アイコン + テキスト横並び）
 */

import React, { useMemo } from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point, Feature } from 'geojson';
import { LABEL_ZOOM, LOCATION_ICONS } from '@/shared/config/constants';
import type { VisitFilter } from '@/features/quick-search-buttons';
import type { MachiRow } from '@/shared/types/database.types';

// アイコン画像（緑色）
const storefrontIcon = require('@assets/icons/storefront.png');

interface MachiFeatureProperties {
  id: string;
  name: string;
  isVisited: boolean;
}

interface MachiLabelsProps {
  geoJson: FeatureCollection<Point, MachiFeatureProperties>;
  onPress: (event: any) => void;
  visitFilter?: VisitFilter;
  /** 選択中の街（GeoJSONに含まれていなくても表示するため） */
  selectedMachi?: MachiRow | null;
  /** 選択中の街が訪問済みかどうか */
  isSelectedMachiVisited?: boolean;
}

export function MachiLabels({
  geoJson,
  onPress,
  visitFilter = 'all',
  selectedMachi,
  isSelectedMachiVisited = false,
}: MachiLabelsProps) {
  // 選択中の街がGeoJSONに含まれていない場合、追加したGeoJSONを生成
  const combinedGeoJson = useMemo((): FeatureCollection<Point, MachiFeatureProperties> => {
    if (!selectedMachi) return geoJson;

    // 既にGeoJSONに含まれているかチェック
    const exists = geoJson.features.some((f) => f.properties.id === selectedMachi.id);
    if (exists) return geoJson;

    // 含まれていない場合、選択中の街を追加
    const selectedFeature: Feature<Point, MachiFeatureProperties> = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [selectedMachi.longitude, selectedMachi.latitude],
      },
      properties: {
        id: selectedMachi.id,
        name: selectedMachi.name,
        isVisited: isSelectedMachiVisited,
      },
    };

    return {
      ...geoJson,
      features: [...geoJson.features, selectedFeature],
    };
  }, [geoJson, selectedMachi, isSelectedMachiVisited]);

  const selectedMachiId = selectedMachi?.id;
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
        shape={combinedGeoJson}
        onPress={onPress}
      >
        {/* 訪問済み街（アイコン + テキスト横並び）- 選択中の街は除外 */}
        <Mapbox.SymbolLayer
          id="visited-machi-labels"
          filter={selectedMachiId
            ? ['all', ['==', ['get', 'isVisited'], true], ['!=', ['get', 'id'], selectedMachiId]]
            : ['==', ['get', 'isVisited'], true]
          }
          minZoomLevel={isVisitedFilter ? 0 : LABEL_ZOOM.MACHI.min}
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

        {/* 未訪問街（アイコン + テキスト横並び）- 選択中の街は除外 */}
        <Mapbox.SymbolLayer
          id="unvisited-machi-labels"
          filter={selectedMachiId
            ? ['all', ['==', ['get', 'isVisited'], false], ['!=', ['get', 'id'], selectedMachiId]]
            : ['==', ['get', 'isVisited'], false]
          }
          minZoomLevel={isUnvisitedFilter ? 0 : LABEL_ZOOM.MACHI.min}
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

        {/* 選択中の街（常に優先表示） */}
        <Mapbox.SymbolLayer
          id="selected-machi-label"
          filter={selectedMachiId
            ? ['==', ['get', 'id'], selectedMachiId]
            : ['==', 'dummy', 'never-match']
          }
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
            textAllowOverlap: true,
            iconAllowOverlap: true,
          }}
        />
      </Mapbox.ShapeSource>
    </>
  );
}

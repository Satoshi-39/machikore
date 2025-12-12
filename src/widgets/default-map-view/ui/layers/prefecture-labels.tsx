/**
 * 都道府県ラベルレイヤー（アイコン + テキスト横並び）
 */

import React, { useMemo } from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point, Feature } from 'geojson';
import { LABEL_ZOOM, LOCATION_ICONS } from '@/shared/config';
import type { PrefectureRow } from '@/shared/types/database.types';

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
  /** 選択中の都道府県（GeoJSONに含まれていなくても表示するため） */
  selectedPrefecture?: PrefectureRow | null;
}

export function PrefectureLabels({ geoJson, prefectureMap, onPress, selectedPrefecture }: PrefectureLabelsProps) {
  // 選択中の都道府県がGeoJSONに含まれていない場合、追加したGeoJSONを生成
  const combinedGeoJson = useMemo((): FeatureCollection<Point, PrefectureFeatureProperties> => {
    if (!selectedPrefecture || selectedPrefecture.longitude == null || selectedPrefecture.latitude == null) {
      return geoJson;
    }

    // 既にGeoJSONに含まれているかチェック
    const exists = geoJson.features.some((f) => f.properties.id === selectedPrefecture.id);
    if (exists) return geoJson;

    // 含まれていない場合、選択中の都道府県を追加
    const selectedFeature: Feature<Point, PrefectureFeatureProperties> = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [selectedPrefecture.longitude, selectedPrefecture.latitude],
      },
      properties: {
        id: selectedPrefecture.id,
        name: selectedPrefecture.name,
        name_kana: selectedPrefecture.name_kana ?? undefined,
        region_id: selectedPrefecture.region_id ?? undefined,
      },
    };

    return {
      ...geoJson,
      features: [...geoJson.features, selectedFeature],
    };
  }, [geoJson, selectedPrefecture]);

  const selectedPrefectureId = selectedPrefecture?.id;

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
        shape={combinedGeoJson}
        onPress={handlePress}
      >
        {/* 通常の都道府県ラベル（選択中は除外） */}
        <Mapbox.SymbolLayer
          id="prefectures-labels"
          minZoomLevel={LABEL_ZOOM.PREFECTURE.min}
          maxZoomLevel={LABEL_ZOOM.PREFECTURE.max}
          filter={selectedPrefectureId
            ? ['!=', ['get', 'id'], selectedPrefectureId]
            : ['has', 'id']
          }
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

        {/* 選択中の都道府県（常に優先表示） */}
        <Mapbox.SymbolLayer
          id="selected-prefecture-label"
          filter={selectedPrefectureId
            ? ['==', ['get', 'id'], selectedPrefectureId]
            : ['==', 'dummy', 'never-match']
          }
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
            textAllowOverlap: true,
            iconAllowOverlap: true,
          }}
        />
      </Mapbox.ShapeSource>
    </>
  );
}

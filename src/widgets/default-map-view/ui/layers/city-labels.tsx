/**
 * 市区ラベルレイヤー（アイコン + テキスト横並び）
 */

import React, { useMemo } from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point, Feature } from 'geojson';
import { LABEL_ZOOM, LOCATION_ICONS } from '@/shared/config';
import type { CityRow } from '@/shared/types/database.types';

// アイコン画像（オレンジ色）
const businessIcon = require('@assets/icons/business-city.png');

interface CityFeatureProperties {
  id: string;
  name: string;
}

interface CityLabelsProps {
  geoJson: FeatureCollection<Point, CityFeatureProperties>;
  onPress: (event: any) => void;
  /** 選択中の市区（GeoJSONに含まれていなくても表示するため） */
  selectedCity?: CityRow | null;
}

export function CityLabels({ geoJson, onPress, selectedCity }: CityLabelsProps) {
  // 選択中の市区がGeoJSONに含まれていない場合、追加したGeoJSONを生成
  const combinedGeoJson = useMemo((): FeatureCollection<Point, CityFeatureProperties> => {
    if (!selectedCity || selectedCity.longitude == null || selectedCity.latitude == null) {
      return geoJson;
    }

    // 既にGeoJSONに含まれているかチェック
    const exists = geoJson.features.some((f) => f.properties.id === selectedCity.id);
    if (exists) return geoJson;

    // 含まれていない場合、選択中の市区を追加
    const selectedFeature: Feature<Point, CityFeatureProperties> = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [selectedCity.longitude, selectedCity.latitude],
      },
      properties: {
        id: selectedCity.id,
        name: selectedCity.name,
      },
    };

    return {
      ...geoJson,
      features: [...geoJson.features, selectedFeature],
    };
  }, [geoJson, selectedCity]);

  const selectedCityId = selectedCity?.id;

  return (
    <>
      {/* アイコン画像を登録 */}
      <Mapbox.Images images={{ 'city-icon': businessIcon }} />

      <Mapbox.ShapeSource
        id="cities-source"
        shape={combinedGeoJson}
        onPress={onPress}
      >
        {/* 通常の市区ラベル（選択中は除外） */}
        <Mapbox.SymbolLayer
          id="cities-labels"
          minZoomLevel={LABEL_ZOOM.CITY.min}
          maxZoomLevel={LABEL_ZOOM.CITY.max}
          filter={selectedCityId
            ? ['!=', ['get', 'id'], selectedCityId]
            : ['has', 'id']
          }
          style={{
            iconImage: 'city-icon',
            iconSize: 0.35,
            textField: ['get', 'name'],
            textSize: 16,
            textColor: LOCATION_ICONS.CITY.color,
            textHaloColor: '#FFFFFF',
            textHaloWidth: 2,
            textFont: ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
            iconTextFit: 'none',
            textAnchor: 'left',
            iconAnchor: 'right',
            textOffset: [0.3, 0],
          }}
        />

        {/* 選択中の市区（常に優先表示） */}
        <Mapbox.SymbolLayer
          id="selected-city-label"
          filter={selectedCityId
            ? ['==', ['get', 'id'], selectedCityId]
            : ['==', 'dummy', 'never-match']
          }
          style={{
            iconImage: 'city-icon',
            iconSize: 0.35,
            textField: ['get', 'name'],
            textSize: 16,
            textColor: LOCATION_ICONS.CITY.color,
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

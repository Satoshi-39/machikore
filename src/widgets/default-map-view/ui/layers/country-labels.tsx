/**
 * 国ラベルレイヤー（テキストのみ）
 */

import React, { useMemo } from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point, Feature } from 'geojson';
import { LABEL_ZOOM } from '@/shared/config';
import type { CountryRow } from '@/shared/types/database.types';

interface CountryFeatureProperties {
  id: string;
  name: string;
  code: string;
}

interface CountryLabelsProps {
  geoJson: FeatureCollection<Point, CountryFeatureProperties>;
  onPress?: (country: CountryRow | null) => void;
  /** 選択中の国（GeoJSONに含まれていなくても表示するため） */
  selectedCountry?: CountryRow | null;
}

export function CountryLabels({ geoJson, onPress, selectedCountry }: CountryLabelsProps) {
  // 選択中の国がGeoJSONに含まれていない場合、追加したGeoJSONを生成
  const combinedGeoJson = useMemo((): FeatureCollection<Point, CountryFeatureProperties> => {
    if (!selectedCountry) return geoJson;

    // 既にGeoJSONに含まれているかチェック
    const exists = geoJson.features.some((f) => f.properties.id === selectedCountry.id);
    if (exists) return geoJson;

    // 含まれていない場合、選択中の国を追加
    const selectedFeature: Feature<Point, CountryFeatureProperties> = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [selectedCountry.longitude, selectedCountry.latitude],
      },
      properties: {
        id: selectedCountry.id,
        name: selectedCountry.name,
        code: selectedCountry.country_code,
      },
    };

    return {
      ...geoJson,
      features: [...geoJson.features, selectedFeature],
    };
  }, [geoJson, selectedCountry]);

  const selectedCountryId = selectedCountry?.id;

  const handlePress = (event: any) => {
    const feature = event.features?.[0];
    if (!feature || !onPress) return;

    const { id, name, code } = feature.properties;
    if (id && name) {
      // CountryRow形式で渡す（座標はダミーでOK、カード表示には使わない）
      onPress({
        id,
        name,
        name_kana: '',
        latitude: 0,
        longitude: 0,
        country_code: code,
      });
    }
  };

  return (
    <Mapbox.ShapeSource
      id="countries-source"
      shape={combinedGeoJson}
      onPress={handlePress}
    >
      {/* 通常の国ラベル（選択中は除外） */}
      <Mapbox.SymbolLayer
        id="countries-labels"
        minZoomLevel={LABEL_ZOOM.COUNTRY.min}
        maxZoomLevel={LABEL_ZOOM.COUNTRY.max}
        filter={selectedCountryId
          ? ['!=', ['get', 'id'], selectedCountryId]
          : ['has', 'id']
        }
        style={{
          textField: ['get', 'name'],
          textSize: 18,
          textColor: '#000000',
          textHaloColor: '#FFFFFF',
          textHaloWidth: 2,
          textFont: ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
        }}
      />

      {/* 選択中の国（常に優先表示） */}
      <Mapbox.SymbolLayer
        id="selected-country-label"
        filter={selectedCountryId
          ? ['==', ['get', 'id'], selectedCountryId]
          : ['==', 'dummy', 'never-match']
        }
        style={{
          textField: ['get', 'name'],
          textSize: 18,
          textColor: '#000000',
          textHaloColor: '#FFFFFF',
          textHaloWidth: 2,
          textFont: ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
          textAllowOverlap: true,
        }}
      />
    </Mapbox.ShapeSource>
  );
}

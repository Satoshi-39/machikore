/**
 * 国ラベルレイヤー（テキストのみ）
 */

import React from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point } from 'geojson';
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
}

export function CountryLabels({ geoJson, onPress }: CountryLabelsProps) {

  const handlePress = (event: any) => {
    const feature = event.features?.[0];
    if (!feature || !onPress) return;

    const { id, name, code } = feature.properties;
    if (id && name) {
      // CountryRow形式で渡す（座標はダミーでOK、カード表示には使わない）
      onPress({
        id,
        name,
        name_en: name, // 英語名は表示名と同じ（ラベルからは英語名取得できないため）
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
      shape={geoJson}
      onPress={handlePress}
      hitbox={{ width: 100, height: 50 }}
    >
      <Mapbox.SymbolLayer
        id="countries-labels"
        minZoomLevel={LABEL_ZOOM.COUNTRY.min}
        maxZoomLevel={LABEL_ZOOM.COUNTRY.max}
        style={{
          textField: ['get', 'name'],
          textSize: 18,
          textColor: '#000000',
          textHaloColor: '#FFFFFF',
          textHaloWidth: 2,
          textFont: ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
        }}
      />
    </Mapbox.ShapeSource>
  );
}

/**
 * 地方ラベルレイヤー（テキストのみ）
 */

import React, { useMemo } from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point, Feature } from 'geojson';
import type { RegionRow } from '@/shared/types/database.types';
import { LABEL_ZOOM } from '@/shared/config';

interface RegionFeatureProperties {
  id: string;
  name: string;
}

interface RegionLabelsProps {
  geoJson: FeatureCollection<Point, RegionFeatureProperties>;
  onPress?: (region: RegionRow) => void;
  regionMap?: Map<string, RegionRow>;
  /** 選択中の地方（GeoJSONに含まれていなくても表示するため） */
  selectedRegion?: RegionRow | null;
}

export function RegionLabels({ geoJson, onPress, regionMap, selectedRegion }: RegionLabelsProps) {
  // 選択中の地方がGeoJSONに含まれていない場合、追加したGeoJSONを生成
  const combinedGeoJson = useMemo((): FeatureCollection<Point, RegionFeatureProperties> => {
    if (!selectedRegion) return geoJson;

    // 既にGeoJSONに含まれているかチェック
    const exists = geoJson.features.some((f) => f.properties.id === selectedRegion.id);
    if (exists) return geoJson;

    // 含まれていない場合、選択中の地方を追加
    const selectedFeature: Feature<Point, RegionFeatureProperties> = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [selectedRegion.longitude, selectedRegion.latitude],
      },
      properties: {
        id: selectedRegion.id,
        name: selectedRegion.name,
      },
    };

    return {
      ...geoJson,
      features: [...geoJson.features, selectedFeature],
    };
  }, [geoJson, selectedRegion]);

  const selectedRegionId = selectedRegion?.id;

  const handlePress = (event: any) => {
    const feature = event.features?.[0];
    if (!feature || !onPress || !regionMap) return;

    const regionId = feature.properties?.id;
    if (regionId) {
      const region = regionMap.get(regionId);
      if (region) {
        onPress(region);
      }
    }
  };

  return (
    <Mapbox.ShapeSource
      id="regions-source"
      shape={combinedGeoJson}
      onPress={handlePress}
    >
      {/* 通常の地方ラベル（選択中は除外） */}
      <Mapbox.SymbolLayer
        id="regions-labels"
        minZoomLevel={LABEL_ZOOM.REGION.min}
        maxZoomLevel={LABEL_ZOOM.REGION.max}
        filter={selectedRegionId
          ? ['!=', ['get', 'id'], selectedRegionId]
          : ['has', 'id']
        }
        style={{
          textField: ['get', 'name'],
          textSize: 16,
          textColor: '#0891b2', // cyan-600
          textHaloColor: '#FFFFFF',
          textHaloWidth: 2,
          textFont: ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
        }}
      />

      {/* 選択中の地方（常に優先表示） */}
      <Mapbox.SymbolLayer
        id="selected-region-label"
        filter={selectedRegionId
          ? ['==', ['get', 'id'], selectedRegionId]
          : ['==', 'dummy', 'never-match']
        }
        style={{
          textField: ['get', 'name'],
          textSize: 16,
          textColor: '#0891b2', // cyan-600
          textHaloColor: '#FFFFFF',
          textHaloWidth: 2,
          textFont: ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
          textAllowOverlap: true,
        }}
      />
    </Mapbox.ShapeSource>
  );
}

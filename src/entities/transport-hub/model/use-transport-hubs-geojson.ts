/**
 * 交通機関データをGeoJSON形式に変換するhook
 */

import { useMemo } from 'react';
import type { FeatureCollection, Point } from 'geojson';
import type { TransportHubRow, TransportHubType } from '../api/use-transport-hubs';
import { useI18n, getTranslatedName, type TranslationsData } from '@/shared/lib/i18n';

export interface TransportHubGeoJsonProperties {
  id: string;
  name: string;
  type: TransportHubType;
  subtype: string | null;
  operator: string | null;
  network: string | null;
  ref: string | null;
}

/**
 * 交通機関データをGeoJSON形式に変換
 * 現在のロケールに応じて翻訳された名前を使用
 */
export function useTransportHubsGeoJson(
  transportHubs: TransportHubRow[] | undefined
): FeatureCollection<Point, TransportHubGeoJsonProperties> {
  const { locale } = useI18n();

  return useMemo(() => {
    if (!transportHubs || transportHubs.length === 0) {
      return {
        type: 'FeatureCollection',
        features: [],
      };
    }

    return {
      type: 'FeatureCollection',
      features: transportHubs.map((hub) => ({
        type: 'Feature' as const,
        id: hub.id,
        geometry: {
          type: 'Point' as const,
          coordinates: [hub.longitude, hub.latitude],
        },
        properties: {
          id: hub.id,
          name: getTranslatedName(hub.name, hub.name_translations as TranslationsData, locale),
          type: hub.type as TransportHubType,
          subtype: hub.subtype,
          operator: hub.operator,
          network: hub.network,
          ref: hub.ref,
        },
      })),
    };
  }, [transportHubs, locale]);
}

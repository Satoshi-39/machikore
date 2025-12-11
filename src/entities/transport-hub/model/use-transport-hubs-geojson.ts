/**
 * 交通機関データをGeoJSON形式に変換するhook
 */

import { useMemo } from 'react';
import type { FeatureCollection, Point } from 'geojson';
import type { TransportHubRow, TransportHubType } from '../api/use-transport-hubs';

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
 */
export function useTransportHubsGeoJson(
  transportHubs: TransportHubRow[] | undefined
): FeatureCollection<Point, TransportHubGeoJsonProperties> {
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
          name: hub.name,
          type: hub.type as TransportHubType,
          subtype: hub.subtype,
          operator: hub.operator,
          network: hub.network,
          ref: hub.ref,
        },
      })),
    };
  }, [transportHubs]);
}

/**
 * Mapbox初期化
 */

import Mapbox from '@rnmapbox/maps';
import { ENV } from '@/shared/config/env';

/**
 * Mapboxを初期化する
 */
export function initMapbox(): void {
  const accessToken = ENV.MAPBOX_ACCESS_TOKEN;

  if (!accessToken) {
    console.warn('Mapbox access token is not set');
    return;
  }

  Mapbox.setAccessToken(accessToken);
  console.log('Mapbox initialized');
}

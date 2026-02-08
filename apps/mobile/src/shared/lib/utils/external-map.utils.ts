/**
 * 外部マップ（Google Maps）関連ユーティリティ
 */

import { Linking } from 'react-native';
import type { PopupMenuItem } from '@/shared/ui';
import { log } from '@/shared/config/logger';

/**
 * Google Mapsで場所を開くURL生成
 */
export function getGoogleMapsUrl(params: {
  latitude: number;
  longitude: number;
  googlePlaceId?: string | null;
}): string {
  const { latitude, longitude, googlePlaceId } = params;
  return googlePlaceId
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${googlePlaceId}`
    : `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

/**
 * Google Mapsで場所を開く
 */
export async function openGoogleMaps(params: {
  latitude: number;
  longitude: number;
  googlePlaceId?: string | null;
}): Promise<void> {
  try {
    await Linking.openURL(getGoogleMapsUrl(params));
  } catch (error) {
    log.error('[openGoogleMaps] Error:', error);
  }
}

/**
 * PopupMenu用のGoogle Mapsメニュー項目を生成
 */
export function createGoogleMapsMenuItem(params: {
  latitude: number;
  longitude: number;
  googlePlaceId?: string | null;
  label: string;
}): PopupMenuItem {
  const { latitude, longitude, googlePlaceId, label } = params;
  return {
    id: 'open-google-maps',
    label,
    icon: 'information-circle-outline',
    onPress: () => openGoogleMaps({ latitude, longitude, googlePlaceId }),
  };
}

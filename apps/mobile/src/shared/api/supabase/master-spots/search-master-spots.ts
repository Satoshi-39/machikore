/**
 * マスタースポット検索API
 */

import { supabase } from '../client';
import { log } from '@/shared/config/logger';
import type { MasterSpotDisplay } from './types';

/**
 * マスタースポットをキーワードで検索（発見タブ用）
 */
export async function searchMasterSpots(
  query: string,
  limit: number = 30
): Promise<MasterSpotDisplay[]> {
  const { data, error } = await supabase
    .from('master_spots')
    .select(
      `
      id,
      name,
      latitude,
      longitude,
      google_place_id,
      google_formatted_address,
      google_short_address,
      google_types,
      user_spots (id)
    `
    )
    .or(`name.ilike.%${query}%,google_short_address.ilike.%${query}%`)
    .limit(limit);

  if (error) {
    log.error('[MasterSpots] Error:', error);
    return [];
  }

  return (data || []).map((spot: any) => ({
    id: spot.id,
    name: spot.name,
    latitude: spot.latitude,
    longitude: spot.longitude,
    google_place_id: spot.google_place_id,
    google_formatted_address: spot.google_formatted_address,
    google_short_address: spot.google_short_address,
    google_types: spot.google_types,
    user_spots_count: spot.user_spots?.length || 0,
  }));
}

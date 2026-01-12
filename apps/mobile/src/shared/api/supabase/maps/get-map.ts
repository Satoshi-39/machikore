/**
 * 単一マップ取得
 */

import { supabase, handleSupabaseError } from '../client';
import type { MapWithUser } from '@/shared/types';
import { mapResponseToMapWithUser } from './types';

/**
 * マップ詳細を取得（IDで）
 */
export async function getMapById(mapId: string): Promise<MapWithUser | null> {
  const { data, error } = await supabase
    .from('maps')
    .select(`
      *,
      users (
        id,
        username,
        display_name,
        avatar_url
      ),
      map_tags (
        tags (
          id,
          name,
          slug
        )
      )
    `)
    .eq('id', mapId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    handleSupabaseError('getMapById', error);
  }

  if (!data) return null;

  return mapResponseToMapWithUser(data);
}

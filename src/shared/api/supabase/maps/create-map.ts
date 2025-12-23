/**
 * マップ作成
 */

import { supabase, handleSupabaseError } from '../client';
import type { MapWithUser } from '@/shared/types';
import { mapResponseToMapWithUser } from './types';
import { log } from '@/shared/config/logger';

export interface CreateMapParams {
  id: string; // UUID
  user_id: string;
  name: string;
  description?: string | null;
  category_id: string;
  is_public: boolean;
  is_official?: boolean;
  thumbnail_url?: string | null;
}

/**
 * 新しいマップを作成
 */
export async function createMap(params: CreateMapParams): Promise<MapWithUser> {
  log.debug('[Maps] Creating map:', params);

  const { data, error } = await supabase
    .from('maps')
    .insert({
      id: params.id,
      user_id: params.user_id,
      name: params.name,
      description: params.description || null,
      category_id: params.category_id,
      is_public: params.is_public,
      is_official: params.is_official || false,
      thumbnail_url: params.thumbnail_url || null,
      spots_count: 0,
      likes_count: 0,
    })
    .select(`
      *,
      users (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .single();

  if (error) {
    handleSupabaseError('createMap', error);
  }

  log.info('[Maps] Success:', data);

  return mapResponseToMapWithUser(data);
}

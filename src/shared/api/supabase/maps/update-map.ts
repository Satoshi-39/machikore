/**
 * マップ更新
 */

import { supabase, handleSupabaseError } from '../client';
import type { MapWithUser, ProseMirrorDoc } from '@/shared/types';
import { mapResponseToMapWithUser } from './types';

export interface UpdateMapParams {
  id: string;
  name?: string;
  description?: string | null;
  category?: string | null;
  category_id?: string | null;
  is_public?: boolean;
  is_article_public?: boolean;
  thumbnail_url?: string | null;
  theme_color?: string;
  article_intro?: ProseMirrorDoc | null;
  article_outro?: ProseMirrorDoc | null;
}

/**
 * マップを更新
 */
export async function updateMap(params: UpdateMapParams): Promise<MapWithUser> {
  const { id, ...updateData } = params;

  const { data, error } = await supabase
    .from('maps')
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
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
    handleSupabaseError('updateMap', error);
  }

  return mapResponseToMapWithUser(data);
}

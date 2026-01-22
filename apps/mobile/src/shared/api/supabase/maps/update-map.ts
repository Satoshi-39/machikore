/**
 * マップ更新
 */

import { supabase, handleSupabaseError } from '../client';
import { detectContentLanguage } from '../detect-language';
import type { MapWithUser, ProseMirrorDoc } from '@/shared/types';
import { mapResponseToMapWithUser } from './types';

export interface UpdateMapParams {
  id: string;
  name?: string;
  description?: string | null;
  category?: string | null;
  category_id?: string | null;
  is_public?: boolean;
  thumbnail_url?: string | null;
  article_intro?: ProseMirrorDoc | null;
  article_outro?: ProseMirrorDoc | null;
  show_label_chips?: boolean;
}

/**
 * マップを更新
 */
export async function updateMap(params: UpdateMapParams): Promise<MapWithUser> {
  const { id, ...updateData } = params;

  // テキストコンテンツが更新される場合は言語を再検出
  let language: string | null | undefined;
  if (updateData.name || updateData.description || updateData.article_intro || updateData.article_outro) {
    language = await detectContentLanguage({
      name: updateData.name,
      description: updateData.description,
      articleContent: updateData.article_intro || updateData.article_outro,
    }).catch(() => null);
  }

  const { data, error } = await supabase
    .from('maps')
    .update({
      ...updateData,
      ...(language !== undefined && { language }),
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

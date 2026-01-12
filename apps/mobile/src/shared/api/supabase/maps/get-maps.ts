/**
 * マップ一覧取得
 */

import { supabase, handleSupabaseError } from '../client';
import type { MapWithUser } from '@/shared/types';
import { mapResponseToMapWithUser, type SupabaseMapResponse } from './types';

/**
 * 公開マップ一覧を取得（フィード用）
 * ユーザー情報とタグも含めて取得
 */
export async function getPublicMaps(
  limit: number = 50,
  offset: number = 0
): Promise<MapWithUser[]> {
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
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    handleSupabaseError('getPublicMaps', error);
  }

  return (data || []).map((map: SupabaseMapResponse) => mapResponseToMapWithUser(map));
}

/**
 * ユーザーの公開マップを取得
 */
export async function getUserPublicMaps(userId: string): Promise<MapWithUser[]> {
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
    .eq('user_id', userId)
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) {
    handleSupabaseError('getUserPublicMaps', error);
  }

  return (data || []).map((map: SupabaseMapResponse) => mapResponseToMapWithUser(map));
}

/**
 * ユーザーの全マップを取得（公開・非公開含む）
 */
export async function getUserMaps(userId: string): Promise<MapWithUser[]> {
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
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    handleSupabaseError('getUserMaps', error);
  }

  return (data || []).map((map: SupabaseMapResponse) => mapResponseToMapWithUser(map));
}

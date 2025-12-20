/**
 * マップ記事関連API
 */

import { supabase, handleSupabaseError } from '../client';
import type { MapArticleData, SpotWithImages, ProseMirrorDoc } from '@/shared/types';
import { getMapById } from './get-map';

/**
 * マップ記事データを取得（マップ + スポット一覧 + 画像）
 */
export async function getMapArticle(
  mapId: string,
  currentUserId?: string | null
): Promise<MapArticleData | null> {
  // マップ情報を取得
  const map = await getMapById(mapId);
  if (!map) return null;

  // スポット一覧を画像付きで取得
  const { data: spotsData, error: spotsError } = await supabase
    .from('user_spots')
    .select(`
      *,
      master_spots (*),
      users (
        id,
        username,
        display_name,
        avatar_url
      ),
      images (
        id,
        cloud_path,
        order_index
      ),
      likes (
        id,
        user_id
      )
    `)
    .eq('map_id', mapId)
    .order('order_index', { ascending: true });

  if (spotsError) {
    handleSupabaseError('getMapArticle', spotsError);
  }

  const spots: SpotWithImages[] = (spotsData || []).map((spot: any) => {
    const isLiked = currentUserId
      ? (spot.likes || []).some((like: any) => like.user_id === currentUserId)
      : false;

    return {
      id: spot.id,
      user_id: spot.user_id,
      map_id: spot.map_id,
      master_spot_id: spot.master_spot_id,
      machi_id: spot.machi_id,
      custom_name: spot.custom_name,
      description: spot.description,
      tags: spot.tags,
      spot_color: spot.spot_color || null,
      images_count: spot.images_count,
      likes_count: spot.likes_count,
      bookmarks_count: spot.bookmarks_count ?? 0,
      comments_count: spot.comments_count,
      order_index: spot.order_index,
      created_at: spot.created_at,
      updated_at: spot.updated_at,
      latitude: spot.latitude,
      longitude: spot.longitude,
      google_formatted_address: spot.google_formatted_address,
      google_short_address: spot.google_short_address,
      master_spot: spot.master_spots || null,
      user: spot.users || null,
      is_liked: isLiked,
      article_content: spot.article_content || null,
      images: (spot.images || []).sort((a: any, b: any) => a.order_index - b.order_index),
    };
  });

  return { map, spots };
}

/**
 * スポットの記事内容を更新
 */
export async function updateSpotArticleContent(
  spotId: string,
  articleContent: ProseMirrorDoc | null
): Promise<void> {
  const { error } = await supabase
    .from('user_spots')
    .update({
      article_content: articleContent,
      updated_at: new Date().toISOString(),
    })
    .eq('id', spotId);

  if (error) {
    handleSupabaseError('updateSpotArticleContent', error);
  }
}

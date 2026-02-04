/**
 * マップ記事関連API
 *
 * API層は生データ（JSONB型）をそのまま返す
 * 住所の言語抽出は表示層（entities/widgets）で行う
 */

import { supabase, handleSupabaseError } from '../client';
import type { MapArticleData, SpotWithImages, ProseMirrorDoc } from '@/shared/types';
import { getMapById } from './get-map';

/**
 * マップ記事データを取得（マップ + スポット一覧 + 画像）
 *
 * オーナーの場合は全スポット（非公開含む）を返す
 * 他ユーザーの場合は公開スポットのみを返す
 */
export async function getMapArticle(
  mapId: string,
  currentUserId?: string | null
): Promise<MapArticleData | null> {
  // マップ情報を取得（currentUserIdを渡していいね・ブックマーク状態も含めて取得）
  const map = await getMapById(mapId, currentUserId);
  if (!map) return null;

  // オーナーかどうか判定
  const isOwner = currentUserId === map.user_id;

  // スポット一覧を画像付きで取得
  // オーナーの場合は全スポット、他ユーザーの場合は公開スポットのみ
  let query = supabase
    .from('user_spots')
    .select(`
      *,
      master_spots (*),
      users (
        id,
        username,
        display_name,
        avatar_url,
        avatar_crop
      ),
      images!images_user_spot_id_fkey (
        id,
        cloud_path,
        order_index
      ),
      likes (
        id,
        user_id
      )
    `)
    .eq('map_id', mapId);

  // 他ユーザーの場合は公開スポットのみ
  if (!isOwner) {
    query = query.eq('is_public', true);
  }

  const { data: spotsData, error: spotsError } = await query.order('order_index', { ascending: true });

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
      description: spot.description,
      tags: spot.tags,
      spot_color: spot.spot_color || null,
      // ピン刺し・現在地登録用のスポット名（TEXT形式）
      name: spot.name || null,
      language: spot.language || 'ja',
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
      master_spot: spot.master_spots ? {
        id: spot.master_spots.id,
        name: spot.master_spots.name,
        latitude: spot.master_spots.latitude,
        longitude: spot.master_spots.longitude,
        google_place_id: spot.master_spots.google_place_id,
        google_formatted_address: spot.master_spots.google_formatted_address,
        google_short_address: spot.master_spots.google_short_address,
        google_types: spot.master_spots.google_types,
      } : null,
      user: spot.users || null,
      is_public: spot.is_public,
      is_liked: isLiked,
      article_content: spot.article_content || null,
      images: (spot.images || []).sort((a: any, b: any) => a.order_index - b.order_index),
      thumbnail_image_id: spot.thumbnail_image_id || null,
      thumbnail_crop: spot.thumbnail_crop || null,
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

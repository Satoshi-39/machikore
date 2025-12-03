/**
 * Supabase Spots API
 * スポットの作成・取得など
 */

import { supabase } from './client';
import type { Database } from '@/shared/types/supabase.generated';

type MasterSpotInsert = Database['public']['Tables']['master_spots']['Insert'];
type MasterSpotRow = Database['public']['Tables']['master_spots']['Row'];
type UserSpotInsert = Database['public']['Tables']['user_spots']['Insert'];
type UserSpotRow = Database['public']['Tables']['user_spots']['Row'];

// ===============================
// スポット作成パラメータ
// ===============================

export interface CreateSpotInput {
  userId: string;
  mapId: string;
  machiId: string;
  // master_spot情報
  name: string;
  latitude: number;
  longitude: number;
  googlePlaceId: string;
  googleFormattedAddress?: string | null;
  googleTypes?: string[] | null;
  googlePhoneNumber?: string | null;
  googleWebsiteUri?: string | null;
  googleRating?: number | null;
  googleUserRatingCount?: number | null;
  // user_spot情報
  customName?: string | null;
  description?: string | null;
  tags?: string[] | null;
}

// ===============================
// スポット作成
// ===============================

/**
 * master_spotを取得または作成
 */
async function getOrCreateMasterSpot(input: {
  name: string;
  latitude: number;
  longitude: number;
  googlePlaceId: string;
  googleFormattedAddress?: string | null;
  googleTypes?: string[] | null;
  googlePhoneNumber?: string | null;
  googleWebsiteUri?: string | null;
  googleRating?: number | null;
  googleUserRatingCount?: number | null;
}): Promise<string> {
  // まず既存のmaster_spotを検索（google_place_idで）
  const { data: existing } = await supabase
    .from('master_spots')
    .select('id')
    .eq('google_place_id', input.googlePlaceId)
    .single();

  if (existing) {
    console.log('[getOrCreateMasterSpot] Found existing:', existing.id);
    return existing.id;
  }

  // 新規作成
  const insertData: MasterSpotInsert = {
    name: input.name,
    latitude: input.latitude,
    longitude: input.longitude,
    google_place_id: input.googlePlaceId,
    google_formatted_address: input.googleFormattedAddress ?? null,
    google_types: input.googleTypes ?? null,
    google_phone_number: input.googlePhoneNumber ?? null,
    google_website_uri: input.googleWebsiteUri ?? null,
    google_rating: input.googleRating ?? null,
    google_user_rating_count: input.googleUserRatingCount ?? null,
  };

  const { data, error } = await supabase
    .from('master_spots')
    .insert(insertData)
    .select('id')
    .single();

  if (error) {
    console.error('[getOrCreateMasterSpot] Error:', error);
    throw error;
  }

  console.log('[getOrCreateMasterSpot] Created new:', data.id);
  return data.id;
}

/**
 * スポットを作成（master_spot + user_spot）
 */
export async function createSpot(input: CreateSpotInput): Promise<string> {
  // 1. master_spotを取得または作成
  const masterSpotId = await getOrCreateMasterSpot({
    name: input.name,
    latitude: input.latitude,
    longitude: input.longitude,
    googlePlaceId: input.googlePlaceId,
    googleFormattedAddress: input.googleFormattedAddress,
    googleTypes: input.googleTypes,
    googlePhoneNumber: input.googlePhoneNumber,
    googleWebsiteUri: input.googleWebsiteUri,
    googleRating: input.googleRating,
    googleUserRatingCount: input.googleUserRatingCount,
  });

  // 2. user_spotを作成
  const userSpotInsert: UserSpotInsert = {
    user_id: input.userId,
    map_id: input.mapId,
    master_spot_id: masterSpotId,
    machi_id: input.machiId,
    custom_name: input.customName ?? null,
    description: input.description ?? null,
    tags: input.tags ?? null,
  };

  const { data, error } = await supabase
    .from('user_spots')
    .insert(userSpotInsert)
    .select('id')
    .single();

  if (error) {
    console.error('[createSpot] Error:', error);
    throw error;
  }

  console.log('[createSpot] Created user_spot:', data.id);
  return data.id;
}

// ===============================
// スポット取得
// ===============================

/**
 * user_spotとmaster_spotを結合した型
 */
export interface UserSpotWithMasterSpot extends UserSpotRow {
  master_spot: MasterSpotRow | null;
}

/**
 * マップIDでスポット一覧を取得
 */
export async function getSpotsByMapId(mapId: string): Promise<UserSpotWithMasterSpot[]> {
  const { data, error } = await supabase
    .from('user_spots')
    .select(`
      *,
      master_spots (*)
    `)
    .eq('map_id', mapId)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('[getSpotsByMapId] Error:', error);
    throw error;
  }

  return (data || []).map((spot: any) => ({
    ...spot,
    master_spot: spot.master_spots || null,
  }));
}

// ===============================
// スポット更新
// ===============================

export interface UpdateSpotInput {
  id: string;
  custom_name?: string | null;
  description?: string | null;
  tags?: string[] | null;
  order_index?: number;
  map_id?: string;
}

/**
 * スポットを更新（user_spotのカスタマイズ可能フィールドのみ）
 */
export async function updateSpot(input: UpdateSpotInput): Promise<UserSpotRow> {
  const { id, ...updateData } = input;

  const { data, error } = await supabase
    .from('user_spots')
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[updateSpot] Error:', error);
    throw error;
  }

  return data;
}

// ===============================
// スポット削除
// ===============================

/**
 * スポットを削除（関連する画像も自動削除される）
 */
export async function deleteSpot(spotId: string): Promise<void> {
  const { error } = await supabase
    .from('user_spots')
    .delete()
    .eq('id', spotId);

  if (error) {
    console.error('[deleteSpot] Error:', error);
    throw error;
  }
}

// ===============================
// スポットをIDで取得
// ===============================

/**
 * IDでスポットを取得（master_spotを結合）
 */
export async function getSpotById(spotId: string): Promise<UserSpotWithMasterSpot | null> {
  const { data, error } = await supabase
    .from('user_spots')
    .select(`
      *,
      master_spots (*)
    `)
    .eq('id', spotId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    console.error('[getSpotById] Error:', error);
    throw error;
  }

  return {
    ...data,
    master_spot: (data as any).master_spots || null,
  };
}

/**
 * IDでスポットを詳細情報付きで取得（user, master_spot, is_liked含む）
 * SpotWithDetails型を返す（SpotCardで使用可能）
 */
export async function getSpotWithDetails(
  spotId: string,
  currentUserId?: string | null
): Promise<import('@/shared/types').SpotWithDetails | null> {
  const { data, error } = await supabase
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
      maps (
        id,
        name
      ),
      likes (
        id,
        user_id
      )
    `)
    .eq('id', spotId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('[getSpotWithDetails] Error:', error);
    throw error;
  }

  const spot = data as any;
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
    images_count: spot.images_count,
    likes_count: spot.likes_count,
    comments_count: spot.comments_count,
    order_index: spot.order_index,
    created_at: spot.created_at,
    updated_at: spot.updated_at,
    master_spot: spot.master_spots || null,
    user: spot.users || null,
    map: spot.maps ? { id: spot.maps.id, name: spot.maps.name } : null,
    is_liked: isLiked,
  };
}

// ===============================
// 公開スポット取得
// ===============================

/**
 * 公開スポット一覧を取得
 * @param currentUserId - 現在のユーザーID（いいね状態を取得するため）
 */
export async function getPublicSpots(
  limit: number = 50,
  offset: number = 0,
  currentUserId?: string | null
) {
  const { data, error } = await supabase
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
      maps!inner (
        id,
        name,
        is_public
      ),
      likes (
        id,
        user_id
      )
    `)
    .eq('maps.is_public', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Failed to fetch public spots:', error);
    throw error;
  }

  return (data || []).map((spot: any) => {
    // 現在のユーザーがいいねしているかチェック
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
      images_count: spot.images_count,
      likes_count: spot.likes_count,
      comments_count: spot.comments_count,
      order_index: spot.order_index,
      created_at: spot.created_at,
      updated_at: spot.updated_at,
      master_spot: spot.master_spots || null,
      user: spot.users || null,
      map: spot.maps ? { id: spot.maps.id, name: spot.maps.name } : null,
      is_liked: isLiked,
    };
  });
}

// ===============================
// マスタースポット取得（デフォルトマップ用）
// ===============================

export interface MasterSpotDisplay {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  google_place_id: string | null;
  google_formatted_address: string | null;
  google_types: string[] | null;
  google_phone_number: string | null;
  google_website_uri: string | null;
  google_rating: number | null;
  google_user_rating_count: number | null;
  likes_count: number;
  user_spots_count: number;
}

/**
 * ビューポート範囲内のマスタースポットを取得（Supabase版）
 * ユーザー投稿があるマスタースポットのみ返す
 */
export async function getMasterSpotsByBounds(
  minLat: number,
  maxLat: number,
  minLng: number,
  maxLng: number,
  limit: number = 500
): Promise<MasterSpotDisplay[]> {
  const { data, error } = await supabase
    .from('master_spots')
    .select(`
      id,
      name,
      latitude,
      longitude,
      google_place_id,
      google_formatted_address,
      google_types,
      google_phone_number,
      google_website_uri,
      google_rating,
      google_user_rating_count,
      likes_count,
      user_spots!inner (id)
    `)
    .gte('latitude', minLat)
    .lte('latitude', maxLat)
    .gte('longitude', minLng)
    .lte('longitude', maxLng)
    .limit(limit);

  if (error) {
    console.error('[getMasterSpotsByBounds] Error:', error);
    throw error;
  }

  return (data || []).map((spot: any) => ({
    id: spot.id,
    name: spot.name,
    latitude: spot.latitude,
    longitude: spot.longitude,
    google_place_id: spot.google_place_id,
    google_formatted_address: spot.google_formatted_address,
    google_types: spot.google_types,
    google_phone_number: spot.google_phone_number,
    google_website_uri: spot.google_website_uri,
    google_rating: spot.google_rating,
    google_user_rating_count: spot.google_user_rating_count,
    likes_count: spot.likes_count ?? 0,
    user_spots_count: spot.user_spots?.length || 0,
  }));
}

// ===============================
// master_spot_idからユーザー投稿を取得
// ===============================

/**
 * ユーザー投稿の画像情報
 */
export interface UserSpotImage {
  id: string;
  cloud_path: string | null;
  order_index: number;
}

/**
 * ユーザー投稿（画像付き）
 */
export interface UserSpotWithImages {
  id: string;
  user_id: string;
  map_id: string;
  master_spot_id: string;
  machi_id: string | null;
  custom_name: string | null;
  description: string | null;
  tags: string[] | null;
  images_count: number;
  likes_count: number;
  comments_count: number;
  order_index: number;
  created_at: string;
  updated_at: string;
  master_spot: any;
  user: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
  map: {
    id: string;
    name: string;
  } | null;
  images: UserSpotImage[];
}

/**
 * master_spot_idに紐づく公開ユーザー投稿を取得（画像付き）
 */
export async function getUserSpotsByMasterSpotId(masterSpotId: string, limit: number = 20): Promise<UserSpotWithImages[]> {
  const { data, error } = await supabase
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
      maps!inner (
        id,
        name,
        is_public
      ),
      images (
        id,
        cloud_path,
        order_index
      )
    `)
    .eq('master_spot_id', masterSpotId)
    .eq('maps.is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch user spots by master_spot_id:', error);
    throw error;
  }

  return (data || []).map((spot: any) => ({
    id: spot.id,
    user_id: spot.user_id,
    map_id: spot.map_id,
    master_spot_id: spot.master_spot_id,
    machi_id: spot.machi_id,
    custom_name: spot.custom_name,
    description: spot.description,
    tags: spot.tags,
    images_count: spot.images_count,
    likes_count: spot.likes_count,
    comments_count: spot.comments_count,
    order_index: spot.order_index,
    created_at: spot.created_at,
    updated_at: spot.updated_at,
    master_spot: spot.master_spots || null,
    user: spot.users || null,
    map: spot.maps ? { id: spot.maps.id, name: spot.maps.name } : null,
    images: (spot.images || []).sort((a: any, b: any) => a.order_index - b.order_index),
  }));
}

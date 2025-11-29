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
// 公開スポット取得
// ===============================

/**
 * 公開スポット一覧を取得（フィード用）
 */
export async function getPublicSpots(limit: number = 50, offset: number = 0) {
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
        is_public
      )
    `)
    .eq('maps.is_public', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Failed to fetch public spots:', error);
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
  }));
}

/**
 * Supabase User Spots API
 * ユーザースポットのCRUD・検索
 */

import { supabase, handleSupabaseError } from './client';
import type { Database } from '@/shared/types/supabase.generated';
import type { SpotWithDetails } from '@/shared/types';

type MasterSpotInsert = Database['public']['Tables']['master_spots']['Insert'];
type MasterSpotRow = Database['public']['Tables']['master_spots']['Row'];
type UserSpotInsert = Database['public']['Tables']['user_spots']['Insert'];
type UserSpotRow = Database['public']['Tables']['user_spots']['Row'];

// ===============================
// 型定義
// ===============================

export interface CreateSpotInput {
  userId: string;
  mapId: string;
  machiId: string;
  // master_spot情報
  name: string;
  latitude: number;
  longitude: number;
  googlePlaceId?: string | null;  // ピン刺し・現在地登録の場合はnull
  googleFormattedAddress?: string | null; // 完全住所（コピー用）
  googleShortAddress?: string | null; // 短縮住所（表示用）
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

export interface UpdateSpotInput {
  id: string;
  custom_name?: string | null;
  description?: string | null;
  tags?: string[] | null;
  order_index?: number;
  map_id?: string;
}

export interface UserSpotWithMasterSpot extends UserSpotRow {
  master_spot: MasterSpotRow | null;
}

export interface UserSpotImage {
  id: string;
  cloud_path: string | null;
  order_index: number;
}

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
    theme_color: string;
  } | null;
  images: UserSpotImage[];
}

/**
 * 発見タブ用のスポット検索結果型
 */
export interface UserSpotSearchResult {
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
  master_spot: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    google_formatted_address: string | null;
    google_short_address: string | null;
  } | null;
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
  googlePlaceId?: string | null;
  googleFormattedAddress?: string | null;
  googleShortAddress?: string | null;
  googleTypes?: string[] | null;
  googlePhoneNumber?: string | null;
  googleWebsiteUri?: string | null;
  googleRating?: number | null;
  googleUserRatingCount?: number | null;
}): Promise<string> {
  // Google Place IDがある場合は既存のmaster_spotを検索
  if (input.googlePlaceId) {
    const { data: existing } = await supabase
      .from('master_spots')
      .select('id')
      .eq('google_place_id', input.googlePlaceId)
      .single();

    if (existing) {
      return existing.id;
    }
  }

  // 新規作成（ピン刺し・現在地登録の場合はgoogle_place_idがnull）
  const insertData: MasterSpotInsert = {
    name: input.name,
    latitude: input.latitude,
    longitude: input.longitude,
    google_place_id: input.googlePlaceId ?? null,
    google_formatted_address: input.googleFormattedAddress ?? null,
    google_short_address: input.googleShortAddress ?? null,
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
    handleSupabaseError('getOrCreateMasterSpot', error);
  }

  return data.id;
}

/**
 * スポットを作成（master_spot + user_spot）
 */
export async function createSpot(input: CreateSpotInput): Promise<string> {
  // 1. google_place_idがある場合のみmaster_spotを取得または作成
  let masterSpotId: string | null = null;
  if (input.googlePlaceId) {
    masterSpotId = await getOrCreateMasterSpot({
      name: input.name,
      latitude: input.latitude,
      longitude: input.longitude,
      googlePlaceId: input.googlePlaceId,
      googleFormattedAddress: input.googleFormattedAddress,
      googleShortAddress: input.googleShortAddress,
      googleTypes: input.googleTypes,
      googlePhoneNumber: input.googlePhoneNumber,
      googleWebsiteUri: input.googleWebsiteUri,
      googleRating: input.googleRating,
      googleUserRatingCount: input.googleUserRatingCount,
    });
  }

  // 2. user_spotを作成
  // ピン刺し・現在地登録の場合（googlePlaceIdがない）は座標と住所をuser_spotに直接保存
  const userSpotInsert: UserSpotInsert = {
    user_id: input.userId,
    map_id: input.mapId,
    master_spot_id: masterSpotId,
    machi_id: input.machiId,
    latitude: input.googlePlaceId ? null : input.latitude,
    longitude: input.googlePlaceId ? null : input.longitude,
    google_formatted_address: input.googlePlaceId ? null : input.googleFormattedAddress ?? null,
    google_short_address: input.googlePlaceId ? null : input.googleShortAddress ?? null,
    custom_name: input.customName ?? input.name,
    description: input.description ?? null,
    tags: input.tags ?? null,
  };

  const { data, error } = await supabase
    .from('user_spots')
    .insert(userSpotInsert)
    .select('id')
    .single();

  if (error) {
    handleSupabaseError('createSpot', error);
  }

  // 3. マップのspots_countをインクリメント
  const { error: rpcError } = await supabase.rpc('increment_map_spots_count', { map_id: input.mapId });
  if (rpcError) {
    console.error('[createSpot] Failed to increment spots_count:', rpcError);
  }

  return data.id;
}

// ===============================
// スポット取得
// ===============================

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
    handleSupabaseError('getSpotsByMapId', error);
  }

  return (data || []).map((spot: any) => ({
    ...spot,
    master_spot: spot.master_spots || null,
  }));
}

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
      return null;
    }
    handleSupabaseError('getSpotById', error);
  }

  return {
    ...data,
    master_spot: (data as any).master_spots || null,
  };
}

/**
 * IDでスポットを詳細情報付きで取得（user, master_spot, is_liked含む）
 */
export async function getSpotWithDetails(
  spotId: string,
  currentUserId?: string | null
): Promise<SpotWithDetails | null> {
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
    handleSupabaseError('getSpotWithDetails', error);
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
    latitude: spot.latitude,
    longitude: spot.longitude,
    google_formatted_address: spot.google_formatted_address,
    google_short_address: spot.google_short_address,
    master_spot: spot.master_spots || null,
    user: spot.users || null,
    map: spot.maps ? { id: spot.maps.id, name: spot.maps.name } : null,
    is_liked: isLiked,
  };
}

// ===============================
// スポット更新
// ===============================

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
    handleSupabaseError('updateSpot', error);
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
  // まずスポット情報を取得（map_idが必要）
  const { data: spot } = await supabase
    .from('user_spots')
    .select('map_id')
    .eq('id', spotId)
    .single();

  const mapId = spot?.map_id;

  const { error } = await supabase
    .from('user_spots')
    .delete()
    .eq('id', spotId);

  if (error) {
    handleSupabaseError('deleteSpot', error);
  }

  // マップのspots_countをデクリメント
  if (mapId) {
    const { error: rpcError } = await supabase.rpc('decrement_map_spots_count', { map_id: mapId });
    if (rpcError) {
      console.error('[deleteSpot] Failed to decrement spots_count:', rpcError);
    }
  }
}

// ===============================
// 公開スポット取得
// ===============================

/**
 * 公開スポット一覧を取得
 */
export async function getPublicSpots(
  limit: number = 50,
  offset: number = 0,
  currentUserId?: string | null
): Promise<SpotWithDetails[]> {
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
    handleSupabaseError('getPublicSpots', error);
  }

  return (data || []).map((spot: any) => {
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
      latitude: spot.latitude,
      longitude: spot.longitude,
      google_formatted_address: spot.google_formatted_address,
      google_short_address: spot.google_short_address,
      master_spot: spot.master_spots || null,
      user: spot.users || null,
      map: spot.maps ? { id: spot.maps.id, name: spot.maps.name } : null,
      is_liked: isLiked,
    };
  });
}

// ===============================
// ユーザースポット検索（発見タブ用）
// ===============================

/**
 * 公開スポットをキーワードで検索（Supabase版）
 * 発見タブの検索で使用
 *
 * 検索対象:
 * 1. user_spots.custom_name, user_spots.description
 * 2. master_spots.name（スポット名）
 */
export async function searchPublicUserSpots(
  query: string,
  limit: number = 30
): Promise<UserSpotSearchResult[]> {
  // 1. user_spotsのcustom_name, descriptionで検索
  const { data: userSpotResults } = await supabase
    .from('user_spots')
    .select(`
      *,
      master_spots (
        id,
        name,
        latitude,
        longitude,
        google_formatted_address,
        google_short_address
      ),
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
      )
    `)
    .eq('maps.is_public', true)
    .or(`custom_name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(limit);


  // 2. master_spotsの名前で検索し、紐づくuser_spotsを取得
  const { data: masterSpotResults } = await supabase
    .from('master_spots')
    .select(`
      id,
      name,
      latitude,
      longitude,
      google_formatted_address,
      google_short_address,
      user_spots (
        *,
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
        )
      )
    `)
    .ilike('name', `%${query}%`)
    .limit(limit);


  // 結果をマージ（重複排除）
  const resultMap = new Map<string, UserSpotSearchResult>();

  // user_spotsの結果を追加
  (userSpotResults || []).forEach((spot: any) => {
    resultMap.set(spot.id, {
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
    });
  });

  // master_spotsからのuser_spotsを追加（公開マップのみ）
  (masterSpotResults || []).forEach((masterSpot: any) => {
    const userSpots = masterSpot.user_spots || [];
    userSpots.forEach((spot: any) => {
      // 公開マップのスポットのみ、かつ重複排除
      if (spot.maps?.is_public && !resultMap.has(spot.id)) {
        resultMap.set(spot.id, {
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
          master_spot: {
            id: masterSpot.id,
            name: masterSpot.name,
            latitude: masterSpot.latitude,
            longitude: masterSpot.longitude,
            google_formatted_address: masterSpot.google_formatted_address,
            google_short_address: masterSpot.google_short_address,
          },
          user: spot.users || null,
          map: spot.maps ? { id: spot.maps.id, name: spot.maps.name } : null,
        });
      }
    });
  });

  // 新着順にソートしてlimit件まで返す
  return Array.from(resultMap.values())
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

// ===============================
// master_spot_idからユーザー投稿を取得
// ===============================

// ===============================
// マップ内スポット検索
// ===============================

/**
 * マップ内スポット検索結果の型
 */
export interface MapSpotSearchResult {
  id: string;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
}

/**
 * 指定マップ内のスポットをキーワードで検索
 * other-map-searchで使用
 */
export async function searchSpotsByMapId(
  mapId: string,
  query: string,
  limit: number = 30
): Promise<MapSpotSearchResult[]> {
  // 1. user_spotsのcustom_nameで検索
  const { data: customNameResults } = await supabase
    .from('user_spots')
    .select(`
      id,
      custom_name,
      master_spots (
        name,
        latitude,
        longitude,
        google_short_address
      )
    `)
    .eq('map_id', mapId)
    .ilike('custom_name', `%${query}%`)
    .limit(limit);

  // 2. master_spotsの名前で検索
  const { data: masterNameResults } = await supabase
    .from('user_spots')
    .select(`
      id,
      custom_name,
      master_spots!inner (
        name,
        latitude,
        longitude,
        google_short_address
      )
    `)
    .eq('map_id', mapId)
    .ilike('master_spots.name', `%${query}%`)
    .limit(limit);

  // 結果をマージ（重複排除）
  const resultMap = new Map<string, MapSpotSearchResult>();

  const processSpot = (spot: any) => {
    const masterSpot = spot.master_spots;
    if (masterSpot && !resultMap.has(spot.id)) {
      resultMap.set(spot.id, {
        id: spot.id,
        name: spot.custom_name || masterSpot.name,
        address: masterSpot.google_short_address,
        latitude: masterSpot.latitude,
        longitude: masterSpot.longitude,
      });
    }
  };

  (customNameResults || []).forEach(processSpot);
  (masterNameResults || []).forEach(processSpot);

  return Array.from(resultMap.values()).slice(0, limit);
}

// ===============================
// master_spot_idからユーザー投稿を取得
// ===============================

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
        is_public,
        theme_color
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
    handleSupabaseError('getUserSpotsByMasterSpotId', error);
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
    map: spot.maps ? { id: spot.maps.id, name: spot.maps.name, theme_color: spot.maps.theme_color } : null,
    images: (spot.images || []).sort((a: any, b: any) => a.order_index - b.order_index),
  }));
}

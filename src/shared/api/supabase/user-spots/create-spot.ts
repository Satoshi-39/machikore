/**
 * スポット作成
 */

import { supabase, handleSupabaseError } from '../client';
import { log } from '@/shared/config/logger';
import type { CreateSpotInput, MasterSpotInsert, UserSpotInsert } from './types';

/**
 * master_spotを取得または作成
 */
async function getOrCreateMasterSpot(input: {
  name: string;
  latitude: number;
  longitude: number;
  machiId?: string | null;
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
      .select('id, machi_id')
      .eq('google_place_id', input.googlePlaceId)
      .single();

    if (existing) {
      // 既存のmaster_spotにmachi_idがない場合は更新（新しいmachiIdがある場合のみ）
      if (!existing.machi_id && input.machiId) {
        await supabase
          .from('master_spots')
          .update({ machi_id: input.machiId })
          .eq('id', existing.id);
      }
      return existing.id;
    }
  }

  // 新規作成（ピン刺し・現在地登録の場合はgoogle_place_idがnull）
  const insertData: MasterSpotInsert = {
    name: input.name,
    latitude: input.latitude,
    longitude: input.longitude,
    machi_id: input.machiId ?? null,
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
      machiId: input.machiId,
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
  // tagsは中間テーブル(spot_tags)で管理するため、ここでは設定しない
  const userSpotInsert: UserSpotInsert & { prefecture_id?: string | null; label_id?: string | null } = {
    user_id: input.userId,
    map_id: input.mapId,
    master_spot_id: masterSpotId,
    machi_id: input.machiId ?? null,
    prefecture_id: input.prefectureId ?? null,
    latitude: input.googlePlaceId ? null : input.latitude,
    longitude: input.googlePlaceId ? null : input.longitude,
    google_formatted_address: input.googlePlaceId ? null : input.googleFormattedAddress ?? null,
    google_short_address: input.googlePlaceId ? null : input.googleShortAddress ?? null,
    custom_name: input.customName ?? input.name,
    description: input.description ?? null,
    article_content: input.articleContent ?? null,
    spot_color: input.spotColor ?? null,
    label_id: input.labelId ?? null,
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
    log.error('[UserSpots] Failed to increment spots_count:', rpcError);
  }

  return data.id;
}

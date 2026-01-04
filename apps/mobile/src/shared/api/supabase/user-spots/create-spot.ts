/**
 * スポット作成
 */

import { supabase, handleSupabaseError } from '../client';
import type { CreateSpotInput, MasterSpotInsert, UserSpotInsert } from './types';

/**
 * master_spotを取得または作成
 * 住所はJSONB形式で多言語対応: { "ja": "日本語住所", "en": "English address" }
 */
async function getOrCreateMasterSpot(input: {
  name: string;
  latitude: number;
  longitude: number;
  languageCode: string;
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
      .select('id, machi_id, google_formatted_address, google_short_address')
      .eq('google_place_id', input.googlePlaceId)
      .single();

    if (existing) {
      const updates: Record<string, unknown> = {};

      // 既存のmaster_spotにmachi_idがない場合は更新（新しいmachiIdがある場合のみ）
      if (!existing.machi_id && input.machiId) {
        updates.machi_id = input.machiId;
      }

      // 現在の言語の住所がない場合は追加（遅延追加）
      const currentFormattedAddress = (existing.google_formatted_address as Record<string, string>) || {};
      const currentShortAddress = (existing.google_short_address as Record<string, string>) || {};

      if (!currentFormattedAddress[input.languageCode] && input.googleFormattedAddress) {
        updates.google_formatted_address = {
          ...currentFormattedAddress,
          [input.languageCode]: input.googleFormattedAddress,
        };
      }

      if (!currentShortAddress[input.languageCode] && input.googleShortAddress) {
        updates.google_short_address = {
          ...currentShortAddress,
          [input.languageCode]: input.googleShortAddress,
        };
      }

      // 更新が必要な場合のみ実行
      if (Object.keys(updates).length > 0) {
        await supabase
          .from('master_spots')
          .update(updates)
          .eq('id', existing.id);
      }

      return existing.id;
    }
  }

  // 新規作成（JSONB形式で住所を保存）
  const insertData: MasterSpotInsert = {
    name: input.name,
    latitude: input.latitude,
    longitude: input.longitude,
    machi_id: input.machiId ?? null,
    google_place_id: input.googlePlaceId ?? null,
    google_formatted_address: input.googleFormattedAddress
      ? { [input.languageCode]: input.googleFormattedAddress }
      : null,
    google_short_address: input.googleShortAddress
      ? { [input.languageCode]: input.googleShortAddress }
      : null,
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
 * 言語はマップから継承される（マップ作成時に検出）
 */
export async function createSpot(input: CreateSpotInput): Promise<string> {
  // 1. マップの言語を先に取得（master_spotへの住所保存にも使用）
  const { data: mapData } = await supabase
    .from('maps')
    .select('language')
    .eq('id', input.mapId)
    .single();
  const languageCode = mapData?.language || 'ja';

  // 2. google_place_idがある場合のみmaster_spotを取得または作成
  let masterSpotId: string | null = null;
  if (input.googlePlaceId) {
    masterSpotId = await getOrCreateMasterSpot({
      name: input.name,
      latitude: input.latitude,
      longitude: input.longitude,
      languageCode,
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

  // 3. user_spotを作成
  // ピン刺し・現在地登録の場合（googlePlaceIdがない）は座標と住所をuser_spotに直接保存（JSONB形式）
  // tagsは中間テーブル(spot_tags)で管理するため、ここでは設定しない
  // prefecture_id, city_id, prefecture_name, city_name, machi_name は machi テーブルから JOIN で取得するため設定しない
  const userSpotInsert: UserSpotInsert & { label_id?: string | null; language?: string | null } = {
    user_id: input.userId,
    map_id: input.mapId,
    master_spot_id: masterSpotId,
    machi_id: input.machiId ?? null,
    // latitude/longitudeはNOT NULL制約があるため、常に値を設定
    latitude: input.latitude,
    longitude: input.longitude,
    google_formatted_address: input.googlePlaceId
      ? null
      : input.googleFormattedAddress
        ? { [languageCode]: input.googleFormattedAddress }
        : null,
    google_short_address: input.googlePlaceId
      ? null
      : input.googleShortAddress
        ? { [languageCode]: input.googleShortAddress }
        : null,
    description: input.description,
    article_content: input.articleContent ?? null,
    spot_color: input.spotColor ?? null,
    label_id: input.labelId ?? null,
    language: languageCode,
  };

  const { data, error } = await supabase
    .from('user_spots')
    .insert(userSpotInsert)
    .select('id')
    .single();

  if (error) {
    handleSupabaseError('createSpot', error);
  }

  // spots_countはトリガーで自動更新される

  return data.id;
}

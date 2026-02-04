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
}): Promise<string> {
  // Google Place IDがある場合は既存のmaster_spotを検索
  if (input.googlePlaceId) {
    const { data: existing } = await supabase
      .from('master_spots')
      .select('id, name, machi_id, google_formatted_address, google_short_address')
      .eq('google_place_id', input.googlePlaceId)
      .single();

    if (existing) {
      const updates: Record<string, unknown> = {};

      // 既存のmaster_spotにmachi_idがない場合は更新（新しいmachiIdがある場合のみ）
      if (!existing.machi_id && input.machiId) {
        updates.machi_id = input.machiId;
      }

      // 現在の言語のスポット名がない場合は追加（遅延追加）
      const currentName = (existing.name as Record<string, string>) || {};
      if (!currentName[input.languageCode] && input.name) {
        updates.name = {
          ...currentName,
          [input.languageCode]: input.name,
        };
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

  // 新規作成（JSONB形式でスポット名と住所を保存）
  const insertData: MasterSpotInsert = {
    name: { [input.languageCode]: input.name },
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
    });
  }

  // 3. user_spotを作成
  // ピン刺し・現在地登録の場合（googlePlaceIdがない）は座標と住所をuser_spotに直接保存（JSONB形式）
  // tagsは中間テーブル(spot_tags)で管理するため、ここでは設定しない

  // ピン刺し・現在地登録用のスポット名（Google Places検索の場合はmaster_spotのnameを使うためnull）
  const isManualRegistration = !input.googlePlaceId;
  const userSpotName = isManualRegistration && input.spotName
    ? { [languageCode]: input.spotName }
    : null;

  const userSpotInsert: UserSpotInsert & { label_id?: string | null; language?: string | null; name?: Record<string, string> | null; is_public?: boolean; prefecture_id?: string | null; city_id?: string | null } = {
    user_id: input.userId,
    map_id: input.mapId,
    master_spot_id: masterSpotId,
    machi_id: input.machiId ?? null,
    prefecture_id: input.prefectureId ?? null,
    city_id: input.cityId ?? null,
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
    // 現在地/ピン刺し登録用のスポット名（JSONB形式で保存）
    // google_place_idがある場合はmaster_spotのnameを使うためnull
    name: userSpotName,
    description: input.description,
    article_content: input.articleContent ?? null,
    spot_color: input.spotColor ?? null,
    label_id: input.labelId ?? null,
    language: languageCode,
    // スポットの公開/非公開（デフォルトはDBでtrueが設定される）
    is_public: input.isPublic,
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

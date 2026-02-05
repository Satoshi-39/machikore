/**
 * スポット作成
 *
 * Google Places Text Search → master_spots upsert → user_spots 作成
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { SpotQuery } from "../config/personas";
import {
  searchPlace,
  extractPrefectureName,
  extractCityName,
  type PlaceResult,
} from "../lib/google-places";

interface CreateSpotResult {
  userSpotId: string | null;
  created: boolean;
  placeResult: PlaceResult | null;
}

/**
 * スポットを作成
 * 1. Google Places Text Search でスポット情報取得
 * 2. master_spots に upsert
 * 3. user_spots を作成
 */
export async function createSpot(
  supabase: SupabaseClient,
  userId: string,
  mapId: string,
  spotQuery: SpotQuery,
  orderIndex: number,
  dryRun: boolean
): Promise<CreateSpotResult> {
  // Google Places 検索
  console.log(`      🔍 検索中: "${spotQuery.query}"`);
  const place = await searchPlace(spotQuery.query);

  if (!place) {
    console.warn(
      `      ⚠️ スポットが見つかりません: "${spotQuery.query}"`
    );
    return { userSpotId: null, created: false, placeResult: null };
  }

  console.log(
    `      📍 見つかりました: ${place.displayName} (${place.shortAddress || place.formattedAddress})`
  );

  if (dryRun) {
    console.log(
      `      🔍 [DRY RUN] スポット作成スキップ: ${place.displayName}`
    );
    return { userSpotId: null, created: false, placeResult: place };
  }

  // master_spots upsert（google_place_id で重複チェック）
  const masterSpotId = await upsertMasterSpot(supabase, place);

  // user_spots 重複チェック（map_id + master_spot_id）
  const { data: existingSpot } = await supabase
    .from("user_spots")
    .select("id")
    .eq("map_id", mapId)
    .eq("master_spot_id", masterSpotId)
    .limit(1);

  if (existingSpot && existingSpot.length > 0) {
    console.log(
      `      ⏭️ スポット「${place.displayName}」は既に存在（スキップ）`
    );
    return {
      userSpotId: existingSpot[0].id,
      created: false,
      placeResult: place,
    };
  }

  // prefecture_id, city_id を解決
  const prefectureId = await resolvePrefectureId(
    supabase,
    place.addressComponents
  );
  const cityId = await resolveCityId(
    supabase,
    place.addressComponents,
    prefectureId
  );

  // user_spots 作成
  const { data: spotData, error: spotError } = await supabase
    .from("user_spots")
    .insert({
      user_id: userId,
      map_id: mapId,
      master_spot_id: masterSpotId,
      name: place.displayName,
      description: spotQuery.description,
      latitude: place.location.latitude,
      longitude: place.location.longitude,
      language: "ja",
      is_public: true,
      order_index: orderIndex,
      prefecture_id: prefectureId,
      city_id: cityId,
      google_formatted_address: { ja: place.formattedAddress },
      google_short_address: place.shortAddress
        ? { ja: place.shortAddress }
        : null,
    })
    .select("id")
    .single();

  if (spotError) {
    throw new Error(
      `user_spots 作成失敗「${place.displayName}」: ${spotError.message}`
    );
  }

  // maps.spots_count を更新
  await updateSpotsCount(supabase, mapId);

  console.log(
    `      ✅ スポット作成: ${place.displayName} (${spotData.id})`
  );
  return { userSpotId: spotData.id, created: true, placeResult: place };
}

/**
 * master_spots に upsert（google_place_id で重複チェック）
 */
async function upsertMasterSpot(
  supabase: SupabaseClient,
  place: PlaceResult
): Promise<string> {
  // 既存チェック
  const { data: existing } = await supabase
    .from("master_spots")
    .select("id")
    .eq("google_place_id", place.placeId)
    .limit(1);

  if (existing && existing.length > 0) {
    return existing[0].id;
  }

  // 新規作成
  const { data, error } = await supabase
    .from("master_spots")
    .insert({
      name: { ja: place.displayName },
      latitude: place.location.latitude,
      longitude: place.location.longitude,
      google_place_id: place.placeId,
      google_types: place.types,
      google_rating: place.rating,
      google_user_rating_count: place.userRatingCount,
      google_formatted_address: { ja: place.formattedAddress },
      google_short_address: place.shortAddress
        ? { ja: place.shortAddress }
        : null,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`master_spots 作成失敗: ${error.message}`);
  }

  return data.id;
}

/**
 * AddressComponents から prefecture_id を解決
 */
async function resolvePrefectureId(
  supabase: SupabaseClient,
  addressComponents: PlaceResult["addressComponents"]
): Promise<string | null> {
  const prefectureName = extractPrefectureName(addressComponents);
  if (!prefectureName) return null;

  const { data } = await supabase
    .from("prefectures")
    .select("id")
    .eq("name", prefectureName)
    .limit(1)
    .single();

  return data?.id ?? null;
}

/**
 * AddressComponents から city_id を解決
 */
async function resolveCityId(
  supabase: SupabaseClient,
  addressComponents: PlaceResult["addressComponents"],
  prefectureId: string | null
): Promise<string | null> {
  const cityName = extractCityName(addressComponents);
  if (!cityName || !prefectureId) return null;

  const { data } = await supabase
    .from("cities")
    .select("id")
    .eq("prefecture_id", prefectureId)
    .eq("name", cityName)
    .limit(1)
    .single();

  return data?.id ?? null;
}

/**
 * maps.spots_count を実際のスポット数で更新
 */
async function updateSpotsCount(
  supabase: SupabaseClient,
  mapId: string
): Promise<void> {
  const { count } = await supabase
    .from("user_spots")
    .select("id", { count: "exact", head: true })
    .eq("map_id", mapId);

  if (count !== null) {
    await supabase
      .from("maps")
      .update({ spots_count: count })
      .eq("id", mapId);
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/shared/api";
import { getServerEnv } from "@/shared/config";

type AddressComponent = {
  longText: string;
  shortText: string;
  types: string[];
};

type PlaceDetails = {
  placeId: string;
  name: string;
  formattedAddress: string;
  shortAddress: string | null;
  latitude: number;
  longitude: number;
  types?: string[];
  phoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
};

/**
 * addressComponentsから短縮住所を生成（mobileと同じロジック）
 */
function buildShortAddress(addressComponents: AddressComponent[]): string | null {
  const getComponent = (type: string) =>
    addressComponents.find((c) => c.types?.includes(type))?.longText || "";

  // 都道府県 + 市区町村 + 地域名 の短縮住所を構築
  const prefecture = getComponent("administrative_area_level_1");
  const city =
    getComponent("locality") || getComponent("administrative_area_level_2");
  // sublocality_level_2（大字・町名）を優先、なければsublocality_level_1、最後にsublocality
  const sublocality =
    getComponent("sublocality_level_2") ||
    getComponent("sublocality_level_1") ||
    getComponent("sublocality");

  // 短い住所: "東京都渋谷区神南" のような形式
  const shortAddress = [prefecture, city, sublocality].filter(Boolean).join("");

  return shortAddress || null;
}

/**
 * Google Places Text Search API で場所を検索
 * @param languageCode 住所の言語コード（マップの言語を継承）
 */
async function searchPlace(
  name: string,
  address: string,
  languageCode: string = "ja"
): Promise<PlaceDetails | null> {
  const { GOOGLE_PLACES_API_KEY } = getServerEnv();

  if (!GOOGLE_PLACES_API_KEY) {
    console.error("Google Places API key is not configured");
    return null;
  }

  try {
    // Text Search で検索
    const searchResponse = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.addressComponents,places.location,places.types,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount",
        },
        body: JSON.stringify({
          textQuery: `${name} ${address}`,
          languageCode,
        }),
      }
    );

    if (!searchResponse.ok) {
      const error = await searchResponse.text();
      console.error("Google Places Text Search error:", error);
      return null;
    }

    const searchData = await searchResponse.json();

    if (!searchData.places || searchData.places.length === 0) {
      console.error("No places found for:", name, address);
      return null;
    }

    // 最初の結果を使用
    const place = searchData.places[0];

    // addressComponentsから短縮住所を生成
    const shortAddress = place.addressComponents
      ? buildShortAddress(place.addressComponents)
      : null;

    return {
      placeId: place.id,
      name: place.displayName?.text || "",
      formattedAddress: place.formattedAddress || "",
      shortAddress,
      latitude: place.location?.latitude || 0,
      longitude: place.location?.longitude || 0,
      types: place.types || [],
      phoneNumber: place.internationalPhoneNumber,
      websiteUri: place.websiteUri,
      rating: place.rating,
      userRatingCount: place.userRatingCount,
    };
  } catch (error) {
    console.error("Failed to search place:", error);
    return null;
  }
}

/**
 * master_spotを取得または作成
 * 住所はJSONB形式で多言語対応: { "ja": "日本語住所", "en": "English address" }
 */
async function getOrCreateMasterSpot(
  supabase: ReturnType<typeof createAdminClient>,
  input: {
    googlePlaceId: string;
    name: string;
    latitude: number;
    longitude: number;
    formattedAddress?: string;
    shortAddress?: string | null;
    languageCode: string;
    types?: string[];
    phoneNumber?: string;
    websiteUri?: string;
    rating?: number;
    userRatingCount?: number;
    machiId?: string | null;
  }
): Promise<string> {
  // 既存のmaster_spotを検索
  const { data: existing } = await supabase
    .from("master_spots")
    .select("id, machi_id, google_formatted_address, google_short_address")
    .eq("google_place_id", input.googlePlaceId)
    .single();

  if (existing) {
    const updates: Record<string, unknown> = {};

    // 既存のmaster_spotにmachi_idがない場合は更新
    if (!existing.machi_id && input.machiId) {
      updates.machi_id = input.machiId;
    }

    // 現在の言語の住所がない場合は追加（遅延追加）
    const currentFormattedAddress = (existing.google_formatted_address as Record<string, string>) || {};
    const currentShortAddress = (existing.google_short_address as Record<string, string>) || {};

    if (!currentFormattedAddress[input.languageCode] && input.formattedAddress) {
      updates.google_formatted_address = {
        ...currentFormattedAddress,
        [input.languageCode]: input.formattedAddress,
      };
    }

    if (!currentShortAddress[input.languageCode] && input.shortAddress) {
      updates.google_short_address = {
        ...currentShortAddress,
        [input.languageCode]: input.shortAddress,
      };
    }

    // 更新が必要な場合のみ実行
    if (Object.keys(updates).length > 0) {
      await supabase
        .from("master_spots")
        .update(updates)
        .eq("id", existing.id);
    }

    return existing.id;
  }

  // 新規作成（JSONB形式で住所を保存）
  const { data, error } = await supabase
    .from("master_spots")
    .insert({
      name: input.name,
      latitude: input.latitude,
      longitude: input.longitude,
      google_place_id: input.googlePlaceId,
      google_formatted_address: input.formattedAddress
        ? { [input.languageCode]: input.formattedAddress }
        : null,
      google_short_address: input.shortAddress
        ? { [input.languageCode]: input.shortAddress }
        : null,
      google_types: input.types ?? null,
      google_phone_number: input.phoneNumber ?? null,
      google_website_uri: input.websiteUri ?? null,
      google_rating: input.rating ?? null,
      google_user_rating_count: input.userRatingCount ?? null,
      machi_id: input.machiId ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create master_spot:", error);
    throw new Error("Failed to create master_spot");
  }

  return data.id;
}

/**
 * 座標から行政区画を判定し、最寄りの街を検索
 */
async function findMachiForSpot(
  supabase: ReturnType<typeof createAdminClient>,
  latitude: number,
  longitude: number,
  formattedAddress?: string
): Promise<{ machiId: string; prefectureId: string } | null> {
  // 1. PostGISで行政区画を判定
  const { data: adminBoundary } = await supabase.rpc("get_city_by_coordinate", {
    lng: longitude,
    lat: latitude,
  });

  if (!adminBoundary || adminBoundary.length === 0 || !adminBoundary[0].city_id) {
    return null;
  }

  const cityId = adminBoundary[0].city_id;
  const prefectureId = adminBoundary[0].prefecture_id;

  // 2. その市区町村内のmachiを取得
  const { data: machiInCity } = await supabase
    .from("machi")
    .select("id, name, prefecture_id, latitude, longitude")
    .eq("city_id", cityId);

  if (!machiInCity || machiInCity.length === 0) {
    return null;
  }

  // 3. 住所から地名を抽出してマッチング（優先）
  if (formattedAddress) {
    const { data: city } = await supabase
      .from("cities")
      .select("name")
      .eq("id", cityId)
      .single();

    if (city) {
      // 市区町村名以降の地名を抽出
      const cityIndex = formattedAddress.indexOf(city.name);
      if (cityIndex !== -1) {
        const afterCity = formattedAddress.substring(cityIndex + city.name.length);
        const placeMatch = afterCity.match(/^([^\d０-９]+)/);
        if (placeMatch && placeMatch[1]) {
          const placeName = placeMatch[1].trim().replace(/[丁目番号町字大字]/g, "").trim();
          if (placeName) {
            // 完全一致
            const exactMatch = machiInCity.find((m) => m.name === placeName);
            if (exactMatch) {
              return { machiId: exactMatch.id, prefectureId };
            }
            // 部分一致
            const partialMatch = machiInCity.find(
              (m) => m.name.includes(placeName) || placeName.includes(m.name)
            );
            if (partialMatch) {
              return { machiId: partialMatch.id, prefectureId };
            }
          }
        }
      }
    }
  }

  // 4. 住所マッチングで見つからない場合は距離ベースで最寄りを選択
  const validMachi = machiInCity.filter((m) => m.latitude != null && m.longitude != null);
  if (validMachi.length === 0) {
    return { machiId: machiInCity[0].id, prefectureId };
  }

  const sorted = validMachi
    .map((m) => ({
      ...m,
      distance: Math.abs(m.latitude! - latitude) + Math.abs(m.longitude! - longitude),
    }))
    .sort((a, b) => a.distance - b.distance);

  return { machiId: sorted[0].id, prefectureId };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, address, map_id, description } = body;

    if (!name || !address || !map_id || !description) {
      return NextResponse.json(
        { error: "name, address, map_id, and description are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // マップ情報を先に取得（オーナーとlanguage）
    const { data: mapData, error: mapError } = await supabase
      .from("maps")
      .select("user_id, language")
      .eq("id", map_id)
      .single();

    if (mapError || !mapData) {
      return NextResponse.json(
        { error: "Map not found" },
        { status: 404 }
      );
    }

    // マップの言語を使用してGoogle Places APIを呼び出す（デフォルトは日本語）
    const languageCode = mapData.language || "ja";

    // Google Places Text Search APIで場所を検索
    const placeDetails = await searchPlace(name, address, languageCode);
    if (!placeDetails) {
      return NextResponse.json(
        { error: "Failed to find place from Google" },
        { status: 500 }
      );
    }

    // 街を検索
    const machiInfo = await findMachiForSpot(
      supabase,
      placeDetails.latitude,
      placeDetails.longitude,
      placeDetails.formattedAddress
    );

    // master_spotを取得または作成
    const masterSpotId = await getOrCreateMasterSpot(supabase, {
      googlePlaceId: placeDetails.placeId,
      name: placeDetails.name,
      latitude: placeDetails.latitude,
      longitude: placeDetails.longitude,
      formattedAddress: placeDetails.formattedAddress,
      shortAddress: placeDetails.shortAddress,
      languageCode,
      types: placeDetails.types,
      phoneNumber: placeDetails.phoneNumber,
      websiteUri: placeDetails.websiteUri,
      rating: placeDetails.rating,
      userRatingCount: placeDetails.userRatingCount,
      machiId: machiInfo?.machiId,
    });

    // user_spotを作成
    const { data: spotData, error: spotError } = await supabase
      .from("user_spots")
      .insert({
        user_id: mapData.user_id,
        map_id: map_id,
        master_spot_id: masterSpotId,
        machi_id: machiInfo?.machiId ?? null,
        prefecture_id: machiInfo?.prefectureId ?? null,
        latitude: placeDetails.latitude,
        longitude: placeDetails.longitude,
        description: description,
        language: mapData.language,
      })
      .select("id")
      .single();

    if (spotError) {
      console.error("Failed to create user_spot:", spotError);
      return NextResponse.json(
        { error: "Failed to create spot" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: spotData.id,
      name: placeDetails.name,
      address: placeDetails.formattedAddress,
      place_id: placeDetails.placeId,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

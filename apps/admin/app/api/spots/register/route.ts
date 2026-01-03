import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/shared/api";
import { getServerEnv } from "@/shared/config";

type PlaceDetails = {
  placeId: string;
  name: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  types?: string[];
  phoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
};

/**
 * Google Places Text Search API で場所を検索
 */
async function searchPlace(
  name: string,
  address: string
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
            "places.id,places.displayName,places.formattedAddress,places.location,places.types,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount",
        },
        body: JSON.stringify({
          textQuery: `${name} ${address}`,
          languageCode: "ja",
          regionCode: "JP",
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

    return {
      placeId: place.id,
      name: place.displayName?.text || "",
      formattedAddress: place.formattedAddress || "",
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
 */
async function getOrCreateMasterSpot(
  supabase: ReturnType<typeof createAdminClient>,
  input: {
    googlePlaceId: string;
    name: string;
    latitude: number;
    longitude: number;
    formattedAddress?: string;
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
    .select("id, machi_id")
    .eq("google_place_id", input.googlePlaceId)
    .single();

  if (existing) {
    // 既存のmaster_spotにmachi_idがない場合は更新
    if (!existing.machi_id && input.machiId) {
      await supabase
        .from("master_spots")
        .update({ machi_id: input.machiId })
        .eq("id", existing.id);
    }
    return existing.id;
  }

  // 新規作成
  const { data, error } = await supabase
    .from("master_spots")
    .insert({
      name: input.name,
      latitude: input.latitude,
      longitude: input.longitude,
      google_place_id: input.googlePlaceId,
      google_formatted_address: input.formattedAddress ?? null,
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
    const { name, address, map_id, custom_name } = body;

    if (!name || !address || !map_id || !custom_name) {
      return NextResponse.json(
        { error: "name, address, map_id, and custom_name are required" },
        { status: 400 }
      );
    }

    // Google Places Text Search APIで場所を検索
    const placeDetails = await searchPlace(name, address);
    if (!placeDetails) {
      return NextResponse.json(
        { error: "Failed to find place from Google" },
        { status: 500 }
      );
    }

    const supabase = createAdminClient();

    // マップ情報を取得（オーナーとlanguage）
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
        custom_name: custom_name,
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

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/shared/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      name_kana,
      latitude,
      longitude,
      prefecture_id,
      city_id,
      place_type,
    } = body;

    if (!name || !prefecture_id) {
      return NextResponse.json(
        { error: "name and prefecture_id are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 都道府県が存在するか確認
    const { data: prefecture, error: prefError } = await supabase
      .from("prefectures")
      .select("id, name")
      .eq("id", prefecture_id)
      .single();

    if (prefError || !prefecture) {
      return NextResponse.json(
        { error: "Prefecture not found" },
        { status: 404 }
      );
    }

    // 市区町村が指定されている場合、存在確認
    let cityName: string | null = null;
    if (city_id) {
      const { data: city, error: cityError } = await supabase
        .from("cities")
        .select("id, name")
        .eq("id", city_id)
        .single();

      if (cityError || !city) {
        return NextResponse.json(
          { error: "City not found" },
          { status: 404 }
        );
      }
      cityName = city.name;
    }

    // 街IDを生成（都道府県ID_街名のスラグ）
    const machiId = `${prefecture_id}_${name.toLowerCase().replace(/\s+/g, "_")}`;

    // 既存の街があるかチェック
    const { data: existingMachi } = await supabase
      .from("machi")
      .select("id")
      .eq("id", machiId)
      .single();

    if (existingMachi) {
      return NextResponse.json(
        { error: "この街は既に登録されています" },
        { status: 409 }
      );
    }

    // 街を作成
    const { data: machi, error: machiError } = await supabase
      .from("machi")
      .insert({
        id: machiId,
        name,
        name_kana: name_kana || null,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        prefecture_id,
        prefecture_name: prefecture.name,
        city_id: city_id || null,
        city_name: cityName,
        place_type: place_type || "neighbourhood",
      })
      .select("id, name")
      .single();

    if (machiError) {
      console.error("Failed to create machi:", machiError);
      return NextResponse.json(
        { error: "Failed to create machi" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: machi.id,
      name: machi.name,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

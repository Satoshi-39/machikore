import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/shared/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      user_id,
      category_id,
      is_public,
      is_official,
      language,
    } = body;

    if (!name || !user_id) {
      return NextResponse.json(
        { error: "name and user_id are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // ユーザーが存在するか確認
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("id", user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // カテゴリが指定されている場合、存在確認
    if (category_id) {
      const { data: category, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("id", category_id)
        .single();

      if (categoryError || !category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
    }

    // マップを作成
    const { data: map, error: mapError } = await supabase
      .from("maps")
      .insert({
        name,
        description: description || null,
        user_id,
        category_id: category_id || null,
        is_public: is_public ?? false,
        is_official: is_official ?? false,
        language: language || "ja",
      })
      .select("id, name")
      .single();

    if (mapError) {
      console.error("Failed to create map:", mapError);
      return NextResponse.json(
        { error: "Failed to create map" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: map.id,
      name: map.name,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

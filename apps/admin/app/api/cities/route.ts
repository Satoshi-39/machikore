import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/shared/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const prefectureId = searchParams.get("prefecture_id");

  if (!prefectureId) {
    return NextResponse.json({ error: "prefecture_id is required" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("cities")
      .select("id, name")
      .eq("prefecture_id", prefectureId)
      .order("name", { ascending: true });

    if (error) {
      console.error("Failed to fetch cities:", error);
      return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

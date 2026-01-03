import { NextResponse } from "next/server";
import { createServerClient } from "@/shared/api";

export async function GET() {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("maps")
      .select(`
        id,
        name,
        user:users!maps_user_id_fkey(display_name)
      `)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Failed to fetch maps:", error);
      return NextResponse.json({ error: "Failed to fetch maps" }, { status: 500 });
    }

    const maps = (data ?? []).map((map) => ({
      id: map.id,
      name: map.name,
      user_display_name: map.user?.display_name ?? "不明",
    }));

    return NextResponse.json(maps);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

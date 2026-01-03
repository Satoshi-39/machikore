import { NextResponse } from "next/server";
import { createAdminClient } from "@/shared/api";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("prefectures")
      .select("id, name")
      .order("id", { ascending: true });

    if (error) {
      console.error("Failed to fetch prefectures:", error);
      return NextResponse.json({ error: "Failed to fetch prefectures" }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

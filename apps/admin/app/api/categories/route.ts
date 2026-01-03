import { NextResponse } from "next/server";
import { createServerClient } from "@/shared/api";

export async function GET() {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Failed to fetch categories:", error);
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/shared/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("users")
      .select("id, display_name, username")
      .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
      .eq("status", "active")
      .order("display_name")
      .limit(10);

    if (error) {
      console.error("Failed to search users:", error);
      return NextResponse.json({ error: "Failed to search users" }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

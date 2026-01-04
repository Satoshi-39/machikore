import { createServerClient } from "@/shared/api";
import type { UserDetail } from "../model/types";

export async function getUserDetail(userId: string): Promise<UserDetail | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }

  return data;
}

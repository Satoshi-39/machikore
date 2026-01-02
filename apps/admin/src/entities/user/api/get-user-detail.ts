import { createServerClient } from "@/shared/api";

export type UserDetail = {
  id: string;
  username: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  status: string;
  is_premium: boolean | null;
  premium_started_at: string | null;
  premium_expires_at: string | null;
  age_group: string | null;
  gender: string | null;
  country: string | null;
  prefecture: string | null;
  created_at: string;
  updated_at: string;
  suspended_at: string | null;
  suspended_reason: string | null;
};

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

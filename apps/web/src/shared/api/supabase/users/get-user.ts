import { createClient } from "../server";

export type UserProfile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
};

/**
 * ユーザー名でユーザープロフィールを取得
 */
export async function getUserByUsername(
  username: string
): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("id, username, display_name, avatar_url, bio")
    .eq("username", username)
    .single();

  if (error || !data) return null;
  return data;
}

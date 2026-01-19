/**
 * ユーザー検索API
 */

import { supabase } from '../client';
import type { UserSearchResult } from './types';

/**
 * ユーザーをキーワードで検索（Supabase版）
 * 発見タブの検索で使用
 */
export async function searchUsers(
  query: string,
  limit: number = 30
): Promise<UserSearchResult[]> {
  const { data, error } = await supabase
    .from('users')
    .select(
      `
      id,
      username,
      display_name,
      bio,
      avatar_url,
      created_at
    `
    )
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return [];
  }

  return (data || []).map((user) => ({
    id: user.id,
    username: user.username,
    display_name: user.display_name,
    bio: user.bio,
    avatar_url: user.avatar_url,
    created_at: user.created_at,
  }));
}

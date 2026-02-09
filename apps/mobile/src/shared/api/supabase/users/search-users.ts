/**
 * ユーザー検索API
 */

import { supabase } from '../client';
import type { UserSearchResult } from './types';

/**
 * ユーザーをキーワードで検索（RPC版）
 * 発見タブの検索で使用。ブロック済みユーザーを除外。
 */
export async function searchUsers(
  query: string,
  limit: number = 30,
  currentUserId?: string,
  offset: number = 0
): Promise<UserSearchResult[]> {
  const { data, error } = await supabase.rpc('search_users', {
    search_query: query,
    result_limit: limit,
    p_current_user_id: currentUserId ?? null,
    result_offset: offset,
  });

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

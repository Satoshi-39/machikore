/**
 * ブロック情報取得
 */

import { supabase, handleSupabaseError } from '../client';

const BLOCKS_PAGE_SIZE = 20;

export interface BlockedUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  blocked_at: string;
}

export interface BlockedUsersPage {
  data: BlockedUser[];
  nextCursor: string | null;
  hasMore: boolean;
}

/**
 * ブロック済みユーザーIDリストを取得
 */
export async function getBlockedUserIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_blocks')
    .select('blocked_id')
    .eq('blocker_id', userId);

  if (error) {
    handleSupabaseError('getBlockedUserIds', error);
  }

  return (data || []).map((row) => row.blocked_id);
}

/**
 * ブロック状態を確認
 */
export async function checkIsBlocked(
  blockerId: string,
  blockedId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_blocks')
    .select('id')
    .eq('blocker_id', blockerId)
    .eq('blocked_id', blockedId)
    .maybeSingle();

  if (error) {
    handleSupabaseError('checkIsBlocked', error);
  }

  return !!data;
}

/**
 * ブロック済みユーザー一覧を取得（ユーザー情報付き、ページネーション対応）
 */
export async function getBlockedUsers(
  userId: string,
  cursor?: string | null
): Promise<BlockedUsersPage> {
  let query = supabase
    .from('user_blocks')
    .select(`
      id,
      created_at,
      blocked:users!user_blocks_blocked_id_fkey (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq('blocker_id', userId)
    .order('created_at', { ascending: false })
    .limit(BLOCKS_PAGE_SIZE + 1);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) {
    handleSupabaseError('getBlockedUsers', error);
  }

  const items = data || [];
  const hasMore = items.length > BLOCKS_PAGE_SIZE;
  const pageItems = hasMore ? items.slice(0, BLOCKS_PAGE_SIZE) : items;

  const blockedUsers: BlockedUser[] = pageItems.map((item) => {
    const user = item.blocked as unknown as {
      id: string;
      username: string;
      display_name: string | null;
      avatar_url: string | null;
    };
    return {
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      avatar_url: user.avatar_url,
      blocked_at: item.created_at,
    };
  });

  const lastItem = pageItems[pageItems.length - 1];

  return {
    data: blockedUsers,
    nextCursor: hasMore && lastItem ? lastItem.created_at : null,
    hasMore,
  };
}

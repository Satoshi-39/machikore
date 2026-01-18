/**
 * フォロー機能の型定義
 */

export interface FollowUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

export interface FollowRecord {
  id: string;
  created_at: string;
  user: FollowUser;
}

export interface FollowsPage {
  data: FollowRecord[];
  nextCursor: string | null;
  hasMore: boolean;
}

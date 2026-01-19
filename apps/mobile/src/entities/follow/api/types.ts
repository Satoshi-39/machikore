/**
 * フォロー機能の型定義（entity層）
 */

import type { FollowRecord } from '@/shared/api/supabase/follows';

/** is_following付きのフォローレコード（entity層で構築） */
export interface FollowWithUser extends FollowRecord {
  is_following?: boolean;
}

/** is_following付きのページデータ */
export interface FollowsPageWithStatus {
  data: FollowWithUser[];
  nextCursor: string | null;
  hasMore: boolean;
}

/**
 * Follows SQLite API
 */

import { getDatabase } from './client';

/**
 * ユーザーのフォロー数を取得
 * @param userId - ユーザーID
 * @returns フォロー数
 */
export function getFollowingCount(userId: string): number {
  const db = getDatabase();
  const result = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM follows WHERE follower_id = ?',
    [userId]
  );
  return result?.count ?? 0;
}

/**
 * ユーザーのフォロワー数を取得
 * @param userId - ユーザーID
 * @returns フォロワー数
 */
export function getFollowersCount(userId: string): number {
  const db = getDatabase();
  const result = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM follows WHERE followee_id = ?',
    [userId]
  );
  return result?.count ?? 0;
}

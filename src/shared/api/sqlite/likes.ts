/**
 * Like関連のSQLite操作
 */

import * as Crypto from 'expo-crypto';
import { queryOne, queryAll, execute } from './client';
import type { LikeRow } from '@/shared/types/database.types';
import type { UUID } from '@/shared/types';

// ===============================
// Like取得
// ===============================

/**
 * ユーザーが投稿にいいねしているか確認
 */
export function checkUserLiked(userId: UUID, postId: UUID): boolean {
  const result = queryOne<LikeRow>(
    'SELECT * FROM likes WHERE user_id = ? AND post_id = ?;',
    [userId, postId]
  );
  return result !== null;
}

/**
 * 投稿のいいねリストを取得
 */
export function getLikesByPostId(postId: UUID): LikeRow[] {
  return queryAll<LikeRow>(
    'SELECT * FROM likes WHERE post_id = ? ORDER BY created_at DESC;',
    [postId]
  );
}

/**
 * ユーザーのいいねリストを取得
 */
export function getLikesByUserId(userId: UUID): LikeRow[] {
  return queryAll<LikeRow>(
    'SELECT * FROM likes WHERE user_id = ? ORDER BY created_at DESC;',
    [userId]
  );
}

// ===============================
// Like追加・削除
// ===============================

/**
 * いいねをトグル（追加 or 削除）
 *
 * @returns いいね後の状態（true: いいね済み, false: いいね解除）
 */
export function toggleLike(userId: UUID, postId: UUID): boolean {
  const isLiked = checkUserLiked(userId, postId);

  if (isLiked) {
    // いいね解除
    execute('DELETE FROM likes WHERE user_id = ? AND post_id = ?;', [
      userId,
      postId,
    ]);

    // likes_countをデクリメント
    execute(
      'UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?;',
      [postId]
    );

    return false;
  } else {
    // いいね追加
    const likeId = Crypto.randomUUID();
    const now = new Date().toISOString();

    execute(
      `
      INSERT INTO likes (id, user_id, post_id, created_at)
      VALUES (?, ?, ?, ?);
      `,
      [likeId, userId, postId, now]
    );

    // likes_countをインクリメント
    execute(
      'UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?;',
      [postId]
    );

    return true;
  }
}

/**
 * いいねを削除
 */
export function deleteLike(userId: UUID, postId: UUID): void {
  execute('DELETE FROM likes WHERE user_id = ? AND post_id = ?;', [
    userId,
    postId,
  ]);

  // likes_countをデクリメント
  execute('UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?;', [
    postId,
  ]);
}

/**
 * 投稿の全いいねを削除（投稿削除時に使用）
 */
export function deleteAllLikesByPostId(postId: UUID): void {
  execute('DELETE FROM likes WHERE post_id = ?;', [postId]);
}

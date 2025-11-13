/**
 * サンプルデータクリーンアップ
 */

import {
  deleteAllPostsByUser,
  deleteAllSchedulesByUser,
  deleteAllVisitsByUser,
  deleteUser,
  checkTableExists,
} from '@/shared/api/sqlite';
import { getCurrentUserId } from '@/entities/user/model';

/**
 * サンプルデータをクリーンアップ（開発用）
 * 再起動時に古いサンプルデータを削除
 */
export function cleanupSampleData(): void {
  console.log('🧹 サンプルデータをクリーンアップ中...');

  // ユーザーIDを取得（認証完了後）
  const userId = getCurrentUserId();
  if (!userId) {
    console.warn('⚠️  ユーザーIDが取得できません。クリーンアップをスキップします。');
    return;
  }

  // 各テーブルが存在する場合のみ削除
  if (checkTableExists('posts')) {
    deleteAllPostsByUser(userId);
  }

  if (checkTableExists('schedules')) {
    deleteAllSchedulesByUser(userId);
  }

  if (checkTableExists('visits')) {
    deleteAllVisitsByUser(userId);
  }

  if (checkTableExists('users')) {
    deleteUser(userId);
  }

  console.log('✅ サンプルデータをクリーンアップ完了');
}

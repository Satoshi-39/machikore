/**
 * サンプルデータクリーンアップ
 */

import {
  deleteAllSpotsByUser,
  deleteAllSchedulesByUser,
  deleteAllVisitsByUser,
  deleteUser,
  checkTableExists,
} from '@/shared/api/sqlite';
import { getCurrentUserId } from '@/entities/user/model';
import { log } from '@/shared/config/logger';

/**
 * サンプルデータをクリーンアップ（開発用）
 * 再起動時に古いサンプルデータを削除
 */
export function cleanupSampleData(): void {
  log.debug('[Cleanup] サンプルデータをクリーンアップ中...');

  // ユーザーIDを取得（認証完了後）
  const userId = getCurrentUserId();
  if (!userId) {
    log.warn('[Cleanup] ユーザーIDが取得できません。クリーンアップをスキップします。');
    return;
  }

  // 各テーブルが存在する場合のみ削除
  if (checkTableExists('spots')) {
    deleteAllSpotsByUser(userId);
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

  log.debug('[Cleanup] サンプルデータをクリーンアップ完了');
}

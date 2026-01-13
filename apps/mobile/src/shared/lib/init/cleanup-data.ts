/**
 * サンプルデータクリーンアップ
 */

import {
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
 * 注: スポットはSupabaseで管理しているためローカルクリーンアップ不要
 */
export function cleanupSampleData(): void {
  log.debug('[Cleanup] サンプルデータをクリーンアップ中...');

  // ユーザーIDを取得（認証完了後）
  const userId = getCurrentUserId();
  if (!userId) {
    log.warn('[Cleanup] ユーザーIDが取得できません。クリーンアップをスキップします。');
    return;
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

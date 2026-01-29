/**
 * SQLite デバッグユーティリティ
 *
 * 開発時にデータベースの内容を確認するための関数
 */

import { queryAll, queryOne } from './client';
import type { VisitRow, ScheduleRow, MachiRow } from '@/shared/types/database.types';

// 本番環境では一切出力しない
const debugLog = (...args: unknown[]) => __DEV__ && debugLog(...args);
const debugError = (...args: unknown[]) => __DEV__ && debugError(...args);

/**
 * 全テーブルのデータ件数を表示
 */
export function logAllTableCounts() {
  debugLog('=== SQLite Table Counts ===');

  const tables = [
    'users',
    'visits',
    'maps',
    'user_spots',
    'master_spots',
    'images',
    'schedules',
    'machi',
    'likes',
    'comments',
    'sync_queue',
    'cached_friends',
    'app_settings',
  ];

  tables.forEach((table) => {
    try {
      const result = queryOne<{ count: number }>(
        `SELECT COUNT(*) as count FROM ${table};`,
        []
      );
      debugLog(`${table}: ${result?.count || 0} records`);
    } catch (error) {
      debugLog(`${table}: Error - ${error}`);
    }
  });

  debugLog('===========================');
}

/**
 * 特定のテーブルの全データを表示
 */
export function logTableData(tableName: string, limit: number = 10) {
  debugLog(`=== ${tableName} (Top ${limit}) ===`);
  try {
    const results = queryAll<any>(
      `SELECT * FROM ${tableName} LIMIT ?;`,
      [limit]
    );
    __DEV__ && console.table(results);
  } catch (error) {
    debugError(`Error reading ${tableName}:`, error);
  }
  debugLog('===========================');
}

/**
 * スポットデータを表示（master_spotsと結合）
 */
export function logSpots(mapId?: string, limit: number = 10) {
  debugLog('=== User Spots ===');
  try {
    const sql = mapId
      ? `SELECT s.*, ms.name, ms.latitude, ms.longitude, ms.google_formatted_address as address
         FROM user_spots s
         JOIN master_spots ms ON s.master_spot_id = ms.id
         WHERE s.map_id = ?
         ORDER BY s.order_index ASC, s.created_at DESC LIMIT ?;`
      : `SELECT s.*, ms.name, ms.latitude, ms.longitude, ms.google_formatted_address as address
         FROM user_spots s
         JOIN master_spots ms ON s.master_spot_id = ms.id
         ORDER BY s.created_at DESC LIMIT ?;`;
    const params = mapId ? [mapId, limit] : [limit];

    const spots = queryAll<any>(sql, params);
    debugLog(`Found ${spots.length} spots:`);
    spots.forEach((spot: any, index: number) => {
      debugLog(`\n[${index + 1}] Spot ID: ${spot.id}`);
      debugLog(`  Name: ${spot.description || spot.name}`);
      debugLog(`  Address: ${spot.address || 'None'}`);
      debugLog(`  Map ID: ${spot.map_id}`);
      debugLog(`  Master Spot ID: ${spot.master_spot_id}`);
      debugLog(`  Machi ID: ${spot.machi_id || 'None'}`);
      debugLog(`  Location: ${spot.latitude}, ${spot.longitude}`);
      debugLog(`  Created at: ${spot.created_at}`);
    });
  } catch (error) {
    debugError('Error reading spots:', error);
  }
  debugLog('==================');
}

/**
 * 訪問記録を表示
 */
export function logVisits(userId?: string, limit: number = 10) {
  debugLog('=== Visits ===');
  try {
    const sql = userId
      ? 'SELECT * FROM visits WHERE user_id = ? ORDER BY visited_at DESC LIMIT ?;'
      : 'SELECT * FROM visits ORDER BY visited_at DESC LIMIT ?;';
    const params = userId ? [userId, limit] : [limit];

    const visits = queryAll<VisitRow>(sql, params);
    debugLog(`Found ${visits.length} visits:`);
    visits.forEach((visit: VisitRow, index: number) => {
      debugLog(`\n[${index + 1}] Visit ID: ${visit.id}`);
      debugLog(`  Machi ID: ${visit.machi_id}`);
      debugLog(`  Last visited: ${visit.visited_at}`);
    });
  } catch (error) {
    debugError('Error reading visits:', error);
  }
  debugLog('==============');
}

/**
 * スケジュールを表示
 */
export function logSchedules(userId?: string, limit: number = 10) {
  debugLog('=== Schedules ===');
  try {
    const sql = userId
      ? 'SELECT * FROM schedules WHERE user_id = ? ORDER BY scheduled_at DESC LIMIT ?;'
      : 'SELECT * FROM schedules ORDER BY scheduled_at DESC LIMIT ?;';
    const params = userId ? [userId, limit] : [limit];

    const schedules = queryAll<ScheduleRow>(sql, params);
    debugLog(`Found ${schedules.length} schedules:`);
    schedules.forEach((schedule: ScheduleRow, index: number) => {
      debugLog(`\n[${index + 1}] Schedule ID: ${schedule.id}`);
      debugLog(`  Title: ${schedule.title}`);
      debugLog(`  Machi ID: ${schedule.machi_id}`);
      debugLog(`  Scheduled at: ${schedule.scheduled_at}`);
      debugLog(`  Completed: ${schedule.is_completed ? 'Yes' : 'No'}`);
    });
  } catch (error) {
    debugError('Error reading schedules:', error);
  }
  debugLog('=================');
}

/**
 * 街データを表示
 */
export function logMachi(limit: number = 10) {
  debugLog('=== Machi ===');
  try {
    const machi = queryAll<MachiRow>(
      'SELECT * FROM machi LIMIT ?;',
      [limit]
    );
    debugLog(`Found ${machi.length} machi:`);
    machi.forEach((m: MachiRow, index: number) => {
      debugLog(`\n[${index + 1}] ${m.name}`);
      debugLog(`  ID: ${m.id}`);
      debugLog(`  Location: ${m.latitude}, ${m.longitude}`);
    });
  } catch (error) {
    debugError('Error reading machi:', error);
  }
  debugLog('=============');
}

/**
 * カスタムSQLを実行して結果を表示
 */
export function logCustomQuery(sql: string, params: any[] = []) {
  debugLog('=== Custom Query ===');
  debugLog('SQL:', sql);
  debugLog('Params:', params);
  try {
    const results = queryAll<any>(sql, params);
    debugLog(`Found ${results.length} results:`);
    __DEV__ && console.table(results);
  } catch (error) {
    debugError('Error executing query:', error);
  }
  debugLog('====================');
}

/**
 * 全データの概要を表示
 */
export function logDatabaseSummary(userId?: string) {
  debugLog('\n\n📊 === DATABASE SUMMARY ===');
  logAllTableCounts();
  debugLog('\n');

  if (userId) {
    debugLog(`User ID: ${userId}\n`);
    logVisits(userId, 5);
    debugLog('\n');
    logSpots(undefined, 5);
    debugLog('\n');
    logSchedules(userId, 5);
  }

  debugLog('\n');
  logMachi(5);
  debugLog('\n=== END SUMMARY ===\n\n');
}

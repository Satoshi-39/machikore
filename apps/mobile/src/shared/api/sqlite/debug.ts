/**
 * SQLite デバッグユーティリティ
 *
 * 開発時にデータベースの内容を確認するための関数
 */

import { queryAll, queryOne } from './client';
import type { VisitRow, ScheduleRow, MachiRow } from '@/shared/types/database.types';

/**
 * 全テーブルのデータ件数を表示
 */
export function logAllTableCounts() {
  console.log('=== SQLite Table Counts ===');

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
      console.log(`${table}: ${result?.count || 0} records`);
    } catch (error) {
      console.log(`${table}: Error - ${error}`);
    }
  });

  console.log('===========================');
}

/**
 * 特定のテーブルの全データを表示
 */
export function logTableData(tableName: string, limit: number = 10) {
  console.log(`=== ${tableName} (Top ${limit}) ===`);
  try {
    const results = queryAll<any>(
      `SELECT * FROM ${tableName} LIMIT ?;`,
      [limit]
    );
    console.table(results);
  } catch (error) {
    console.error(`Error reading ${tableName}:`, error);
  }
  console.log('===========================');
}

/**
 * スポットデータを表示（master_spotsと結合）
 */
export function logSpots(mapId?: string, limit: number = 10) {
  console.log('=== User Spots ===');
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
    console.log(`Found ${spots.length} spots:`);
    spots.forEach((spot: any, index: number) => {
      console.log(`\n[${index + 1}] Spot ID: ${spot.id}`);
      console.log(`  Name: ${spot.description || spot.name}`);
      console.log(`  Address: ${spot.address || 'None'}`);
      console.log(`  Map ID: ${spot.map_id}`);
      console.log(`  Master Spot ID: ${spot.master_spot_id}`);
      console.log(`  Machi ID: ${spot.machi_id || 'None'}`);
      console.log(`  Location: ${spot.latitude}, ${spot.longitude}`);
      console.log(`  Created at: ${spot.created_at}`);
    });
  } catch (error) {
    console.error('Error reading spots:', error);
  }
  console.log('==================');
}

/**
 * 訪問記録を表示
 */
export function logVisits(userId?: string, limit: number = 10) {
  console.log('=== Visits ===');
  try {
    const sql = userId
      ? 'SELECT * FROM visits WHERE user_id = ? ORDER BY visited_at DESC LIMIT ?;'
      : 'SELECT * FROM visits ORDER BY visited_at DESC LIMIT ?;';
    const params = userId ? [userId, limit] : [limit];

    const visits = queryAll<VisitRow>(sql, params);
    console.log(`Found ${visits.length} visits:`);
    visits.forEach((visit: VisitRow, index: number) => {
      console.log(`\n[${index + 1}] Visit ID: ${visit.id}`);
      console.log(`  Machi ID: ${visit.machi_id}`);
      console.log(`  Last visited: ${visit.visited_at}`);
    });
  } catch (error) {
    console.error('Error reading visits:', error);
  }
  console.log('==============');
}

/**
 * スケジュールを表示
 */
export function logSchedules(userId?: string, limit: number = 10) {
  console.log('=== Schedules ===');
  try {
    const sql = userId
      ? 'SELECT * FROM schedules WHERE user_id = ? ORDER BY scheduled_at DESC LIMIT ?;'
      : 'SELECT * FROM schedules ORDER BY scheduled_at DESC LIMIT ?;';
    const params = userId ? [userId, limit] : [limit];

    const schedules = queryAll<ScheduleRow>(sql, params);
    console.log(`Found ${schedules.length} schedules:`);
    schedules.forEach((schedule: ScheduleRow, index: number) => {
      console.log(`\n[${index + 1}] Schedule ID: ${schedule.id}`);
      console.log(`  Title: ${schedule.title}`);
      console.log(`  Machi ID: ${schedule.machi_id}`);
      console.log(`  Scheduled at: ${schedule.scheduled_at}`);
      console.log(`  Completed: ${schedule.is_completed ? 'Yes' : 'No'}`);
    });
  } catch (error) {
    console.error('Error reading schedules:', error);
  }
  console.log('=================');
}

/**
 * 街データを表示
 */
export function logMachi(limit: number = 10) {
  console.log('=== Machi ===');
  try {
    const machi = queryAll<MachiRow>(
      'SELECT * FROM machi LIMIT ?;',
      [limit]
    );
    console.log(`Found ${machi.length} machi:`);
    machi.forEach((m: MachiRow, index: number) => {
      console.log(`\n[${index + 1}] ${m.name}`);
      console.log(`  ID: ${m.id}`);
      console.log(`  Location: ${m.latitude}, ${m.longitude}`);
    });
  } catch (error) {
    console.error('Error reading machi:', error);
  }
  console.log('=============');
}

/**
 * カスタムSQLを実行して結果を表示
 */
export function logCustomQuery(sql: string, params: any[] = []) {
  console.log('=== Custom Query ===');
  console.log('SQL:', sql);
  console.log('Params:', params);
  try {
    const results = queryAll<any>(sql, params);
    console.log(`Found ${results.length} results:`);
    console.table(results);
  } catch (error) {
    console.error('Error executing query:', error);
  }
  console.log('====================');
}

/**
 * 全データの概要を表示
 */
export function logDatabaseSummary(userId?: string) {
  console.log('\n\n📊 === DATABASE SUMMARY ===');
  logAllTableCounts();
  console.log('\n');

  if (userId) {
    console.log(`User ID: ${userId}\n`);
    logVisits(userId, 5);
    console.log('\n');
    logSpots(undefined, 5);
    console.log('\n');
    logSchedules(userId, 5);
  }

  console.log('\n');
  logMachi(5);
  console.log('\n=== END SUMMARY ===\n\n');
}

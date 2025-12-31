/**
 * SQLite データベースクライアント
 */

import * as SQLite from 'expo-sqlite';

// ===============================
// データベース接続
// ===============================

const DB_NAME = 'machikore.db';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * データベースを開く
 */
export function openDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync(DB_NAME);
  }
  return db;
}

/**
 * データベースを閉じる
 */
export function closeDatabase(): void {
  if (db) {
    db.closeSync();
    db = null;
  }
}

/**
 * データベースインスタンスを取得
 */
export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    return openDatabase();
  }
  return db;
}

// ===============================
// トランザクション
// ===============================

/**
 * トランザクション実行
 */
export async function executeTransaction<T>(
  callback: (db: SQLite.SQLiteDatabase) => Promise<T>
): Promise<T> {
  const database = getDatabase();

  try {
    database.execSync('BEGIN TRANSACTION;');
    const result = await callback(database);
    database.execSync('COMMIT;');
    return result;
  } catch (error) {
    database.execSync('ROLLBACK;');
    throw error;
  }
}

// ===============================
// クエリヘルパー
// ===============================

/**
 * クエリ実行（単一行取得）
 */
export function queryOne<T>(
  sql: string,
  params: SQLite.SQLiteBindParams = []
): T | null {
  const database = getDatabase();
  const result = database.getFirstSync<T>(sql, params);
  return result ?? null;
}

/**
 * クエリ実行（複数行取得）
 */
export function queryAll<T>(
  sql: string,
  params: SQLite.SQLiteBindParams = []
): T[] {
  const database = getDatabase();
  const result = database.getAllSync<T>(sql, params);
  return result;
}

/**
 * 実行（INSERT/UPDATE/DELETE）
 */
export function execute(
  sql: string,
  params: SQLite.SQLiteBindParams = []
): SQLite.SQLiteRunResult {
  const database = getDatabase();
  return database.runSync(sql, params);
}

/**
 * バッチ実行
 */
export function executeBatch(statements: Array<{ sql: string; params?: SQLite.SQLiteBindParams }>) {
  const database = getDatabase();

  database.execSync('BEGIN TRANSACTION;');
  try {
    for (const { sql, params = [] } of statements) {
      database.runSync(sql, params);
    }
    database.execSync('COMMIT;');
  } catch (error) {
    database.execSync('ROLLBACK;');
    throw error;
  }
}

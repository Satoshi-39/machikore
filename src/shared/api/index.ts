/**
 * API エクスポート
 */

// Supabase API（メインのデータソース）
export * from './supabase';

// SQLite API（ローカルキャッシュ用 - 重複を避けるため個別インポート推奨）
// 重複する関数名があるため、SQLiteを使う場合は直接 '@/shared/api/sqlite' からインポートすること
export {
  getDatabase,
  openDatabase,
  closeDatabase,
  runMigrations,
  // SQLite固有の関数のみエクスポート
  insertMap,
  getMapsByUserId,
  getAllMaps,
  updateMap,
  deleteMap,
  deleteAllMaps,
  searchMaps,
} from './sqlite';

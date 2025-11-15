/**
 * SQLite マイグレーション
 */

import { getDatabase } from './client';

// ===============================
// マイグレーション実行
// ===============================

/**
 * データベースを初期化（全テーブル作成）
 */
export function initializeDatabase(): void {
  const db = getDatabase();

  // トランザクション開始
  db.execSync('BEGIN TRANSACTION;');

  try {
    // 古いスキーマのテーブルをドロップ（station_id → machi_id への移行）
    // TODO: 本番環境では、データを保持したままALTER TABLEでマイグレーションする
    // 現在は開発環境のため、既存データを破棄して新スキーマで再作成
    db.execSync('DROP TABLE IF EXISTS sync_queue;');
    db.execSync('DROP TABLE IF EXISTS friends;');
    db.execSync('DROP TABLE IF EXISTS posts;');
    db.execSync('DROP TABLE IF EXISTS schedules;');
    db.execSync('DROP TABLE IF EXISTS visits;');
    db.execSync('DROP TABLE IF EXISTS machi;');
    db.execSync('DROP TABLE IF EXISTS cities;');
    db.execSync('DROP TABLE IF EXISTS prefectures;');
    db.execSync('DROP TABLE IF EXISTS stations;');

    // 1. ユーザーテーブル
    db.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL UNIQUE,
        display_name TEXT,
        avatar_url TEXT,
        bio TEXT,
        is_subscribed INTEGER DEFAULT 0,
        subscription_started_at TEXT,
        subscription_expires_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0
      );
    `);

    // インデックス作成
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_users_email
      ON users(email);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_users_username
      ON users(username);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_users_is_synced
      ON users(is_synced);
    `);

    // 2. 都道府県テーブル（マスターデータ）
    db.execSync(`
      CREATE TABLE IF NOT EXISTS prefectures (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        name_kana TEXT NOT NULL,
        region TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // 3. 市区町村テーブル（マスターデータ）
    db.execSync(`
      CREATE TABLE IF NOT EXISTS cities (
        id TEXT PRIMARY KEY,
        prefecture_id TEXT NOT NULL,
        name TEXT NOT NULL,
        name_kana TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('区', '市', '町', '村')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (prefecture_id) REFERENCES prefectures(id)
      );
    `);

    // インデックス作成
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_cities_prefecture_id
      ON cities(prefecture_id);
    `);

    // 4. 街テーブル（マスターデータ）
    db.execSync(`
      CREATE TABLE IF NOT EXISTS machi (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        line_name TEXT NOT NULL,
        prefecture_id TEXT NOT NULL,
        city_id TEXT,
        prefecture TEXT NOT NULL,
        FOREIGN KEY (prefecture_id) REFERENCES prefectures(id),
        FOREIGN KEY (city_id) REFERENCES cities(id)
      );
    `);

    // インデックス作成
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_machi_name
      ON machi(name);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_machi_line
      ON machi(line_name);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_machi_prefecture_id
      ON machi(prefecture_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_machi_city_id
      ON machi(city_id);
    `);

    // 5. 訪問記録テーブル
    db.execSync(`
      CREATE TABLE IF NOT EXISTS visits (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        machi_id TEXT NOT NULL,
        visit_count INTEGER NOT NULL DEFAULT 1,
        visited_at TEXT NOT NULL,
        memo TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0
      );
    `);

    // インデックス作成
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_visits_user_id
      ON visits(user_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_visits_machi_id
      ON visits(machi_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_visits_visited_at
      ON visits(visited_at);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_visits_user_machi
      ON visits(user_id, machi_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_visits_is_synced
      ON visits(is_synced);
    `);

    // 6. 投稿テーブル
    db.execSync(`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        content TEXT NOT NULL,
        machi_id TEXT,
        visit_id TEXT,
        is_auto_generated INTEGER DEFAULT 0,
        is_draft INTEGER DEFAULT 0,
        likes_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE CASCADE
      );
    `);

    // インデックス作成
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_posts_user_id
      ON posts(user_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_posts_machi_id
      ON posts(machi_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_posts_created_at
      ON posts(created_at DESC);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_posts_is_draft
      ON posts(is_draft);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_posts_is_synced
      ON posts(is_synced);
    `);

    // 7. 画像テーブル
    db.execSync(`
      CREATE TABLE IF NOT EXISTS images (
        id TEXT PRIMARY KEY,
        post_id TEXT NOT NULL,
        local_path TEXT,
        cloud_path TEXT,
        width INTEGER,
        height INTEGER,
        file_size INTEGER,
        order_index INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
      );
    `);

    // インデックス作成
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_images_post_id
      ON images(post_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_images_is_synced
      ON images(is_synced);
    `);

    // 8. いいねテーブル
    db.execSync(`
      CREATE TABLE IF NOT EXISTS likes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        UNIQUE(user_id, post_id)
      );
    `);

    // インデックス作成
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_likes_user_id
      ON likes(user_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_likes_post_id
      ON likes(post_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_likes_is_synced
      ON likes(is_synced);
    `);

    // 9. 予定テーブル
    db.execSync(`
      CREATE TABLE IF NOT EXISTS schedules (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        machi_id TEXT NOT NULL,
        scheduled_at TEXT NOT NULL,
        title TEXT NOT NULL,
        memo TEXT,
        is_completed INTEGER DEFAULT 0,
        completed_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0
      );
    `);

    // インデックス作成
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_schedules_user_id
      ON schedules(user_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_schedules_scheduled_at
      ON schedules(scheduled_at);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_schedules_is_completed
      ON schedules(is_completed);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_schedules_is_synced
      ON schedules(is_synced);
    `);

    // 10. 友達テーブル
    db.execSync(`
      CREATE TABLE IF NOT EXISTS friends (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        friend_id TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0,
        UNIQUE(user_id, friend_id)
      );
    `);

    // インデックス作成
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_friends_user_id
      ON friends(user_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_friends_friend_id
      ON friends(friend_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_friends_status
      ON friends(status);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_friends_is_synced
      ON friends(is_synced);
    `);

    // 11. 同期キューテーブル
    db.execSync(`
      CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
        data TEXT,
        status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
        retry_count INTEGER DEFAULT 0,
        last_error TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // インデックス作成
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_sync_queue_entity_type
      ON sync_queue(entity_type);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_sync_queue_status
      ON sync_queue(status);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_sync_queue_created_at
      ON sync_queue(created_at);
    `);

    // コミット
    db.execSync('COMMIT;');

    console.log('Database initialized successfully');
  } catch (error) {
    // ロールバック
    db.execSync('ROLLBACK;');
    console.error('Database initialization failed:', error);
    throw error;
  }
}

/**
 * 全テーブルを削除（開発用）
 */
export function dropAllTables(): void {
  const db = getDatabase();

  db.execSync('BEGIN TRANSACTION;');

  try {
    db.execSync('DROP TABLE IF EXISTS sync_queue;');
    db.execSync('DROP TABLE IF EXISTS friends;');
    db.execSync('DROP TABLE IF EXISTS schedules;');
    db.execSync('DROP TABLE IF EXISTS likes;');
    db.execSync('DROP TABLE IF EXISTS images;');
    db.execSync('DROP TABLE IF EXISTS posts;');
    db.execSync('DROP TABLE IF EXISTS visits;');
    db.execSync('DROP TABLE IF EXISTS machi;');
    db.execSync('DROP TABLE IF EXISTS cities;');
    db.execSync('DROP TABLE IF EXISTS prefectures;');
    db.execSync('DROP TABLE IF EXISTS users;');

    db.execSync('COMMIT;');

    console.log('All tables dropped successfully');
  } catch (error) {
    db.execSync('ROLLBACK;');
    console.error('Failed to drop tables:', error);
    throw error;
  }
}

/**
 * データベースをリセット（削除→再作成）
 */
export function resetDatabase(): void {
  dropAllTables();
  initializeDatabase();
}

/**
 * テーブル存在チェック
 */
export function checkTableExists(tableName: string): boolean {
  const db = getDatabase();
  const result = db.getFirstSync<{ count: number }>(
    `SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name=?;`,
    [tableName]
  );
  return (result?.count ?? 0) > 0;
}

/**
 * データベースバージョン管理用テーブル
 */
export function initVersionTable(): void {
  const db = getDatabase();

  db.execSync(`
    CREATE TABLE IF NOT EXISTS db_version (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);
}

/**
 * 現在のデータベースバージョンを取得
 */
export function getCurrentVersion(): number {
  const db = getDatabase();
  const result = db.getFirstSync<{ version: number }>(
    'SELECT MAX(version) as version FROM db_version;'
  );
  return result?.version ?? 0;
}

/**
 * バージョンを記録
 */
export function recordVersion(version: number): void {
  const db = getDatabase();
  db.runSync(
    'INSERT INTO db_version (version, applied_at) VALUES (?, ?);',
    [version, new Date().toISOString()]
  );
}

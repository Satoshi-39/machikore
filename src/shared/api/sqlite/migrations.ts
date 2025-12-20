/**
 * SQLite マイグレーション
 */

import { getDatabase } from './client';
import { log } from '@/shared/config/logger';

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
    // 古いスキーマのテーブルをドロップ（街ログ → 街コレへの移行）
    // TODO: 本番環境では、データを保持したままALTER TABLEでマイグレーションする
    // 現在は開発環境のため、既存データを破棄して新スキーマで再作成
    db.execSync('DROP TABLE IF EXISTS sync_queue;');
    db.execSync('DROP TABLE IF EXISTS bookmarks;');
    db.execSync('DROP TABLE IF EXISTS comments;');
    db.execSync('DROP TABLE IF EXISTS follows;');
    db.execSync('DROP TABLE IF EXISTS likes;');
    db.execSync('DROP TABLE IF EXISTS images;');
    db.execSync('DROP TABLE IF EXISTS user_spots;');
    db.execSync('DROP TABLE IF EXISTS master_spots;');
    db.execSync('DROP TABLE IF EXISTS spots;');
    db.execSync('DROP TABLE IF EXISTS maps;');
    db.execSync('DROP TABLE IF EXISTS visits;');
    db.execSync('DROP TABLE IF EXISTS machi;');
    db.execSync('DROP TABLE IF EXISTS cities;');
    db.execSync('DROP TABLE IF EXISTS prefectures;');
    db.execSync('DROP TABLE IF EXISTS regions;');
    db.execSync('DROP TABLE IF EXISTS countries;');
    // 削除された古いテーブル
    db.execSync('DROP TABLE IF EXISTS posts;');
    db.execSync('DROP TABLE IF EXISTS schedules;');
    db.execSync('DROP TABLE IF EXISTS friends;');
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

    // 2. 大陸テーブル（マスターデータ）
    db.execSync(`
      CREATE TABLE IF NOT EXISTS continents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        display_order INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // 2.5. 国テーブル（マスターデータ）
    db.execSync(`
      CREATE TABLE IF NOT EXISTS countries (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        name_kana TEXT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        country_code TEXT NOT NULL UNIQUE,
        continent_id TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (continent_id) REFERENCES continents(id)
      );
    `);

    // 3. 地方テーブル（マスターデータ）
    db.execSync(`
      CREATE TABLE IF NOT EXISTS regions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        name_kana TEXT NOT NULL,
        name_translations TEXT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        country_code TEXT NOT NULL DEFAULT 'jp',
        display_order INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // 3. 都道府県テーブル（マスターデータ）
    db.execSync(`
      CREATE TABLE IF NOT EXISTS prefectures (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        name_kana TEXT NOT NULL,
        name_translations TEXT,
        region_id TEXT,
        latitude REAL,
        longitude REAL,
        country_code TEXT NOT NULL DEFAULT 'jp',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (region_id) REFERENCES regions(id)
      );
    `);

    // 4. 市区町村テーブル（マスターデータ）
    db.execSync(`
      CREATE TABLE IF NOT EXISTS cities (
        id TEXT PRIMARY KEY,
        prefecture_id TEXT NOT NULL,
        name TEXT NOT NULL,
        name_kana TEXT NOT NULL,
        name_translations TEXT,
        type TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        tile_id TEXT,
        country_code TEXT NOT NULL DEFAULT 'jp',
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
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_cities_tile_id
      ON cities(tile_id);
    `);

    // 5. 街テーブル（マスターデータ）
    db.execSync(`
      CREATE TABLE IF NOT EXISTS machi (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        name_kana TEXT,
        name_translations TEXT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        prefecture_id TEXT NOT NULL,
        city_id TEXT,
        tile_id TEXT,
        country_code TEXT NOT NULL DEFAULT 'jp',
        prefecture_name TEXT,
        prefecture_name_translations TEXT,
        city_name TEXT,
        city_name_translations TEXT,
        created_at TEXT,
        updated_at TEXT,
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
      CREATE INDEX IF NOT EXISTS idx_machi_prefecture_id
      ON machi(prefecture_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_machi_city_id
      ON machi(city_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_machi_country_code
      ON machi(country_code);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_machi_tile_id
      ON machi(tile_id);
    `);

    // 5.5. 交通機関テーブル（駅、空港、フェリーターミナル、バスターミナル）
    db.execSync(`
      CREATE TABLE IF NOT EXISTS transport_hubs (
        id TEXT PRIMARY KEY,
        osm_id INTEGER,
        osm_type TEXT,
        prefecture_id TEXT NOT NULL,
        city_id TEXT,
        type TEXT NOT NULL,
        subtype TEXT,
        name TEXT NOT NULL,
        name_kana TEXT,
        operator TEXT,
        network TEXT,
        ref TEXT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        tile_id TEXT,
        country_code TEXT NOT NULL DEFAULT 'jp',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (prefecture_id) REFERENCES prefectures(id),
        FOREIGN KEY (city_id) REFERENCES cities(id)
      );
    `);

    // インデックス作成
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_transport_hubs_prefecture_id
      ON transport_hubs(prefecture_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_transport_hubs_type
      ON transport_hubs(type);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_transport_hubs_tile_id
      ON transport_hubs(tile_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_transport_hubs_location
      ON transport_hubs(latitude, longitude);
    `);

    // 6. マップテーブル
    db.execSync(`
      CREATE TABLE IF NOT EXISTS maps (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        is_public INTEGER DEFAULT 0,
        is_default INTEGER DEFAULT 0,
        is_official INTEGER DEFAULT 0,
        thumbnail_url TEXT,
        spots_count INTEGER DEFAULT 0,
        likes_count INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0
      );
    `);

    // インデックス作成
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_maps_user_id
      ON maps(user_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_maps_is_public
      ON maps(is_public);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_maps_created_at
      ON maps(created_at DESC);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_maps_is_synced
      ON maps(is_synced);
    `);

    // 7. マスタースポットテーブル（共有スポットデータ）
    db.execSync(`
      CREATE TABLE IF NOT EXISTS master_spots (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        google_place_id TEXT,
        google_formatted_address TEXT,
        google_types TEXT,
        google_phone_number TEXT,
        google_website_uri TEXT,
        google_rating REAL,
        google_user_rating_count INTEGER,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0
      );
    `);

    // インデックス作成
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_master_spots_google_place_id
      ON master_spots(google_place_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_master_spots_name
      ON master_spots(name);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_master_spots_location
      ON master_spots(latitude, longitude);
    `);

    // 8. ユーザースポットテーブル（ユーザーごとのスポット）
    // tagsは中間テーブル(spot_tags)で管理
    db.execSync(`
      CREATE TABLE IF NOT EXISTS user_spots (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        map_id TEXT NOT NULL,
        master_spot_id TEXT NOT NULL,
        machi_id TEXT NOT NULL,
        custom_name TEXT,
        description TEXT,
        images_count INTEGER DEFAULT 0,
        likes_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        order_index INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (map_id) REFERENCES maps(id) ON DELETE CASCADE,
        FOREIGN KEY (master_spot_id) REFERENCES master_spots(id) ON DELETE CASCADE,
        FOREIGN KEY (machi_id) REFERENCES machi(id),
        UNIQUE(user_id, map_id, master_spot_id)
      );
    `);

    // インデックス作成
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_user_spots_user_id
      ON user_spots(user_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_user_spots_map_id
      ON user_spots(map_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_user_spots_master_spot_id
      ON user_spots(master_spot_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_user_spots_machi_id
      ON user_spots(machi_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_user_spots_created_at
      ON user_spots(created_at DESC);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_user_spots_is_synced
      ON user_spots(is_synced);
    `);

    // 9. 訪問記録テーブル（街訪問 - シンプルな訪問済み/未訪問管理）
    db.execSync(`
      CREATE TABLE IF NOT EXISTS visits (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        machi_id TEXT NOT NULL,
        visited_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (machi_id) REFERENCES machi(id),
        UNIQUE(user_id, machi_id)
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

    // 9. フォローテーブル
    db.execSync(`
      CREATE TABLE IF NOT EXISTS follows (
        id TEXT PRIMARY KEY,
        follower_id TEXT NOT NULL,
        followee_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0,
        UNIQUE(follower_id, followee_id)
      );
    `);

    // インデックス作成
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_follows_follower_id
      ON follows(follower_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_follows_followee_id
      ON follows(followee_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_follows_is_synced
      ON follows(is_synced);
    `);

    // 10. コメントテーブル（マップとスポット用）
    db.execSync(`
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        map_id TEXT,
        spot_id TEXT,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (map_id) REFERENCES maps(id) ON DELETE CASCADE,
        FOREIGN KEY (spot_id) REFERENCES spots(id) ON DELETE CASCADE,
        CHECK ((map_id IS NOT NULL AND spot_id IS NULL) OR (map_id IS NULL AND spot_id IS NOT NULL))
      );
    `);

    // インデックス作成
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_comments_user_id
      ON comments(user_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_comments_map_id
      ON comments(map_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_comments_spot_id
      ON comments(spot_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_comments_created_at
      ON comments(created_at DESC);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_comments_is_synced
      ON comments(is_synced);
    `);

    // 11. ブックマークテーブル（マップとスポット用）
    db.execSync(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        map_id TEXT,
        spot_id TEXT,
        created_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (map_id) REFERENCES maps(id) ON DELETE CASCADE,
        FOREIGN KEY (spot_id) REFERENCES spots(id) ON DELETE CASCADE,
        UNIQUE(user_id, map_id, spot_id),
        CHECK ((map_id IS NOT NULL AND spot_id IS NULL) OR (map_id IS NULL AND spot_id IS NOT NULL))
      );
    `);

    // インデックス作成
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id
      ON bookmarks(user_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_bookmarks_map_id
      ON bookmarks(map_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_bookmarks_spot_id
      ON bookmarks(spot_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_bookmarks_is_synced
      ON bookmarks(is_synced);
    `);

    // 12. 画像テーブル（スポット用）
    db.execSync(`
      CREATE TABLE IF NOT EXISTS images (
        id TEXT PRIMARY KEY,
        spot_id TEXT NOT NULL,
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
        FOREIGN KEY (spot_id) REFERENCES spots(id) ON DELETE CASCADE
      );
    `);

    // インデックス作成
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_images_spot_id
      ON images(spot_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_images_is_synced
      ON images(is_synced);
    `);

    // 13. いいねテーブル（マップとスポット用）
    db.execSync(`
      CREATE TABLE IF NOT EXISTS likes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        map_id TEXT,
        spot_id TEXT,
        created_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (map_id) REFERENCES maps(id) ON DELETE CASCADE,
        FOREIGN KEY (spot_id) REFERENCES spots(id) ON DELETE CASCADE,
        UNIQUE(user_id, map_id, spot_id),
        CHECK ((map_id IS NOT NULL AND spot_id IS NULL) OR (map_id IS NULL AND spot_id IS NOT NULL))
      );
    `);

    // インデックス作成
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_likes_user_id
      ON likes(user_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_likes_map_id
      ON likes(map_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_likes_spot_id
      ON likes(spot_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_likes_is_synced
      ON likes(is_synced);
    `);

    // 14. 閲覧履歴テーブル（マップ閲覧履歴のキャッシュ）
    db.execSync(`
      CREATE TABLE IF NOT EXISTS view_history (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        map_id TEXT NOT NULL,
        viewed_at TEXT NOT NULL,
        view_count INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (map_id) REFERENCES maps(id) ON DELETE CASCADE,
        UNIQUE(user_id, map_id)
      );
    `);

    // インデックス作成（view_history）
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_view_history_user_id
      ON view_history(user_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_view_history_map_id
      ON view_history(map_id);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_view_history_viewed_at
      ON view_history(viewed_at DESC);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_view_history_user_viewed
      ON view_history(user_id, viewed_at DESC);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_view_history_is_synced
      ON view_history(is_synced);
    `);

    // 15. 同期キューテーブル
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

    // 15. キャッシュメタデータテーブル（TTL管理用）
    db.execSync(`
      CREATE TABLE IF NOT EXISTS cache_metadata (
        cache_key TEXT PRIMARY KEY,
        entity_type TEXT NOT NULL,
        fetched_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        record_count INTEGER DEFAULT 0
      );
    `);

    // インデックス作成
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_cache_metadata_entity_type
      ON cache_metadata(entity_type);
    `);
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_cache_metadata_expires_at
      ON cache_metadata(expires_at);
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

    log.info('[SQLite] Database initialized successfully');
  } catch (error) {
    // ロールバック
    db.execSync('ROLLBACK;');
    log.error('[SQLite] Database initialization failed:', error);
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
    db.execSync('DROP TABLE IF EXISTS view_history;');
    db.execSync('DROP TABLE IF EXISTS bookmarks;');
    db.execSync('DROP TABLE IF EXISTS comments;');
    db.execSync('DROP TABLE IF EXISTS follows;');
    db.execSync('DROP TABLE IF EXISTS likes;');
    db.execSync('DROP TABLE IF EXISTS images;');
    db.execSync('DROP TABLE IF EXISTS spots;');
    db.execSync('DROP TABLE IF EXISTS maps;');
    db.execSync('DROP TABLE IF EXISTS visits;');
    db.execSync('DROP TABLE IF EXISTS transport_hubs;');
    db.execSync('DROP TABLE IF EXISTS machi;');
    db.execSync('DROP TABLE IF EXISTS cities;');
    db.execSync('DROP TABLE IF EXISTS prefectures;');
    db.execSync('DROP TABLE IF EXISTS users;');

    db.execSync('COMMIT;');

    log.info('[SQLite] All tables dropped successfully');
  } catch (error) {
    db.execSync('ROLLBACK;');
    log.error('[SQLite] Failed to drop tables:', error);
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

/**
 * マイグレーション5: master_spotsテーブル追加と2テーブル構成への移行
 */
export function migration005_AddMasterSpots(): void {
  const db = getDatabase();

  log.info('[SQLite] [Migration 005] Starting: Add master_spots and refactor spots...');

  db.execSync('BEGIN TRANSACTION;');

  try {
    // 1. master_spotsテーブル作成
    db.execSync(`
      CREATE TABLE IF NOT EXISTS master_spots (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        google_place_id TEXT,
        google_formatted_address TEXT,
        google_types TEXT,
        google_phone_number TEXT,
        google_website_uri TEXT,
        google_rating REAL,
        google_user_rating_count INTEGER,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0
      );
    `);

    // インデックス作成
    db.execSync('CREATE INDEX IF NOT EXISTS idx_master_spots_google_place_id ON master_spots(google_place_id);');
    db.execSync('CREATE INDEX IF NOT EXISTS idx_master_spots_name ON master_spots(name);');
    db.execSync('CREATE INDEX IF NOT EXISTS idx_master_spots_location ON master_spots(latitude, longitude);');

    // 2. 既存spotsデータをバックアップ（もしspotsテーブルが存在する場合）
    const tableExists = db.getAllSync<{ count: number }>(
      "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='spots';"
    )[0];

    if (tableExists && tableExists.count > 0) {
      db.execSync('CREATE TABLE spots_backup AS SELECT * FROM spots;');
    }

    // 3. 既存spotsからmaster_spotsを作成（重複除外）
    if (tableExists && tableExists.count > 0) {
      db.execSync(`
        INSERT INTO master_spots (id, name, latitude, longitude, created_at, updated_at)
        SELECT
          lower(hex(randomblob(16))) as id,
          name,
          latitude,
          longitude,
          MIN(created_at) as created_at,
          MIN(created_at) as updated_at
        FROM spots_backup
        GROUP BY name, ROUND(latitude, 6), ROUND(longitude, 6);
      `);
    }

    // 4. spotsテーブルを削除（外部キー制約も削除）
    db.execSync('DROP TABLE IF EXISTS spots;');

    // 5. 新しいuser_spotsテーブルを作成
    db.execSync(`
      CREATE TABLE IF NOT EXISTS user_spots (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        map_id TEXT NOT NULL,
        master_spot_id TEXT NOT NULL,
        machi_id TEXT NOT NULL,
        custom_name TEXT,
        description TEXT,
        tags TEXT,
        images_count INTEGER DEFAULT 0,
        likes_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        order_index INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (map_id) REFERENCES maps(id) ON DELETE CASCADE,
        FOREIGN KEY (master_spot_id) REFERENCES master_spots(id) ON DELETE CASCADE,
        FOREIGN KEY (machi_id) REFERENCES machi(id),
        UNIQUE(user_id, map_id, master_spot_id)
      );
    `);

    // インデックス作成
    db.execSync('CREATE INDEX IF NOT EXISTS idx_user_spots_user_id ON user_spots(user_id);');
    db.execSync('CREATE INDEX IF NOT EXISTS idx_user_spots_map_id ON user_spots(map_id);');
    db.execSync('CREATE INDEX IF NOT EXISTS idx_user_spots_master_spot_id ON user_spots(master_spot_id);');
    db.execSync('CREATE INDEX IF NOT EXISTS idx_user_spots_machi_id ON user_spots(machi_id);');
    db.execSync('CREATE INDEX IF NOT EXISTS idx_user_spots_created_at ON user_spots(created_at DESC);');
    db.execSync('CREATE INDEX IF NOT EXISTS idx_user_spots_is_synced ON user_spots(is_synced);');

    // 6. バックアップデータを新構造に移行
    if (tableExists && tableExists.count > 0) {
      db.execSync(`
        INSERT INTO user_spots (
        id, user_id, map_id, master_spot_id, machi_id,
        description, images_count, likes_count, comments_count,
        order_index, created_at, updated_at, synced_at, is_synced
      )
      SELECT
        sb.id,
        sb.user_id,
        sb.map_id,
        ms.id as master_spot_id,
        sb.machi_id,
        sb.memo as description,
        sb.images_count,
        sb.likes_count,
        sb.comments_count,
        sb.order_index,
        sb.created_at,
        sb.updated_at,
        sb.synced_at,
        sb.is_synced
        FROM spots_backup sb
        JOIN master_spots ms ON (
          ms.name = sb.name
          AND ROUND(ms.latitude, 6) = ROUND(sb.latitude, 6)
          AND ROUND(ms.longitude, 6) = ROUND(sb.longitude, 6)
        );
      `);

      // 7. バックアップテーブルを削除
      db.execSync('DROP TABLE spots_backup;');
    }

    // コミット
    db.execSync('COMMIT;');

    log.info('[SQLite] [Migration 005] Completed successfully');
  } catch (error) {
    db.execSync('ROLLBACK;');
    log.error('[SQLite] [Migration 005] Failed:', error);
    throw error;
  }
}

/**
 * マイグレーション6: machi/citiesテーブルにtile_idカラム追加
 */
export function migration006_AddTileId(): void {
  const db = getDatabase();

  log.info('[SQLite] [Migration 006] Starting: Add tile_id to machi and cities...');

  db.execSync('BEGIN TRANSACTION;');

  try {
    // 1. machiテーブルにtile_idカラム追加（存在しない場合のみ）
    const machiColumns = db.getAllSync<{ name: string }>(
      "PRAGMA table_info(machi);"
    );
    const hasMachiTileId = machiColumns.some(col => col.name === 'tile_id');

    if (!hasMachiTileId) {
      db.execSync('ALTER TABLE machi ADD COLUMN tile_id TEXT;');
      db.execSync('CREATE INDEX IF NOT EXISTS idx_machi_tile_id ON machi(tile_id);');

      // 既存データのtile_idを計算して更新
      db.execSync(`
        UPDATE machi
        SET tile_id = CAST(CAST(longitude / 0.25 AS INTEGER) AS TEXT) || '_' || CAST(CAST(latitude / 0.25 AS INTEGER) AS TEXT)
        WHERE tile_id IS NULL AND latitude IS NOT NULL AND longitude IS NOT NULL;
      `);
    }

    // 2. citiesテーブルにtile_idカラム追加（存在しない場合のみ）
    const citiesColumns = db.getAllSync<{ name: string }>(
      "PRAGMA table_info(cities);"
    );
    const hasCitiesTileId = citiesColumns.some(col => col.name === 'tile_id');

    if (!hasCitiesTileId) {
      db.execSync('ALTER TABLE cities ADD COLUMN tile_id TEXT;');
      db.execSync('CREATE INDEX IF NOT EXISTS idx_cities_tile_id ON cities(tile_id);');

      // 既存データのtile_idを計算して更新
      db.execSync(`
        UPDATE cities
        SET tile_id = CAST(CAST(longitude / 0.25 AS INTEGER) AS TEXT) || '_' || CAST(CAST(latitude / 0.25 AS INTEGER) AS TEXT)
        WHERE tile_id IS NULL AND latitude IS NOT NULL AND longitude IS NOT NULL;
      `);
    }

    // コミット
    db.execSync('COMMIT;');

    log.info('[SQLite] [Migration 006] Completed successfully');
  } catch (error) {
    db.execSync('ROLLBACK;');
    log.error('[SQLite] [Migration 006] Failed:', error);
    throw error;
  }
}

/**
 * マイグレーション7: transport_hubsテーブル追加
 */
export function migration007_AddTransportHubs(): void {
  const db = getDatabase();

  log.info('[SQLite] [Migration 007] Starting: Add transport_hubs table...');

  db.execSync('BEGIN TRANSACTION;');

  try {
    // transport_hubsテーブルが存在しない場合のみ作成
    const tableExists = db.getAllSync<{ count: number }>(
      "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='transport_hubs';"
    )[0];

    if (!tableExists || tableExists.count === 0) {
      db.execSync(`
        CREATE TABLE IF NOT EXISTS transport_hubs (
          id TEXT PRIMARY KEY,
          osm_id INTEGER,
          osm_type TEXT,
          prefecture_id TEXT NOT NULL,
          city_id TEXT,
          type TEXT NOT NULL,
          subtype TEXT,
          name TEXT NOT NULL,
          name_kana TEXT,
          operator TEXT,
          network TEXT,
          ref TEXT,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          tile_id TEXT,
          country_code TEXT NOT NULL DEFAULT 'jp',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          FOREIGN KEY (prefecture_id) REFERENCES prefectures(id),
          FOREIGN KEY (city_id) REFERENCES cities(id)
        );
      `);

      // インデックス作成
      db.execSync('CREATE INDEX IF NOT EXISTS idx_transport_hubs_prefecture_id ON transport_hubs(prefecture_id);');
      db.execSync('CREATE INDEX IF NOT EXISTS idx_transport_hubs_type ON transport_hubs(type);');
      db.execSync('CREATE INDEX IF NOT EXISTS idx_transport_hubs_tile_id ON transport_hubs(tile_id);');
      db.execSync('CREATE INDEX IF NOT EXISTS idx_transport_hubs_location ON transport_hubs(latitude, longitude);');
    }

    // コミット
    db.execSync('COMMIT;');

    log.info('[SQLite] [Migration 007] Completed successfully');
  } catch (error) {
    db.execSync('ROLLBACK;');
    log.error('[SQLite] [Migration 007] Failed:', error);
    throw error;
  }
}

/**
 * マイグレーション008: regionsテーブルに座標カラム追加
 */
function migration008_AddRegionsCoordinates(): void {
  const db = getDatabase();

  log.info('[SQLite] [Migration 008] Adding coordinates to regions table...');

  try {
    // カラムが存在するかチェック
    const tableInfo = db.getAllSync<{ name: string }>('PRAGMA table_info(regions);');
    const hasLatitude = tableInfo.some((col) => col.name === 'latitude');
    const hasLongitude = tableInfo.some((col) => col.name === 'longitude');

    if (!hasLatitude || !hasLongitude) {
      db.execSync('BEGIN TRANSACTION;');

      if (!hasLatitude) {
        db.execSync('ALTER TABLE regions ADD COLUMN latitude REAL;');
      }
      if (!hasLongitude) {
        db.execSync('ALTER TABLE regions ADD COLUMN longitude REAL;');
      }

      db.execSync('COMMIT;');
      log.info('[SQLite] [Migration 008] Completed successfully');
    } else {
      log.info('[SQLite] [Migration 008] Columns already exist, skipping');
    }
  } catch (error) {
    db.execSync('ROLLBACK;');
    log.error('[SQLite] [Migration 008] Failed:', error);
    throw error;
  }
}

/**
 * マイグレーション009: spot_idをuser_spot_idにリネーム
 * 対象テーブル: comments, bookmarks, images, likes
 */
function migration009_RenameSpotIdToUserSpotId(): void {
  const db = getDatabase();

  log.info('[SQLite] [Migration 009] Renaming spot_id to user_spot_id...');

  try {
    db.execSync('BEGIN TRANSACTION;');

    // 1. commentsテーブル
    const commentsInfo = db.getAllSync<{ name: string }>('PRAGMA table_info(comments);');
    if (commentsInfo.some((col) => col.name === 'spot_id')) {
      db.execSync('DROP INDEX IF EXISTS idx_comments_spot_id;');
      db.execSync('ALTER TABLE comments RENAME COLUMN spot_id TO user_spot_id;');
      db.execSync('CREATE INDEX IF NOT EXISTS idx_comments_user_spot_id ON comments(user_spot_id);');
    }

    // 2. bookmarksテーブル
    const bookmarksInfo = db.getAllSync<{ name: string }>('PRAGMA table_info(bookmarks);');
    if (bookmarksInfo.some((col) => col.name === 'spot_id')) {
      db.execSync('DROP INDEX IF EXISTS idx_bookmarks_spot_id;');
      db.execSync('ALTER TABLE bookmarks RENAME COLUMN spot_id TO user_spot_id;');
      db.execSync('CREATE INDEX IF NOT EXISTS idx_bookmarks_user_spot_id ON bookmarks(user_spot_id);');
    }

    // 3. imagesテーブル
    const imagesInfo = db.getAllSync<{ name: string }>('PRAGMA table_info(images);');
    if (imagesInfo.some((col) => col.name === 'spot_id')) {
      db.execSync('DROP INDEX IF EXISTS idx_images_spot_id;');
      db.execSync('ALTER TABLE images RENAME COLUMN spot_id TO user_spot_id;');
      db.execSync('CREATE INDEX IF NOT EXISTS idx_images_user_spot_id ON images(user_spot_id);');
    }

    // 4. likesテーブル
    const likesInfo = db.getAllSync<{ name: string }>('PRAGMA table_info(likes);');
    if (likesInfo.some((col) => col.name === 'spot_id')) {
      db.execSync('DROP INDEX IF EXISTS idx_likes_spot_id;');
      db.execSync('ALTER TABLE likes RENAME COLUMN spot_id TO user_spot_id;');
      db.execSync('CREATE INDEX IF NOT EXISTS idx_likes_user_spot_id ON likes(user_spot_id);');
    }

    db.execSync('COMMIT;');
    log.info('[SQLite] [Migration 009] Completed successfully');
  } catch (error) {
    db.execSync('ROLLBACK;');
    log.error('[SQLite] [Migration 009] Failed:', error);
    throw error;
  }
}

/**
 * 全マイグレーションを実行
 */
export function runMigrations(): void {
  // バージョンテーブル初期化
  initVersionTable();

  const currentVersion = getCurrentVersion();
  log.info(`[SQLite] Current database version: ${currentVersion}`);

  // マイグレーション5: master_spots追加
  if (currentVersion < 5) {
    migration005_AddMasterSpots();
    recordVersion(5);
    log.info('[SQLite] Applied version 5');
  }

  // マイグレーション6: tile_id追加
  if (currentVersion < 6) {
    migration006_AddTileId();
    recordVersion(6);
    log.info('[SQLite] Applied version 6');
  }

  // マイグレーション7: transport_hubs追加
  if (currentVersion < 7) {
    migration007_AddTransportHubs();
    recordVersion(7);
    log.info('[SQLite] Applied version 7');
  }

  // マイグレーション8: regions座標カラム追加
  if (currentVersion < 8) {
    migration008_AddRegionsCoordinates();
    recordVersion(8);
    log.info('[SQLite] Applied version 8');
  }

  // マイグレーション9: spot_id → user_spot_idリネーム
  if (currentVersion < 9) {
    migration009_RenameSpotIdToUserSpotId();
    recordVersion(9);
    log.info('[SQLite] Applied version 9');
  }

  log.info('[SQLite] All migrations completed');
}

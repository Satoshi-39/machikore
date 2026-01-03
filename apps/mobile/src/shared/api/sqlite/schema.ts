/**
 * SQLite スキーマ定義
 *
 * 開発環境では毎回テーブルを再作成します。
 * 本番環境ではマイグレーション方式に移行予定。
 */

import { getDatabase } from './client';
import { log } from '@/shared/config/logger';

/**
 * データベースを初期化（全テーブル作成）
 *
 * 開発環境では既存テーブルをドロップして再作成します。
 */
export function initializeDatabase(): void {
  const db = getDatabase();

  db.execSync('BEGIN TRANSACTION;');

  try {
    // 既存テーブルをドロップ（依存関係の逆順）
    db.execSync('DROP TABLE IF EXISTS sync_queue;');
    db.execSync('DROP TABLE IF EXISTS cache_metadata;');
    db.execSync('DROP TABLE IF EXISTS view_history;');
    db.execSync('DROP TABLE IF EXISTS bookmarks;');
    db.execSync('DROP TABLE IF EXISTS comments;');
    db.execSync('DROP TABLE IF EXISTS follows;');
    db.execSync('DROP TABLE IF EXISTS likes;');
    db.execSync('DROP TABLE IF EXISTS images;');
    db.execSync('DROP TABLE IF EXISTS user_spots;');
    db.execSync('DROP TABLE IF EXISTS master_spots;');
    db.execSync('DROP TABLE IF EXISTS map_labels;');
    db.execSync('DROP TABLE IF EXISTS maps;');
    db.execSync('DROP TABLE IF EXISTS visits;');
    db.execSync('DROP TABLE IF EXISTS transport_hubs;');
    db.execSync('DROP TABLE IF EXISTS machi;');
    db.execSync('DROP TABLE IF EXISTS cities;');
    db.execSync('DROP TABLE IF EXISTS prefectures;');
    db.execSync('DROP TABLE IF EXISTS regions;');
    db.execSync('DROP TABLE IF EXISTS countries;');
    db.execSync('DROP TABLE IF EXISTS continents;');
    db.execSync('DROP TABLE IF EXISTS users;');
    db.execSync('DROP TABLE IF EXISTS db_version;');
    // 古いテーブル
    db.execSync('DROP TABLE IF EXISTS spots;');
    db.execSync('DROP TABLE IF EXISTS posts;');
    db.execSync('DROP TABLE IF EXISTS schedules;');
    db.execSync('DROP TABLE IF EXISTS friends;');
    db.execSync('DROP TABLE IF EXISTS stations;');

    // ========================================
    // 1. ユーザーテーブル
    // ========================================
    db.execSync(`
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL UNIQUE,
        display_name TEXT,
        avatar_url TEXT,
        bio TEXT,
        is_premium INTEGER DEFAULT 0,
        premium_started_at TEXT,
        premium_expires_at TEXT,
        push_token TEXT,
        push_token_updated_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0
      );
    `);
    db.execSync('CREATE INDEX idx_users_email ON users(email);');
    db.execSync('CREATE INDEX idx_users_username ON users(username);');
    db.execSync('CREATE INDEX idx_users_is_synced ON users(is_synced);');

    // ========================================
    // 2. 大陸テーブル
    // ========================================
    db.execSync(`
      CREATE TABLE continents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        name_kana TEXT,
        name_translations TEXT,
        display_order INTEGER NOT NULL,
        latitude REAL,
        longitude REAL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // ========================================
    // 3. 国テーブル
    // ========================================
    db.execSync(`
      CREATE TABLE countries (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        name_kana TEXT,
        name_translations TEXT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        continent_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (continent_id) REFERENCES continents(id)
      );
    `);
    db.execSync('CREATE INDEX idx_countries_continent_id ON countries(continent_id);');

    // ========================================
    // 4. 地方テーブル
    // ========================================
    db.execSync(`
      CREATE TABLE regions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        name_kana TEXT,
        name_translations TEXT,
        latitude REAL,
        longitude REAL,
        country_id TEXT NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (country_id) REFERENCES countries(id)
      );
    `);
    db.execSync('CREATE INDEX idx_regions_country_id ON regions(country_id);');

    // ========================================
    // 5. 都道府県テーブル
    // ========================================
    db.execSync(`
      CREATE TABLE prefectures (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        name_kana TEXT,
        name_translations TEXT,
        region_id TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (region_id) REFERENCES regions(id)
      );
    `);
    db.execSync('CREATE INDEX idx_prefectures_region_id ON prefectures(region_id);');

    // ========================================
    // 6. 市区町村テーブル
    // ========================================
    db.execSync(`
      CREATE TABLE cities (
        id TEXT PRIMARY KEY,
        prefecture_id TEXT NOT NULL,
        name TEXT NOT NULL,
        name_kana TEXT,
        name_translations TEXT,
        type TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        tile_id TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (prefecture_id) REFERENCES prefectures(id)
      );
    `);
    db.execSync('CREATE INDEX idx_cities_prefecture_id ON cities(prefecture_id);');
    db.execSync('CREATE INDEX idx_cities_tile_id ON cities(tile_id);');

    // ========================================
    // 7. 街テーブル
    // ========================================
    db.execSync(`
      CREATE TABLE machi (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        name_kana TEXT,
        name_translations TEXT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        prefecture_id TEXT NOT NULL,
        city_id TEXT,
        tile_id TEXT,
        osm_id INTEGER,
        place_type TEXT,
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
    db.execSync('CREATE INDEX idx_machi_name ON machi(name);');
    db.execSync('CREATE INDEX idx_machi_prefecture_id ON machi(prefecture_id);');
    db.execSync('CREATE INDEX idx_machi_city_id ON machi(city_id);');
    db.execSync('CREATE INDEX idx_machi_tile_id ON machi(tile_id);');

    // ========================================
    // 8. 交通機関テーブル
    // ========================================
    db.execSync(`
      CREATE TABLE transport_hubs (
        id TEXT PRIMARY KEY,
        osm_id INTEGER,
        osm_type TEXT,
        prefecture_id TEXT NOT NULL,
        city_id TEXT,
        type TEXT NOT NULL,
        subtype TEXT,
        name TEXT NOT NULL,
        name_kana TEXT,
        name_translations TEXT,
        operator TEXT,
        network TEXT,
        ref TEXT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        tile_id TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (prefecture_id) REFERENCES prefectures(id),
        FOREIGN KEY (city_id) REFERENCES cities(id)
      );
    `);
    db.execSync('CREATE INDEX idx_transport_hubs_prefecture_id ON transport_hubs(prefecture_id);');
    db.execSync('CREATE INDEX idx_transport_hubs_type ON transport_hubs(type);');
    db.execSync('CREATE INDEX idx_transport_hubs_tile_id ON transport_hubs(tile_id);');
    db.execSync('CREATE INDEX idx_transport_hubs_location ON transport_hubs(latitude, longitude);');

    // ========================================
    // 9. マップテーブル
    // ========================================
    db.execSync(`
      CREATE TABLE maps (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        category_id TEXT,
        is_public INTEGER DEFAULT 0,
        is_official INTEGER DEFAULT 0,
        show_label_chips INTEGER DEFAULT 1,
        thumbnail_url TEXT,
        spots_count INTEGER DEFAULT 0,
        likes_count INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0
      );
    `);
    db.execSync('CREATE INDEX idx_maps_user_id ON maps(user_id);');
    db.execSync('CREATE INDEX idx_maps_is_public ON maps(is_public);');
    db.execSync('CREATE INDEX idx_maps_created_at ON maps(created_at DESC);');
    db.execSync('CREATE INDEX idx_maps_is_synced ON maps(is_synced);');

    // ========================================
    // 10. マップラベルテーブル
    // ========================================
    db.execSync(`
      CREATE TABLE map_labels (
        id TEXT PRIMARY KEY,
        map_id TEXT NOT NULL,
        name TEXT NOT NULL,
        color TEXT NOT NULL DEFAULT 'blue',
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (map_id) REFERENCES maps(id) ON DELETE CASCADE,
        UNIQUE(map_id, name)
      );
    `);
    db.execSync('CREATE INDEX idx_map_labels_map_id ON map_labels(map_id);');

    // ========================================
    // 11. マスタースポットテーブル
    // ========================================
    db.execSync(`
      CREATE TABLE master_spots (
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
    db.execSync('CREATE INDEX idx_master_spots_google_place_id ON master_spots(google_place_id);');
    db.execSync('CREATE INDEX idx_master_spots_name ON master_spots(name);');
    db.execSync('CREATE INDEX idx_master_spots_location ON master_spots(latitude, longitude);');

    // ========================================
    // 12. ユーザースポットテーブル
    // ========================================
    db.execSync(`
      CREATE TABLE user_spots (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        map_id TEXT NOT NULL,
        master_spot_id TEXT NOT NULL,
        machi_id TEXT NOT NULL,
        prefecture_id TEXT,
        description TEXT NOT NULL,
        spot_color TEXT DEFAULT 'blue',
        label_id TEXT,
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
        FOREIGN KEY (prefecture_id) REFERENCES prefectures(id),
        FOREIGN KEY (label_id) REFERENCES map_labels(id) ON DELETE SET NULL,
        UNIQUE(user_id, map_id, master_spot_id)
      );
    `);
    db.execSync('CREATE INDEX idx_user_spots_user_id ON user_spots(user_id);');
    db.execSync('CREATE INDEX idx_user_spots_map_id ON user_spots(map_id);');
    db.execSync('CREATE INDEX idx_user_spots_master_spot_id ON user_spots(master_spot_id);');
    db.execSync('CREATE INDEX idx_user_spots_machi_id ON user_spots(machi_id);');
    db.execSync('CREATE INDEX idx_user_spots_prefecture_id ON user_spots(prefecture_id);');
    db.execSync('CREATE INDEX idx_user_spots_created_at ON user_spots(created_at DESC);');
    db.execSync('CREATE INDEX idx_user_spots_is_synced ON user_spots(is_synced);');
    db.execSync('CREATE INDEX idx_user_spots_label_id ON user_spots(label_id);');

    // ========================================
    // 13. 訪問記録テーブル
    // ========================================
    db.execSync(`
      CREATE TABLE visits (
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
    db.execSync('CREATE INDEX idx_visits_user_id ON visits(user_id);');
    db.execSync('CREATE INDEX idx_visits_machi_id ON visits(machi_id);');
    db.execSync('CREATE INDEX idx_visits_visited_at ON visits(visited_at);');
    db.execSync('CREATE INDEX idx_visits_user_machi ON visits(user_id, machi_id);');
    db.execSync('CREATE INDEX idx_visits_is_synced ON visits(is_synced);');

    // ========================================
    // 14. フォローテーブル
    // ========================================
    db.execSync(`
      CREATE TABLE follows (
        id TEXT PRIMARY KEY,
        follower_id TEXT NOT NULL,
        followee_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0,
        UNIQUE(follower_id, followee_id)
      );
    `);
    db.execSync('CREATE INDEX idx_follows_follower_id ON follows(follower_id);');
    db.execSync('CREATE INDEX idx_follows_followee_id ON follows(followee_id);');
    db.execSync('CREATE INDEX idx_follows_is_synced ON follows(is_synced);');

    // ========================================
    // 15. コメントテーブル
    // ========================================
    db.execSync(`
      CREATE TABLE comments (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        map_id TEXT,
        user_spot_id TEXT,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (map_id) REFERENCES maps(id) ON DELETE CASCADE,
        FOREIGN KEY (user_spot_id) REFERENCES user_spots(id) ON DELETE CASCADE,
        CHECK ((map_id IS NOT NULL AND user_spot_id IS NULL) OR (map_id IS NULL AND user_spot_id IS NOT NULL))
      );
    `);
    db.execSync('CREATE INDEX idx_comments_user_id ON comments(user_id);');
    db.execSync('CREATE INDEX idx_comments_map_id ON comments(map_id);');
    db.execSync('CREATE INDEX idx_comments_user_spot_id ON comments(user_spot_id);');
    db.execSync('CREATE INDEX idx_comments_created_at ON comments(created_at DESC);');
    db.execSync('CREATE INDEX idx_comments_is_synced ON comments(is_synced);');

    // ========================================
    // 16. ブックマークテーブル
    // ========================================
    db.execSync(`
      CREATE TABLE bookmarks (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        map_id TEXT,
        user_spot_id TEXT,
        created_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (map_id) REFERENCES maps(id) ON DELETE CASCADE,
        FOREIGN KEY (user_spot_id) REFERENCES user_spots(id) ON DELETE CASCADE,
        UNIQUE(user_id, map_id, user_spot_id),
        CHECK ((map_id IS NOT NULL AND user_spot_id IS NULL) OR (map_id IS NULL AND user_spot_id IS NOT NULL))
      );
    `);
    db.execSync('CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);');
    db.execSync('CREATE INDEX idx_bookmarks_map_id ON bookmarks(map_id);');
    db.execSync('CREATE INDEX idx_bookmarks_user_spot_id ON bookmarks(user_spot_id);');
    db.execSync('CREATE INDEX idx_bookmarks_is_synced ON bookmarks(is_synced);');

    // ========================================
    // 17. 画像テーブル
    // ========================================
    db.execSync(`
      CREATE TABLE images (
        id TEXT PRIMARY KEY,
        user_spot_id TEXT NOT NULL,
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
        FOREIGN KEY (user_spot_id) REFERENCES user_spots(id) ON DELETE CASCADE
      );
    `);
    db.execSync('CREATE INDEX idx_images_user_spot_id ON images(user_spot_id);');
    db.execSync('CREATE INDEX idx_images_is_synced ON images(is_synced);');

    // ========================================
    // 18. いいねテーブル
    // ========================================
    db.execSync(`
      CREATE TABLE likes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        map_id TEXT,
        user_spot_id TEXT,
        created_at TEXT NOT NULL,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (map_id) REFERENCES maps(id) ON DELETE CASCADE,
        FOREIGN KEY (user_spot_id) REFERENCES user_spots(id) ON DELETE CASCADE,
        UNIQUE(user_id, map_id, user_spot_id),
        CHECK ((map_id IS NOT NULL AND user_spot_id IS NULL) OR (map_id IS NULL AND user_spot_id IS NOT NULL))
      );
    `);
    db.execSync('CREATE INDEX idx_likes_user_id ON likes(user_id);');
    db.execSync('CREATE INDEX idx_likes_map_id ON likes(map_id);');
    db.execSync('CREATE INDEX idx_likes_user_spot_id ON likes(user_spot_id);');
    db.execSync('CREATE INDEX idx_likes_is_synced ON likes(is_synced);');

    // ========================================
    // 19. 閲覧履歴テーブル
    // ========================================
    db.execSync(`
      CREATE TABLE view_history (
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
    db.execSync('CREATE INDEX idx_view_history_user_id ON view_history(user_id);');
    db.execSync('CREATE INDEX idx_view_history_map_id ON view_history(map_id);');
    db.execSync('CREATE INDEX idx_view_history_viewed_at ON view_history(viewed_at DESC);');
    db.execSync('CREATE INDEX idx_view_history_user_viewed ON view_history(user_id, viewed_at DESC);');
    db.execSync('CREATE INDEX idx_view_history_is_synced ON view_history(is_synced);');

    // ========================================
    // 20. キャッシュメタデータテーブル
    // ========================================
    db.execSync(`
      CREATE TABLE cache_metadata (
        cache_key TEXT PRIMARY KEY,
        entity_type TEXT NOT NULL,
        fetched_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        record_count INTEGER DEFAULT 0
      );
    `);
    db.execSync('CREATE INDEX idx_cache_metadata_entity_type ON cache_metadata(entity_type);');
    db.execSync('CREATE INDEX idx_cache_metadata_expires_at ON cache_metadata(expires_at);');

    // ========================================
    // 21. 同期キューテーブル
    // ========================================
    db.execSync(`
      CREATE TABLE sync_queue (
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
    db.execSync('CREATE INDEX idx_sync_queue_entity_type ON sync_queue(entity_type);');
    db.execSync('CREATE INDEX idx_sync_queue_status ON sync_queue(status);');
    db.execSync('CREATE INDEX idx_sync_queue_created_at ON sync_queue(created_at);');

    db.execSync('COMMIT;');
    log.info('[SQLite] Database initialized successfully');
  } catch (error) {
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
    db.execSync('DROP TABLE IF EXISTS cache_metadata;');
    db.execSync('DROP TABLE IF EXISTS view_history;');
    db.execSync('DROP TABLE IF EXISTS bookmarks;');
    db.execSync('DROP TABLE IF EXISTS comments;');
    db.execSync('DROP TABLE IF EXISTS follows;');
    db.execSync('DROP TABLE IF EXISTS likes;');
    db.execSync('DROP TABLE IF EXISTS images;');
    db.execSync('DROP TABLE IF EXISTS user_spots;');
    db.execSync('DROP TABLE IF EXISTS master_spots;');
    db.execSync('DROP TABLE IF EXISTS map_labels;');
    db.execSync('DROP TABLE IF EXISTS maps;');
    db.execSync('DROP TABLE IF EXISTS visits;');
    db.execSync('DROP TABLE IF EXISTS transport_hubs;');
    db.execSync('DROP TABLE IF EXISTS machi;');
    db.execSync('DROP TABLE IF EXISTS cities;');
    db.execSync('DROP TABLE IF EXISTS prefectures;');
    db.execSync('DROP TABLE IF EXISTS regions;');
    db.execSync('DROP TABLE IF EXISTS countries;');
    db.execSync('DROP TABLE IF EXISTS continents;');
    db.execSync('DROP TABLE IF EXISTS users;');
    db.execSync('DROP TABLE IF EXISTS db_version;');

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

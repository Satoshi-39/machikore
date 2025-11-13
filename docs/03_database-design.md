# 街コレ - データベース設計書

## 目次
- [1. データベース構成概要](#1-データベース構成概要)
- [2. SQLite スキーマ設計（ローカルDB）](#2-sqlite-スキーマ設計ローカルdb)
- [3. Supabase スキーマ設計（クラウドDB）](#3-supabase-スキーマ設計クラウドdb)
- [4. マイグレーション戦略](#4-マイグレーション戦略)
- [5. データ同期設計](#5-データ同期設計)
- [6. パフォーマンス最適化](#6-パフォーマンス最適化)
- [7. データ整合性](#7-データ整合性)
- [8. バックアップ・リストア](#8-バックアップリストア)
- [9. セキュリティ](#9-セキュリティ)
- [10. 補足](#10-補足)
- [11. 削除ルールとカスケード動作](#11-削除ルールとカスケード動作)

---

## 1. データベース構成概要

### 1.1 2層データベースアーキテクチャ

```
┌─────────────────────────────────────────────────────────┐
│                  Application Layer                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────────┐    ┌──────────────────────┐  │
│  │   SQLite (Local)     │    │  Supabase (Cloud)    │  │
│  │                      │    │                      │  │
│  │  - 無料版：全データ  │    │  - 有料版のみ        │  │
│  │  - 有料版：キャッシュ│    │  - バックアップ      │  │
│  │  - オフライン対応    │    │  - 友達同期          │  │
│  │                      │    │  - クロスデバイス    │  │
│  └──────────────────────┘    └──────────────────────┘  │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 2. SQLite スキーマ設計（ローカルDB）

### 2.1 テーブル一覧

1. `users` - ユーザー情報
2. `visits` - 訪問記録
3. `posts` - 投稿
4. `images` - 画像
5. `schedules` - 予定
6. `likes` - いいね
7. `comments` - コメント
8. `sync_queue` - 同期キュー
9. `cached_friends` - 友達キャッシュ（有料版）
10. `app_settings` - アプリ設定

---

### 2.2 テーブル詳細設計

#### 2.2.1 users（ユーザー情報）

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,                    -- UUIDまたはSupabase User ID
  email TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,                        -- プロフィール画像URL
  bio TEXT,                               -- 自己紹介
  is_subscribed INTEGER DEFAULT 0,        -- 有料版フラグ (0: 無料, 1: 有料)
  subscription_started_at TEXT,           -- サブスク開始日時 (ISO8601)
  subscription_expires_at TEXT,           -- サブスク有効期限 (ISO8601)
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  synced_at TEXT                          -- 最終同期日時
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_subscribed ON users(is_subscribed);
```

---

#### 2.2.2 visits（訪問記録）

```sql
CREATE TABLE visits (
  id TEXT PRIMARY KEY,                    -- UUID
  user_id TEXT NOT NULL,
  station_id TEXT NOT NULL,               -- 街ID（stations.jsonのid）
  visit_count INTEGER NOT NULL DEFAULT 1, -- 訪問回数（1回目、2回目...）
  visited_at TEXT NOT NULL,               -- 訪問日時 (ISO8601)
  memo TEXT,                              -- メモ
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  synced_at TEXT,                         -- Supabaseへの同期日時
  is_synced INTEGER DEFAULT 0,            -- 同期済みフラグ (0: 未, 1: 済)

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_visits_user_id ON visits(user_id);
CREATE INDEX idx_visits_station_id ON visits(station_id);
CREATE INDEX idx_visits_visited_at ON visits(visited_at);
CREATE INDEX idx_visits_user_station ON visits(user_id, station_id);
CREATE INDEX idx_visits_is_synced ON visits(is_synced);
```

---

#### 2.2.3 posts（投稿）

```sql
CREATE TABLE posts (
  id TEXT PRIMARY KEY,                    -- UUID
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,                  -- 投稿本文
  station_id TEXT,                        -- 関連する街ID（任意）
  visit_id TEXT,                          -- 関連する訪問記録ID（訪問に紐付く場合）
  is_auto_generated INTEGER DEFAULT 0,    -- 自動生成フラグ (0: 手動, 1: 自動)
  is_draft INTEGER DEFAULT 0,             -- 下書きフラグ (0: 公開, 1: 下書き)
  likes_count INTEGER DEFAULT 0,          -- いいね数
  comments_count INTEGER DEFAULT 0,       -- コメント数
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  synced_at TEXT,
  is_synced INTEGER DEFAULT 0,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE CASCADE  -- 訪問削除時に投稿も連鎖削除
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_station_id ON posts(station_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_is_draft ON posts(is_draft);
CREATE INDEX idx_posts_is_synced ON posts(is_synced);
```

---

#### 2.2.4 images（画像）

```sql
CREATE TABLE images (
  id TEXT PRIMARY KEY,                    -- UUID
  post_id TEXT NOT NULL,
  local_path TEXT,                        -- ローカルファイルパス
  supabase_url TEXT,                      -- Supabase Storage URL
  width INTEGER,
  height INTEGER,
  file_size INTEGER,                      -- バイト数
  order_index INTEGER DEFAULT 0,          -- 表示順序
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  synced_at TEXT,
  is_synced INTEGER DEFAULT 0,

  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE INDEX idx_images_post_id ON images(post_id);
CREATE INDEX idx_images_is_synced ON images(is_synced);
```

---

#### 2.2.5 schedules（予定）

```sql
CREATE TABLE schedules (
  id TEXT PRIMARY KEY,                    -- UUID
  user_id TEXT NOT NULL,
  station_id TEXT NOT NULL,               -- 訪問予定の街ID
  scheduled_at TEXT NOT NULL,             -- 予定日時 (ISO8601)
  title TEXT NOT NULL,                    -- タイトル（例：「渋谷で友達と会う」）
  memo TEXT,                              -- メモ
  is_completed INTEGER DEFAULT 0,         -- 完了フラグ (0: 未完了, 1: 完了)
  completed_at TEXT,                      -- 完了日時
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  synced_at TEXT,
  is_synced INTEGER DEFAULT 0,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_schedules_user_id ON schedules(user_id);
CREATE INDEX idx_schedules_scheduled_at ON schedules(scheduled_at);
CREATE INDEX idx_schedules_is_completed ON schedules(is_completed);
CREATE INDEX idx_schedules_is_synced ON schedules(is_synced);
```

---

#### 2.2.6 likes（いいね）

```sql
CREATE TABLE likes (
  id TEXT PRIMARY KEY,                    -- UUID
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  synced_at TEXT,
  is_synced INTEGER DEFAULT 0,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,

  UNIQUE(user_id, post_id)                -- 1ユーザー1投稿につき1いいね
);

CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_is_synced ON likes(is_synced);
```

---

#### 2.2.7 comments（コメント）

```sql
CREATE TABLE comments (
  id TEXT PRIMARY KEY,                    -- UUID
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  synced_at TEXT,
  is_synced INTEGER DEFAULT 0,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
CREATE INDEX idx_comments_is_synced ON comments(is_synced);
```

---

#### 2.2.8 sync_queue（同期キュー）

```sql
CREATE TABLE sync_queue (
  id TEXT PRIMARY KEY,                    -- UUID
  entity_type TEXT NOT NULL,              -- 'visit', 'post', 'schedule', 'like', 'comment'
  entity_id TEXT NOT NULL,                -- 対象エンティティのID
  action TEXT NOT NULL,                   -- 'create', 'update', 'delete'
  payload TEXT,                           -- JSON形式のペイロード
  retry_count INTEGER DEFAULT 0,          -- リトライ回数
  max_retries INTEGER DEFAULT 3,
  status TEXT DEFAULT 'pending',          -- 'pending', 'processing', 'failed', 'completed'
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  processed_at TEXT
);

CREATE INDEX idx_sync_queue_status ON sync_queue(status);
CREATE INDEX idx_sync_queue_entity ON sync_queue(entity_type, entity_id);
CREATE INDEX idx_sync_queue_created_at ON sync_queue(created_at);
```

---

#### 2.2.9 cached_friends（友達キャッシュ）

```sql
CREATE TABLE cached_friends (
  id TEXT PRIMARY KEY,                    -- UUID
  user_id TEXT NOT NULL,
  friend_id TEXT NOT NULL,
  friend_username TEXT,
  friend_display_name TEXT,
  friend_avatar_url TEXT,
  status TEXT NOT NULL,                   -- 'pending', 'accepted'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  UNIQUE(user_id, friend_id)
);

CREATE INDEX idx_cached_friends_user_id ON cached_friends(user_id);
CREATE INDEX idx_cached_friends_status ON cached_friends(status);
```

---

#### 2.2.10 app_settings（アプリ設定）

```sql
CREATE TABLE app_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 初期設定データ
INSERT INTO app_settings (key, value) VALUES
  ('theme', 'light'),
  ('notifications_enabled', '1'),
  ('last_sync_at', NULL),
  ('onboarding_completed', '0');
```

---

## 3. Supabase スキーマ設計（クラウドDB）

### 3.1 テーブル一覧

1. `users` - ユーザー情報（Supabase Auth連携）
2. `visits` - 訪問記録
3. `posts` - 投稿
4. `images` - 画像メタデータ
5. `schedules` - 予定
6. `likes` - いいね
7. `comments` - コメント
8. `friendships` - 友達関係

---

### 3.2 テーブル詳細設計

#### 3.2.1 users（ユーザー情報）

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_subscribed BOOLEAN DEFAULT FALSE,
  subscription_started_at TIMESTAMPTZ,
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLSポリシー
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- 友達のプロフィールも閲覧可能
CREATE POLICY "Users can view friends' profiles"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM friendships
      WHERE (user_id = auth.uid() AND friend_id = users.id AND status = 'accepted')
         OR (friend_id = auth.uid() AND user_id = users.id AND status = 'accepted')
    )
  );

-- インデックス
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_is_subscribed ON users(is_subscribed);
```

---

#### 3.2.2 visits（訪問記録）

```sql
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  station_id TEXT NOT NULL,
  visit_count INTEGER NOT NULL DEFAULT 1,
  visited_at TIMESTAMPTZ NOT NULL,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLSポリシー
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own visits"
  ON visits FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view friends' visits"
  ON visits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM friendships
      WHERE (user_id = auth.uid() AND friend_id = visits.user_id AND status = 'accepted')
         OR (friend_id = auth.uid() AND user_id = visits.user_id AND status = 'accepted')
    )
  );

-- インデックス
CREATE INDEX idx_visits_user_id ON visits(user_id);
CREATE INDEX idx_visits_station_id ON visits(station_id);
CREATE INDEX idx_visits_visited_at ON visits(visited_at DESC);
CREATE INDEX idx_visits_user_station ON visits(user_id, station_id);
```

---

#### 3.2.3 posts（投稿）

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  station_id TEXT,
  visit_id UUID REFERENCES visits(id) ON DELETE SET NULL,
  is_auto_generated BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLSポリシー
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own posts"
  ON posts FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view friends' posts"
  ON posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM friendships
      WHERE (user_id = auth.uid() AND friend_id = posts.user_id AND status = 'accepted')
         OR (friend_id = auth.uid() AND user_id = posts.user_id AND status = 'accepted')
    )
  );

-- インデックス
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_station_id ON posts(station_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

---

#### 3.2.4 images（画像メタデータ）

```sql
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,             -- Supabase Storageパス
  url TEXT NOT NULL,                      -- 公開URL
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLSポリシー
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Images inherit post permissions"
  ON images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = images.post_id
        AND (posts.user_id = auth.uid() OR
             EXISTS (
               SELECT 1 FROM friendships
               WHERE (user_id = auth.uid() AND friend_id = posts.user_id AND status = 'accepted')
                  OR (friend_id = auth.uid() AND user_id = posts.user_id AND status = 'accepted')
             ))
    )
  );

-- インデックス
CREATE INDEX idx_images_post_id ON images(post_id);
```

---

#### 3.2.5 schedules（予定）

```sql
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  station_id TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  title TEXT NOT NULL,
  memo TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLSポリシー
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own schedules"
  ON schedules FOR ALL
  USING (auth.uid() = user_id);

-- インデックス
CREATE INDEX idx_schedules_user_id ON schedules(user_id);
CREATE INDEX idx_schedules_scheduled_at ON schedules(scheduled_at);
```

---

#### 3.2.6 likes（いいね）

```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, post_id)
);

-- RLSポリシー
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own likes"
  ON likes FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view likes on visible posts"
  ON likes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = likes.post_id
        AND (posts.user_id = auth.uid() OR
             EXISTS (
               SELECT 1 FROM friendships
               WHERE (user_id = auth.uid() AND friend_id = posts.user_id AND status = 'accepted')
                  OR (friend_id = auth.uid() AND user_id = posts.user_id AND status = 'accepted')
             ))
    )
  );

-- インデックス
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_post_id ON likes(post_id);
```

---

#### 3.2.7 comments（コメント）

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLSポリシー
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own comments"
  ON comments FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view comments on visible posts"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = comments.post_id
        AND (posts.user_id = auth.uid() OR
             EXISTS (
               SELECT 1 FROM friendships
               WHERE (user_id = auth.uid() AND friend_id = posts.user_id AND status = 'accepted')
                  OR (friend_id = auth.uid() AND user_id = posts.user_id AND status = 'accepted')
             ))
    )
  );

-- インデックス
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
```

---

#### 3.2.8 friendships（友達関係）

```sql
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',  -- 'pending', 'accepted', 'rejected'
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,

  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- RLSポリシー
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own friendships"
  ON friendships FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friend requests"
  ON friendships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can respond to friend requests"
  ON friendships FOR UPDATE
  USING (auth.uid() = friend_id);

CREATE POLICY "Users can delete own friendships"
  ON friendships FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- インデックス
CREATE INDEX idx_friendships_user_id ON friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX idx_friendships_status ON friendships(status);
```

---

## 4. マイグレーション戦略

### 4.1 SQLiteマイグレーション

```typescript
// src/shared/api/sqlite/migrations/001_initial.ts
export const migration_001 = `
  CREATE TABLE IF NOT EXISTS users (...);
  CREATE TABLE IF NOT EXISTS visits (...);
  CREATE TABLE IF NOT EXISTS posts (...);
  -- 他のテーブル作成...
`;

// マイグレーション実行
const migrations = [migration_001, migration_002, ...];

async function runMigrations(db: SQLite.SQLiteDatabase) {
  const currentVersion = await getCurrentVersion(db);

  for (let i = currentVersion; i < migrations.length; i++) {
    await db.execAsync(migrations[i]);
    await setVersion(db, i + 1);
  }
}
```

### 4.2 Supabaseマイグレーション

```sql
-- supabase/migrations/20250101000000_initial_schema.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (...);
CREATE TABLE visits (...);
-- 他のテーブル作成...

-- RLSポリシー設定
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ポリシー作成...
```

---

## 5. データ同期設計

### 5.1 同期フロー

```typescript
// 無料版→有料版移行時の全データ同期
async function syncAllDataToSupabase() {
  const db = await openDatabase();

  // 1. ユーザー情報同期
  await syncUsers(db);

  // 2. 訪問記録同期
  await syncVisits(db);

  // 3. 投稿同期
  await syncPosts(db);

  // 4. 画像同期
  await syncImages(db);

  // 5. 予定同期
  await syncSchedules(db);
}

// 個別エンティティの同期
async function syncVisits(db: SQLite.SQLiteDatabase) {
  const unsyncedVisits = await db.getAllAsync(
    'SELECT * FROM visits WHERE is_synced = 0'
  );

  for (const visit of unsyncedVisits) {
    try {
      // Supabaseに挿入
      const { error } = await supabase
        .from('visits')
        .insert({
          id: visit.id,
          user_id: visit.user_id,
          station_id: visit.station_id,
          visit_count: visit.visit_count,
          visited_at: visit.visited_at,
          memo: visit.memo,
        });

      if (error) throw error;

      // ローカルDBの同期フラグを更新
      await db.runAsync(
        'UPDATE visits SET is_synced = 1, synced_at = ? WHERE id = ?',
        [new Date().toISOString(), visit.id]
      );
    } catch (error) {
      console.error('Sync failed for visit:', visit.id, error);
    }
  }
}
```

### 5.2 リアルタイム同期（有料版）

```typescript
// Supabaseのリアルタイムサブスクリプション
function subscribeToFriendsPosts() {
  const { user } = useUserStore.getState();

  const subscription = supabase
    .channel('friend-posts')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'posts',
      },
      (payload) => {
        // 友達の新規投稿を受信
        const newPost = payload.new;

        // Zustand Storeを更新
        usePostStore.getState().addPost(newPost);

        // ローカルDBにキャッシュ
        cachePostLocally(newPost);
      }
    )
    .subscribe();

  return () => subscription.unsubscribe();
}
```

---

## 6. パフォーマンス最適化

### 6.1 インデックス戦略

- **頻繁にクエリされるカラム**にインデックス作成
- **複合インデックス**で複雑なクエリを高速化
- **外部キー**にもインデックス設定

### 6.2 クエリ最適化例

```sql
-- 特定日の投稿を取得（カレンダー機能）
SELECT p.*, u.username, u.avatar_url
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE DATE(p.created_at) = '2025-01-06'
ORDER BY p.created_at DESC;

-- 街ごとの訪問履歴（マップ機能）
SELECT *
FROM visits
WHERE user_id = ? AND station_id = ?
ORDER BY visited_at DESC;

-- タイムライン取得（スレッド機能）
-- 自分 + 友達の投稿を取得
SELECT p.*, u.username, u.avatar_url
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.user_id = ?
   OR p.user_id IN (
     SELECT friend_id FROM cached_friends
     WHERE user_id = ? AND status = 'accepted'
   )
ORDER BY p.created_at DESC
LIMIT 50;
```

---

## 7. データ整合性

### 7.1 外部キー制約

- すべてのリレーションに`FOREIGN KEY`制約を設定
- `ON DELETE CASCADE`で関連データを自動削除
- `ON DELETE SET NULL`で孤児レコードを防止

### 7.2 トリガー（Supabase）

```sql
-- 投稿削除時にいいね数・コメント数を更新
CREATE OR REPLACE FUNCTION update_post_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- いいねが追加/削除された場合
  IF TG_TABLE_NAME = 'likes' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
    END IF;
  END IF;

  -- コメントが追加/削除された場合
  IF TG_TABLE_NAME = 'comments' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER likes_count_trigger
AFTER INSERT OR DELETE ON likes
FOR EACH ROW EXECUTE FUNCTION update_post_counts();

CREATE TRIGGER comments_count_trigger
AFTER INSERT OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION update_post_counts();
```

---

## 8. バックアップ・リストア

### 8.1 SQLiteバックアップ

```typescript
// ローカルDBをエクスポート
async function exportDatabase(): Promise<string> {
  const db = await openDatabase();
  const exportPath = `${FileSystem.documentDirectory}backup_${Date.now()}.db`;

  await FileSystem.copyAsync({
    from: db._db._name,
    to: exportPath,
  });

  return exportPath;
}
```

### 8.2 Supabaseバックアップ

- Supabaseの自動バックアップ機能を活用
- Point-in-Time Recovery (PITR) 有効化（Pro版以上）

---

## 9. セキュリティ

### 9.1 SQLite暗号化（検討）

```typescript
// SQLCipherを使用した暗号化
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('machikore.db', {
  encryption: true,
  key: await getEncryptionKey(),
});
```

### 9.2 Supabase RLS（Row Level Security）

- すべてのテーブルでRLS有効化
- ユーザーごとに適切なアクセス権限設定
- 友達関係に基づく閲覧権限制御

---

## 10. 補足

### 10.1 データ量見積もり

- **ユーザー数**: 10,000人
- **訪問記録/ユーザー**: 平均200件 → 2,000,000レコード
- **投稿/ユーザー**: 平均50件 → 500,000レコード
- **画像/投稿**: 平均2枚 → 1,000,000レコード

### 10.2 ストレージ見積もり

- SQLite DB: ユーザーあたり約5-10MB
- 画像（ローカル）: ユーザーあたり約100-500MB
- Supabase Storage: ユーザーあたり約100-500MB（有料版）

### 10.3 今後の拡張

- **シャーディング**: ユーザー数増加時の対応
- **レプリケーション**: 高可用性の確保
- **アーカイブ**: 古いデータの別テーブル移動

---

## 11. 削除ルールとカスケード動作

### 11.1 訪問記録と投稿の関係

#### データモデル
```
訪問記録 (visits)
  ├─ 自動生成投稿 (posts where is_auto_generated = 1)  [1対1]
  └─ 手動投稿 (posts where is_auto_generated = 0)     [1対多]
```

#### 作成フロー
1. ユーザーが街マーカーをタップして訪問記録を登録
2. `visits`テーブルに訪問記録を作成
3. 自動的に`posts`テーブルに投稿を作成（`is_auto_generated = 1`、`visit_id`を設定）
4. ユーザーは追加で手動投稿を作成可能（同じ`visit_id`に紐付け、`is_auto_generated = 0`）

### 11.2 削除ルールの詳細

#### 11.2.1 手動投稿のみ削除する場合

**対象**: `is_auto_generated = 0`の投稿

**動作**:
- その投稿のみ削除
- 訪問記録（`visits`）は削除されない
- 自動生成投稿は削除されない
- 同じ訪問に紐付いた他の手動投稿は削除されない

**SQLイメージ**:
```sql
-- 手動投稿を削除
DELETE FROM posts WHERE id = ? AND is_auto_generated = 0;

-- 訪問記録と他の投稿は影響を受けない
```

**使用ケース**: ユーザーが後から追加した写真や感想を削除したい場合

---

#### 11.2.2 自動生成投稿を削除する場合

**対象**: `is_auto_generated = 1`の投稿

**動作**:
1. 自動生成投稿を削除
2. **アプリケーションロジックで**訪問記録（`visits`）も削除
3. 訪問記録の削除により、`ON DELETE CASCADE`で紐付いた全ての手動投稿も連鎖削除

**実装例**:
```typescript
// features/delete-post/api/delete-post.ts
async function deletePost(postId: string) {
  // 投稿情報を取得
  const post = await db.getFirstAsync('SELECT * FROM posts WHERE id = ?', [postId]);

  if (post.is_auto_generated === 1) {
    // 自動生成投稿の場合、訪問記録を削除（投稿は CASCADE で自動削除）
    await db.runAsync('DELETE FROM visits WHERE id = ?', [post.visit_id]);
  } else {
    // 手動投稿の場合、投稿のみ削除
    await db.runAsync('DELETE FROM posts WHERE id = ?', [postId]);
  }
}
```

**使用ケース**: ユーザーがその街への訪問記録自体をなかったことにしたい場合

---

#### 11.2.3 地図から訪問記録を直接削除する場合

**対象**: 街詳細ボトムシートから訪問記録を削除

**動作**:
1. `visits`テーブルから訪問記録を削除
2. `ON DELETE CASCADE`により、その訪問に紐付いた**全ての投稿**（自動生成 + 手動）が連鎖削除
3. `ON DELETE CASCADE`により、投稿に紐付いた**全ての画像**も連鎖削除

**SQLイメージ**:
```sql
-- 訪問記録を削除
DELETE FROM visits WHERE id = ?;

-- FOREIGN KEY制約により以下が自動実行:
-- DELETE FROM posts WHERE visit_id = ?;
-- DELETE FROM images WHERE post_id IN (SELECT id FROM posts WHERE visit_id = ?);
```

**実装例**:
```typescript
// features/visit-station/api/delete-visit.ts
async function deleteVisit(visitId: string) {
  // 確認ダイアログを表示
  const confirmed = await confirmDelete(
    '訪問記録を削除しますか？',
    'この訪問に関連する全ての投稿（写真含む）も削除されます。'
  );

  if (!confirmed) return;

  // 訪問記録を削除（投稿と画像は CASCADE で自動削除）
  await db.runAsync('DELETE FROM visits WHERE id = ?', [visitId]);

  // Zustand Storeを更新
  useVisitStore.getState().deleteVisit(visitId);
  usePostStore.getState().deletePostsByVisitId(visitId);
}
```

**使用ケース**: ユーザーが街詳細画面からその訪問の記録をまとめて削除したい場合

---

### 11.3 カスケード削除の動作フロー

```
訪問記録削除
    │
    ├─ 自動生成投稿削除 (ON DELETE CASCADE)
    │   └─ 画像削除 (ON DELETE CASCADE)
    │
    ├─ 手動投稿1削除 (ON DELETE CASCADE)
    │   └─ 画像削除 (ON DELETE CASCADE)
    │
    ├─ 手動投稿2削除 (ON DELETE CASCADE)
    │   └─ 画像削除 (ON DELETE CASCADE)
    │
    └─ ...
```

### 11.4 削除時の注意事項

#### 11.4.1 確認ダイアログ

削除操作は取り消せないため、必ず確認ダイアログを表示する:

- **手動投稿削除**: 「この投稿を削除しますか？」
- **自動生成投稿削除**: 「訪問記録と関連する全ての投稿を削除しますか？」
- **訪問記録削除**: 「訪問記録と関連する全ての投稿（写真含む）を削除しますか？」

#### 11.4.2 有料版での同期

有料版ユーザーの場合、ローカル削除後にSupabaseにも同期:

```typescript
// 削除をSupabaseに同期
if (isSubscribed && isOnline()) {
  await supabase.from('visits').delete().eq('id', visitId);
} else if (isSubscribed) {
  // オフラインの場合は同期キューに追加
  addToSyncQueue({ type: 'delete_visit', id: visitId });
}
```

#### 11.4.3 画像ファイルの削除

投稿削除時、データベースレコードは削除されるが、ローカル画像ファイルは残る場合がある。
定期的なクリーンアップ処理を実装:

```typescript
// 孤立した画像ファイルをクリーンアップ
async function cleanupOrphanedImages() {
  const allImages = await db.getAllAsync('SELECT * FROM images');
  const imageDir = `${FileSystem.documentDirectory}images/`;

  for (const image of allImages) {
    const exists = await FileSystem.getInfoAsync(image.local_path);
    if (!exists.exists) {
      // DBレコードを削除
      await db.runAsync('DELETE FROM images WHERE id = ?', [image.id]);
    }
  }
}
```

### 11.5 削除ルールまとめ表

| 削除対象 | 訪問記録 | 自動生成投稿 | 手動投稿 | 画像 |
|---------|---------|------------|---------|------|
| **手動投稿** | 残る | 残る | **削除** | **削除** |
| **自動生成投稿** | **削除** | **削除** | **削除** | **削除** |
| **訪問記録** | **削除** | **削除** | **削除** | **削除** |

### 11.6 実装チェックリスト

- [ ] `posts`テーブルの`visit_id`外部キー制約を`ON DELETE CASCADE`に設定
- [ ] `images`テーブルの`post_id`外部キー制約を`ON DELETE CASCADE`に設定
- [ ] 自動生成投稿削除時に訪問記録も削除するロジックを実装
- [ ] 削除前に確認ダイアログを表示
- [ ] 有料版での削除同期処理を実装
- [ ] 孤立画像ファイルのクリーンアップ処理を実装

# 街ログ - システム設計書

## 目次
- [1. システムアーキテクチャ概要](#1-システムアーキテクチャ概要)
- [2. Feature-Sliced Design (FSD) 構造](#2-feature-sliced-design-fsd-構造)
- [3. 状態管理設計](#3-状態管理設計)
- [4. データベース設計](#4-データベース設計)
- [5. API設計](#5-api設計)
- [6. オフライン対応設計](#6-オフライン対応設計)
- [7. 画像管理設計](#7-画像管理設計)
- [8. 街データ管理](#8-街データ管理)
- [9. セキュリティ設計](#9-セキュリティ設計)
- [10. パフォーマンス最適化](#10-パフォーマンス最適化)
- [11. エラーハンドリング](#11-エラーハンドリング)
- [12. テスト戦略](#12-テスト戦略)
- [13. デプロイ・CI/CD](#13-デプロイcicd)
- [14. モニタリング・分析](#14-モニタリング分析)
- [15. 補足事項](#15-補足事項)

---

## 1. システムアーキテクチャ概要

### 1.1 アーキテクチャ図

```
┌─────────────────────────────────────────────────────────────┐
│                     React Native App (Expo)                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │    App     │  │  Widgets   │  │   Shared   │            │
│  │ (Screens)  │  │   (UI)     │  │   (Utils)  │  FSD       │
│  └────────────┘  └────────────┘  └────────────┘  Layers    │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Features  │  │  Entities  │  │   Shared   │            │
│  │ (Business) │  │  (Models)  │  │    (API)   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                     State Management                          │
│  ┌──────────────────────────┐  ┌─────────────────────────┐ │
│  │    Zustand Stores        │  │   React Query Cache     │ │
│  │  - User State            │  │  - Server Data          │ │
│  │  - Visit State           │  │  - Sync Queue           │ │
│  │  - Post State            │  │                         │ │
│  └──────────────────────────┘  └─────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                        Data Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    SQLite    │  │   Supabase   │  │   Static     │      │
│  │   (Local)    │  │   (Cloud)    │  │   Data       │      │
│  │  - Visits    │  │  - Users     │  │  - Stations  │      │
│  │  - Posts     │  │  - Synced    │  │  - Routes    │      │
│  │  - Queue     │  │    Data      │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Feature-Sliced Design (FSD) 構造

### 2.1 ディレクトリ構造の概要

**Expo Router + FSDの統合**

Expo Routerは`app/`ディレクトリをルーティングに使用します（Next.jsと同様）。
FSDの実装コードは`src/`ディレクトリに配置し、`app/`からは薄いエントリーポイントとして呼び出します。

```
プロジェクトルート/
├── app/                          # Expo Router（ルーティング定義のみ）
│   ├── (tabs)/                   # タブナビゲーショングループ
│   │   ├── map.tsx              # マップ画面エントリーポイント
│   │   ├── thread.tsx           # スレッド画面エントリーポイント
│   │   ├── create.tsx           # 投稿作成画面エントリーポイント
│   │   ├── calendar.tsx         # カレンダー画面エントリーポイント
│   │   └── profile.tsx          # マイページ画面エントリーポイント
│   ├── _layout.tsx              # ルートレイアウト
│   └── +not-found.tsx           # 404ページ
│
└── src/                          # FSD実装（全てのビジネスロジックとUI）
    ├── app/                      # アプリケーション層（初期化・プロバイダ）
    │   └── providers/
    │       ├── query-provider.tsx
    │       ├── auth-provider.tsx
    │       └── theme-provider.tsx
    │
    ├── pages/                    # ページ層（画面の統合）
    │   ├── map/
    │   │   └── ui/
    │   │       └── MapPage.tsx
    │   ├── thread/
    │   │   └── ui/
    │   │       └── ThreadPage.tsx
    │   ├── create-post/
    │   │   └── ui/
    │   │       └── CreatePostPage.tsx
    │   ├── calendar/
    │   │   └── ui/
    │   │       └── CalendarPage.tsx
    │   └── profile/
    │       └── ui/
    │           └── ProfilePage.tsx
    │
    ├── widgets/                  # ウィジェット層（複合UIブロック）
    │   ├── station-map/
    │   │   └── ui/
    │   │       ├── StationMap.tsx
    │   │       └── StationMarkers.tsx
    │   ├── post-timeline/
    │   │   ├── model/
    │   │   │   └── use-timeline.ts
    │   │   └── ui/
    │   │       ├── PostTimeline.tsx
    │   │       └── TimelineItem.tsx
    │   └── month-calendar/
    │       └── ui/
    │           └── MonthCalendar.tsx
    │
    ├── features/                 # フィーチャー層（ユーザーインタラクション）
    │   ├── visit-machi/       # 街訪問機能
    │   │   ├── model/
    │   │   │   └── use-visit-station.ts
    │   │   ├── ui/
    │   │   │   └── VisitStationButton.tsx
    │   │   └── api/
    │   │       └── create-visit.ts
    │   │
    │   ├── create-post/         # 投稿作成機能
    │   │   ├── model/
    │   │   │   ├── use-post-form.ts
    │   │   │   └── use-draft.ts
    │   │   ├── ui/
    │   │   │   ├── PostForm.tsx
    │   │   │   └── ImagePicker.tsx
    │   │   └── api/
    │   │       └── create-post.ts
    │   │
    │   ├── delete-post/         # 投稿削除機能
    │   │   ├── model/
    │   │   │   └── use-delete-post.ts
    │   │   ├── ui/
    │   │   │   └── DeletePostButton.tsx
    │   │   └── api/
    │   │       └── delete-post.ts
    │   │
    │   ├── add-schedule/        # 予定追加機能
    │   │   ├── model/
    │   │   ├── ui/
    │   │   └── api/
    │   │
    │   └── sync-friends/        # 友達同期機能（有料版）
    │       ├── model/
    │       ├── ui/
    │       └── api/
    │
    ├── entities/                 # エンティティ層（ビジネスドメイン）
    │   ├── visit/               # 訪問記録エンティティ
    │   │   ├── api/
    │   │   │   ├── visit.query.ts     # React Query クエリファクトリー
    │   │   │   ├── get-visits.ts
    │   │   │   ├── get-visit-by-id.ts
    │   │   │   └── update-visit.ts
    │   │   ├── model/
    │   │   │   ├── types.ts
    │   │   │   └── use-visit-store.ts
    │   │   └── ui/
    │   │       ├── VisitCard.tsx
    │   │       └── VisitBadge.tsx
    │   │
    │   ├── post/                # 投稿エンティティ
    │   │   ├── api/
    │   │   │   ├── post.query.ts      # React Query クエリファクトリー
    │   │   │   ├── get-posts.ts
    │   │   │   └── get-timeline.ts
    │   │   ├── model/
    │   │   │   ├── types.ts
    │   │   │   └── use-post-store.ts
    │   │   └── ui/
    │   │       ├── PostCard.tsx
    │   │       └── PostImage.tsx
    │   │
    │   ├── machi/             # 街エンティティ
    │   │   ├── model/
    │   │   │   ├── types.ts
    │   │   │   └── use-station-store.ts
    │   │   ├── ui/
    │   │   │   ├── StationMarker.tsx
    │   │   │   └── StationCard.tsx
    │   │   └── lib/
    │   │       └── station-utils.ts
    │   │
    │   ├── user/                # ユーザーエンティティ
    │   │   ├── api/
    │   │   │   ├── user.query.ts
    │   │   │   └── get-profile.ts
    │   │   ├── model/
    │   │   │   ├── types.ts
    │   │   │   └── use-user-store.ts
    │   │   └── ui/
    │   │       ├── UserAvatar.tsx
    │   │       └── UserCard.tsx
    │   │
    │   └── schedule/            # 予定エンティティ
    │       ├── api/
    │       │   └── schedule.query.ts
    │       ├── model/
    │       │   └── types.ts
    │       └── ui/
    │           └── ScheduleCard.tsx
    │
    └── shared/                   # 共有層（基盤）
        ├── api/                  # API クライアント
        │   ├── query-client.ts   # React Query 設定
        │   ├── supabase/
        │   │   ├── client.ts
        │   │   ├── auth.ts
        │   │   └── storage.ts
        │   └── sqlite/
        │       ├── client.ts
        │       └── migrations/
        │
        ├── ui/                   # 共通UIコンポーネント
        │   ├── Button/
        │   ├── Input/
        │   ├── Modal/
        │   ├── Card/
        │   └── Loading/
        │
        ├── lib/                  # ユーティリティ
        │   ├── date.ts
        │   ├── storage.ts
        │   └── validation.ts
        │
        ├── config/               # 設定
        │   ├── constants.ts
        │   └── env.ts
        │
        ├── types/                # 型定義（自動生成 + 手動）
        │   ├── database.ts       # Supabase自動生成型
        │   ├── sqlite.ts         # SQLite型定義
        │   └── common.ts         # 共通型
        │
        └── assets/               # 静的ファイル
            ├── stations.json     # 街データ
            └── images/
```

### 2.2 FSD各層の役割と命名規則

#### 2.2.1 App層（アプリケーション層）
**役割**: アプリケーション全体の初期化とプロバイダ設定
**配置場所**: `src/app/`
**命名**: 技術的な目的を示す（providers/, config/など）

```typescript
// src/app/providers/query-provider.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/query-client';

export function QueryProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

#### 2.2.2 Pages層（ページ層）
**役割**: 画面全体の統合・ウィジェットとフィーチャーの組み合わせ
**配置場所**: `src/pages/`
**命名**: 画面の目的を示す（map/, thread/, profile/など）

```typescript
// src/pages/map/ui/MapPage.tsx
import { StationMap } from '@/widgets/station-map';
import { VisitStationButton } from '@/features/visit-station';

export function MapPage() {
  return (
    <View>
      <StationMap />
      <VisitStationButton />
    </View>
  );
}
```

#### 2.2.3 Widgets層（ウィジェット層）
**役割**: 複数のエンティティを組み合わせた複合UIブロック
**配置場所**: `src/widgets/`
**命名**: UIブロックの目的を示す（station-map/, post-timeline/など）

#### 2.2.4 Features層（フィーチャー層）
**役割**: ユーザーインタラクション（動詞形で命名）
**配置場所**: `src/features/`
**命名**: ユーザーアクションを示す（visit-machi/, create-post/, delete-post/など）

**重要**: featuresは「何をするか」を示す。entitiesは「何であるか」を示す。

#### 2.2.5 Entities層（エンティティ層）
**役割**: ビジネスドメインの概念（名詞形で命名）
**配置場所**: `src/entities/`
**命名**: ビジネス概念を示す（visit/, post/, station/, user/など）

**React Query統合**: `api/`セグメントにクエリファクトリーを配置

```typescript
// src/entities/visit/api/visit.query.ts
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const visitQueries = createQueryKeys('visits', {
  all: null,
  byStation: (stationId: string) => ({
    queryKey: [stationId],
    queryFn: () => getVisitsByStation(stationId),
  }),
  byDate: (date: string) => ({
    queryKey: [date],
    queryFn: () => getVisitsByDate(date),
  }),
});
```

#### 2.2.6 Shared層（共有層）
**役割**: 再利用可能な基盤コード
**配置場所**: `src/shared/`
**命名**: 技術的な分類（ui/, api/, lib/, config/など）

### 2.3 型管理戦略

#### 2.3.1 Supabase型の自動生成

```bash
# Supabase型を自動生成
npx supabase gen types typescript --project-id <project-id> > src/shared/types/database.ts
```

```typescript
// src/shared/types/database.ts（自動生成）
export type Database = {
  public: {
    Tables: {
      visits: {
        Row: {
          id: string;
          user_id: string;
          station_id: string;
          visited_at: string;
          // ...
        };
        Insert: {
          id?: string;
          user_id: string;
          station_id: string;
          visited_at: string;
          // ...
        };
        Update: {
          id?: string;
          user_id?: string;
          // ...
        };
      };
      // ...
    };
  };
};
```

#### 2.3.2 SQLite型定義

```typescript
// src/shared/types/sqlite.ts（手動定義）
export interface VisitRow {
  id: string;
  user_id: string;
  station_id: string;
  visit_count: number;
  visited_at: string;
  memo: string | null;
  created_at: string;
  synced_at: string | null;
  is_synced: 0 | 1;
}

export interface PostRow {
  id: string;
  user_id: string;
  visit_id: string | null;
  is_auto_generated: 0 | 1;
  content: string;
  created_at: string;
  updated_at: string;
  synced_at: string | null;
  is_synced: 0 | 1;
}
```

#### 2.3.3 型のバージョン管理

**重要**: 自動生成された型ファイルもGitで管理する

**理由**:
1. チーム開発で型の一貫性を保つ
2. デプロイ時にSupabaseにアクセスできなくてもビルド可能
3. 型の変更履歴を追跡できる

**ワークフロー**:
1. Supabaseのスキーマ変更
2. 型を再生成: `npm run generate:types`
3. 生成された型をコミット
4. プルリクエストでレビュー

```json
// package.json
{
  "scripts": {
    "generate:types": "npx supabase gen types typescript --project-id <project-id> > src/shared/types/database.ts"
  }
}
```

---

## 3. 状態管理設計

### 3.1 ストレージ戦略

**データ機密度による分類:**

| 機密度 | ストレージ | 用途 | 特徴 |
|-------|----------|------|------|
| **高** | SecureStore | 認証トークン、セッション | 暗号化、低速 |
| **中** | SQLite | 訪問記録、投稿、画像パス | 構造化データ、中速 |
| **低** | Zustand Persist (AsyncStorage) | UI状態、設定、キャッシュ | 非構造化、高速 |

**パフォーマンス最適化ポイント:**
- SecureStore: 最小限のデータ（トークンのみ）で暗号化オーバーヘッド削減
- Zustand Persist: 頻繁にアクセスするUI状態で高速読み書き
- SQLite: 大量の構造化データに最適

---

### 3.2 Zustand Store 設計

#### 3.2.1 訪問記録 Store (visitStore)

**永続化なし（メモリのみ）**

```typescript
interface VisitState {
  // State
  visits: Visit[];
  selectedStationId: string | null;

  // Actions
  addVisit: (visit: Visit) => void;
  updateVisit: (id: string, data: Partial<Visit>) => void;
  deleteVisit: (id: string) => void;
  getVisitsByStation: (stationId: string) => Visit[];
  getVisitsByDate: (date: Date) => Visit[];
  selectStation: (stationId: string | null) => void;
}

// 実装
const useVisitStore = create<VisitState>((set, get) => ({
  visits: [],
  selectedStationId: null,
  // ... actions
}));
```

**メモリのみの理由:** SQLiteから読み込んだデータをキャッシュするため、永続化不要

---

#### 3.2.2 投稿 Store (postStore)

**永続化あり（下書きのみ）**

```typescript
interface PostState {
  // State
  posts: Post[];
  draftPosts: Post[]; // <- 永続化対象
  filter: PostFilter;

  // Actions
  addPost: (post: Post) => void;
  updatePost: (id: string, data: Partial<Post>) => void;
  deletePost: (id: string) => void;
  saveDraft: (post: Post) => void;
  deleteDraft: (id: string) => void;
  setFilter: (filter: PostFilter) => void;
  getPostsByDate: (date: Date) => Post[];
}

// 実装（Persist使用）
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const usePostStore = create<PostState>()(
  persist(
    (set, get) => ({
      posts: [],
      draftPosts: [],
      filter: {},
      // ... actions
    }),
    {
      name: 'post-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ draftPosts: state.draftPosts }), // 下書きのみ永続化
    }
  )
);
```

**下書きを永続化する理由:** アプリ終了時に下書きが消えるのを防ぐ

---

#### 3.2.3 ユーザー Store (userStore)

**永続化あり（基本情報のみ）**

```typescript
interface UserState {
  // State
  user: User | null; // <- 永続化対象（基本情報のみ）
  isSubscribed: boolean; // <- 永続化対象
  friends: User[];

  // Actions
  setUser: (user: User | null) => void;
  updateProfile: (data: Partial<User>) => void;
  setSubscriptionStatus: (status: boolean) => void;
  addFriend: (friend: User) => void;
  removeFriend: (friendId: string) => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isSubscribed: false,
      friends: [],
      // ... actions
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isSubscribed: state.isSubscribed,
      }),
    }
  )
);
```

**永続化する理由:** アプリ起動時にユーザー情報をすぐ表示できる（UX向上）

---

#### 3.2.4 UI状態 Store (uiStore)

**永続化あり（全て）**

```typescript
interface UIState {
  // State
  selectedTab: string; // <- 永続化対象
  mapFilter: 'self' | 'friends' | 'all'; // <- 永続化対象
  calendarSelectedUserId: string | null; // <- 永続化対象
  theme: 'light' | 'dark'; // <- 永続化対象

  // Actions
  setSelectedTab: (tab: string) => void;
  setMapFilter: (filter: 'self' | 'friends' | 'all') => void;
  setCalendarSelectedUserId: (userId: string | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      selectedTab: 'map',
      mapFilter: 'self',
      calendarSelectedUserId: null,
      theme: 'light',

      setSelectedTab: (tab) => set({ selectedTab: tab }),
      setMapFilter: (filter) => set({ mapFilter: filter }),
      setCalendarSelectedUserId: (userId) => set({ calendarSelectedUserId: userId }),
      setTheme: (theme) => set({ theme: theme }),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

**全て永続化する理由:**
- アプリ再起動時に前回の状態を復元（UX向上）
- 頻繁に変更されるがデータ量は少ない
- AsyncStorageは高速なので影響小

---

#### 3.2.5 アプリ設定 Store (appSettingsStore)

**永続化あり（全て）**

```typescript
interface AppSettingsState {
  // State
  onboardingCompleted: boolean; // <- 永続化対象
  notificationsEnabled: boolean; // <- 永続化対象
  language: 'ja' | 'en'; // <- 永続化対象
  lastSyncAt: string | null; // <- 永続化対象

  // Actions
  setOnboardingCompleted: (completed: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setLanguage: (language: 'ja' | 'en') => void;
  setLastSyncAt: (timestamp: string) => void;
}

const useAppSettingsStore = create<AppSettingsState>()(
  persist(
    (set) => ({
      onboardingCompleted: false,
      notificationsEnabled: true,
      language: 'ja',
      lastSyncAt: null,

      setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setLanguage: (language) => set({ language: language }),
      setLastSyncAt: (timestamp) => set({ lastSyncAt: timestamp }),
    }),
    {
      name: 'app-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

**全て永続化する理由:** アプリ設定は常に永続化が必要

---

#### 3.2.6 同期キュー Store (syncQueueStore)

**永続化なし（メモリのみ）**

```typescript
interface SyncQueueState {
  // State
  queue: SyncItem[];
  isSyncing: boolean;

  // Actions
  addToQueue: (item: SyncItem) => void;
  removeFromQueue: (id: string) => void;
  processSyncQueue: () => Promise<void>;
  clearQueue: () => void;
}

const useSyncQueueStore = create<SyncQueueState>((set, get) => ({
  queue: [],
  isSyncing: false,
  // ... actions
}));
```

**永続化しない理由:** 同期キューはSQLiteの`sync_queue`テーブルで永続化するため不要

---

### 3.3 ストレージ戦略まとめ

**パフォーマンス比較:**

| ストレージ | 読み込み速度 | 書き込み速度 | セキュリティ | 用途 |
|-----------|------------|------------|------------|------|
| SecureStore | 🐢 遅い | 🐢 遅い | 🔒 高 | トークン |
| SQLite | 🐇 中速 | 🐇 中速 | 🔓 中 | 構造化データ |
| AsyncStorage | 🚀 高速 | 🚀 高速 | 🔓 低 | UI状態・設定 |

**実装時の注意点:**

1. **SecureStore**
   ```typescript
   // ❌ 悪い例：大量データを保存
   await SecureStore.setItemAsync('user_data', JSON.stringify(largeData));

   // ✅ 良い例：最小限のデータのみ
   await SecureStore.setItemAsync('session', JSON.stringify({
     access_token,
     refresh_token,
   }));
   ```

2. **Zustand Persist**
   ```typescript
   // ❌ 悪い例：全てのデータを永続化
   persist((set) => ({ ...allState }), { name: 'store' })

   // ✅ 良い例：必要な部分のみ永続化
   persist(
     (set) => ({ ...allState }),
     {
       name: 'store',
       partialize: (state) => ({ theme: state.theme }), // 必要な部分のみ
     }
   )
   ```

3. **SQLite**
   ```typescript
   // ✅ 大量の構造化データに最適
   await db.runAsync(
     'INSERT INTO visits (user_id, station_id, visited_at) VALUES (?, ?, ?)',
     [userId, stationId, timestamp]
   );
   ```

---

### 3.4 React Query 設計

#### 3.4.1 クエリキー規約

```typescript
const queryKeys = {
  visits: {
    all: ['visits'] as const,
    byStation: (stationId: string) => ['visits', 'station', stationId] as const,
    byDate: (date: string) => ['visits', 'date', date] as const,
  },
  posts: {
    all: ['posts'] as const,
    byId: (id: string) => ['posts', id] as const,
    timeline: (userId?: string) => ['posts', 'timeline', userId] as const,
  },
  stations: {
    all: ['stations'] as const,
    byId: (id: string) => ['stations', id] as const,
  },
  friends: {
    all: ['friends'] as const,
    requests: ['friends', 'requests'] as const,
  },
};
```

#### 3.2.2 カスタムフック例

```typescript
// 訪問記録取得
function useVisits() {
  return useQuery({
    queryKey: queryKeys.visits.all,
    queryFn: fetchVisitsFromSQLite,
    networkMode: 'offlineFirst',
  });
}

// 投稿一覧取得（タイムライン）
function useTimeline(userId?: string) {
  const { isSubscribed } = useUserStore();

  return useQuery({
    queryKey: queryKeys.posts.timeline(userId),
    queryFn: () => isSubscribed
      ? fetchTimelineFromSupabase(userId)
      : fetchTimelineFromSQLite(),
    networkMode: isSubscribed ? 'online' : 'offlineFirst',
  });
}

// 投稿作成
function useCreatePost() {
  const { addPost } = usePostStore();
  const { addToQueue } = useSyncQueueStore();
  const { isSubscribed } = useUserStore();

  return useMutation({
    mutationFn: async (post: Post) => {
      // ローカルに保存
      await savePostToSQLite(post);

      // 有料版の場合、Supabaseにも保存（オンライン時）
      if (isSubscribed && isOnline()) {
        await savePostToSupabase(post);
      } else if (isSubscribed) {
        // オフライン時は同期キューに追加
        addToQueue({ type: 'post', data: post });
      }
    },
    onSuccess: (data) => {
      addPost(data);
      queryClient.invalidateQueries(queryKeys.posts.all);
    },
  });
}
```

---

## 4. データベース設計（詳細は03_database-design.mdを参照）

### 4.1 SQLite（ローカル）

- **目的**: オフラインファースト、高速アクセス
- **テーブル**:
  - `visits` - 訪問記録
  - `posts` - 投稿
  - `schedules` - 予定
  - `sync_queue` - 同期キュー
  - `cached_friends` - 友達キャッシュ（有料版）

### 4.2 Supabase（クラウド）

- **目的**: データバックアップ、友達同期、クロスデバイス同期
- **テーブル**:
  - `users` - ユーザー情報
  - `visits` - 訪問記録（同期済み）
  - `posts` - 投稿（同期済み）
  - `schedules` - 予定（同期済み）
  - `friendships` - 友達関係
  - `likes` - いいね
  - `comments` - コメント

---

## 5. API設計（詳細は05_api-design.mdを参照）

### 5.1 Supabase API エンドポイント

#### 5.1.1 認証
- `POST /auth/signup` - ユーザー登録
- `POST /auth/login` - ログイン
- `POST /auth/logout` - ログアウト
- `GET /auth/user` - ユーザー情報取得

#### 5.1.2 訪問記録
- `GET /visits` - 訪問記録一覧
- `POST /visits` - 訪問記録作成
- `PUT /visits/:id` - 訪問記録更新
- `DELETE /visits/:id` - 訪問記録削除

#### 5.1.3 投稿
- `GET /posts` - 投稿一覧
- `GET /posts/:id` - 投稿詳細
- `POST /posts` - 投稿作成
- `PUT /posts/:id` - 投稿更新
- `DELETE /posts/:id` - 投稿削除

#### 5.1.4 友達（有料版）
- `GET /friends` - 友達一覧
- `POST /friends/request` - 友達リクエスト送信
- `POST /friends/accept/:id` - 友達リクエスト承認
- `DELETE /friends/:id` - 友達削除

---

## 6. オフライン対応設計

### 6.1 データ同期フロー

```
┌──────────────────────────────────────────────────────────┐
│                     User Action                           │
│              (例: 投稿作成、訪問記録登録)                    │
└───────────────────┬──────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   SQLiteに保存        │  ← 常に実行
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Zustand Storeを更新  │  ← UIに即座に反映
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  有料版 & オンライン?  │
        └───────────┬───────────┘
                    │
          ┌─────────┴─────────┐
          │                   │
        YES                  NO
          │                   │
          ▼                   ▼
 ┌──────────────────┐  ┌──────────────────┐
 │ Supabaseに送信   │  │ 同期キューに追加  │
 └──────────────────┘  └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ オンライン復帰時 │
                    │ 自動同期実行     │
                    └──────────────────┘
```

### 6.2 同期キューの処理

```typescript
// 同期キュー処理ロジック
async function processSyncQueue() {
  const { queue, removeFromQueue } = useSyncQueueStore.getState();
  const isOnline = await checkNetworkStatus();

  if (!isOnline) return;

  for (const item of queue) {
    try {
      switch (item.type) {
        case 'post':
          await savePostToSupabase(item.data);
          break;
        case 'visit':
          await saveVisitToSupabase(item.data);
          break;
        case 'schedule':
          await saveScheduleToSupabase(item.data);
          break;
      }
      removeFromQueue(item.id);
    } catch (error) {
      console.error('Sync failed:', error);
      // リトライロジック
    }
  }
}

// ネットワーク復帰時に自動実行
NetInfo.addEventListener(state => {
  if (state.isConnected) {
    processSyncQueue();
  }
});
```

---

## 7. 画像管理設計

### 7.1 無料版の画像管理

```typescript
// ローカルファイルシステムに保存
async function saveImageLocally(uri: string, postId: string): Promise<string> {
  const fileUri = `${FileSystem.documentDirectory}images/${postId}_${Date.now()}.jpg`;
  await FileSystem.copyAsync({ from: uri, to: fileUri });
  return fileUri;
}

// SQLiteにパスを保存
await db.runAsync(
  'INSERT INTO images (post_id, local_path) VALUES (?, ?)',
  [postId, fileUri]
);
```

### 7.2 有料版の画像管理

```typescript
// Supabase Storageにアップロード
async function uploadImageToSupabase(
  localUri: string,
  postId: string
): Promise<string> {
  const fileName = `${postId}_${Date.now()}.jpg`;
  const { data, error } = await supabase.storage
    .from('post-images')
    .upload(fileName, {
      uri: localUri,
      type: 'image/jpeg',
    });

  if (error) throw error;

  // 公開URLを取得
  const { data: publicUrl } = supabase.storage
    .from('post-images')
    .getPublicUrl(fileName);

  return publicUrl.publicUrl;
}
```

### 7.3 無料版→有料版移行時の画像移行

```typescript
async function migrateImagesToSupabase(onProgress: (progress: number) => void) {
  // ローカル画像一覧を取得
  const images = await db.getAllAsync('SELECT * FROM images WHERE supabase_url IS NULL');
  const total = images.length;

  for (let i = 0; i < images.length; i++) {
    const image = images[i];

    try {
      // Supabaseにアップロード
      const supabaseUrl = await uploadImageToSupabase(image.local_path, image.post_id);

      // DBを更新
      await db.runAsync(
        'UPDATE images SET supabase_url = ? WHERE id = ?',
        [supabaseUrl, image.id]
      );

      // 進捗を報告
      onProgress((i + 1) / total * 100);
    } catch (error) {
      console.error('Image migration failed:', image.id, error);
    }
  }

  // 移行完了後、ユーザー確認を得てからローカル画像を削除
  await confirmAndDeleteLocalImages();
}
```

---

## 8. 街データ管理

### 8.1 街データの構造

```typescript
interface Station {
  id: string;                    // 一意のID
  name: string;                  // 街名
  nameKana: string;              // 街名（かな）
  latitude: number;              // 緯度
  longitude: number;             // 経度
  lines: string[];               // 路線名の配列
  operator: string;              // 運営会社（JR東日本、東京メトロなど）
  prefecture: string;            // 都道府県
  city: string;                  // 市区町村
}
```

### 8.2 街データの保存形式

```json
// assets/stations.json
{
  "version": "1.0.0",
  "lastUpdated": "2025-01-01",
  "stations": [
    {
      "id": "st_tokyo_001",
      "name": "東京",
      "nameKana": "とうきょう",
      "latitude": 35.681236,
      "longitude": 139.767125,
      "lines": ["JR山手線", "JR中央線", "JR東海道本線"],
      "operator": "JR東日本",
      "prefecture": "東京都",
      "city": "千代田区"
    },
    ...
  ]
}
```

### 8.3 街データの読み込み

```typescript
import stationsData from '@/assets/stations.json';

// Zustand storeで管理
interface StationState {
  stations: Station[];
  loadStations: () => void;
  getStationById: (id: string) => Station | undefined;
  searchStations: (query: string) => Station[];
}

const useStationStore = create<StationState>((set, get) => ({
  stations: [],

  loadStations: () => {
    set({ stations: stationsData.stations });
  },

  getStationById: (id: string) => {
    return get().stations.find(s => s.id === id);
  },

  searchStations: (query: string) => {
    const lowerQuery = query.toLowerCase();
    return get().stations.filter(s =>
      s.name.includes(query) ||
      s.nameKana.includes(lowerQuery)
    );
  },
}));
```

---

## 9. セキュリティ設計

### 9.1 認証フロー

```typescript
// Supabase認証の初期化
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

// ログイン
async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data.user;
}

// セッション管理
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    useUserStore.getState().setUser(session?.user);
  } else if (event === 'SIGNED_OUT') {
    useUserStore.getState().setUser(null);
  }
});
```

### 9.2 認証セッション永続化

**expo-secure-storeを使用した永続化**

```typescript
import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'user_session';

// セッション永続化ミドルウェア
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session) {
    // セッションを暗号化してSecureStoreに保存
    await SecureStore.setItemAsync(
      SESSION_KEY,
      JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
      })
    );

    // Zustand Storeも更新
    useUserStore.getState().setUser(session.user);
  } else if (event === 'SIGNED_OUT') {
    // セッションを削除
    await SecureStore.deleteItemAsync(SESSION_KEY);
    useUserStore.getState().setUser(null);
  } else if (event === 'TOKEN_REFRESHED' && session) {
    // トークンリフレッシュ時も更新
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  }
});

// アプリ起動時にセッション復元
async function restoreSession() {
  try {
    const sessionStr = await SecureStore.getItemAsync(SESSION_KEY);

    if (sessionStr) {
      const session = JSON.parse(sessionStr);

      // セッションの有効期限チェック
      const now = Math.floor(Date.now() / 1000);
      if (session.expires_at && session.expires_at > now) {
        // セッションを復元
        const { data, error } = await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });

        if (!error && data.session) {
          useUserStore.getState().setUser(data.session.user);
          return true;
        }
      }
    }
  } catch (error) {
    console.error('Session restore failed:', error);
    // エラー時はセッションをクリア
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }

  return false;
}

// App.tsxで起動時に実行
export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // セッション復元を試みる
        await restoreSession();
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return <SplashScreen />;
  }

  return <RootNavigator />;
}
```

### 9.3 Row Level Security (RLS)

```sql
-- Supabase RLSポリシー例

-- 投稿は自分のものだけ更新・削除可能
CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);

-- 友達の投稿は閲覧可能
CREATE POLICY "Users can view friends' posts"
  ON posts FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM friendships
      WHERE (user_id = auth.uid() AND friend_id = posts.user_id)
         OR (friend_id = auth.uid() AND user_id = posts.user_id)
    )
  );
```

---

## 10. パフォーマンス最適化

### 10.1 地図レンダリング最適化

```typescript
// 表示範囲内の街のみレンダリング
function useVisibleStations(region: Region) {
  const { stations } = useStationStore();

  return useMemo(() => {
    return stations.filter(station =>
      isInRegion(station, region)
    );
  }, [stations, region]);
}

// クラスタリング（ズームレベルに応じて）
function useStationClusters(visibleStations: Station[], zoom: number) {
  return useMemo(() => {
    if (zoom < CLUSTER_ZOOM_THRESHOLD) {
      return clusterStations(visibleStations);
    }
    return visibleStations;
  }, [visibleStations, zoom]);
}
```

### 10.2 画像の遅延読み込み

```typescript
// React Nativeのreact-native-fast-imageを使用
import FastImage from 'react-native-fast-image';

<FastImage
  source={{
    uri: imageUrl,
    priority: FastImage.priority.normal,
  }}
  resizeMode={FastImage.resizeMode.cover}
  style={styles.image}
/>
```

### 10.3 リスト仮想化

```typescript
// FlashListを使用（react-native-flashlist）
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={posts}
  renderItem={({ item }) => <PostCard post={item} />}
  estimatedItemSize={200}
  keyExtractor={item => item.id}
/>
```

---

## 11. エラーハンドリング

### 11.1 グローバルエラーハンドリング

```typescript
// エラーバウンダリ
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // ログ送信（例: Sentry）
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorScreen />;
    }
    return this.props.children;
  }
}
```

### 11.2 ネットワークエラーハンドリング

```typescript
// React Queryのエラーハンドリング
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // ネットワークエラーは3回リトライ
        if (error.message.includes('network')) {
          return failureCount < 3;
        }
        return false;
      },
      onError: (error) => {
        // トースト通知
        showToast('データの取得に失敗しました');
      },
    },
  },
});
```

---

## 12. テスト戦略

### 12.1 ユニットテスト
- **ツール**: Jest
- **対象**: utils、hooks、store

### 12.2 統合テスト
- **ツール**: React Native Testing Library
- **対象**: features、widgets

### 12.3 E2Eテスト
- **ツール**: Detox
- **対象**: 主要なユーザーフロー

---

## 13. デプロイ・CI/CD

### 13.1 デプロイ戦略

**EAS Build（Expo Application Services）を使用**

EAS Buildは、Expoアプリのクラウドビルドサービスです。
GitHub ActionsとEAS Buildを組み合わせてCI/CDを構築します。

**GitHub ActionsとGitHub Workflowsの違い**:
- **GitHub Actions**: CI/CDプラットフォーム全体の名称
- **GitHub Workflows**: `.github/workflows/*.yml`ファイルで定義されるCI/CDの設定

つまり、「GitHub Actionsを使う」=「GitHub Workflowsファイルを作成する」と同じ意味です。

### 13.2 EAS Build設定

```json
// eas.json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "autoIncrement": true,
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "$SUPABASE_URL",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "$SUPABASE_ANON_KEY"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCD1234"
      },
      "android": {
        "serviceAccountKeyPath": "./service-account-key.json",
        "track": "internal"
      }
    }
  }
}
```

### 13.3 GitHub Actionsワークフロー

#### 13.3.1 テスト・ビルドワークフロー

```yaml
# .github/workflows/test-and-build.yml
name: Test and Build

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # ユニットテスト・型チェック
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run TypeScript check
        run: npm run typecheck

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

  # EAS Build（mainブランチのみ）
  build:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: npm ci

      - name: Build Android (Preview)
        run: eas build --platform android --profile preview --non-interactive

      - name: Build iOS (Preview)
        run: eas build --platform ios --profile preview --non-interactive
```

#### 13.3.2 本番デプロイワークフロー

```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    tags:
      - 'v*'  # v1.0.0などのタグがプッシュされたときに実行

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: npm ci

      - name: Build and Submit to App Store
        run: |
          eas build --platform ios --profile production --non-interactive
          eas submit --platform ios --profile production --non-interactive

      - name: Build and Submit to Google Play
        run: |
          eas build --platform android --profile production --non-interactive
          eas submit --platform android --profile production --non-interactive
```

### 13.4 環境変数の管理

**EASシークレットを使用**（推奨）

```bash
# Supabase認証情報を安全に保存
eas secret:create --scope project --name SUPABASE_URL --value <your-supabase-url>
eas secret:create --scope project --name SUPABASE_ANON_KEY --value <your-anon-key>
```

**GitHub Secretsも併用**

1. GitHubリポジトリの Settings > Secrets and variables > Actions
2. 以下のシークレットを追加:
   - `EXPO_TOKEN`: EASの認証トークン
   - `SUPABASE_URL`: Supabase URL
   - `SUPABASE_ANON_KEY`: Supabase匿名キー

### 13.5 リリースフロー

```
1. 開発
   ↓
2. プルリクエスト作成
   ↓
3. GitHub Actions: テスト実行
   ↓
4. レビュー・承認
   ↓
5. mainブランチにマージ
   ↓
6. GitHub Actions: プレビュービルド（自動）
   ↓
7. QA確認
   ↓
8. タグ作成（例: v1.0.0）
   ↓
9. GitHub Actions: 本番ビルド・ストア提出（自動）
   ↓
10. ストアレビュー
   ↓
11. リリース
```

---

## 14. モニタリング・分析

### 14.1 クラッシュレポート
- **ツール**: Sentry

### 14.2 アナリティクス
- **ツール**: Firebase Analytics または Mixpanel
- **トラッキングイベント**:
  - 訪問記録作成
  - 投稿作成
  - 予定作成
  - 有料版アップグレード

### 14.3 パフォーマンスモニタリング
- **ツール**: Firebase Performance Monitoring
- **計測項目**:
  - アプリ起動時間
  - 画面遷移時間
  - API応答時間

---

## 15. 補足事項

### 15.1 今後の技術的拡張

- **プッシュ通知**: Expo Notificationsを使用
- **位置情報自動判定**: expo-locationで将来的に自動訪問記録に対応
- **オフラインマップ**: react-native-mapsのキャッシュ機能活用
- **AR機能**: 街到達時のAR演出（将来的な拡張）

### 15.2 パフォーマンス目標

- アプリ起動時間: 3秒以内
- 地図初期表示: 2秒以内
- 投稿作成→表示: 1秒以内（ローカル）
- SQLiteクエリ: 100ms以内
- Supabase API: 500ms以内

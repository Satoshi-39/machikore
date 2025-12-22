# 街コレ - API設計書

## 目次
- [1. API概要](#1-api概要)
- [2. 認証API](#2-認証api)
- [3. ユーザーAPI](#3-ユーザーapi)
- [4. 訪問記録API](#4-訪問記録api)
- [5. 投稿API](#5-投稿api)
- [6. いいね・コメントAPI](#6-いいねコメントapi)
- [7. 友達API（有料版）](#7-友達api有料版)
- [8. ストレージAPI（画像アップロード）](#8-ストレージapi画像アップロード)
- [9. リアルタイムAPI（有料版）](#9-リアルタイムapi有料版)
- [10. エラーハンドリング](#10-エラーハンドリング)
- [11. レート制限](#11-レート制限)
- [12. セキュリティ](#12-セキュリティ)
- [13. パフォーマンス最適化](#13-パフォーマンス最適化)
- [14. モック・テスト](#14-モックテスト)
- [15. API バージョニング](#15-api-バージョニング)
- [16. 補足](#16-補足)

---

## 1. API概要

### 1.1 アーキテクチャ

```
┌──────────────────────────────────────────────────┐
│              React Native App                    │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌─────────────────┐    ┌─────────────────┐    │
│  │  React Query    │    │   Supabase      │    │
│  │  - Caching      │◄──►│   Client        │    │
│  │  - Mutations    │    │   - Auth        │    │
│  │  - Sync         │    │   - Database    │    │
│  └─────────────────┘    │   - Storage     │    │
│                          │   - Realtime    │    │
│                          └─────────────────┘    │
│                                  │               │
└──────────────────────────────────┼───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │   Supabase Backend       │
                    │   (PostgreSQL + APIs)    │
                    └──────────────────────────┘
```

### 1.2 API種類

1. **認証API** - Supabase Auth
2. **データAPI** - Supabase Database (PostgREST)
3. **ストレージAPI** - Supabase Storage
4. **リアルタイムAPI** - Supabase Realtime（有料版）

### 1.3 ベースURL

```
Supabase Project URL: https://<project-id>.supabase.co
API URL: https://<project-id>.supabase.co/rest/v1
Auth URL: https://<project-id>.supabase.co/auth/v1
Storage URL: https://<project-id>.supabase.co/storage/v1
```

### 1.4 認証方式

- **ヘッダー**:
  ```
  Authorization: Bearer <access_token>
  apikey: <supabase_anon_key>
  ```

---

## 2. 認証API

### 2.1 ユーザー登録

**エンドポイント**: `POST /auth/v1/signup`

**リクエスト**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**レスポンス** (成功 - 200):
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "abc123...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "created_at": "2025-01-06T12:00:00Z"
  }
}
```

**エラー** (400):
```json
{
  "error": "User already registered",
  "error_description": "Email already exists"
}
```

**実装例**:
```typescript
async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
}
```

---

### 2.2 ログイン

**エンドポイント**: `POST /auth/v1/token?grant_type=password`

**リクエスト**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**レスポンス** (成功 - 200):
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "abc123...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com"
  }
}
```

**実装例**:
```typescript
async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}
```

---

### 2.3 ログアウト

**エンドポイント**: `POST /auth/v1/logout`

**ヘッダー**:
```
Authorization: Bearer <access_token>
```

**レスポンス** (成功 - 204):
```
No Content
```

**実装例**:
```typescript
async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
```

---

### 2.4 トークンリフレッシュ

**エンドポイント**: `POST /auth/v1/token?grant_type=refresh_token`

**リクエスト**:
```json
{
  "refresh_token": "abc123..."
}
```

**レスポンス** (成功 - 200):
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "def456..."
}
```

**実装例**:
```typescript
// React Queryでの自動リフレッシュ設定
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed:', session);
  }
});
```

---

## 3. ユーザーAPI

### 3.1 ユーザープロフィール取得

**エンドポイント**: `GET /rest/v1/users?id=eq.<user_id>`

**ヘッダー**:
```
Authorization: Bearer <access_token>
apikey: <supabase_anon_key>
```

**レスポンス** (成功 - 200):
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "travel_lover",
    "display_name": "旅好きユーザー",
    "avatar_url": "https://example.com/avatar.jpg",
    "bio": "東京の街を制覇中！",
    "is_subscribed": false,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-06T12:00:00Z"
  }
]
```

**実装例**:
```typescript
async function getUser(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

// React Query フック
function useUser(userId: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => getUser(userId),
  });
}
```

---

### 3.2 プロフィール更新

**エンドポイント**: `PATCH /rest/v1/users?id=eq.<user_id>`

**リクエスト**:
```json
{
  "display_name": "新しい名前",
  "bio": "自己紹介を更新しました",
  "avatar_url": "https://example.com/new-avatar.jpg"
}
```

**レスポンス** (成功 - 200):
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "display_name": "新しい名前",
    "bio": "自己紹介を更新しました",
    "updated_at": "2025-01-06T12:30:00Z"
  }
]
```

**実装例**:
```typescript
async function updateProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// React Query Mutation
function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: Partial<User> }) =>
      updateProfile(userId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['users', data.id]);
    },
  });
}
```

---

## 4. 訪問記録API

### 4.1 訪問記録一覧取得

**エンドポイント**: `GET /rest/v1/visits?user_id=eq.<user_id>&order=visited_at.desc`

**レスポンス** (成功 - 200):
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "station_id": "st_tokyo_001",
    "visit_count": 1,
    "visited_at": "2025-01-06T12:00:00Z",
    "memo": "初めて訪問しました！",
    "created_at": "2025-01-06T12:00:00Z",
    "updated_at": "2025-01-06T12:00:00Z"
  },
  {
    "id": "223e4567-e89b-12d3-a456-426614174001",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "station_id": "st_tokyo_002",
    "visit_count": 2,
    "visited_at": "2025-01-05T18:00:00Z",
    "memo": "2回目の訪問",
    "created_at": "2025-01-05T18:00:00Z",
    "updated_at": "2025-01-05T18:00:00Z"
  }
]
```

**実装例**:
```typescript
async function getVisits(userId: string) {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .eq('user_id', userId)
    .order('visited_at', { ascending: false });

  if (error) throw error;
  return data;
}

// React Query フック
function useVisits(userId: string) {
  return useQuery({
    queryKey: ['visits', userId],
    queryFn: () => getVisits(userId),
  });
}
```

---

### 4.2 特定街の訪問履歴取得

**エンドポイント**: `GET /rest/v1/visits?user_id=eq.<user_id>&station_id=eq.<station_id>&order=visited_at.desc`

**レスポンス** (成功 - 200):
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "station_id": "st_tokyo_001",
    "visit_count": 3,
    "visited_at": "2025-01-06T12:00:00Z",
    "memo": "3回目の訪問",
    "created_at": "2025-01-06T12:00:00Z"
  },
  {
    "id": "223e4567-e89b-12d3-a456-426614174001",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "station_id": "st_tokyo_001",
    "visit_count": 2,
    "visited_at": "2025-01-03T15:00:00Z",
    "memo": "2回目の訪問",
    "created_at": "2025-01-03T15:00:00Z"
  }
]
```

**実装例**:
```typescript
async function getVisitsByStation(userId: string, stationId: string) {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .eq('user_id', userId)
    .eq('station_id', stationId)
    .order('visited_at', { ascending: false });

  if (error) throw error;
  return data;
}
```

---

### 4.3 訪問記録作成

**エンドポイント**: `POST /rest/v1/visits`

**リクエスト**:
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "station_id": "st_tokyo_001",
  "visit_count": 1,
  "visited_at": "2025-01-06T12:00:00Z",
  "memo": "初めて訪問しました！"
}
```

**レスポンス** (成功 - 201):
```json
[
  {
    "id": "323e4567-e89b-12d3-a456-426614174002",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "station_id": "st_tokyo_001",
    "visit_count": 1,
    "visited_at": "2025-01-06T12:00:00Z",
    "memo": "初めて訪問しました！",
    "created_at": "2025-01-06T12:00:00Z",
    "updated_at": "2025-01-06T12:00:00Z"
  }
]
```

**実装例**:
```typescript
async function createVisit(visit: Omit<Visit, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('visits')
    .insert(visit)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// React Query Mutation
function useCreateVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVisit,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['visits', data.user_id]);
    },
  });
}
```

---

### 4.4 訪問記録更新

**エンドポイント**: `PATCH /rest/v1/visits?id=eq.<visit_id>`

**リクエスト**:
```json
{
  "memo": "メモを更新しました"
}
```

**レスポンス** (成功 - 200):
```json
[
  {
    "id": "323e4567-e89b-12d3-a456-426614174002",
    "memo": "メモを更新しました",
    "updated_at": "2025-01-06T12:30:00Z"
  }
]
```

---

### 4.5 訪問記録削除

**エンドポイント**: `DELETE /rest/v1/visits?id=eq.<visit_id>`

**レスポンス** (成功 - 204):
```
No Content
```

**実装例**:
```typescript
async function deleteVisit(visitId: string) {
  const { error } = await supabase
    .from('visits')
    .delete()
    .eq('id', visitId);

  if (error) throw error;
}
```

---

## 5. 投稿API

### 5.1 タイムライン取得

**エンドポイント**: `GET /rest/v1/posts?order=created_at.desc&limit=50`

**クエリパラメータ**:
- `limit`: 取得件数（デフォルト: 50）
- `offset`: オフセット（ページネーション）

**レスポンス** (成功 - 200):
```json
[
  {
    "id": "423e4567-e89b-12d3-a456-426614174003",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "content": "渋谷街に訪問しました（1回目）",
    "station_id": "st_tokyo_001",
    "visit_id": "323e4567-e89b-12d3-a456-426614174002",
    "is_auto_generated": true,
    "likes_count": 12,
    "comments_count": 5,
    "created_at": "2025-01-06T12:00:00Z",
    "updated_at": "2025-01-06T12:00:00Z"
  }
]
```

**JOINでユーザー情報も取得**:
```typescript
async function getTimeline(userId: string, limit = 50, offset = 0) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      users!inner(id, username, display_name, avatar_url)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data;
}

// React Query 無限スクロール
function useInfiniteTimeline(userId: string) {
  return useInfiniteQuery({
    queryKey: ['posts', 'timeline', userId],
    queryFn: ({ pageParam = 0 }) => getTimeline(userId, 50, pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 50) return undefined;
      return pages.length * 50;
    },
  });
}
```

---

### 5.2 友達のタイムライン取得（有料版）

**エンドポイント**: カスタムクエリ

**実装例**:
```typescript
async function getFriendsTimeline(userId: string) {
  // 友達IDを取得
  const { data: friendships } = await supabase
    .from('friendships')
    .select('friend_id')
    .eq('user_id', userId)
    .eq('status', 'accepted');

  const friendIds = friendships?.map(f => f.friend_id) || [];

  // 自分 + 友達の投稿を取得
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      users!inner(id, username, display_name, avatar_url)
    `)
    .in('user_id', [userId, ...friendIds])
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
}
```

---

### 5.3 投稿作成

**エンドポイント**: `POST /rest/v1/posts`

**リクエスト**:
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "content": "渋谷街でおしゃれなカフェを発見！",
  "station_id": "st_tokyo_001",
  "is_auto_generated": false
}
```

**レスポンス** (成功 - 201):
```json
[
  {
    "id": "523e4567-e89b-12d3-a456-426614174004",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "content": "渋谷街でおしゃれなカフェを発見！",
    "station_id": "st_tokyo_001",
    "is_auto_generated": false,
    "likes_count": 0,
    "comments_count": 0,
    "created_at": "2025-01-06T12:00:00Z",
    "updated_at": "2025-01-06T12:00:00Z"
  }
]
```

**実装例**:
```typescript
async function createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// React Query Mutation
function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries(['posts', 'timeline']);
    },
  });
}
```

---

### 5.4 投稿更新

**エンドポイント**: `PATCH /rest/v1/posts?id=eq.<post_id>`

**リクエスト**:
```json
{
  "content": "投稿内容を更新しました"
}
```

---

### 5.5 投稿削除

**エンドポイント**: `DELETE /rest/v1/posts?id=eq.<post_id>`

**レスポンス** (成功 - 204):
```
No Content
```

---

## 6. いいね・コメントAPI

### 6.1 いいね追加

**エンドポイント**: `POST /rest/v1/likes`

**リクエスト**:
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "post_id": "523e4567-e89b-12d3-a456-426614174004"
}
```

**レスポンス** (成功 - 201):
```json
[
  {
    "id": "623e4567-e89b-12d3-a456-426614174005",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "post_id": "523e4567-e89b-12d3-a456-426614174004",
    "created_at": "2025-01-06T12:00:00Z"
  }
]
```

**実装例**:
```typescript
async function likePost(userId: string, postId: string) {
  const { data, error } = await supabase
    .from('likes')
    .insert({ user_id: userId, post_id: postId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// いいね削除
async function unlikePost(userId: string, postId: string) {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId);

  if (error) throw error;
}

// React Query Mutation
function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
      likePost(userId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
  });
}
```

---

### 6.2 コメント一覧取得

**エンドポイント**: `GET /rest/v1/comments?post_id=eq.<post_id>&order=created_at.asc`

**レスポンス** (成功 - 200):
```json
[
  {
    "id": "723e4567-e89b-12d3-a456-426614174006",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "post_id": "523e4567-e89b-12d3-a456-426614174004",
    "content": "素敵なカフェですね！",
    "created_at": "2025-01-06T12:05:00Z",
    "updated_at": "2025-01-06T12:05:00Z"
  }
]
```

---

### 6.3 コメント追加

**エンドポイント**: `POST /rest/v1/comments`

**リクエスト**:
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "post_id": "523e4567-e89b-12d3-a456-426614174004",
  "content": "素敵なカフェですね！"
}
```

---

## 7. 友達API（有料版）

### 7.1 友達一覧取得

**エンドポイント**: `GET /rest/v1/friendships?user_id=eq.<user_id>&status=eq.accepted`

**レスポンス** (成功 - 200):
```json
[
  {
    "id": "823e4567-e89b-12d3-a456-426614174007",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "friend_id": "660e8400-e29b-41d4-a716-446655440001",
    "status": "accepted",
    "requested_at": "2025-01-01T00:00:00Z",
    "responded_at": "2025-01-01T12:00:00Z"
  }
]
```

**JOINで友達情報も取得**:
```typescript
async function getFriends(userId: string) {
  const { data, error } = await supabase
    .from('friendships')
    .select(`
      *,
      friend:users!friend_id(id, username, display_name, avatar_url)
    `)
    .eq('user_id', userId)
    .eq('status', 'accepted');

  if (error) throw error;
  return data;
}
```

---

### 7.2 友達リクエスト送信

**エンドポイント**: `POST /rest/v1/friendships`

**リクエスト**:
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "friend_id": "660e8400-e29b-41d4-a716-446655440001",
  "status": "pending"
}
```

**実装例**:
```typescript
async function sendFriendRequest(userId: string, friendId: string) {
  const { data, error } = await supabase
    .from('friendships')
    .insert({ user_id: userId, friend_id: friendId, status: 'pending' })
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

---

### 7.3 友達リクエスト承認

**エンドポイント**: `PATCH /rest/v1/friendships?id=eq.<friendship_id>`

**リクエスト**:
```json
{
  "status": "accepted",
  "responded_at": "2025-01-06T12:00:00Z"
}
```

---

### 7.4 友達削除

**エンドポイント**: `DELETE /rest/v1/friendships?id=eq.<friendship_id>`

---

## 8. ストレージAPI（画像アップロード）

### 8.1 画像アップロード

**エンドポイント**: `POST /storage/v1/object/post-images/<file_name>`

**実装例**:
```typescript
async function uploadImage(file: File, postId: string): Promise<string> {
  const fileName = `${postId}_${Date.now()}.jpg`;

  // 画像をアップロード
  const { data, error } = await supabase.storage
    .from('post-images')
    .upload(fileName, file, {
      contentType: 'image/jpeg',
      upsert: false,
    });

  if (error) throw error;

  // 公開URLを取得
  const { data: publicUrlData } = supabase.storage
    .from('post-images')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

// React Native での画像アップロード
async function uploadImageFromUri(uri: string, postId: string) {
  // URIをBlobに変換
  const response = await fetch(uri);
  const blob = await response.blob();

  const fileName = `${postId}_${Date.now()}.jpg`;

  const { data, error } = await supabase.storage
    .from('post-images')
    .upload(fileName, blob, {
      contentType: 'image/jpeg',
    });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from('post-images')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
```

---

### 8.2 画像削除

**エンドポイント**: `DELETE /storage/v1/object/post-images/<file_name>`

**実装例**:
```typescript
async function deleteImage(fileName: string) {
  const { error } = await supabase.storage
    .from('post-images')
    .remove([fileName]);

  if (error) throw error;
}
```

---

## 9. リアルタイムAPI（有料版）

### 9.1 友達の新規投稿をリアルタイム購読

**実装例**:
```typescript
function subscribeToFriendsPosts(userId: string, onNewPost: (post: Post) => void) {
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
        const newPost = payload.new as Post;

        // 友達の投稿のみ処理
        checkIfFriend(userId, newPost.user_id).then(isFriend => {
          if (isFriend) {
            onNewPost(newPost);
          }
        });
      }
    )
    .subscribe();

  return () => subscription.unsubscribe();
}

// 使用例
useEffect(() => {
  const unsubscribe = subscribeToFriendsPosts(currentUserId, (newPost) => {
    // Zustand Storeを更新
    usePostStore.getState().addPost(newPost);
  });

  return unsubscribe;
}, [currentUserId]);
```

---

### 9.2 いいね・コメントのリアルタイム更新

**実装例**:
```typescript
function subscribeToPostUpdates(postId: string) {
  // いいねの変更を購読
  const likesChannel = supabase
    .channel(`post-${postId}-likes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'likes',
        filter: `post_id=eq.${postId}`,
      },
      () => {
        // いいね数を再取得
        refetchLikes();
      }
    )
    .subscribe();

  // コメントの変更を購読
  const commentsChannel = supabase
    .channel(`post-${postId}-comments`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'comments',
        filter: `post_id=eq.${postId}`,
      },
      (payload) => {
        // 新しいコメントを追加
        addComment(payload.new);
      }
    )
    .subscribe();

  return () => {
    likesChannel.unsubscribe();
    commentsChannel.unsubscribe();
  };
}
```

---

## 10. エラーハンドリング

### 10.1 エラーコード一覧

| コード | 説明 |
|-------|------|
| 400 | Bad Request - リクエストが不正 |
| 401 | Unauthorized - 認証エラー |
| 403 | Forbidden - 権限エラー |
| 404 | Not Found - リソースが見つからない |
| 409 | Conflict - データ競合（例：重複いいね） |
| 500 | Internal Server Error - サーバーエラー |

### 10.2 エラーレスポンス形式

```json
{
  "error": "エラーコード",
  "message": "エラーメッセージ",
  "details": "詳細情報",
  "hint": "ヒント"
}
```

### 10.3 エラーハンドリング実装

```typescript
// グローバルエラーハンドラ
function handleSupabaseError(error: any) {
  if (error.code === 'PGRST116') {
    // RLSポリシー違反
    showToast('この操作を実行する権限がありません');
  } else if (error.code === '23505') {
    // UNIQUE制約違反
    showToast('既に存在するデータです');
  } else if (error.message.includes('JWT')) {
    // トークンエラー
    logout();
    showToast('セッションが切れました。再ログインしてください');
  } else {
    showToast('エラーが発生しました');
    console.error(error);
  }
}

// React Query でのエラーハンドリング
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: handleSupabaseError,
    },
    mutations: {
      onError: handleSupabaseError,
    },
  },
});
```

---

## 11. レート制限

### 11.1 Supabaseの制限

- **Free Tier**:
  - API リクエスト: 500,000回/月
  - Storage: 1GB
  - Database: 500MB

- **Pro Tier**:
  - API リクエスト: 無制限
  - Storage: 100GB
  - Database: 8GB

### 11.2 クライアント側のレート制限対策

```typescript
// React Queryのキャッシュを活用
const { data } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  cacheTime: 10 * 60 * 1000,
});

// デバウンス
import { debounce } from 'lodash';

const debouncedSearch = debounce((query: string) => {
  searchStations(query);
}, 300);
```

---

## 12. セキュリティ

### 12.1 環境変数管理

```typescript
// .env
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

// 使用
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;
```

### 12.2 Row Level Security (RLS)

すべてのテーブルでRLSを有効化し、適切なポリシーを設定（詳細は03_database-design.mdを参照）

---

## 13. パフォーマンス最適化

### 13.1 クエリ最適化

```typescript
// 悪い例：N+1問題
for (const post of posts) {
  const user = await getUser(post.user_id);
}

// 良い例：JOINで一括取得
const posts = await supabase
  .from('posts')
  .select('*, users(username, avatar_url)')
  .limit(50);
```

### 13.2 ページネーション

```typescript
// カーソルベースページネーション
async function getPosts(cursor?: string, limit = 20) {
  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;
  return data;
}
```

---

## 14. モック・テスト

### 14.1 APIモック

```typescript
// __mocks__/supabase.ts
export const supabase = {
  from: jest.fn(() => ({
    select: jest.fn().mockResolvedValue({ data: mockPosts, error: null }),
    insert: jest.fn().mockResolvedValue({ data: mockPost, error: null }),
  })),
};
```

### 14.2 統合テスト

```typescript
describe('Posts API', () => {
  it('should create a post', async () => {
    const post = {
      user_id: 'test-user-id',
      content: 'Test post',
    };

    const result = await createPost(post);
    expect(result).toHaveProperty('id');
    expect(result.content).toBe('Test post');
  });
});
```

---

## 15. API バージョニング

将来的なAPI変更に備えて、バージョン管理を検討：

```typescript
// v1
const API_V1_URL = 'https://xxx.supabase.co/rest/v1';

// v2（将来）
const API_V2_URL = 'https://xxx.supabase.co/rest/v2';
```

---

## 16. 補足

### 16.1 関連ドキュメント

- [Supabase公式ドキュメント](https://supabase.com/docs)
- [PostgREST API Reference](https://postgrest.org/en/stable/api.html)
- [React Query ドキュメント](https://tanstack.com/query/latest)

### 16.2 今後の拡張

- **GraphQL対応**: PostgRESTの代わりにGraphQL使用検討
- **WebSocket**: より高度なリアルタイム機能
- **Edge Functions**: サーバーサイドロジックの追加

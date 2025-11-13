/**
 * React Query クライアント設定
 */

import { QueryClient } from '@tanstack/react-query';

// ===============================
// 定数
// ===============================

export const DEFAULT_PAGE_SIZE = 20;

// ===============================
// クエリクライアント設定
// ===============================

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ステイルタイム（5分）
      staleTime: 1000 * 60 * 5,

      // キャッシュタイム（10分）
      gcTime: 1000 * 60 * 10,

      // 自動再取得の設定
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,

      // リトライ設定
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // ミューテーションのリトライ設定
      retry: 1,
    },
  },
});

// ===============================
// クエリキーのプレフィックス
// ===============================

export const QUERY_KEYS = {
  // 訪問記録
  visits: ['visits'] as const,
  visitsList: (userId: string) => [...QUERY_KEYS.visits, 'list', userId] as const,
  visitsDetail: (visitId: string) => [...QUERY_KEYS.visits, 'detail', visitId] as const,
  visitsMachi: (userId: string, machiId: string) =>
    [...QUERY_KEYS.visits, 'machi', userId, machiId] as const,
  /** @deprecated Use visitsMachi instead */
  visitsStation: (userId: string, stationId: string) =>
    [...QUERY_KEYS.visits, 'machi', userId, stationId] as const,

  // 投稿
  posts: ['posts'] as const,
  postsList: (userId: string) => [...QUERY_KEYS.posts, 'list', userId] as const,
  postsTimeline: () => [...QUERY_KEYS.posts, 'timeline'] as const,
  postsDetail: (postId: string) => [...QUERY_KEYS.posts, 'detail', postId] as const,
  postDetail: (postId: string) => [...QUERY_KEYS.posts, 'detail', postId] as const,
  postsVisit: (visitId: string) => [...QUERY_KEYS.posts, 'visit', visitId] as const,

  // いいね
  likes: ['likes'] as const,
  likeStatus: (userId: string, postId: string) =>
    [...QUERY_KEYS.likes, 'status', userId, postId] as const,

  // 街
  machi: ['machi'] as const,
  machiList: () => [...QUERY_KEYS.machi, 'list'] as const,
  machiDetail: (machiId: string) =>
    [...QUERY_KEYS.machi, 'detail', machiId] as const,
  machiSearch: (searchTerm: string) =>
    [...QUERY_KEYS.machi, 'search', searchTerm] as const,

  // 駅（後方互換性のため残す）
  /** @deprecated Use machi instead */
  stations: ['machi'] as const,
  /** @deprecated Use machiList instead */
  stationsList: () => [...QUERY_KEYS.machi, 'list'] as const,
  /** @deprecated Use machiDetail instead */
  stationsDetail: (stationId: string) =>
    [...QUERY_KEYS.machi, 'detail', stationId] as const,
  /** @deprecated Use machiSearch instead */
  stationsSearch: (searchTerm: string) =>
    [...QUERY_KEYS.machi, 'search', searchTerm] as const,

  // 予定
  schedules: ['schedules'] as const,
  schedulesList: (userId: string) => [...QUERY_KEYS.schedules, 'list', userId] as const,
  schedulesMonth: (userId: string, year: number, month: number) =>
    [...QUERY_KEYS.schedules, 'month', userId, year, month] as const,
  schedulesDetail: (scheduleId: string) =>
    [...QUERY_KEYS.schedules, 'detail', scheduleId] as const,

  // ユーザー
  users: ['users'] as const,
  usersMe: () => [...QUERY_KEYS.users, 'me'] as const,
  usersDetail: (userId: string) => [...QUERY_KEYS.users, 'detail', userId] as const,
} as const;

// ===============================
// クエリ無効化ヘルパー
// ===============================

/**
 * 訪問記録関連のクエリを無効化
 */
export function invalidateVisits() {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.visits });
}

/**
 * 投稿関連のクエリを無効化
 */
export function invalidatePosts() {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts });
}

/**
 * 予定関連のクエリを無効化
 */
export function invalidateSchedules() {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.schedules });
}

/**
 * 街関連のクエリを無効化
 */
export function invalidateMachi() {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.machi });
}

/**
 * 駅関連のクエリを無効化
 * @deprecated Use invalidateMachi instead
 */
export function invalidateStations() {
  invalidateMachi();
}

/**
 * すべてのクエリを無効化
 */
export function invalidateAllQueries() {
  queryClient.invalidateQueries();
}

/**
 * すべてのクエリをクリア
 */
export function clearAllQueries() {
  queryClient.clear();
}

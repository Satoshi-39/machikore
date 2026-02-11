import { QueryClient } from "@tanstack/react-query";

/**
 * TanStack Query クライアント設定
 * モバイル版の設定をベースに、Web版向けに調整
 */

let queryClient: QueryClient | null = null;

export function getQueryClient(): QueryClient {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5分
          gcTime: 1000 * 60 * 10, // 10分
          refetchOnWindowFocus: false,
          refetchOnReconnect: true,
          refetchOnMount: true,
          retry: (failureCount) => failureCount < 2,
          retryDelay: (attemptIndex) =>
            Math.min(1000 * 2 ** attemptIndex, 30000),
        },
        mutations: {
          retry: false,
        },
      },
    });
  }
  return queryClient;
}

// ===============================
// Query Keys（モバイル版と統一）
// ===============================

export const QUERY_KEYS = {
  // マップ
  maps: ["maps"] as const,
  mapsLists: () => [...QUERY_KEYS.maps, "list"] as const,
  mapsDetail: (mapId: string) =>
    [...QUERY_KEYS.maps, "detail", mapId] as const,
  mapsArticle: (mapId: string) =>
    [...QUERY_KEYS.maps, "article", mapId] as const,

  // スポット
  spots: ["spots"] as const,
  spotsLists: () => [...QUERY_KEYS.spots, "list"] as const,
  spotsMap: (mapId: string) =>
    [...QUERY_KEYS.spotsLists(), { type: "map", mapId }] as const,
  spotsDetail: (spotId: string) =>
    [...QUERY_KEYS.spots, "detail", spotId] as const,

  // ユーザー
  users: ["users"] as const,
  usersDetail: (username: string) =>
    [...QUERY_KEYS.users, "detail", username] as const,

  // カテゴリ
  categories: ["categories"] as const,

  // いいね
  likes: ["likes"] as const,

  // ブックマーク
  bookmarks: ["bookmarks"] as const,
} as const;

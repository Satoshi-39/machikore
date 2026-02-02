/**
 * React Query クライアント設定
 */

import { QueryClient } from '@tanstack/react-query';

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
      // React Nativeではバックグラウンド復帰時にfocusイベントが発火するが、
      // ユーザーは直前の画面をそのまま見たいため、自動再取得は無効にする
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,

      // リトライ設定
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // ミューテーションはリトライしない（重複登録を防ぐため）
      retry: false,
    },
  },
});

// ===============================
// クエリキーのプレフィックス
// ===============================

export const QUERY_KEYS = {
  // ===============================
  // 訪問記録
  // ===============================
  visits: ['visits'] as const,
  visitsList: (userId: string) => [...QUERY_KEYS.visits, 'list', userId] as const,
  visitsDetail: (visitId: string) => [...QUERY_KEYS.visits, 'detail', visitId] as const,
  visitsMachi: (userId: string, machiId: string) =>
    [...QUERY_KEYS.visits, 'machi', userId, machiId] as const,
  visitsStatus: (userId: string, machiId: string) =>
    ['machi-visit-status', userId, machiId] as const,
  visitsInfo: (userId: string, machiId: string) =>
    ['machi-visit-info', userId, machiId] as const,

  // ===============================
  // 混合フィード（マップ+スポット）
  // ===============================
  /** 混合フィード（どちらの階層にも属さない独立キー） */
  mixedFeed: () => ['mixed-feed'] as const,

  // ===============================
  // マップ（TkDodo推奨の階層構造）
  // ===============================
  /** マップ関連の全キャッシュを無効化する際のルートキー */
  maps: ['maps'] as const,
  /** リスト系のベースキー */
  mapsLists: () => [...QUERY_KEYS.maps, 'list'] as const,
  /** ユーザーのマップ一覧（マイページ/プロフィール） */
  mapsUser: (userId: string) => [...QUERY_KEYS.mapsLists(), { type: 'user', userId }] as const,
  /** マップフィード */
  mapsFeed: () => [...QUERY_KEYS.mapsLists(), { type: 'feed' }] as const,
  /** マップ検索 */
  mapsSearch: (query: string) => [...QUERY_KEYS.mapsLists(), { type: 'search', query }] as const,
  /** タグ検索 */
  mapsTagSearch: (tag: string) => [...QUERY_KEYS.mapsLists(), { type: 'tag', tag }] as const,
  /** カテゴリ検索 */
  mapsCategorySearch: (categoryId: string) =>
    [...QUERY_KEYS.mapsLists(), { type: 'category-search', categoryId }] as const,
  /** 人気マップ */
  mapsPopular: (limit: number) => [...QUERY_KEYS.mapsLists(), { type: 'popular', limit }] as const,
  /** 今日のおすすめマップ */
  mapsTodayPicks: (limit: number) => [...QUERY_KEYS.mapsLists(), { type: 'today', limit }] as const,
  /** カテゴリ別人気マップ */
  mapsCategoryPopular: (categoryId: string, limit: number) =>
    [...QUERY_KEYS.mapsLists(), { type: 'category-popular', categoryId, limit }] as const,
  /** カテゴリ別最新マップ */
  mapsCategoryLatest: (categoryId: string, limit: number) =>
    [...QUERY_KEYS.mapsLists(), { type: 'category-latest', categoryId, limit }] as const,
  /** 特集カテゴリのマップ */
  mapsFeaturedCategory: (categoryId: string) =>
    [...QUERY_KEYS.mapsLists(), { type: 'featured-category', categoryId }] as const,
  /** 詳細系のベースキー */
  mapsDetails: () => [...QUERY_KEYS.maps, 'detail'] as const,
  /** マップ詳細（ユーザーマップページ） */
  mapsDetail: (mapId: string, currentUserId?: string | null) =>
    [...QUERY_KEYS.mapsDetails(), mapId, currentUserId] as const,
  /** マップ記事 */
  mapsArticle: (mapId: string) => [...QUERY_KEYS.mapsDetails(), mapId, 'article'] as const,
  /** マップラベル */
  mapsLabels: (mapId: string) => [...QUERY_KEYS.mapsDetails(), mapId, 'labels'] as const,

  // ===============================
  // スポット（TkDodo推奨の階層構造）
  // ===============================
  /** スポット関連の全キャッシュを無効化する際のルートキー */
  spots: ['spots'] as const,
  /** リスト系のベースキー */
  spotsLists: () => [...QUERY_KEYS.spots, 'list'] as const,
  /** マップ内のスポット一覧 */
  spotsMap: (mapId: string) => [...QUERY_KEYS.spotsLists(), { type: 'map', mapId }] as const,
  /** スポットフィード */
  spotsFeed: () => [...QUERY_KEYS.spotsLists(), { type: 'feed' }] as const,
  /** スポット検索 */
  spotsSearch: (query: string) => [...QUERY_KEYS.spotsLists(), { type: 'search', query }] as const,
  /** 都道府県別スポット */
  spotsPrefecture: (prefectureId: string) =>
    [...QUERY_KEYS.spotsLists(), { type: 'prefecture', prefectureId }] as const,
  /** マスタースポットに紐づくスポット */
  spotsByMasterSpot: (masterSpotId: string, limit?: number) =>
    [...QUERY_KEYS.spotsLists(), { type: 'master-spot', masterSpotId, limit }] as const,
  /** 詳細系のベースキー */
  spotsDetails: () => [...QUERY_KEYS.spots, 'detail'] as const,
  /** スポット詳細 */
  spotsDetail: (spotId: string) => [...QUERY_KEYS.spotsDetails(), spotId] as const,
  /** スポット詳細（ユーザー情報付き） */
  spotsDetailWithUser: (spotId: string, currentUserId?: string | null) =>
    [...QUERY_KEYS.spotsDetails(), spotId, currentUserId] as const,
  /** スポット画像 */
  spotsImages: (spotId: string) => [...QUERY_KEYS.spotsDetails(), spotId, 'images'] as const,
  /** スポットショート動画 */
  spotsShorts: (spotId: string) => [...QUERY_KEYS.spotsDetails(), spotId, 'shorts'] as const,

  // ===============================
  // マスタースポット
  // ===============================
  masterSpots: ['masterSpots'] as const,
  masterSpotsDetail: (masterSpotId: string) =>
    ['master-spot', masterSpotId] as const,
  masterSpotsByMachi: (machiId: string, limit?: number) =>
    [...QUERY_KEYS.masterSpots, 'byMachi', machiId, limit] as const,
  masterSpotFavorite: (userId: string, masterSpotId: string) =>
    ['master-spot-favorite', userId, masterSpotId] as const,
  masterSpotFavoriteIds: (userId: string) =>
    ['master-spot-favorite-ids', userId] as const,

  // ===============================
  // いいね
  // ===============================
  likes: ['likes'] as const,
  likeStatus: (userId: string, targetId: string) =>
    [...QUERY_KEYS.likes, 'status', userId, targetId] as const,
  mapLikeStatus: (userId: string, mapId: string) =>
    ['map-like-status', userId, mapId] as const,
  spotLikeStatus: (userId: string, spotId: string) =>
    ['spot-like-status', userId, spotId] as const,
  userLikedMaps: (userId: string) => ['user-liked-maps', userId] as const,
  userLikedSpots: (userId: string) => ['user-liked-spots', userId] as const,
  spotLikers: (spotId: string) => ['spotLikers', spotId] as const,
  mapLikers: (mapId: string) => ['mapLikers', mapId] as const,

  // ===============================
  // ブックマーク
  // ===============================
  bookmarks: ['bookmarks'] as const,
  bookmarksList: (userId: string, folderId?: string) =>
    [...QUERY_KEYS.bookmarks, userId, folderId] as const,
  bookmarkedSpots: (userId: string, folderId?: string) =>
    [...QUERY_KEYS.bookmarks, 'spots', userId, folderId] as const,
  bookmarkedMaps: (userId: string, folderId?: string) =>
    [...QUERY_KEYS.bookmarks, 'maps', userId, folderId] as const,
  bookmarkFolders: ['bookmark-folders'] as const,
  bookmarkFoldersList: (userId: string, folderType?: string) =>
    [...QUERY_KEYS.bookmarkFolders, userId, folderType] as const,
  bookmarkStatus: (type: 'spot' | 'map', userId: string, targetId: string) =>
    ['bookmark-status', type, userId, targetId] as const,
  bookmarkInfo: (type: 'spot' | 'map', userId: string, targetId: string) =>
    ['bookmark-info', type, userId, targetId] as const,
  folderBookmarkCounts: (userId: string) =>
    ['folder-bookmark-counts', userId] as const,

  // ===============================
  // 通知
  // ===============================
  notifications: ['notifications'] as const,
  notificationsList: (userId: string) =>
    [...QUERY_KEYS.notifications, userId] as const,
  notificationsUnreadCount: (userId: string) =>
    [...QUERY_KEYS.notifications, 'unread-count', userId] as const,
  announcements: ['announcements'] as const,
  announcementsSystem: () => ['system-announcements'] as const,
  announcementsUnreadCount: (userId: string) =>
    [...QUERY_KEYS.announcements, 'unread-count', userId] as const,
  announcementsReadIds: (userId: string) =>
    [...QUERY_KEYS.announcements, 'read-ids', userId] as const,

  // ===============================
  // 地理データ
  // ===============================
  continents: () => ['continents'] as const,
  countries: () => ['countries'] as const,
  regions: () => ['regions'] as const,
  prefectures: () => ['prefectures'] as const,
  cities: ['cities'] as const,
  citiesList: () => ['cities', 'list'] as const,

  // 街
  machi: ['machi'] as const,
  machiList: () => [...QUERY_KEYS.machi, 'list'] as const,
  machiDetail: (machiId: string) =>
    [...QUERY_KEYS.machi, 'detail', machiId] as const,
  machiSearch: (searchTerm: string) =>
    [...QUERY_KEYS.machi, 'search', searchTerm] as const,

  // 交通機関
  transportHubs: () => ['transport-hubs'] as const,
  transportHubsList: () => ['transport-hubs', 'list'] as const,

  // ===============================
  // ユーザー
  // ===============================
  users: ['users'] as const,
  usersMe: () => [...QUERY_KEYS.users, 'me'] as const,
  usersDetail: (userId: string) => ['user', userId] as const,
  usersSearch: (query: string) => [...QUERY_KEYS.users, 'search', query] as const,
  usersStats: (userId: string) => ['userStats', userId] as const,

  // ===============================
  // フォロー
  // ===============================
  follows: ['follows'] as const,
  followStatus: (followerId: string, followeeId: string) =>
    ['follow-status', followerId, followeeId] as const,
  followCounts: (userId: string) => ['follow-counts', userId] as const,
  followers: (userId: string, currentUserId?: string | null) =>
    ['followers', userId, currentUserId] as const,
  following: (userId: string, currentUserId?: string | null) =>
    ['following', userId, currentUserId] as const,

  // ===============================
  // コメント
  // ===============================
  comments: ['comments'] as const,
  commentsSpot: (spotId: string, currentUserId?: string | null) =>
    ['comments', 'spot', spotId, currentUserId] as const,
  commentsMap: (mapId: string, currentUserId?: string | null) =>
    ['comments', 'map', mapId, currentUserId] as const,
  commentsMapCount: (mapId: string) => ['comments', 'map', mapId, 'count'] as const,
  commentsReplies: (parentId: string) => ['comments', 'replies', parentId] as const,
  commentsRepliesWithUser: (parentId: string, currentUserId?: string | null) =>
    ['comments', 'replies', parentId, currentUserId] as const,
  commentLikeStatus: (userId: string, commentId: string) =>
    ['comment-like-status', userId, commentId] as const,

  // ===============================
  // カテゴリ・タグ
  // ===============================
  categories: () => ['categories'] as const,
  tags: () => ['tags'] as const,

  // ===============================
  // 特集
  // ===============================
  featuredItems: ['featured-items'] as const,
  featuredItemsByCategory: (categoryId?: string) =>
    [...QUERY_KEYS.featuredItems, categoryId ?? 'all'] as const,
  featuredItemDetail: (id: string) =>
    ['featured-item', id] as const,
  featuredCategoryMaps: (categoryId: string) =>
    ['featured-category-maps', categoryId] as const,

  // ===============================
  // マガジン
  // ===============================
  magazines: () => ['magazines'] as const,
  magazineDetail: (id: string) => ['magazine', id] as const,
  magazineMaps: (magazineId: string) => ['magazine-maps', magazineId] as const,
  magazineSections: (magazineId: string) => ['magazine-sections', magazineId] as const,

  // ===============================
  // 予定
  // ===============================
  schedules: ['schedules'] as const,
  schedulesList: (userId: string) => [...QUERY_KEYS.schedules, 'list', userId] as const,
  schedulesMonth: (userId: string, year: number, month: number) =>
    [...QUERY_KEYS.schedules, 'month', userId, year, month] as const,
  schedulesDetail: (scheduleId: string) =>
    [...QUERY_KEYS.schedules, 'detail', scheduleId] as const,

  // ===============================
  // 閲覧履歴
  // ===============================
  viewHistory: ['view-history'] as const,
  viewHistoryRecent: (userId: string, limit?: number) =>
    [...QUERY_KEYS.viewHistory, 'recent', userId, limit] as const,

  // ===============================
  // Wikipedia
  // ===============================
  wikipedia: ['wikipedia'] as const,
  wikipediaCountry: (name: string) => ['wikipedia', 'country', name] as const,
  wikipediaCity: (cityName: string, prefectureName: string) =>
    ['wikipedia', 'city', cityName, prefectureName] as const,
  wikipediaMachi: (machiName: string, cityName?: string, prefectureName?: string) =>
    ['wikipedia', 'machi', machiName, cityName, prefectureName] as const,
  wikipediaPrefecture: (prefectureName: string) =>
    ['wikipedia', 'prefecture', prefectureName] as const,
  wikipediaRegion: (regionName: string) =>
    ['wikipedia', 'region', regionName] as const,

  // ===============================
  // コレクション
  // ===============================
  collections: ['collections'] as const,
  collectionsLists: () => [...QUERY_KEYS.collections, 'list'] as const,
  collectionsList: (userId: string) => [...QUERY_KEYS.collectionsLists(), userId] as const,
  collectionsDetails: () => [...QUERY_KEYS.collections, 'detail'] as const,
  collectionsDetail: (id: string) => [...QUERY_KEYS.collectionsDetails(), id] as const,
  collectionsPublic: () => [...QUERY_KEYS.collections, 'public'] as const,
  /** コレクション内マップ */
  collectionMaps: ['collection-maps'] as const,
  collectionMapsList: (collectionId: string) => [...QUERY_KEYS.collectionMaps, collectionId] as const,
  collectionMapsMapCollections: (mapId: string, userId: string) =>
    [...QUERY_KEYS.collectionMaps, 'map', mapId, userId] as const,

  // ===============================
  // ユーザー設定
  // ===============================
  userPreferences: ['user-preferences'] as const,

} as const;

// ===============================
// クエリ無効化ヘルパー
// ===============================

/** 訪問記録関連のクエリを無効化 */
export function invalidateVisits() {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.visits });
}

/** マップ関連のクエリを無効化 */
export function invalidateMaps() {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.maps });
}

/** スポット関連のクエリを無効化 */
export function invalidateSpots() {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.spots });
}

/** ブックマーク関連のクエリを無効化 */
export function invalidateBookmarks(userId?: string) {
  if (userId) {
    queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.bookmarks, userId] });
  } else {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarks });
  }
}

/** 通知関連のクエリを無効化（通知リスト + 未読カウント + お知らせ） */
export function invalidateNotifications(userId?: string) {
  // 通知全体（リスト + 未読カウント）を無効化
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
  // お知らせ関連も無効化
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.announcements });
}

/** 予定関連のクエリを無効化 */
export function invalidateSchedules() {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.schedules });
}

/** 街関連のクエリを無効化 */
export function invalidateMachi() {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.machi });
}

/** 閲覧履歴関連のクエリを無効化 */
export function invalidateViewHistory() {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.viewHistory });
}

/** すべてのクエリを無効化 */
export function invalidateAllQueries() {
  queryClient.invalidateQueries();
}

/** すべてのクエリをクリア */
export function clearAllQueries() {
  queryClient.clear();
}


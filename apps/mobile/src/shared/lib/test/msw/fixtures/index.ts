/**
 * テスト用フィクスチャ（モックデータ）
 */

import type { UserRow, MapRow, UserSpotRow, MasterSpotRow } from '@/shared/types';

// ===============================
// Users
// ===============================

export const mockUsers: UserRow[] = [
  {
    id: 'user-1',
    username: 'testuser1',
    display_name: 'テストユーザー1',
    avatar_url: 'https://example.com/avatar1.png',
    bio: 'テストユーザー1の自己紹介',
    email: 'test1@example.com',
    age_group: null,
    country: null,
    gender: null,
    prefecture: null,
    status: 'active',
    is_premium: false,
    premium_started_at: null,
    premium_expires_at: null,
    push_token: null,
    push_token_updated_at: null,
    suspended_at: null,
    suspended_reason: null,
    deletion_requested_at: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-2',
    username: 'testuser2',
    display_name: 'テストユーザー2',
    avatar_url: 'https://example.com/avatar2.png',
    bio: 'テストユーザー2の自己紹介',
    email: 'test2@example.com',
    age_group: null,
    country: null,
    gender: null,
    prefecture: null,
    status: 'active',
    is_premium: true,
    premium_started_at: '2024-01-01T00:00:00Z',
    premium_expires_at: '2025-01-01T00:00:00Z',
    push_token: null,
    push_token_updated_at: null,
    suspended_at: null,
    suspended_reason: null,
    deletion_requested_at: null,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
];

// ===============================
// Maps
// ===============================

export const mockMaps: MapRow[] = [
  {
    id: 'map-1',
    user_id: 'user-1',
    name: '東京のおすすめカフェ',
    description: '東京都内のおすすめカフェをまとめました',
    thumbnail_url: 'https://example.com/cover1.png',
    is_public: true,
    is_official: false,
    category_id: 'category-1',
    language: 'ja',
    spots_count: 5,
    likes_count: 10,
    bookmarks_count: 3,
    comments_count: 2,
    article_intro: null,
    article_outro: null,
    show_label_chips: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'map-2',
    user_id: 'user-1',
    name: '京都の神社巡り',
    description: '京都の有名な神社をまとめました',
    thumbnail_url: 'https://example.com/cover2.png',
    is_public: true,
    is_official: false,
    category_id: 'category-2',
    language: 'ja',
    spots_count: 8,
    likes_count: 25,
    bookmarks_count: 10,
    comments_count: 5,
    article_intro: null,
    article_outro: null,
    show_label_chips: true,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'map-3',
    user_id: 'user-2',
    name: '大阪グルメ',
    description: '大阪の美味しいお店',
    thumbnail_url: null,
    is_public: false,
    is_official: false,
    category_id: 'category-1',
    language: 'ja',
    spots_count: 3,
    likes_count: 0,
    bookmarks_count: 0,
    comments_count: 0,
    article_intro: null,
    article_outro: null,
    show_label_chips: false,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
];

// ===============================
// Master Spots
// ===============================

export const mockMasterSpots: MasterSpotRow[] = [
  {
    id: 'master-spot-1',
    name: 'スターバックス 渋谷店',
    latitude: 35.6595,
    longitude: 139.7004,
    machi_id: null,
    google_place_id: 'ChIJ1234567890',
    google_formatted_address: '東京都渋谷区渋谷1-2-3',
    google_short_address: '渋谷1-2-3',
    google_types: ['cafe', 'food'],
    google_phone_number: '03-1234-5678',
    google_website_uri: 'https://starbucks.co.jp',
    google_rating: 4.2,
    google_user_rating_count: 150,
    favorites_count: 10,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'master-spot-2',
    name: '伏見稲荷大社',
    latitude: 34.9671,
    longitude: 135.7727,
    machi_id: null,
    google_place_id: 'ChIJ9876543210',
    google_formatted_address: '京都府京都市伏見区深草藪之内町68',
    google_short_address: '伏見区深草',
    google_types: ['place_of_worship', 'tourist_attraction'],
    google_phone_number: '075-641-7331',
    google_website_uri: 'https://inari.jp',
    google_rating: 4.8,
    google_user_rating_count: 5000,
    favorites_count: 50,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
];

// ===============================
// User Spots
// ===============================

export const mockSpots: UserSpotRow[] = [
  {
    id: 'spot-1',
    user_id: 'user-1',
    map_id: 'map-1',
    master_spot_id: 'master-spot-1',
    machi_id: null,
    name: null,
    description: 'スタバ渋谷',
    spot_color: 'blue',
    label_id: null,
    language: 'ja',
    images_count: 2,
    likes_count: 5,
    bookmarks_count: 1,
    comments_count: 1,
    order_index: 0,
    latitude: 35.6595,
    longitude: 139.7004,
    prefecture_id: null,
    city_id: null,
    google_formatted_address: '東京都渋谷区渋谷1-2-3',
    google_short_address: '渋谷1-2-3',
    article_content: null,
    is_public: true,
    thumbnail_image_id: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'spot-2',
    user_id: 'user-1',
    map_id: 'map-2',
    master_spot_id: 'master-spot-2',
    machi_id: null,
    name: null,
    description: '伏見稲荷',
    spot_color: 'red',
    label_id: null,
    language: 'ja',
    images_count: 5,
    likes_count: 15,
    bookmarks_count: 8,
    comments_count: 3,
    order_index: 0,
    latitude: 34.9671,
    longitude: 135.7727,
    prefecture_id: null,
    city_id: null,
    google_formatted_address: '京都府京都市伏見区深草藪之内町68',
    google_short_address: '伏見区深草',
    article_content: null,
    is_public: true,
    thumbnail_image_id: null,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
];

// ===============================
// ファクトリー関数
// ===============================

/**
 * カスタムユーザーを作成
 */
export function createMockUser(overrides: Partial<UserRow> = {}): UserRow {
  return {
    id: `user-${Date.now()}`,
    username: 'mockuser',
    display_name: 'モックユーザー',
    avatar_url: null,
    bio: null,
    email: 'mock@example.com',
    age_group: null,
    country: null,
    gender: null,
    prefecture: null,
    status: 'active',
    is_premium: false,
    premium_started_at: null,
    premium_expires_at: null,
    push_token: null,
    push_token_updated_at: null,
    suspended_at: null,
    suspended_reason: null,
    deletion_requested_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * カスタムマップを作成
 */
export function createMockMap(overrides: Partial<MapRow> = {}): MapRow {
  return {
    id: `map-${Date.now()}`,
    user_id: 'user-1',
    name: 'モックマップ',
    description: null,
    thumbnail_url: null,
    is_public: true,
    is_official: false,
    category_id: null,
    language: 'ja',
    spots_count: 0,
    likes_count: 0,
    bookmarks_count: 0,
    comments_count: 0,
    article_intro: null,
    article_outro: null,
    show_label_chips: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * カスタムスポットを作成
 */
export function createMockSpot(overrides: Partial<UserSpotRow> = {}): UserSpotRow {
  return {
    id: `spot-${Date.now()}`,
    user_id: 'user-1',
    map_id: 'map-1',
    master_spot_id: null,
    machi_id: null,
    name: null,
    description: 'モックスポット',
    spot_color: null,
    label_id: null,
    language: 'ja',
    images_count: 0,
    likes_count: 0,
    bookmarks_count: 0,
    comments_count: 0,
    order_index: 0,
    latitude: 35.6812,
    longitude: 139.7671,
    prefecture_id: null,
    city_id: null,
    google_formatted_address: null,
    google_short_address: null,
    article_content: null,
    is_public: true,
    thumbnail_image_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

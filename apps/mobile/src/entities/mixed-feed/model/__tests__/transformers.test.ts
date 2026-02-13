/**
 * 混合フィード変換ロジックの単体テスト
 *
 * RPC結果からドメイン型への変換を検証
 */

import type { RpcMixedFeedItem } from '@/shared/types';
import { toMixedFeedItem, transformMixedFeedItems } from '../transformers';

// ===============================
// テストデータ ファクトリー
// ===============================

/** 全フィールドnullのベーステンプレート */
function createBaseItem(overrides: Partial<RpcMixedFeedItem> = {}): RpcMixedFeedItem {
  return {
    item_type: 'map',
    item_id: 'item-1',
    feed_position: 0,
    created_at: '2024-01-01T00:00:00Z',
    spot_display_type: null,
    // マップ
    map_id: null,
    map_name: null,
    map_description: null,
    map_thumbnail_url: null,
    map_thumbnail_crop: null,
    map_is_public: null,
    map_spots_count: null,
    map_likes_count: null,
    map_bookmarks_count: null,
    map_comments_count: null,
    map_category_id: null,
    map_language: null,
    map_user_id: null,
    map_user_username: null,
    map_user_display_name: null,
    map_user_avatar_url: null,
    map_user_avatar_crop: null,
    map_tags: null,
    map_is_liked: null,
    map_is_bookmarked: null,
    // スポット
    spot_id: null,
    spot_user_id: null,
    spot_map_id: null,
    spot_master_spot_id: null,
    spot_machi_id: null,
    spot_description: null,
    spot_spot_color: null,
    spot_label_id: null,
    spot_name: null,
    spot_images_count: null,
    spot_likes_count: null,
    spot_bookmarks_count: null,
    spot_comments_count: null,
    spot_order_index: null,
    spot_latitude: null,
    spot_longitude: null,
    spot_google_formatted_address: null,
    spot_google_short_address: null,
    spot_master_spot_name: null,
    spot_master_spot_latitude: null,
    spot_master_spot_longitude: null,
    spot_master_spot_google_place_id: null,
    spot_master_spot_google_formatted_address: null,
    spot_master_spot_google_short_address: null,
    spot_master_spot_google_types: null,
    spot_user_username: null,
    spot_user_display_name: null,
    spot_user_avatar_url: null,
    spot_user_avatar_crop: null,
    spot_map_name: null,
    spot_is_public: null,
    spot_article_content: null,
    spot_image_urls: null,
    spot_tags: null,
    spot_is_liked: null,
    spot_is_bookmarked: null,
    spot_video_url: null,
    spot_thumbnail_image_id: null,
    spot_thumbnail_crop: null,
    // 広告
    ad_slot: null,
    ...overrides,
  } as RpcMixedFeedItem;
}

function createMapItem(overrides: Partial<RpcMixedFeedItem> = {}): RpcMixedFeedItem {
  return createBaseItem({
    item_type: 'map',
    item_id: 'map-1',
    map_id: 'map-1',
    map_name: '東京カフェ',
    map_description: 'おすすめカフェ',
    map_user_id: 'user-1',
    map_user_username: 'testuser',
    map_user_display_name: 'テストユーザー',
    map_user_avatar_url: 'https://example.com/avatar.png',
    map_tags: [{ id: 'tag-1', name: 'カフェ', slug: 'cafe' }],
    map_spots_count: 5,
    map_likes_count: 10,
    map_is_liked: true,
    map_is_bookmarked: false,
    ...overrides,
  });
}

function createSpotItem(overrides: Partial<RpcMixedFeedItem> = {}): RpcMixedFeedItem {
  return createBaseItem({
    item_type: 'spot',
    item_id: 'spot-1',
    spot_display_type: 'card',
    spot_id: 'spot-1',
    spot_user_id: 'user-1',
    spot_map_id: 'map-1',
    spot_map_name: '東京カフェ',
    spot_master_spot_id: 'master-1',
    spot_master_spot_name: 'スターバックス',
    spot_master_spot_latitude: 35.6595,
    spot_master_spot_longitude: 139.7004,
    spot_description: 'おいしいコーヒー',
    spot_user_username: 'testuser',
    spot_image_urls: ['https://example.com/img1.png'],
    spot_tags: [{ id: 'tag-1', name: 'カフェ', slug: 'cafe' }],
    spot_is_liked: false,
    spot_is_bookmarked: true,
    ...overrides,
  });
}

function createAdItem(overrides: Partial<RpcMixedFeedItem> = {}): RpcMixedFeedItem {
  return createBaseItem({
    item_type: 'ad',
    item_id: 'ad-1',
    ad_slot: 'feed_native',
    feed_position: 3,
    ...overrides,
  });
}

// ===============================
// toMixedFeedItem テスト
// ===============================

describe('toMixedFeedItem', () => {
  describe('mapアイテム', () => {
    it('item_type: "map" → type: "map" のMixedFeedItem', () => {
      const item = createMapItem();
      const result = toMixedFeedItem(item);

      expect(result.type).toBe('map');
      if (result.type === 'map') {
        expect(result.data.id).toBe('map-1');
        expect(result.data.name).toBe('東京カフェ');
        expect(result.createdAt).toBe('2024-01-01T00:00:00Z');
      }
    });

    it('map_tagsがnull → 空配列', () => {
      const item = createMapItem({ map_tags: null });
      const result = toMixedFeedItem(item);

      if (result.type === 'map') {
        expect(result.data.tags).toEqual([]);
      }
    });

    it('map_user_idがnull → user: null', () => {
      const item = createMapItem({ map_user_id: null });
      const result = toMixedFeedItem(item);

      if (result.type === 'map') {
        expect(result.data.user).toBeNull();
      }
    });

    it('map_is_liked/is_bookmarked未定義 → false', () => {
      const item = createMapItem({ map_is_liked: null, map_is_bookmarked: null });
      const result = toMixedFeedItem(item);

      if (result.type === 'map') {
        expect(result.data.is_liked).toBe(false);
        expect(result.data.is_bookmarked).toBe(false);
      }
    });

    it('ユーザー情報が正しくマッピングされる', () => {
      const item = createMapItem();
      const result = toMixedFeedItem(item);

      if (result.type === 'map') {
        expect(result.data.user).toEqual({
          id: 'user-1',
          username: 'testuser',
          display_name: 'テストユーザー',
          avatar_url: 'https://example.com/avatar.png',
          avatar_crop: null,
        });
      }
    });
  });

  describe('spotアイテム', () => {
    it('spot_display_type: "card" → displayType: "card"', () => {
      const item = createSpotItem({ spot_display_type: 'card' });
      const result = toMixedFeedItem(item);

      expect(result.type).toBe('spot');
      if (result.type === 'spot') {
        expect(result.displayType).toBe('card');
      }
    });

    it('spot_display_type: "short" → displayType: "short"', () => {
      const item = createSpotItem({ spot_display_type: 'short' });
      const result = toMixedFeedItem(item);

      if (result.type === 'spot') {
        expect(result.displayType).toBe('short');
      }
    });

    it('spot_display_typeがnull → "card"にフォールバック', () => {
      const item = createSpotItem({ spot_display_type: null });
      const result = toMixedFeedItem(item);

      if (result.type === 'spot') {
        expect(result.displayType).toBe('card');
      }
    });

    it('spot_master_spot_idがnull → master_spot: null', () => {
      const item = createSpotItem({ spot_master_spot_id: null });
      const result = toMixedFeedItem(item);

      if (result.type === 'spot') {
        expect(result.data.master_spot).toBeNull();
      }
    });

    it('spot_nameがstring → nameにマッピング', () => {
      const item = createSpotItem({ spot_name: 'カスタム名' });
      const result = toMixedFeedItem(item);

      if (result.type === 'spot') {
        expect(result.data.name).toBe('カスタム名');
      }
    });

    it('spot_nameがstring以外 → null', () => {
      const item = createSpotItem({ spot_name: 123 as any });
      const result = toMixedFeedItem(item);

      if (result.type === 'spot') {
        expect(result.data.name).toBeNull();
      }
    });

    it('spot_image_urls/spot_tagsがnull → 空配列', () => {
      const item = createSpotItem({ spot_image_urls: null, spot_tags: null });
      const result = toMixedFeedItem(item);

      if (result.type === 'spot') {
        expect(result.data.image_urls).toEqual([]);
        expect(result.data.tags).toEqual([]);
      }
    });

    it('spot_is_liked/is_bookmarked未定義 → false', () => {
      const item = createSpotItem({ spot_is_liked: null, spot_is_bookmarked: null });
      const result = toMixedFeedItem(item);

      if (result.type === 'spot') {
        expect(result.data.is_liked).toBe(false);
        expect(result.data.is_bookmarked).toBe(false);
      }
    });
  });

  describe('adアイテム', () => {
    it('item_type: "ad" → type: "ad"', () => {
      const item = createAdItem();
      const result = toMixedFeedItem(item);

      expect(result.type).toBe('ad');
    });

    it('ad_slotとfeed_positionが正しくマッピング', () => {
      const item = createAdItem({ ad_slot: 'carousel_video', feed_position: 7 });
      const result = toMixedFeedItem(item);

      if (result.type === 'ad') {
        expect(result.adSlot).toBe('carousel_video');
        expect(result.feedPosition).toBe(7);
      }
    });
  });
});

// ===============================
// transformMixedFeedItems テスト
// ===============================

describe('transformMixedFeedItems', () => {
  it('空配列 → 空配列', () => {
    expect(transformMixedFeedItems([])).toEqual([]);
  });

  it('map, spot, ad混在 → 正しく変換', () => {
    const items = [
      createMapItem(),
      createSpotItem(),
      createAdItem(),
    ];
    const results = transformMixedFeedItems(items);

    expect(results).toHaveLength(3);
    expect(results[0]!.type).toBe('map');
    expect(results[1]!.type).toBe('spot');
    expect(results[2]!.type).toBe('ad');
  });
});

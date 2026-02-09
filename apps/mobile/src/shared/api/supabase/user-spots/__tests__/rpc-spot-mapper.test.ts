/**
 * rpcSpotResponseToUserSpotSearchResult マッパーのテスト
 *
 * search_public_spots RPC の生データから UserSpotSearchResult への変換を検証
 * 特にネストしたオブジェクトの条件構築、null/undefined のエッジケースに注目
 */

import { rpcSpotResponseToUserSpotSearchResult, type SearchPublicSpotsRpcRow } from '../types';

const baseRow: SearchPublicSpotsRpcRow = {
  id: 'spot-1',
  user_id: 'user-1',
  map_id: 'map-1',
  master_spot_id: 'ms-1',
  machi_id: null,
  description: 'おいしいラーメン屋',
  spot_color: '#FF0000',
  label_id: 'label-1',
  label_name: 'グルメ',
  label_color: '#00FF00',
  name: null,
  language: 'ja',
  images_count: 3,
  likes_count: 5,
  comments_count: 2,
  order_index: 0,
  created_at: '2024-06-01T00:00:00Z',
  updated_at: '2024-06-01T00:00:00Z',
  latitude: 35.6580,
  longitude: 139.7016,
  google_formatted_address: { ja: '東京都渋谷区' },
  google_short_address: { ja: '渋谷区' },
  is_public: true,
  master_spot_name: { ja: '渋谷ラーメン' },
  master_spot_latitude: 35.6580,
  master_spot_longitude: 139.7016,
  master_spot_google_place_id: 'ChIJ123',
  master_spot_google_formatted_address: { ja: '東京都渋谷区道玄坂' },
  master_spot_google_short_address: { ja: '渋谷区道玄坂' },
  master_spot_google_types: ['restaurant'],
  user_username: 'testuser',
  user_display_name: 'Test User',
  user_avatar_url: 'https://example.com/avatar.jpg',
  user_avatar_crop: null,
  map_name: 'グルメマップ',
  tags: [{ id: 'tag-1', name: 'ラーメン', slug: 'ramen' }],
  article_content: null,
  image_urls: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
  thumbnail_image_id: 'img-1',
  thumbnail_crop: null,
};

describe('rpcSpotResponseToUserSpotSearchResult', () => {
  it('全フィールドが揃っている場合に正しく変換する', () => {
    const result = rpcSpotResponseToUserSpotSearchResult(baseRow);

    expect(result.id).toBe('spot-1');
    expect(result.user_id).toBe('user-1');
    expect(result.map_id).toBe('map-1');
    expect(result.description).toBe('おいしいラーメン屋');
    expect(result.spot_color).toBe('#FF0000');
    expect(result.language).toBe('ja');
    expect(result.is_public).toBe(true);
  });

  // -------------------------------------------------------
  // map_label の条件分岐
  // -------------------------------------------------------
  describe('map_label の構築', () => {
    it('label_name がある場合は MapLabelBasicInfo を構築する', () => {
      const result = rpcSpotResponseToUserSpotSearchResult(baseRow);
      expect(result.map_label).toEqual({
        id: 'label-1',
        name: 'グルメ',
        color: '#00FF00',
      });
    });

    it('label_name が null の場合は map_label が null になる', () => {
      const result = rpcSpotResponseToUserSpotSearchResult({
        ...baseRow,
        label_name: null,
        label_color: null,
      });
      expect(result.map_label).toBeNull();
    });
  });

  // -------------------------------------------------------
  // master_spot の条件分岐
  // -------------------------------------------------------
  describe('master_spot の構築', () => {
    it('master_spot_id がある場合はネストしたオブジェクトを構築する', () => {
      const result = rpcSpotResponseToUserSpotSearchResult(baseRow);
      expect(result.master_spot).toEqual({
        id: 'ms-1',
        name: { ja: '渋谷ラーメン' },
        latitude: 35.6580,
        longitude: 139.7016,
        google_place_id: 'ChIJ123',
        google_formatted_address: { ja: '東京都渋谷区道玄坂' },
        google_short_address: { ja: '渋谷区道玄坂' },
        google_types: ['restaurant'],
      });
    });

    it('master_spot_id が null の場合は master_spot が null になる', () => {
      const result = rpcSpotResponseToUserSpotSearchResult({
        ...baseRow,
        master_spot_id: null,
      });
      expect(result.master_spot).toBeNull();
    });
  });

  // -------------------------------------------------------
  // user の条件分岐
  // -------------------------------------------------------
  describe('user の構築', () => {
    it('user_username がある場合はユーザーオブジェクトを構築する', () => {
      const result = rpcSpotResponseToUserSpotSearchResult(baseRow);
      expect(result.user).toEqual({
        id: 'user-1',
        username: 'testuser',
        display_name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
        avatar_crop: null,
      });
    });

    it('user_username が null の場合は user が null になる', () => {
      const result = rpcSpotResponseToUserSpotSearchResult({
        ...baseRow,
        user_username: null,
      });
      expect(result.user).toBeNull();
    });

    it('user_avatar_crop が undefined の場合は null にフォールバックする', () => {
      const row = { ...baseRow };
      // @ts-expect-error: テスト用にundefinedを設定
      row.user_avatar_crop = undefined;
      const result = rpcSpotResponseToUserSpotSearchResult(row);
      expect(result.user?.avatar_crop).toBeNull();
    });
  });

  // -------------------------------------------------------
  // map の条件分岐
  // -------------------------------------------------------
  describe('map の構築', () => {
    it('map_name がある場合はマップオブジェクトを構築する', () => {
      const result = rpcSpotResponseToUserSpotSearchResult(baseRow);
      expect(result.map).toEqual({ id: 'map-1', name: 'グルメマップ' });
    });

    it('map_name が null の場合は map が null になる', () => {
      const result = rpcSpotResponseToUserSpotSearchResult({
        ...baseRow,
        map_name: null,
      });
      expect(result.map).toBeNull();
    });
  });

  // -------------------------------------------------------
  // tags の変換（空配列 → undefined）
  // -------------------------------------------------------
  describe('tags の変換', () => {
    it('タグがある場合は配列として返す', () => {
      const result = rpcSpotResponseToUserSpotSearchResult(baseRow);
      expect(result.tags).toEqual([{ id: 'tag-1', name: 'ラーメン', slug: 'ramen' }]);
    });

    it('tags が空配列の場合は undefined になる', () => {
      const result = rpcSpotResponseToUserSpotSearchResult({
        ...baseRow,
        tags: [],
      });
      expect(result.tags).toBeUndefined();
    });

    it('tags が null の場合は undefined になる', () => {
      const result = rpcSpotResponseToUserSpotSearchResult({
        ...baseRow,
        tags: null,
      });
      expect(result.tags).toBeUndefined();
    });
  });

  // -------------------------------------------------------
  // image_urls の変換（空配列 → undefined）
  // -------------------------------------------------------
  describe('image_urls の変換', () => {
    it('画像URLがある場合は配列として返す', () => {
      const result = rpcSpotResponseToUserSpotSearchResult(baseRow);
      expect(result.image_urls).toEqual([
        'https://example.com/img1.jpg',
        'https://example.com/img2.jpg',
      ]);
    });

    it('image_urls が空配列の場合は undefined になる', () => {
      const result = rpcSpotResponseToUserSpotSearchResult({
        ...baseRow,
        image_urls: [],
      });
      expect(result.image_urls).toBeUndefined();
    });

    it('image_urls が null の場合は undefined になる', () => {
      const result = rpcSpotResponseToUserSpotSearchResult({
        ...baseRow,
        image_urls: null,
      });
      expect(result.image_urls).toBeUndefined();
    });
  });

  // -------------------------------------------------------
  // thumbnail のフォールバック
  // -------------------------------------------------------
  describe('thumbnail のフォールバック', () => {
    it('thumbnail_image_id が空文字の場合は null になる', () => {
      const result = rpcSpotResponseToUserSpotSearchResult({
        ...baseRow,
        thumbnail_image_id: '',
      });
      expect(result.thumbnail_image_id).toBeNull();
    });

    it('thumbnail_image_id が null の場合は null になる', () => {
      const result = rpcSpotResponseToUserSpotSearchResult({
        ...baseRow,
        thumbnail_image_id: null,
      });
      expect(result.thumbnail_image_id).toBeNull();
    });
  });
});

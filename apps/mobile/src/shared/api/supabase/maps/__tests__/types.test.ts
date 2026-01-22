/**
 * maps/types.ts のテスト
 *
 * mapResponseToMapWithUser関数のテスト
 */

import { mapResponseToMapWithUser, type SupabaseMapResponse } from '../types';

describe('mapResponseToMapWithUser', () => {
  const baseResponse: SupabaseMapResponse = {
    id: 'map-123',
    user_id: 'user-456',
    name: 'テストマップ',
    description: 'マップの説明',
    category_id: 'cat-789',
    is_public: true,
    is_official: false,
    thumbnail_url: 'https://example.com/thumb.jpg',
    spots_count: 10,
    likes_count: 5,
    bookmarks_count: 3,
    comments_count: 2,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    article_intro: null,
    article_outro: null,
    show_label_chips: true,
    language: 'ja',
    users: {
      id: 'user-456',
      username: 'testuser',
      display_name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg',
    },
  };

  describe('基本的な変換', () => {
    it('すべてのフィールドを正しく変換する', () => {
      const result = mapResponseToMapWithUser(baseResponse);

      expect(result.id).toBe('map-123');
      expect(result.user_id).toBe('user-456');
      expect(result.name).toBe('テストマップ');
      expect(result.description).toBe('マップの説明');
      expect(result.category_id).toBe('cat-789');
      expect(result.is_public).toBe(true);
      expect(result.is_official).toBe(false);
      expect(result.thumbnail_url).toBe('https://example.com/thumb.jpg');
      expect(result.spots_count).toBe(10);
      expect(result.likes_count).toBe(5);
      expect(result.bookmarks_count).toBe(3);
      expect(result.comments_count).toBe(2);
      expect(result.created_at).toBe('2024-01-01T00:00:00Z');
      expect(result.updated_at).toBe('2024-01-02T00:00:00Z');
    });

    it('ユーザー情報を正しく変換する', () => {
      const result = mapResponseToMapWithUser(baseResponse);

      expect(result.user).toEqual({
        id: 'user-456',
        username: 'testuser',
        display_name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
      });
    });

    it('記事関連フィールドを正しく変換する', () => {
      const result = mapResponseToMapWithUser(baseResponse);

      expect(result.article_intro).toBeNull();
      expect(result.article_outro).toBeNull();
    });

    it('その他のフィールドを正しく変換する', () => {
      const result = mapResponseToMapWithUser(baseResponse);

      expect(result.show_label_chips).toBe(true);
      expect(result.language).toBe('ja');
    });
  });

  describe('nullやundefinedのデフォルト値', () => {
    it('bookmarks_countがnullの場合は0', () => {
      const response = { ...baseResponse, bookmarks_count: null as any };
      const result = mapResponseToMapWithUser(response);
      expect(result.bookmarks_count).toBe(0);
    });

    it('comments_countがnullの場合は0', () => {
      const response = { ...baseResponse, comments_count: null as any };
      const result = mapResponseToMapWithUser(response);
      expect(result.comments_count).toBe(0);
    });

    it('article_introがnullの場合はnull', () => {
      const response = { ...baseResponse, article_intro: null };
      const result = mapResponseToMapWithUser(response);
      expect(result.article_intro).toBeNull();
    });

    it('article_outroがnullの場合はnull', () => {
      const response = { ...baseResponse, article_outro: null };
      const result = mapResponseToMapWithUser(response);
      expect(result.article_outro).toBeNull();
    });

    it('show_label_chipsがnullの場合はfalse', () => {
      const response = { ...baseResponse, show_label_chips: null as any };
      const result = mapResponseToMapWithUser(response);
      expect(result.show_label_chips).toBe(false);
    });

    it('languageがnullの場合はnull', () => {
      const response = { ...baseResponse, language: null };
      const result = mapResponseToMapWithUser(response);
      expect(result.language).toBeNull();
    });
  });

  describe('ユーザー情報がない場合', () => {
    it('usersがundefinedの場合はnull', () => {
      const response = { ...baseResponse, users: undefined };
      const result = mapResponseToMapWithUser(response);
      expect(result.user).toBeNull();
    });
  });

  describe('undefinedフィールドの処理', () => {
    it('bookmarks_countがundefinedの場合は0', () => {
      const response = { ...baseResponse, bookmarks_count: undefined as any };
      const result = mapResponseToMapWithUser(response);
      expect(result.bookmarks_count).toBe(0);
    });

    it('comments_countがundefinedの場合は0', () => {
      const response = { ...baseResponse, comments_count: undefined as any };
      const result = mapResponseToMapWithUser(response);
      expect(result.comments_count).toBe(0);
    });

    it('show_label_chipsがundefinedの場合はfalse', () => {
      const response = { ...baseResponse, show_label_chips: undefined as any };
      const result = mapResponseToMapWithUser(response);
      expect(result.show_label_chips).toBe(false);
    });
  });

  describe('最小限のデータ', () => {
    it('必須フィールドのみでも変換できる', () => {
      const minimalResponse: SupabaseMapResponse = {
        id: 'map-min',
        user_id: 'user-min',
        name: '最小マップ',
        description: null,
        category_id: null,
        is_public: false,
        is_official: false,
        thumbnail_url: null,
        spots_count: 0,
        likes_count: 0,
        bookmarks_count: null as any,
        comments_count: null as any,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        article_intro: null,
        article_outro: null,
        show_label_chips: null as any,
        language: null,
      };

      const result = mapResponseToMapWithUser(minimalResponse);

      expect(result.id).toBe('map-min');
      expect(result.name).toBe('最小マップ');
      expect(result.description).toBeNull();
      expect(result.bookmarks_count).toBe(0);
      expect(result.comments_count).toBe(0);
      expect(result.show_label_chips).toBe(false);
      expect(result.user).toBeNull();
    });
  });
});

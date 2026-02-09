/**
 * 結合テスト: ブックマークの楽観的更新
 *
 * useBookmarkMap, useUnbookmarkMapFromFolder が
 * MSW でモックした API と正しく連携することを検証
 */

import React from 'react';
import { http, HttpResponse } from 'msw';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { server } from '@/shared/lib/test/msw/server';
import { I18nProvider } from '@/shared/lib/providers/I18nProvider';
import { mockMaps, mockUsers } from '@/shared/lib/test/msw/fixtures/index';
import { useBookmarkMap, useUnbookmarkMapFromFolder } from '@/entities/bookmark/api/use-toggle-map-bookmark';
import { QUERY_KEYS } from '@/shared/api/query-client';
import type { MapWithUser } from '@/shared/types';

const SUPABASE_URL = 'https://test.supabase.co';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity, staleTime: Infinity },
      mutations: { retry: false },
    },
  });
}

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <I18nProvider>{children}</I18nProvider>
      </QueryClientProvider>
    );
  };
}

function createMapWithUser(overrides: Partial<MapWithUser> = {}): MapWithUser {
  const user = mockUsers[0]!;
  return {
    ...mockMaps[0],
    user: { id: user.id, username: user.username, display_name: user.display_name, avatar_url: user.avatar_url, avatar_crop: null },
    is_liked: false,
    is_bookmarked: false,
    tags: [],
    ...overrides,
  } as MapWithUser;
}

function seedMapFeed(queryClient: QueryClient, maps: MapWithUser[]) {
  queryClient.setQueryData(QUERY_KEYS.mapsFeed(), { pages: [maps], pageParams: [undefined] });
}

describe('ブックマーク楽観的更新 結合テスト', () => {
  it('マップをブックマークできる（bookmarks_count +1）', async () => {
    const queryClient = createTestQueryClient();
    seedMapFeed(queryClient, [createMapWithUser({ is_bookmarked: false, bookmarks_count: 3 })]);

    server.use(
      http.post(`${SUPABASE_URL}/rest/v1/bookmarks`, async () => {
        return HttpResponse.json({
          id: 'bookmark-1',
          user_id: 'user-1',
          map_id: 'map-1',
          folder_id: null,
        }, { status: 201 });
      }),
    );

    const { result } = renderHook(() => useBookmarkMap(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({ userId: 'user-1', mapId: 'map-1' });
    });

    // 楽観的更新でキャッシュが即座に変わることを検証
    const feedData = queryClient.getQueryData<{ pages: MapWithUser[][] }>(QUERY_KEYS.mapsFeed());
    const map = feedData?.pages[0]?.[0];
    expect(map?.is_bookmarked).toBe(true);
    expect(map?.bookmarks_count).toBe(4); // 3 + 1
  });

  it('ブックマークを解除できる', async () => {
    const queryClient = createTestQueryClient();
    seedMapFeed(queryClient, [createMapWithUser({ is_bookmarked: true, bookmarks_count: 3 })]);
    queryClient.setQueryData(QUERY_KEYS.bookmarkInfo('map', 'user-1', 'map-1'), [
      { id: 'bookmark-1', folder_id: null },
    ]);

    server.use(
      http.delete(`${SUPABASE_URL}/rest/v1/bookmarks`, () => {
        return HttpResponse.json([], { status: 200 });
      }),
    );

    const { result } = renderHook(() => useUnbookmarkMapFromFolder(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({ userId: 'user-1', mapId: 'map-1', folderId: null });
    });

    // 全フォルダから削除 → bookmarks_count が -1
    const feedData = queryClient.getQueryData<{ pages: MapWithUser[][] }>(QUERY_KEYS.mapsFeed());
    const map = feedData?.pages[0]?.[0];
    expect(map?.is_bookmarked).toBe(false);
    expect(map?.bookmarks_count).toBe(2); // 3 - 1
  });

  it('APIエラー時にロールバックされる', async () => {
    const queryClient = createTestQueryClient();
    seedMapFeed(queryClient, [createMapWithUser({ is_bookmarked: false, bookmarks_count: 3 })]);

    server.use(
      http.post(`${SUPABASE_URL}/rest/v1/bookmarks`, () => {
        return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useBookmarkMap(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({ userId: 'user-1', mapId: 'map-1' });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // ロールバック: 元の状態に戻る
    const feedData = queryClient.getQueryData<{ pages: MapWithUser[][] }>(QUERY_KEYS.mapsFeed());
    const map = feedData?.pages[0]?.[0];
    expect(map?.is_bookmarked).toBe(false);
    expect(map?.bookmarks_count).toBe(3); // 元の値
  });
});

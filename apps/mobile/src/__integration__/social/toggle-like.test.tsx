/**
 * 結合テスト: いいねの楽観的更新
 *
 * useToggleMapLike が MSW でモックした API と正しく連携し、
 * 楽観的更新とロールバックが動作することを検証
 */

import React from 'react';
import { http, HttpResponse } from 'msw';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { server } from '@/shared/lib/test/msw/server';
import { mockMaps, mockUsers } from '@/shared/lib/test/msw/fixtures/index';
import { useToggleMapLike } from '@/entities/like/api/use-toggle-map-like';
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
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

function createMapWithUser(overrides: Partial<MapWithUser> = {}): MapWithUser {
  const user = mockUsers[0];
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

describe('いいね楽観的更新 結合テスト', () => {
  it('いいねを追加できる（likes_count +1, is_liked = true）', async () => {
    const queryClient = createTestQueryClient();
    seedMapFeed(queryClient, [createMapWithUser({ is_liked: false, likes_count: 10 })]);

    // checkMapLiked → 未いいね → addMapLike
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/likes`, ({ request }) => {
        const accept = request.headers.get('accept');
        if (accept?.includes('vnd.pgrst.object')) {
          return new HttpResponse(null, { status: 406 });
        }
        return HttpResponse.json([]);
      }),
      http.post(`${SUPABASE_URL}/rest/v1/likes`, async () => {
        return HttpResponse.json({ id: 'like-1', user_id: 'user-1', map_id: 'map-1' }, { status: 201 });
      }),
    );

    const { result } = renderHook(() => useToggleMapLike(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({ userId: 'user-1', mapId: 'map-1', isLiked: false });
    });

    // 楽観的更新でキャッシュが即座に変わることを検証
    const feedData = queryClient.getQueryData<{ pages: MapWithUser[][] }>(QUERY_KEYS.mapsFeed());
    const map = feedData?.pages[0]?.[0];
    expect(map?.is_liked).toBe(true);
    expect(map?.likes_count).toBe(11); // 10 + 1
  });

  it('いいねを解除できる（likes_count -1, is_liked = false）', async () => {
    const queryClient = createTestQueryClient();
    seedMapFeed(queryClient, [createMapWithUser({ is_liked: true, likes_count: 10 })]);

    // checkMapLiked → いいね済み → removeMapLike
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/likes`, ({ request }) => {
        const accept = request.headers.get('accept');
        if (accept?.includes('vnd.pgrst.object')) {
          return HttpResponse.json({ id: 'like-1' });
        }
        return HttpResponse.json([{ id: 'like-1' }]);
      }),
      http.delete(`${SUPABASE_URL}/rest/v1/likes`, () => {
        return HttpResponse.json([], { status: 200 });
      }),
    );

    const { result } = renderHook(() => useToggleMapLike(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({ userId: 'user-1', mapId: 'map-1', isLiked: true });
    });

    // 楽観的更新: is_liked が false に、likes_count が -1
    const feedData = queryClient.getQueryData<{ pages: MapWithUser[][] }>(QUERY_KEYS.mapsFeed());
    const map = feedData?.pages[0]?.[0];
    expect(map?.is_liked).toBe(false);
    expect(map?.likes_count).toBe(9); // 10 - 1
  });

  it('APIエラー時にロールバックされる', async () => {
    const queryClient = createTestQueryClient();
    seedMapFeed(queryClient, [createMapWithUser({ is_liked: false, likes_count: 10 })]);

    // checkMapLiked → 未いいね → addMapLike でエラー
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/likes`, ({ request }) => {
        const accept = request.headers.get('accept');
        if (accept?.includes('vnd.pgrst.object')) {
          return new HttpResponse(null, { status: 406 });
        }
        return HttpResponse.json([]);
      }),
      http.post(`${SUPABASE_URL}/rest/v1/likes`, () => {
        return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useToggleMapLike(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({ userId: 'user-1', mapId: 'map-1', isLiked: false });
    });

    // エラーが発生
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // ロールバック: 元の状態に戻る
    const feedData = queryClient.getQueryData<{ pages: MapWithUser[][] }>(QUERY_KEYS.mapsFeed());
    const map = feedData?.pages[0]?.[0];
    expect(map?.is_liked).toBe(false);
    expect(map?.likes_count).toBe(10); // 元の値
  });
});

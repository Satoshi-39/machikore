/**
 * 結合テスト: マップ CRUD 操作
 *
 * useCreateMap, useUpdateMap, useDeleteMap, useMap が
 * MSW でモックした API と正しく連携することを検証
 */

import React from 'react';
import { http, HttpResponse } from 'msw';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { server } from '@/shared/lib/test/msw/server';
import { mockMaps, mockUsers } from '@/shared/lib/test/msw/fixtures/index';
import { useCreateMap } from '@/entities/map/api/use-create-map';
import { useUpdateMap } from '@/entities/map/api/use-update-map';
import { useDeleteMap } from '@/entities/map/api/use-delete-map';
import { useMap } from '@/entities/map/api/use-map';

const SUPABASE_URL = 'https://test.supabase.co';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

function createWrapper() {
  const queryClient = createTestQueryClient();
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

// detect-language Edge Function のモック
const detectLanguageHandler = http.post(
  `${SUPABASE_URL}/functions/v1/detect-language`,
  () => HttpResponse.json({ language: 'ja' }),
);

describe('マップ CRUD 結合テスト', () => {
  it('マップを作成できる', async () => {
    const user = mockUsers[0];
    const createdMapResponse = {
      ...mockMaps[0],
      id: 'new-map-id',
      name: '新しいマップ',
      spots_count: 0,
      likes_count: 0,
      bookmarks_count: 0,
      comments_count: 0,
      users: {
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
      },
    };

    server.use(
      detectLanguageHandler,
      // createMap は .select(...).single() を使う → single object を返す
      http.post(`${SUPABASE_URL}/rest/v1/maps`, async () => {
        return HttpResponse.json(createdMapResponse, {
          status: 201,
          headers: { 'Content-Range': '*/1' },
        });
      }),
    );

    const { result } = renderHook(() => useCreateMap(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        userId: 'user-1',
        name: '新しいマップ',
        categoryId: 'category-1',
        isPublic: true,
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.name).toBe('新しいマップ');
    expect(result.current.data?.user?.username).toBe('testuser1');
  });

  it('マップを更新できる', async () => {
    const updatedMap = {
      ...mockMaps[0],
      name: '更新されたマップ名',
      updated_at: new Date().toISOString(),
      users: {
        id: mockUsers[0].id,
        username: mockUsers[0].username,
        display_name: mockUsers[0].display_name,
        avatar_url: mockUsers[0].avatar_url,
      },
    };

    server.use(
      detectLanguageHandler,
      http.patch(`${SUPABASE_URL}/rest/v1/maps`, async () => {
        return HttpResponse.json(updatedMap);
      }),
    );

    const { result } = renderHook(() => useUpdateMap(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        id: 'map-1',
        name: '更新されたマップ名',
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('マップを削除できる', async () => {
    server.use(
      http.delete(`${SUPABASE_URL}/rest/v1/maps`, () => {
        return HttpResponse.json([], { status: 200 });
      }),
    );

    const { result } = renderHook(() => useDeleteMap(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate('map-1');
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('map-1');
  });

  it('単一マップを取得できる', async () => {
    const map = mockMaps[0];
    const user = mockUsers.find((u) => u.id === map.user_id);

    server.use(
      // getMapById は .from('maps').select(...).eq('id', mapId).single() を使う
      // Supabase は GET /rest/v1/maps?id=eq.map-1&select=... で送信
      http.get(`${SUPABASE_URL}/rest/v1/maps`, ({ request }) => {
        const url = new URL(request.url);
        const idParam = url.searchParams.get('id');
        const accept = request.headers.get('accept');

        // .single() の場合、Accept: application/vnd.pgrst.object+json が送信される
        if (idParam?.includes('map-1') && accept?.includes('vnd.pgrst.object')) {
          return HttpResponse.json({
            ...map,
            users: user ? {
              id: user.id,
              username: user.username,
              display_name: user.display_name,
              avatar_url: user.avatar_url,
            } : null,
            map_tags: [],
            likes: [],
            bookmarks: [],
          });
        }
        return HttpResponse.json([]);
      }),
    );

    const { result } = renderHook(() => useMap('map-1', 'user-1'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.id).toBe('map-1');
    expect(result.current.data?.name).toBe('東京のおすすめカフェ');
    expect(result.current.data?.user).toBeDefined();
    expect(result.current.data?.user?.username).toBe('testuser1');
  });
});

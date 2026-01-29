/**
 * 結合テスト: フィードマップ取得
 *
 * useFeedMaps hook が MSW でモックした API と正しく連携することを検証
 */

import React from 'react';
import { http, HttpResponse } from 'msw';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { server } from '@/shared/lib/test/msw/server';
import { mockMaps, mockUsers } from '@/shared/lib/test/msw/fixtures/index';
import { useFeedMaps } from '@/entities/map/api/use-feed-maps';

const SUPABASE_URL = 'https://test.supabase.co';

// テスト用 QueryClient
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
    },
  });
}

// ラッパーコンポーネント
function createWrapper() {
  const queryClient = createTestQueryClient();
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useFeedMaps 結合テスト', () => {
  it('公開マップ一覧を取得できる', async () => {
    const publicMaps = mockMaps.filter((m) => m.is_public);
    const mapsWithUsers = publicMaps.map((map) => ({
      ...map,
      users: mockUsers.find((u) => u.id === map.user_id) || null,
    }));

    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/maps_public`, () => {
        return HttpResponse.json(mapsWithUsers);
      }),
    );

    const { result } = renderHook(() => useFeedMaps(), {
      wrapper: createWrapper(),
    });

    // 初期状態は loading
    expect(result.current.isLoading).toBe(true);

    // データ取得完了を待つ
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // 公開マップが取得されている
    expect(result.current.data?.pages[0]?.length).toBe(publicMaps.length);
  });

  it('APIエラー時にエラー状態になる', async () => {
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/maps_public`, () => {
        return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useFeedMaps(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it('マップにユーザー情報が含まれる', async () => {
    const publicMaps = mockMaps.filter((m) => m.is_public);
    const mapsWithUsers = publicMaps.map((map) => ({
      ...map,
      users: mockUsers.find((u) => u.id === map.user_id) || null,
    }));

    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/maps_public`, () => {
        return HttpResponse.json(mapsWithUsers);
      }),
    );

    const { result } = renderHook(() => useFeedMaps(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const maps = result.current.data?.pages[0] ?? [];
    expect(maps.length).toBeGreaterThan(0);

    // 各マップにユーザー情報が結合されている
    maps.forEach((map) => {
      if (map.user) {
        expect(map.user).toHaveProperty('id');
        expect(map.user).toHaveProperty('username');
        expect(map.user).toHaveProperty('display_name');
      }
    });
  });

  it('空の結果を正しく処理できる', async () => {
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/maps_public`, () => {
        return HttpResponse.json([]);
      }),
    );

    const { result } = renderHook(() => useFeedMaps(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.pages[0]).toEqual([]);
  });
});

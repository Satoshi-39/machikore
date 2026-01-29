/**
 * 結合テスト: 混合フィード取得
 *
 * useMixedFeed, useFollowingMixedFeed が
 * MSW でモックした RPC と正しく連携することを検証
 */

import React from 'react';
import { http, HttpResponse } from 'msw';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { server } from '@/shared/lib/test/msw/server';
import { mockMixedFeedResponse } from '@/shared/lib/test/msw/fixtures/index';
import { useMixedFeed, useFollowingMixedFeed } from '@/entities/mixed-feed/api/use-mixed-feed';

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

describe('混合フィード 結合テスト', () => {
  it('おすすめフィードを取得できる', async () => {
    server.use(
      http.post(`${SUPABASE_URL}/rest/v1/rpc/get_mixed_feed`, () => {
        return HttpResponse.json(mockMixedFeedResponse);
      }),
    );

    const { result } = renderHook(
      () => useMixedFeed({ showAds: false }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const items = result.current.data?.pages[0] ?? [];
    expect(items.length).toBe(2);

    // マップアイテムの検証
    const mapItem = items.find((item) => item.type === 'map');
    expect(mapItem).toBeDefined();
    expect(mapItem?.type).toBe('map');
    if (mapItem?.type === 'map') {
      expect(mapItem.data.id).toBe('map-1');
      expect(mapItem.data.name).toBe('東京のおすすめカフェ');
      expect(mapItem.data.user).toBeDefined();
      expect(mapItem.data.user?.username).toBe('testuser1');
    }

    // スポットアイテムの検証
    const spotItem = items.find((item) => item.type === 'spot');
    expect(spotItem).toBeDefined();
    expect(spotItem?.type).toBe('spot');
    if (spotItem?.type === 'spot') {
      expect(spotItem.data.id).toBe('spot-1');
      expect(spotItem.data.description).toBe('スタバ渋谷');
      expect(spotItem.displayType).toBe('card');
    }
  });

  it('フォロー中フィードを取得できる', async () => {
    server.use(
      http.post(`${SUPABASE_URL}/rest/v1/rpc/get_following_mixed_feed`, () => {
        return HttpResponse.json(mockMixedFeedResponse);
      }),
    );

    const { result } = renderHook(
      () => useFollowingMixedFeed({ userId: 'user-1', showAds: false }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const items = result.current.data?.pages[0] ?? [];
    expect(items.length).toBeGreaterThan(0);
  });

  it('空のフィードを処理できる', async () => {
    server.use(
      http.post(`${SUPABASE_URL}/rest/v1/rpc/get_mixed_feed`, () => {
        return HttpResponse.json([]);
      }),
    );

    const { result } = renderHook(
      () => useMixedFeed({ showAds: false }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.pages[0]).toEqual([]);
  });

  it('APIエラー時にエラー状態になる', async () => {
    server.use(
      http.post(`${SUPABASE_URL}/rest/v1/rpc/get_mixed_feed`, () => {
        return HttpResponse.json(
          { message: 'Internal Server Error' },
          { status: 500 },
        );
      }),
    );

    const { result } = renderHook(
      () => useMixedFeed({ showAds: false }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

/**
 * 結合テスト: コレクションマップ追加/削除の楽観的更新
 *
 * useAddMapToCollection, useRemoveMapFromCollection の
 * 楽観的更新とロールバックを検証
 */

import React from 'react';
import { http, HttpResponse } from 'msw';
import { QueryClient, QueryClientProvider, type InfiniteData } from '@tanstack/react-query';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { server } from '@/shared/lib/test/msw/server';
import { I18nProvider } from '@/shared/lib/providers/I18nProvider';
import { QUERY_KEYS } from '@/shared/api/query-client';
import {
  useAddMapToCollection,
  useRemoveMapFromCollection,
} from '@/entities/collection/api/use-collection-maps';
import type { CollectionMapWithDetails, CollectionWithUser } from '@/shared/api/supabase/collections';

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

const mockCollectionMap: CollectionMapWithDetails = {
  id: 'cm-1',
  collection_id: 'collection-1',
  map_id: 'map-1',
  order_index: 0,
  created_at: '2024-06-01T00:00:00Z',
  map: {
    id: 'map-1',
    user_id: 'user-1',
    name: 'テストマップ',
    description: null,
    thumbnail_url: null,
    spots_count: 3,
    likes_count: 0,
    bookmarks_count: 0,
    is_public: true,
    created_at: '2024-06-01T00:00:00Z',
    user: { id: 'user-1', username: 'testuser', display_name: 'Test User', avatar_url: null },
  },
};

const mockCollectionDetail: CollectionWithUser = {
  id: 'collection-1',
  user_id: 'user-1',
  name: 'テストコレクション',
  description: null,
  thumbnail_url: null,
  thumbnail_crop: null,
  is_public: true,
  maps_count: 1,
  likes_count: 0,
  order_index: 0,
  created_at: '2024-06-01T00:00:00Z',
  updated_at: '2024-06-01T00:00:00Z',
  user: { id: 'user-1', username: 'testuser', display_name: 'Test User', avatar_url: null },
};

function setupCaches(queryClient: QueryClient, maps: CollectionMapWithDetails[], detail: CollectionWithUser) {
  queryClient.setQueryData<InfiniteData<CollectionMapWithDetails[]>>(
    QUERY_KEYS.collectionMapsList('collection-1'),
    { pages: [maps], pageParams: [undefined] }
  );
  queryClient.setQueryData<CollectionWithUser>(
    QUERY_KEYS.collectionsDetail('collection-1'),
    detail
  );
}

describe('コレクションマップ楽観的更新 結合テスト', () => {
  it('マップ追加時にキャッシュが楽観的に更新される（maps_count +1）', async () => {
    const queryClient = createTestQueryClient();
    setupCaches(queryClient, [mockCollectionMap], mockCollectionDetail);

    server.use(
      http.post(`${SUPABASE_URL}/rest/v1/collection_maps`, () => {
        return HttpResponse.json({}, { status: 201 });
      }),
    );

    const { result } = renderHook(() => useAddMapToCollection(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({
        collectionId: 'collection-1',
        mapId: 'map-2',
        userId: 'user-1',
      });
    });

    // 楽観的更新: マップ一覧に新しいエントリが追加される
    const mapsCache = queryClient.getQueryData<InfiniteData<CollectionMapWithDetails[]>>(
      QUERY_KEYS.collectionMapsList('collection-1')
    );
    expect(mapsCache?.pages[0]?.length).toBe(2);
    expect(mapsCache?.pages[0]?.[1]?.map_id).toBe('map-2');

    // maps_countが+1されている
    const detailCache = queryClient.getQueryData<CollectionWithUser>(
      QUERY_KEYS.collectionsDetail('collection-1')
    );
    expect(detailCache?.maps_count).toBe(2);
  });

  it('マップ削除時にキャッシュが楽観的に更新される（maps_count -1）', async () => {
    const queryClient = createTestQueryClient();
    setupCaches(queryClient, [mockCollectionMap], mockCollectionDetail);

    server.use(
      http.delete(`${SUPABASE_URL}/rest/v1/collection_maps`, () => {
        return new HttpResponse(null, { status: 204 });
      }),
    );

    const { result } = renderHook(() => useRemoveMapFromCollection(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({
        collectionId: 'collection-1',
        mapId: 'map-1',
        userId: 'user-1',
      });
    });

    // 楽観的更新: マップ一覧からmap-1が削除される
    const mapsCache = queryClient.getQueryData<InfiniteData<CollectionMapWithDetails[]>>(
      QUERY_KEYS.collectionMapsList('collection-1')
    );
    expect(mapsCache?.pages[0]?.length).toBe(0);

    // maps_countが-1されている
    const detailCache = queryClient.getQueryData<CollectionWithUser>(
      QUERY_KEYS.collectionsDetail('collection-1')
    );
    expect(detailCache?.maps_count).toBe(0);
  });

  it('マップ追加失敗時にキャッシュがロールバックされる', async () => {
    const queryClient = createTestQueryClient();
    setupCaches(queryClient, [mockCollectionMap], mockCollectionDetail);

    server.use(
      http.post(`${SUPABASE_URL}/rest/v1/collection_maps`, () => {
        return HttpResponse.json(
          { message: 'Internal Server Error' },
          { status: 500 },
        );
      }),
    );

    const { result } = renderHook(() => useAddMapToCollection(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({
        collectionId: 'collection-1',
        mapId: 'map-2',
        userId: 'user-1',
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // ロールバック: 元のデータに戻っている
    const mapsCache = queryClient.getQueryData<InfiniteData<CollectionMapWithDetails[]>>(
      QUERY_KEYS.collectionMapsList('collection-1')
    );
    expect(mapsCache?.pages[0]?.length).toBe(1);
    expect(mapsCache?.pages[0]?.[0]?.map_id).toBe('map-1');

    const detailCache = queryClient.getQueryData<CollectionWithUser>(
      QUERY_KEYS.collectionsDetail('collection-1')
    );
    expect(detailCache?.maps_count).toBe(1);
  });
});

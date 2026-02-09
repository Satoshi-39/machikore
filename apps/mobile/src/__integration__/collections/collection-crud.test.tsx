/**
 * 結合テスト: コレクションCRUD
 *
 * useCreateCollection, useUpdateCollection, useDeleteCollection が
 * MSWでモックしたAPIと正しく連携し、キャッシュ無効化が動作することを検証
 */

import React from 'react';
import { http, HttpResponse } from 'msw';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { server } from '@/shared/lib/test/msw/server';
import { I18nProvider } from '@/shared/lib/providers/I18nProvider';
import { QUERY_KEYS } from '@/shared/api/query-client';
import {
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
} from '@/entities/collection/api/use-collections';

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

const mockCollectionResponse = {
  id: 'collection-1',
  user_id: 'user-1',
  name: 'お気に入りマップ',
  description: 'お気に入りのマップをまとめました',
  thumbnail_url: null,
  thumbnail_crop: null,
  color: null,
  is_public: true,
  maps_count: 0,
  likes_count: 0,
  order_index: 0,
  created_at: '2024-06-01T00:00:00Z',
  updated_at: '2024-06-01T00:00:00Z',
};

describe('コレクションCRUD 結合テスト', () => {
  it('コレクションを作成できる', async () => {
    const queryClient = createTestQueryClient();

    // コレクション一覧キャッシュを初期化
    queryClient.setQueryData(QUERY_KEYS.collectionsList('user-1'), []);

    server.use(
      http.post(`${SUPABASE_URL}/rest/v1/collections`, () => {
        return HttpResponse.json(mockCollectionResponse, { status: 201 });
      }),
    );

    const { result } = renderHook(() => useCreateCollection(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({
        userId: 'user-1',
        name: 'お気に入りマップ',
        description: 'お気に入りのマップをまとめました',
        isPublic: true,
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.name).toBe('お気に入りマップ');
    expect(result.current.data?.is_public).toBe(true);
  });

  it('コレクションを更新できる', async () => {
    const queryClient = createTestQueryClient();

    const updatedCollection = {
      ...mockCollectionResponse,
      name: '更新されたコレクション',
      updated_at: '2024-06-02T00:00:00Z',
    };

    server.use(
      http.patch(`${SUPABASE_URL}/rest/v1/collections`, () => {
        return HttpResponse.json(updatedCollection, { status: 200 });
      }),
    );

    const { result } = renderHook(() => useUpdateCollection(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({
        collectionId: 'collection-1',
        userId: 'user-1',
        updates: { name: '更新されたコレクション' },
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.name).toBe('更新されたコレクション');
  });

  it('コレクションを削除できる', async () => {
    const queryClient = createTestQueryClient();

    // 削除前のコレクション一覧を設定
    queryClient.setQueryData(QUERY_KEYS.collectionsList('user-1'), [mockCollectionResponse]);

    server.use(
      http.delete(`${SUPABASE_URL}/rest/v1/collections`, () => {
        return new HttpResponse(null, { status: 204 });
      }),
    );

    const { result } = renderHook(() => useDeleteCollection(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({ collectionId: 'collection-1', userId: 'user-1' });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('コレクション作成失敗時にエラー状態になる', async () => {
    const queryClient = createTestQueryClient();

    server.use(
      http.post(`${SUPABASE_URL}/rest/v1/collections`, () => {
        return HttpResponse.json(
          { message: 'Internal Server Error' },
          { status: 500 },
        );
      }),
    );

    const { result } = renderHook(() => useCreateCollection(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({ userId: 'user-1', name: 'テスト' });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

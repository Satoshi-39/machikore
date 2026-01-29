/**
 * 結合テスト: フォローの楽観的更新
 *
 * useFollowUser, useUnfollowUser が
 * MSW でモックした API と正しく連携することを検証
 */

import React from 'react';
import { http, HttpResponse } from 'msw';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { server } from '@/shared/lib/test/msw/server';
import { useFollowUser, useUnfollowUser } from '@/entities/follow/api/use-follow-operations';
import { QUERY_KEYS } from '@/shared/api/query-client';

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

describe('フォロー楽観的更新 結合テスト', () => {
  it('ユーザーをフォローできる（followers_count +1）', async () => {
    const queryClient = createTestQueryClient();
    // フォロー数キャッシュをセット
    queryClient.setQueryData(QUERY_KEYS.followCounts('user-2'), {
      followers: 10,
      following: 5,
    });

    server.use(
      http.post(`${SUPABASE_URL}/rest/v1/follows`, async () => {
        return HttpResponse.json({
          id: 'follow-1',
          follower_id: 'user-1',
          followee_id: 'user-2',
        }, { status: 201 });
      }),
    );

    const { result } = renderHook(() => useFollowUser(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({ followerId: 'user-1', followeeId: 'user-2' });
    });

    // 楽観的更新: followStatus が true になる
    await waitFor(() => {
      const status = queryClient.getQueryData<boolean>(
        QUERY_KEYS.followStatus('user-1', 'user-2'),
      );
      expect(status).toBe(true);
    });

    // 楽観的更新: followers が +1
    const counts = queryClient.getQueryData<{ followers: number; following: number }>(
      QUERY_KEYS.followCounts('user-2'),
    );
    expect(counts?.followers).toBe(11); // 10 + 1

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('フォローを解除できる（followers_count -1）', async () => {
    const queryClient = createTestQueryClient();
    // フォロー済み状態でキャッシュをセット
    queryClient.setQueryData(QUERY_KEYS.followStatus('user-1', 'user-2'), true);
    queryClient.setQueryData(QUERY_KEYS.followCounts('user-2'), {
      followers: 10,
      following: 5,
    });

    server.use(
      http.delete(`${SUPABASE_URL}/rest/v1/follows`, () => {
        return HttpResponse.json([], { status: 200 });
      }),
    );

    const { result } = renderHook(() => useUnfollowUser(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({ followerId: 'user-1', followeeId: 'user-2' });
    });

    // 楽観的更新: followStatus が false になる
    await waitFor(() => {
      const status = queryClient.getQueryData<boolean>(
        QUERY_KEYS.followStatus('user-1', 'user-2'),
      );
      expect(status).toBe(false);
    });

    // 楽観的更新: followers が -1
    const counts = queryClient.getQueryData<{ followers: number; following: number }>(
      QUERY_KEYS.followCounts('user-2'),
    );
    expect(counts?.followers).toBe(9); // 10 - 1

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('APIエラー時にロールバックされる', async () => {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(QUERY_KEYS.followStatus('user-1', 'user-2'), false);
    queryClient.setQueryData(QUERY_KEYS.followCounts('user-2'), {
      followers: 10,
      following: 5,
    });

    server.use(
      http.post(`${SUPABASE_URL}/rest/v1/follows`, () => {
        return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useFollowUser(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({ followerId: 'user-1', followeeId: 'user-2' });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // ロールバック: followStatus が元に戻る
    const status = queryClient.getQueryData<boolean>(
      QUERY_KEYS.followStatus('user-1', 'user-2'),
    );
    expect(status).toBe(false);

    // ロールバック: followers が元に戻る
    const counts = queryClient.getQueryData<{ followers: number; following: number }>(
      QUERY_KEYS.followCounts('user-2'),
    );
    expect(counts?.followers).toBe(10);
  });
});

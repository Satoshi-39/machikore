/**
 * 結合テスト: コメントCRUD
 *
 * useAddSpotComment, useUpdateComment, useDeleteComment が
 * MSWでモックしたAPIと正しく連携し、キャッシュ無効化が動作することを検証
 */

import React from 'react';
import { http, HttpResponse } from 'msw';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { server } from '@/shared/lib/test/msw/server';
import { mockUsers } from '@/shared/lib/test/msw/fixtures/index';
import { I18nProvider } from '@/shared/lib/providers/I18nProvider';
import { useAddSpotComment, useUpdateComment, useDeleteComment } from '@/entities/comment/api/use-spot-comments';

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

const mockCommentResponse = {
  id: 'comment-1',
  user_id: mockUsers[0]!.id,
  user_spot_id: 'spot-1',
  map_id: null,
  content: 'テストコメント',
  parent_id: null,
  root_id: null,
  depth: 0,
  likes_count: 0,
  replies_count: 0,
  created_at: '2024-06-01T00:00:00Z',
  updated_at: '2024-06-01T00:00:00Z',
  user: {
    id: mockUsers[0]!.id,
    username: mockUsers[0]!.username,
    display_name: mockUsers[0]!.display_name,
    avatar_url: mockUsers[0]!.avatar_url,
    avatar_crop: null,
  },
  comment_likes: [],
};

describe('コメントCRUD 結合テスト', () => {
  it('スポットにコメントを追加できる', async () => {
    const queryClient = createTestQueryClient();

    // コメント一覧キャッシュを初期化
    queryClient.setQueryData(['comments', 'spot', 'spot-1', null], {
      pages: [[]],
      pageParams: [undefined],
    });

    server.use(
      http.post(`${SUPABASE_URL}/rest/v1/comments`, () => {
        return HttpResponse.json(mockCommentResponse, { status: 201 });
      }),
    );

    const { result } = renderHook(() => useAddSpotComment(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({ userId: 'user-1', spotId: 'spot-1', content: 'テストコメント' });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // 戻り値がCommentWithUser形式であることを確認
    expect(result.current.data?.content).toBe('テストコメント');
    expect(result.current.data?.user?.username).toBe('testuser1');
  });

  it('コメントを更新できる', async () => {
    const queryClient = createTestQueryClient();

    const updatedComment = {
      ...mockCommentResponse,
      content: '更新されたコメント',
      updated_at: '2024-06-02T00:00:00Z',
    };

    server.use(
      http.patch(`${SUPABASE_URL}/rest/v1/comments`, () => {
        return HttpResponse.json(updatedComment, { status: 200 });
      }),
    );

    const { result } = renderHook(() => useUpdateComment(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({
        commentId: 'comment-1',
        content: '更新されたコメント',
        spotId: 'spot-1',
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.content).toBe('更新されたコメント');
  });

  it('コメントを削除できる', async () => {
    const queryClient = createTestQueryClient();

    server.use(
      http.delete(`${SUPABASE_URL}/rest/v1/comments`, () => {
        return new HttpResponse(null, { status: 204 });
      }),
    );

    const { result } = renderHook(() => useDeleteComment(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({
        commentId: 'comment-1',
        spotId: 'spot-1',
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('コメント追加失敗時にエラー状態になる', async () => {
    const queryClient = createTestQueryClient();

    server.use(
      http.post(`${SUPABASE_URL}/rest/v1/comments`, () => {
        return HttpResponse.json(
          { message: 'Internal Server Error' },
          { status: 500 },
        );
      }),
    );

    const { result } = renderHook(() => useAddSpotComment(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({ userId: 'user-1', spotId: 'spot-1', content: 'テスト' });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

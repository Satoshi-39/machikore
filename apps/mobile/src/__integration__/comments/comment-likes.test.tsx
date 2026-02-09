/**
 * 結合テスト: コメントいいね楽観的更新
 *
 * useLikeComment, useUnlikeComment の楽観的更新と
 * エラー時のロールバックを検証
 */

import React from 'react';
import { http, HttpResponse } from 'msw';
import { QueryClient, QueryClientProvider, type InfiniteData } from '@tanstack/react-query';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { server } from '@/shared/lib/test/msw/server';
import { I18nProvider } from '@/shared/lib/providers/I18nProvider';
import { useLikeComment, useUnlikeComment } from '@/entities/comment/api/use-comment-likes';
import type { CommentWithUser } from '@/shared/types';

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

const mockComment: CommentWithUser = {
  id: 'comment-1',
  user_id: 'commenter-1',
  map_id: null,
  user_spot_id: 'spot-1',
  content: 'テストコメント',
  created_at: '2024-06-01T00:00:00Z',
  updated_at: '2024-06-01T00:00:00Z',
  parent_id: null,
  root_id: null,
  depth: 0,
  likes_count: 3,
  replies_count: 0,
  user: { id: 'commenter-1', username: 'commenter', display_name: 'Commenter', avatar_url: null, avatar_crop: null },
  is_liked: false,
  is_liked_by_author: false,
  author: null,
};

function setCommentCache(
  queryClient: QueryClient,
  spotId: string,
  comments: CommentWithUser[]
) {
  const data: InfiniteData<CommentWithUser[]> = {
    pages: [comments],
    pageParams: [undefined],
  };
  queryClient.setQueryData(['comments', 'spot', spotId, null], data);
}

describe('コメントいいね楽観的更新 結合テスト', () => {
  it('いいね成功時にキャッシュが楽観的に更新される', async () => {
    const queryClient = createTestQueryClient();
    setCommentCache(queryClient, 'spot-1', [mockComment]);

    server.use(
      http.post(`${SUPABASE_URL}/rest/v1/comment_likes`, () => {
        return HttpResponse.json({}, { status: 201 });
      }),
    );

    const { result } = renderHook(() => useLikeComment(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({
        userId: 'user-1',
        commentId: 'comment-1',
        spotId: 'spot-1',
      });
    });

    // 楽観的更新: is_liked = true, likes_count + 1
    const cached = queryClient.getQueryData<InfiniteData<CommentWithUser[]>>(
      ['comments', 'spot', 'spot-1', null]
    );
    const updatedComment = cached?.pages[0]?.[0];
    expect(updatedComment?.is_liked).toBe(true);
    expect(updatedComment?.likes_count).toBe(4);
  });

  it('いいね解除成功時にキャッシュが楽観的に更新される', async () => {
    const queryClient = createTestQueryClient();
    const likedComment = { ...mockComment, is_liked: true, likes_count: 3 };
    setCommentCache(queryClient, 'spot-1', [likedComment]);

    server.use(
      http.delete(`${SUPABASE_URL}/rest/v1/comment_likes`, () => {
        return new HttpResponse(null, { status: 204 });
      }),
    );

    const { result } = renderHook(() => useUnlikeComment(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({
        userId: 'user-1',
        commentId: 'comment-1',
        spotId: 'spot-1',
      });
    });

    const cached = queryClient.getQueryData<InfiniteData<CommentWithUser[]>>(
      ['comments', 'spot', 'spot-1', null]
    );
    const updatedComment = cached?.pages[0]?.[0];
    expect(updatedComment?.is_liked).toBe(false);
    expect(updatedComment?.likes_count).toBe(2);
  });

  it('likes_count が 0 の場合に unlike しても負の値にならない', async () => {
    const queryClient = createTestQueryClient();
    const zeroLikeComment = { ...mockComment, is_liked: true, likes_count: 0 };
    setCommentCache(queryClient, 'spot-1', [zeroLikeComment]);

    server.use(
      http.delete(`${SUPABASE_URL}/rest/v1/comment_likes`, () => {
        return new HttpResponse(null, { status: 204 });
      }),
    );

    const { result } = renderHook(() => useUnlikeComment(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({
        userId: 'user-1',
        commentId: 'comment-1',
        spotId: 'spot-1',
      });
    });

    const cached = queryClient.getQueryData<InfiniteData<CommentWithUser[]>>(
      ['comments', 'spot', 'spot-1', null]
    );
    expect(cached?.pages[0]?.[0]?.likes_count).toBe(0);
  });

  it('いいねAPI失敗時にキャッシュがロールバックされる', async () => {
    const queryClient = createTestQueryClient();
    setCommentCache(queryClient, 'spot-1', [mockComment]);

    server.use(
      http.post(`${SUPABASE_URL}/rest/v1/comment_likes`, () => {
        return HttpResponse.json(
          { message: 'Internal Server Error' },
          { status: 500 },
        );
      }),
    );

    const { result } = renderHook(() => useLikeComment(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({
        userId: 'user-1',
        commentId: 'comment-1',
        spotId: 'spot-1',
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // ロールバック: 元のデータに戻っている
    const cached = queryClient.getQueryData<InfiniteData<CommentWithUser[]>>(
      ['comments', 'spot', 'spot-1', null]
    );
    const rolledBackComment = cached?.pages[0]?.[0];
    expect(rolledBackComment?.is_liked).toBe(false);
    expect(rolledBackComment?.likes_count).toBe(3);
  });
});

/**
 * 結合テスト: スポット CRUD 操作
 *
 * useCreateSpot, useUpdateSpot, useDeleteSpot, usePublishSpot が
 * MSW でモックした API と正しく連携することを検証
 */

import React from 'react';
import { http, HttpResponse } from 'msw';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { server } from '@/shared/lib/test/msw/server';
import { mockSpots } from '@/shared/lib/test/msw/fixtures/index';
import { useCreateSpot } from '@/entities/user-spot/api/use-create-spot';
import { useUpdateSpot } from '@/entities/user-spot/api/use-update-spot';
import { useDeleteSpot } from '@/entities/user-spot/api/use-delete-spot';
import { usePublishSpot } from '@/entities/user-spot/api/use-publish-spot';

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

describe('スポット CRUD 結合テスト', () => {
  it('スポットを作成できる', async () => {
    const newSpotId = 'spot-new-123';

    server.use(
      // master_spots の取得（google_place_id チェック用）
      http.get(`${SUPABASE_URL}/rest/v1/master_spots`, () => {
        return HttpResponse.json([{
          id: 'master-spot-1',
          name: 'テストスポット',
          latitude: 35.6595,
          longitude: 139.7004,
          google_place_id: 'ChIJ_test',
        }]);
      }),
      // user_spots の作成
      http.post(`${SUPABASE_URL}/rest/v1/user_spots`, async () => {
        return HttpResponse.json([{
          id: newSpotId,
          user_id: 'user-1',
          map_id: 'map-1',
          master_spot_id: 'master-spot-1',
          description: 'テストスポット',
          is_public: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }], { status: 201 });
      }),
    );

    const { result } = renderHook(() => useCreateSpot(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        userId: 'user-1',
        mapId: 'map-1',
        masterSpotId: 'master-spot-1',
        description: 'テストスポット',
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('スポットを更新できる', async () => {
    const updatedSpot = {
      ...mockSpots[0],
      description: '更新された説明',
      updated_at: new Date().toISOString(),
    };

    server.use(
      http.patch(`${SUPABASE_URL}/rest/v1/user_spots`, async () => {
        return HttpResponse.json([updatedSpot]);
      }),
    );

    const { result } = renderHook(() => useUpdateSpot(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        spotId: 'spot-1',
        description: '更新された説明',
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('スポットを削除できる', async () => {
    server.use(
      http.delete(`${SUPABASE_URL}/rest/v1/user_spots`, () => {
        return HttpResponse.json([], { status: 200 });
      }),
    );

    const { result } = renderHook(() => useDeleteSpot(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate('spot-1');
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('spot-1');
  });

  it('スポットを公開できる', async () => {
    server.use(
      http.post(`${SUPABASE_URL}/rest/v1/rpc/publish_spot`, () => {
        return HttpResponse.json(null);
      }),
    );

    const { result } = renderHook(() => usePublishSpot(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ spotId: 'spot-1', mapId: 'map-1' });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});

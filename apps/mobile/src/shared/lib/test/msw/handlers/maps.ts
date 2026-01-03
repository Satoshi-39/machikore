/**
 * MSW ハンドラー - Maps API
 */

import { http, HttpResponse } from 'msw';
import { mockMaps, mockUsers } from '../fixtures';

const SUPABASE_URL = 'https://test.supabase.co';

/**
 * Maps API のモックハンドラー
 */
export const mapHandlers = [
  // マップ一覧取得
  http.get(`${SUPABASE_URL}/rest/v1/maps`, ({ request }) => {
    const url = new URL(request.url);
    const select = url.searchParams.get('select');
    const userId = url.searchParams.get('user_id');
    const isPublic = url.searchParams.get('is_public');

    let maps = [...mockMaps];

    // フィルタリング
    if (userId) {
      const userIdValue = userId.replace('eq.', '');
      maps = maps.filter((m) => m.user_id === userIdValue);
    }
    if (isPublic) {
      const isPublicValue = isPublic.replace('eq.', '') === 'true';
      maps = maps.filter((m) => m.is_public === isPublicValue);
    }

    // ユーザー情報を結合
    if (select?.includes('users')) {
      maps = maps.map((map) => ({
        ...map,
        users: mockUsers.find((u) => u.id === map.user_id) || null,
      }));
    }

    return HttpResponse.json(maps);
  }),

  // 単一マップ取得
  http.get(`${SUPABASE_URL}/rest/v1/maps/:id`, ({ params, request }) => {
    const url = new URL(request.url);
    const idParam = url.searchParams.get('id');
    const id = idParam?.replace('eq.', '') || params.id;

    const map = mockMaps.find((m) => m.id === id);
    if (!map) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const user = mockUsers.find((u) => u.id === map.user_id);
    return HttpResponse.json([{ ...map, users: user || null }]);
  }),

  // マップ作成
  http.post(`${SUPABASE_URL}/rest/v1/maps`, async ({ request }) => {
    const body = await request.json();
    const newMap = {
      id: `map-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...body,
    };
    return HttpResponse.json([newMap], { status: 201 });
  }),

  // マップ更新
  http.patch(`${SUPABASE_URL}/rest/v1/maps`, async ({ request }) => {
    const url = new URL(request.url);
    const idParam = url.searchParams.get('id');
    const id = idParam?.replace('eq.', '');
    const body = await request.json();

    const map = mockMaps.find((m) => m.id === id);
    if (!map) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updatedMap = { ...map, ...body, updated_at: new Date().toISOString() };
    return HttpResponse.json([updatedMap]);
  }),

  // マップ削除
  http.delete(`${SUPABASE_URL}/rest/v1/maps`, ({ request }) => {
    const url = new URL(request.url);
    const idParam = url.searchParams.get('id');
    const id = idParam?.replace('eq.', '');

    const map = mockMaps.find((m) => m.id === id);
    if (!map) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return HttpResponse.json([], { status: 200 });
  }),
];

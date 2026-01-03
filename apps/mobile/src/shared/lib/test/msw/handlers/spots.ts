/**
 * MSW ハンドラー - Spots API
 */

import { http, HttpResponse } from 'msw';
import { mockSpots, mockMasterSpots, mockUsers } from '../fixtures';

const SUPABASE_URL = 'https://test.supabase.co';

/**
 * Spots API のモックハンドラー
 */
export const spotHandlers = [
  // スポット一覧取得
  http.get(`${SUPABASE_URL}/rest/v1/user_spots`, ({ request }) => {
    const url = new URL(request.url);
    const select = url.searchParams.get('select');
    const mapId = url.searchParams.get('map_id');
    const userId = url.searchParams.get('user_id');

    let spots = [...mockSpots];

    // フィルタリング
    if (mapId) {
      const mapIdValue = mapId.replace('eq.', '');
      spots = spots.filter((s) => s.map_id === mapIdValue);
    }
    if (userId) {
      const userIdValue = userId.replace('eq.', '');
      spots = spots.filter((s) => s.user_id === userIdValue);
    }

    // リレーション結合
    if (select?.includes('master_spots') || select?.includes('users')) {
      spots = spots.map((spot) => ({
        ...spot,
        master_spots: select.includes('master_spots')
          ? mockMasterSpots.find((ms) => ms.id === spot.master_spot_id) || null
          : undefined,
        users: select.includes('users')
          ? mockUsers.find((u) => u.id === spot.user_id) || null
          : undefined,
      }));
    }

    return HttpResponse.json(spots);
  }),

  // 単一スポット取得
  http.get(`${SUPABASE_URL}/rest/v1/user_spots/:id`, ({ request }) => {
    const url = new URL(request.url);
    const idParam = url.searchParams.get('id');
    const id = idParam?.replace('eq.', '');

    const spot = mockSpots.find((s) => s.id === id);
    if (!spot) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const masterSpot = mockMasterSpots.find((ms) => ms.id === spot.master_spot_id);
    const user = mockUsers.find((u) => u.id === spot.user_id);

    return HttpResponse.json([
      {
        ...spot,
        master_spots: masterSpot || null,
        users: user || null,
      },
    ]);
  }),

  // スポット作成
  http.post(`${SUPABASE_URL}/rest/v1/user_spots`, async ({ request }) => {
    const body = await request.json();
    const newSpot = {
      id: `spot-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images_count: 0,
      likes_count: 0,
      bookmarks_count: 0,
      comments_count: 0,
      order_index: 0,
      ...body,
    };
    return HttpResponse.json([newSpot], { status: 201 });
  }),

  // スポット更新
  http.patch(`${SUPABASE_URL}/rest/v1/user_spots`, async ({ request }) => {
    const url = new URL(request.url);
    const idParam = url.searchParams.get('id');
    const id = idParam?.replace('eq.', '');
    const body = await request.json();

    const spot = mockSpots.find((s) => s.id === id);
    if (!spot) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updatedSpot = { ...spot, ...body, updated_at: new Date().toISOString() };
    return HttpResponse.json([updatedSpot]);
  }),

  // スポット削除
  http.delete(`${SUPABASE_URL}/rest/v1/user_spots`, ({ request }) => {
    const url = new URL(request.url);
    const idParam = url.searchParams.get('id');
    const id = idParam?.replace('eq.', '');

    const spot = mockSpots.find((s) => s.id === id);
    if (!spot) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return HttpResponse.json([], { status: 200 });
  }),

  // マスタースポット取得
  http.get(`${SUPABASE_URL}/rest/v1/master_spots`, ({ request }) => {
    const url = new URL(request.url);
    const idParam = url.searchParams.get('id');

    if (idParam) {
      const id = idParam.replace('eq.', '');
      const masterSpot = mockMasterSpots.find((ms) => ms.id === id);
      return HttpResponse.json(masterSpot ? [masterSpot] : []);
    }

    return HttpResponse.json(mockMasterSpots);
  }),
];

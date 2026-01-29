/**
 * MSW ハンドラー - Likes API
 */

import { http, HttpResponse } from 'msw';

const SUPABASE_URL = 'https://test.supabase.co';

/**
 * Likes API のモックハンドラー
 */
export const likeHandlers = [
  // いいね状態チェック（SELECT id FROM likes WHERE user_id=... AND map_id=...）
  http.get(`${SUPABASE_URL}/rest/v1/likes`, ({ request }) => {
    const url = new URL(request.url);
    const accept = request.headers.get('accept');

    // maybeSingle の場合（Accept: application/vnd.pgrst.object+json）
    if (accept?.includes('vnd.pgrst.object')) {
      // デフォルトは「いいねしていない」状態
      return HttpResponse.json(null, {
        headers: { 'Content-Range': '*/0' },
      });
    }

    return HttpResponse.json([]);
  }),

  // いいね追加
  http.post(`${SUPABASE_URL}/rest/v1/likes`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const newLike = {
      id: `like-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...body,
    };
    return HttpResponse.json(newLike, { status: 201 });
  }),

  // いいね削除
  http.delete(`${SUPABASE_URL}/rest/v1/likes`, () => {
    return HttpResponse.json([], { status: 200 });
  }),
];

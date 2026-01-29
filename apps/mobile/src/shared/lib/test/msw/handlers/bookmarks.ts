/**
 * MSW ハンドラー - Bookmarks API
 */

import { http, HttpResponse } from 'msw';

const SUPABASE_URL = 'https://test.supabase.co';

/**
 * Bookmarks API のモックハンドラー
 */
export const bookmarkHandlers = [
  // ブックマーク状態チェック
  http.get(`${SUPABASE_URL}/rest/v1/bookmarks`, ({ request }) => {
    const accept = request.headers.get('accept');

    if (accept?.includes('vnd.pgrst.object')) {
      return HttpResponse.json(null, {
        headers: { 'Content-Range': '*/0' },
      });
    }

    return HttpResponse.json([]);
  }),

  // ブックマーク追加
  http.post(`${SUPABASE_URL}/rest/v1/bookmarks`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const newBookmark = {
      id: `bookmark-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...body,
    };
    return HttpResponse.json(newBookmark, { status: 201 });
  }),

  // ブックマーク削除
  http.delete(`${SUPABASE_URL}/rest/v1/bookmarks`, () => {
    return HttpResponse.json([], { status: 200 });
  }),
];

/**
 * MSW ハンドラー - Follows API
 */

import { http, HttpResponse } from 'msw';

const SUPABASE_URL = 'https://test.supabase.co';

/**
 * Follows API のモックハンドラー
 */
export const followHandlers = [
  // フォロー追加
  http.post(`${SUPABASE_URL}/rest/v1/follows`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const newFollow = {
      id: `follow-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...body,
    };
    return HttpResponse.json(newFollow, { status: 201 });
  }),

  // フォロー削除
  http.delete(`${SUPABASE_URL}/rest/v1/follows`, () => {
    return HttpResponse.json([], { status: 200 });
  }),
];

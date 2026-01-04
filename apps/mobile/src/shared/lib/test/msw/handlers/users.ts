/**
 * MSW ハンドラー - Users API
 */

import { http, HttpResponse } from 'msw';
import { mockUsers } from '../fixtures';

const SUPABASE_URL = 'https://test.supabase.co';

/**
 * Users API のモックハンドラー
 */
export const userHandlers = [
  // ユーザー一覧取得
  http.get(`${SUPABASE_URL}/rest/v1/users`, ({ request }) => {
    const url = new URL(request.url);
    const idParam = url.searchParams.get('id');

    if (idParam) {
      const id = idParam.replace('eq.', '');
      const user = mockUsers.find((u) => u.id === id);
      return HttpResponse.json(user ? [user] : []);
    }

    return HttpResponse.json(mockUsers);
  }),

  // 単一ユーザー取得
  http.get(`${SUPABASE_URL}/rest/v1/users/:id`, ({ params }) => {
    const user = mockUsers.find((u) => u.id === params.id);
    if (!user) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json([user]);
  }),

  // ユーザー更新
  http.patch(`${SUPABASE_URL}/rest/v1/users`, async ({ request }) => {
    const url = new URL(request.url);
    const idParam = url.searchParams.get('id');
    const id = idParam?.replace('eq.', '');
    const body = (await request.json()) as Record<string, unknown>;

    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updatedUser = { ...user, ...body, updated_at: new Date().toISOString() };
    return HttpResponse.json([updatedUser]);
  }),
];

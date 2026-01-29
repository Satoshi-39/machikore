/**
 * MSW ハンドラー - Supabase RPC API & Edge Functions
 */

import { http, HttpResponse } from 'msw';
import { mockMixedFeedResponse } from '../fixtures';

const SUPABASE_URL = 'https://test.supabase.co';

/**
 * RPC API & Edge Functions のモックハンドラー
 */
export const rpcHandlers = [
  // detect-language Edge Function
  http.post(`${SUPABASE_URL}/functions/v1/detect-language`, () => {
    return HttpResponse.json({ language: 'ja' });
  }),

  // get_mixed_feed RPC
  http.post(`${SUPABASE_URL}/rest/v1/rpc/get_mixed_feed`, () => {
    return HttpResponse.json(mockMixedFeedResponse);
  }),

  // get_following_mixed_feed RPC
  http.post(`${SUPABASE_URL}/rest/v1/rpc/get_following_mixed_feed`, () => {
    return HttpResponse.json(mockMixedFeedResponse);
  }),

  // publish_spot RPC
  http.post(`${SUPABASE_URL}/rest/v1/rpc/publish_spot`, () => {
    return HttpResponse.json(null);
  }),

  // unpublish_spot RPC
  http.post(`${SUPABASE_URL}/rest/v1/rpc/unpublish_spot`, () => {
    return HttpResponse.json(null);
  }),
];

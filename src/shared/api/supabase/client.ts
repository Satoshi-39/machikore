/**
 * Supabase クライアント
 */

import { createClient } from '@supabase/supabase-js';
import { SecureStorageAdapter } from '@/shared/lib/storage';
import { ENV } from '@/shared/config';

// ===============================
// Supabase クライアント作成
// ===============================

/**
 * Supabaseクライアント
 *
 * 認証情報は SecureStore に暗号化保存される（AsyncStorageではなく）
 * これによりトークンがデバイス上で安全に保管される
 */
export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
  auth: {
    storage: SecureStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ===============================
// エラーハンドリング
// ===============================

/**
 * Supabaseエラーを正規化する
 * HTMLレスポンス（500エラーなど）を適切なエラーメッセージに変換
 */
export function normalizeSupabaseError(error: any): Error {
  if (!error) {
    return new Error('不明なエラーが発生しました');
  }

  // エラーメッセージを取得
  const message = error.message || error.toString();

  // HTMLレスポンスの場合（Cloudflare/Supabaseのサーバーエラー）
  if (typeof message === 'string' && message.includes('<html>')) {
    // HTMLからタイトルを抽出
    const titleMatch = message.match(/<title>([^<]+)<\/title>/i);
    const errorTitle = titleMatch?.[1] ?? 'サーバーエラー';

    // ユーザーフレンドリーなメッセージに変換
    if (errorTitle.includes('500')) {
      return new Error('サーバーエラーが発生しました。しばらく待ってから再試行してください。');
    }
    if (errorTitle.includes('502') || errorTitle.includes('503') || errorTitle.includes('504')) {
      return new Error('サーバーが一時的に利用できません。しばらく待ってから再試行してください。');
    }
    return new Error(`サーバーエラー: ${errorTitle}`);
  }

  // 通常のSupabaseエラー
  return error instanceof Error ? error : new Error(message);
}

/**
 * Supabaseエラーをログ出力して正規化されたエラーをスロー
 */
export function handleSupabaseError(context: string, error: any): never {
  const normalizedError = normalizeSupabaseError(error);
  console.error(`[${context}] Error:`, normalizedError.message);
  throw normalizedError;
}

// ===============================
// 型エクスポート
// ===============================

// Supabase自動生成型は後で追加
// export type Database = {} from './database.types';

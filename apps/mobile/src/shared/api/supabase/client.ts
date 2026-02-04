/**
 * Supabase クライアント
 */

import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';
import { LargeSecureStorageAdapter } from '@/shared/lib/storage';
import { ENV } from '@/shared/config';
import { log } from '@/shared/config/logger';
import type { Database } from '@/shared/types/database.types';

// ===============================
// Supabase クライアント作成
// ===============================

/**
 * Supabaseクライアント
 *
 * 認証情報は LargeSecureStorageAdapter を使用して保存:
 * - 暗号化キー（32バイト）→ SecureStore（暗号化保存）
 * - セッションデータ → AsyncStorage（AES-256で暗号化済み）
 *
 * これによりSecureStoreの2KB制限を回避しつつ、セキュリティを確保
 *
 * @see https://zenn.dev/rei2718/articles/80f5903602cbe9
 */
export const supabase = createClient<Database>(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
  auth: {
    storage: LargeSecureStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ===============================
// React Native向け自動リフレッシュ制御
// ===============================

/**
 * AppStateと連動してトークンの自動リフレッシュを制御する（Supabase公式推奨パターン）
 *
 * ブラウザと異なり、React Nativeではアプリのフォアグラウンド/バックグラウンドを
 * ライブラリが自動判定できないため、明示的に制御する必要がある。
 *
 * - フォアグラウンド復帰時: startAutoRefresh() でリフレッシュタイマーを開始
 * - バックグラウンド移行時: stopAutoRefresh() でリフレッシュタイマーを停止
 *
 * @see https://supabase.com/docs/reference/javascript/auth-startautorefresh
 */
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}

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
  log.error(`[Supabase] ${context} Error:`, normalizedError.message);
  throw normalizedError;
}

// ===============================
// 型エクスポート
// ===============================

export type { Database } from '@/shared/types/database.types';

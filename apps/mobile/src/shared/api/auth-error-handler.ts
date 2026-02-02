/**
 * グローバル認証エラーハンドラー
 *
 * TanStack QueryのQueryCache/MutationCacheから呼び出され、
 * 認証エラー（JWT期限切れ等）を検知してセッション回復またはサインアウトを行う。
 *
 * フロー:
 * 1. isAuthError() で認証エラーか判定
 * 2. handleAuthError() でリフレッシュ試行
 * 3. 成功 → 全クエリ再取得 / 失敗 → signOut() → AuthProviderのSIGNED_OUTハンドラが処理
 */

import { supabase } from '@/shared/api/supabase/client';
import { log } from '@/shared/config/logger';

// ===============================
// 認証エラー判定
// ===============================

/** 認証エラーとみなすメッセージパターン */
const AUTH_ERROR_PATTERNS = [
  'jwt expired',
  'jwt_expired',
  'token is expired',
  'token expired',
  'invalid jwt',
  'invalid_jwt',
  'jwt malformed',
  'not authenticated',
  'unauthorized',
  'auth session missing',
  'refresh_token_not_found',
  'invalid refresh token',
  'user not found',
  'session_not_found',
] as const;

/** 認証エラーとみなすHTTPステータスコード */
const AUTH_ERROR_STATUS_CODES = [401, 403] as const;

/**
 * エラーが認証エラーかどうかを判定する
 *
 * ネットワークエラー（fetch failed等）は認証エラーとみなさない。
 * 通常のリトライで処理すべきため。
 */
export function isAuthError(error: unknown): boolean {
  if (!error) return false;

  // ステータスコードによる判定
  if (typeof error === 'object' && error !== null) {
    const statusCode = (error as any).status ?? (error as any).statusCode ?? (error as any).code;
    if (typeof statusCode === 'number' && AUTH_ERROR_STATUS_CODES.includes(statusCode as any)) {
      return true;
    }
  }

  // メッセージによる判定
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : String((error as any)?.message ?? '');

  const lowerMessage = message.toLowerCase();

  // ネットワークエラーは除外
  if (
    lowerMessage.includes('fetch failed') ||
    lowerMessage.includes('network request failed') ||
    lowerMessage.includes('network error') ||
    lowerMessage.includes('aborted')
  ) {
    return false;
  }

  return AUTH_ERROR_PATTERNS.some((pattern) => lowerMessage.includes(pattern));
}

// ===============================
// 認証エラーハンドリング
// ===============================

/** クールダウン期間（ミリ秒） */
const COOLDOWN_MS = 5000;

/** 最後にハンドリングを実行した時刻 */
let lastHandledAt = 0;

/** 実行中のリカバリーPromise（多重実行防止） */
let recoveryPromise: Promise<void> | null = null;

/**
 * 認証エラーをハンドリングする
 *
 * デバウンス付き（5秒クールダウン）+ singleton Promiseで多重実行を防止。
 * 1. refreshSession() でトークンリフレッシュを試行
 * 2. 成功 → queryClient.invalidateQueries() で全クエリ再取得
 * 3. 失敗 → supabase.auth.signOut() → AuthProviderのSIGNED_OUTハンドラが処理
 *
 * queryClient は循環参照を避けるため引数で受け取る。
 */
export async function handleAuthError(
  queryClient: { invalidateQueries: () => void },
): Promise<void> {
  const now = Date.now();

  // クールダウン中なら何もしない
  if (now - lastHandledAt < COOLDOWN_MS) {
    log.debug('[AuthErrorHandler] クールダウン中、スキップ');
    return;
  }

  // 既に実行中のリカバリーがあればそれを待つ
  if (recoveryPromise) {
    log.debug('[AuthErrorHandler] リカバリー実行中、既存Promiseを待機');
    return recoveryPromise;
  }

  lastHandledAt = now;

  recoveryPromise = (async () => {
    try {
      log.info('[AuthErrorHandler] 認証エラー検知、セッションリフレッシュ試行');

      const { data, error } = await supabase.auth.refreshSession();

      if (error || !data.session) {
        log.warn('[AuthErrorHandler] セッションリフレッシュ失敗、サインアウト実行:', error?.message);
        await supabase.auth.signOut();
        return;
      }

      // リフレッシュ成功 → 全クエリを再取得
      log.info('[AuthErrorHandler] セッションリフレッシュ成功、全クエリ再取得');
      queryClient.invalidateQueries();
    } catch (err) {
      log.error('[AuthErrorHandler] リカバリー中にエラー発生、サインアウト実行:', err);
      try {
        await supabase.auth.signOut();
      } catch (signOutErr) {
        log.error('[AuthErrorHandler] サインアウトにも失敗:', signOutErr);
      }
    } finally {
      recoveryPromise = null;
    }
  })();

  return recoveryPromise;
}

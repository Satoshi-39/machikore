/**
 * Turnstile CAPTCHAトークン取得フック
 *
 * FSD: shared/lib/turnstile
 *
 * getCaptchaToken() を呼ぶとTurnstile実行→トークン取得をPromiseでラップして返す。
 * 30秒タイムアウト付き。
 */

import { useCallback, useRef } from 'react';
import type { TurnstileWebViewRef } from '@/shared/ui/turnstile';

const TURNSTILE_TIMEOUT_MS = 30_000;

interface PendingResolve {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

export function useTurnstile() {
  const turnstileRef = useRef<TurnstileWebViewRef>(null);
  const pendingRef = useRef<PendingResolve | null>(null);

  const onToken = useCallback((token: string) => {
    if (pendingRef.current) {
      pendingRef.current.resolve(token);
      pendingRef.current = null;
    }
  }, []);

  const onError = useCallback((error: string) => {
    if (pendingRef.current) {
      pendingRef.current.reject(new Error(`Turnstile error: ${error}`));
      pendingRef.current = null;
    }
  }, []);

  const onExpire = useCallback(() => {
    if (pendingRef.current) {
      pendingRef.current.reject(new Error('Turnstile token expired'));
      pendingRef.current = null;
    }
  }, []);

  const getCaptchaToken = useCallback((): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      pendingRef.current = { resolve, reject };

      const timeout = setTimeout(() => {
        if (pendingRef.current) {
          pendingRef.current.reject(new Error('Turnstile timeout'));
          pendingRef.current = null;
        }
      }, TURNSTILE_TIMEOUT_MS);

      // タイムアウトクリーンアップ
      const originalResolve = resolve;
      const originalReject = reject;
      pendingRef.current = {
        resolve: (token: string) => {
          clearTimeout(timeout);
          originalResolve(token);
        },
        reject: (error: Error) => {
          clearTimeout(timeout);
          originalReject(error);
        },
      };

      turnstileRef.current?.execute();
    });
  }, []);

  return {
    turnstileRef,
    getCaptchaToken,
    onToken,
    onError,
    onExpire,
  };
}

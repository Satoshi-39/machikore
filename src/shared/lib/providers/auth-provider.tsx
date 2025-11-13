/**
 * 認証プロバイダ
 *
 * FSD: shared/lib/providers
 * 設計書: 02_system-design.md - 9.2 認証セッション永続化
 *
 * 役割:
 * - アプリ起動時のセッション復元
 * - Supabase Authイベントの監視
 * - 認証状態変更時のZustand Store更新
 * - ゲストモード対応（認証なしでも閲覧可能）
 */

import React, { useEffect, useState } from 'react';
import { supabase } from '@/shared/api/supabase/client';
import {
  restoreSession,
  saveSession,
} from '@/shared/api/supabase/auth';
import { syncUserToSQLite } from '@/shared/lib/sync';
import { getUserById } from '@/shared/api/sqlite';
import { useUserStore } from '@/entities/user/model';
import type { User } from '@/entities/user/model';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * 認証プロバイダ
 *
 * アプリ起動時に以下の処理を行う：
 * 1. SecureStoreからセッション復元を試みる
 * 2. 復元失敗 → ゲストモードで起動（認証なしでも閲覧可能）
 * 3. Supabase Authイベントを監視してZustand Storeを同期
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [isInitializing, setIsInitializing] = useState(true);
  const { setUser, setAuthState } = useUserStore();

  useEffect(() => {
    let isMounted = true;
    let subscription: any = null;

    async function initializeAuth() {
      try {
        console.log('[AuthProvider] 認証初期化開始');

        // 1. セッション復元を試みる
        const restored = await restoreSession();

        if (restored) {
          // セッション復元成功 → 現在のセッションを取得
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user && isMounted) {
            // Supabase Auth → SQLite 同期（session.userを直接渡す）
            await syncUserToSQLite(session.user);

            // SQLiteからユーザー情報を取得してストアに保存
            const userData = getUserById(session.user.id);
            if (userData) {
              setUser(userData as User);
              setAuthState('authenticated');
            }
          }
        } else {
          // 2. セッション復元失敗 → ゲストモード（認証なしでも閲覧可能）
          if (isMounted) {
            setUser(null);
            setAuthState('unauthenticated');
          }
        }

        // 3. 認証完了後にSupabase Authイベントを監視開始
        if (isMounted) {
          const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              // サインイン時（Email/Password、OAuth）
              // Supabase Auth → SQLite 同期（session.userを直接渡す）
              await syncUserToSQLite(session.user);

              // SQLiteからユーザー情報を取得してストアに保存
              const userData = getUserById(session.user.id);
              if (userData && isMounted) {
                setUser(userData as User);
                setAuthState('authenticated');
              }
            } else if (event === 'SIGNED_OUT') {
              // サインアウト時
              if (isMounted) {
                setUser(null);
                setAuthState('unauthenticated');
              }
            } else if (event === 'TOKEN_REFRESHED' && session) {
              // トークンリフレッシュ時
              // 新しいトークンをSecureStoreに保存
              if (session.access_token && session.refresh_token) {
                await saveSession(
                  session.access_token,
                  session.refresh_token,
                  session.expires_at || 0
                );
              }
            }
          });
          subscription = data.subscription;
        }
      } catch (err) {
        console.error('[AuthProvider] 認証初期化エラー:', err);
        // エラーが発生してもゲストモードで続行
        if (isMounted) {
          setUser(null);
          setAuthState('unauthenticated');
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    }

    initializeAuth();

    // クリーンアップ
    return () => {
      isMounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []); // Zustandのsetterは安定した参照なので依存配列に含めない

  // 初期化中のみローディング表示
  if (isInitializing) {
    return null; // または軽量なスプラッシュ画面
  }

  return <>{children}</>;
}

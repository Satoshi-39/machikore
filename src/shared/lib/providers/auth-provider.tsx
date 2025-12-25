/**
 * 認証プロバイダ
 *
 * FSD: shared/lib/providers
 * 設計書: 02_system-design.md - 9.2 認証セッション永続化
 *
 * 役割:
 * - アプリ起動時のセッション復元（Supabaseが自動で行う）
 * - Supabase Authイベントの監視
 * - 認証状態変更時のZustand Store更新
 * - ゲストモード対応（認証なしでも閲覧可能）
 *
 * セッション管理:
 * - Supabaseクライアントが SecureStorageAdapter を使用して自動管理
 * - トークンの保存/復元/リフレッシュはすべてSupabaseが処理
 */

import React, { useEffect, useState } from 'react';
import { supabase } from '@/shared/api/supabase/client';
import { upsertUserToSupabase } from '@/shared/api/supabase/auth';
import { getUserById as getUserByIdFromSupabase } from '@/shared/api/supabase/users';
import {
  getCurrentTermsVersions,
  recordTermsAgreement,
  getUserLatestAgreement,
} from '@/shared/api/supabase/terms';
import {
  loginToRevenueCat,
  logoutFromRevenueCat,
  isPremiumActive,
} from '@/shared/api/revenuecat';
import { cacheUserToSQLite } from '@/shared/lib/cache';
import { setSentryUser } from '@/shared/lib/init/sentry';
import { identifyUser as identifyPostHogUser, resetUser as resetPostHogUser } from '@/shared/lib/init/posthog';
import { log } from '@/shared/config/logger';
import { useUserStore } from '@/entities/user/model';
import { useSubscriptionStore } from '@/entities/subscription';
import { useAppSettingsStore } from '@/shared/lib/store';
import { syncLocalPreferencesToServer } from '@/entities/user/api/use-user-preferences';
import { getCurrentLocale } from '@/shared/lib/i18n';
import type { User } from '@/entities/user/model';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * ログイン時にローカルの同意情報をサーバーに同期
 * 未ログイン時にオンボーディングで同意した内容をサーバーに記録
 */
async function syncTermsAgreementToServer(userId: string): Promise<void> {
  try {
    // ローカルの同意バージョンを取得
    const { agreedTermsVersion, agreedPrivacyVersion } = useAppSettingsStore.getState();

    if (!agreedTermsVersion || !agreedPrivacyVersion) {
      log.debug('[AuthProvider] ローカルに同意情報なし、同期スキップ');
      return;
    }

    // サーバーの同意情報を確認
    const serverAgreement = await getUserLatestAgreement(userId);

    // すでにサーバーに同じバージョンの同意が記録されていればスキップ
    if (
      serverAgreement &&
      serverAgreement.terms_version === agreedTermsVersion &&
      serverAgreement.privacy_version === agreedPrivacyVersion
    ) {
      log.debug('[AuthProvider] サーバーに同意情報あり、同期スキップ');
      return;
    }

    // サーバーから現在の規約バージョンIDを取得
    const currentTerms = await getCurrentTermsVersions();
    if (!currentTerms.termsOfService || !currentTerms.privacyPolicy) {
      log.warn('[AuthProvider] サーバーに規約が設定されていません');
      return;
    }

    // ローカルの同意バージョンとサーバーの規約バージョンが一致するか確認
    if (
      currentTerms.termsOfService.version !== agreedTermsVersion ||
      currentTerms.privacyPolicy.version !== agreedPrivacyVersion
    ) {
      log.debug('[AuthProvider] ローカルとサーバーの規約バージョンが異なる、同期スキップ');
      return;
    }

    // サーバーに同意を記録
    await recordTermsAgreement(
      userId,
      currentTerms.termsOfService.id,
      currentTerms.privacyPolicy.id
    );

    log.info('[AuthProvider] 同意情報をサーバーに同期しました');
  } catch (err) {
    log.error('[AuthProvider] 同意情報の同期に失敗:', err);
    // 失敗してもアプリは続行
  }
}

/**
 * 認証プロバイダ
 *
 * アプリ起動時に以下の処理を行う：
 * 1. Supabaseが自動でSecureStoreからセッション復元
 * 2. 復元失敗 → ゲストモードで起動（認証なしでも閲覧可能）
 * 3. Supabase Authイベントを監視してZustand Storeを同期
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [isInitializing, setIsInitializing] = useState(true);
  const { setUser, setAuthState } = useUserStore();
  const { setSubscriptionStatus, reset: resetSubscription } = useSubscriptionStore();

  useEffect(() => {
    let isMounted = true;
    let subscription: any = null;

    async function initializeAuth() {
      try {
        log.debug('[AuthProvider] 認証初期化開始');

        // Supabaseが自動でSecureStoreからセッションを復元する
        // getSession()を呼ぶことで復元されたセッションを取得
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user && isMounted) {
          // セッション復元成功
          log.info('[AuthProvider] セッション復元成功:', session.user.id);

          // Supabase public.users にupsert（外部キー制約を満たすため）
          await upsertUserToSupabase(session.user);

          // SQLiteにもキャッシュとして同期
          await cacheUserToSQLite(session.user);

          // Supabaseから最新のユーザー情報を取得してストアに保存
          // （プロフィール更新後も最新データが反映されるようにするため）
          const userData = await getUserByIdFromSupabase(session.user.id);
          if (userData && isMounted) {
            setUser(userData as User);
            setAuthState('authenticated');
            // Sentryにユーザー情報を設定
            setSentryUser({ id: userData.id, username: userData.username });
            // PostHogにユーザーを識別
            identifyPostHogUser(userData.id, { username: userData.username });
          }

          // RevenueCatにログインしてサブスクリプション状態を取得
          try {
            const customerInfo = await loginToRevenueCat(session.user.id);
            const isPremium = isPremiumActive(customerInfo);
            if (isMounted) {
              setSubscriptionStatus(isPremium, customerInfo);
            }
          } catch (err) {
            log.warn('[AuthProvider] RevenueCatログインエラー（続行）:', err);
          }

          // ユーザー設定（locale等）をサーバーに同期（セッション復元時）
          await syncLocalPreferencesToServer(getCurrentLocale());
        } else {
          // セッション復元失敗 → ゲストモード（認証なしでも閲覧可能）
          log.debug('[AuthProvider] セッションなし、ゲストモードで起動');
          if (isMounted) {
            setUser(null);
            setAuthState('unauthenticated');
          }
        }

        // 認証完了後にSupabase Authイベントを監視開始
        if (isMounted) {
          const { data } = supabase.auth.onAuthStateChange((event, session) => {
            log.debug('[AuthProvider] Auth event:', event);

            // 非同期処理はコールバック外で実行（setSessionのブロッキングを防ぐ）
            if (event === 'SIGNED_IN' && session?.user) {
              // サインイン時（Email/Password、OAuth）
              const user = session.user;
              (async () => {
                try {
                  // Supabase public.users にupsert（外部キー制約を満たすため）
                  await upsertUserToSupabase(user);

                  // SQLiteにもキャッシュとして同期
                  await cacheUserToSQLite(user);

                  // Supabaseから最新のユーザー情報を取得してストアに保存
                  const userData = await getUserByIdFromSupabase(user.id);
                  if (userData && isMounted) {
                    setUser(userData as User);
                    setAuthState('authenticated');
                    // Sentryにユーザー情報を設定
                    setSentryUser({ id: userData.id, username: userData.username });
                    // PostHogにユーザーを識別
                    identifyPostHogUser(userData.id, { username: userData.username });
                  }

                  // RevenueCatにログインしてサブスクリプション状態を取得
                  try {
                    const customerInfo = await loginToRevenueCat(user.id);
                    const isPremium = isPremiumActive(customerInfo);
                    if (isMounted) {
                      setSubscriptionStatus(isPremium, customerInfo);
                    }
                  } catch (rcErr) {
                    log.warn('[AuthProvider] RevenueCatログインエラー（続行）:', rcErr);
                  }

                  // ローカルの同意情報をサーバーに同期
                  await syncTermsAgreementToServer(user.id);

                  // ユーザー設定（locale等）をサーバーに同期
                  await syncLocalPreferencesToServer(getCurrentLocale());
                } catch (err) {
                  log.error('[AuthProvider] SIGNED_IN処理エラー:', err);
                }
              })();
            } else if (event === 'SIGNED_OUT') {
              // サインアウト時
              (async () => {
                // RevenueCatからログアウト
                try {
                  await logoutFromRevenueCat();
                } catch (rcErr) {
                  log.warn('[AuthProvider] RevenueCatログアウトエラー:', rcErr);
                }

                if (isMounted) {
                  setUser(null);
                  setAuthState('unauthenticated');
                  resetSubscription();
                  // Sentryからユーザー情報をクリア
                  setSentryUser(null);
                  // PostHogのユーザーをリセット
                  resetPostHogUser();
                }
              })();
            }
            // TOKEN_REFRESHED: Supabaseが自動でSecureStoreに保存するので何もしない
          });
          subscription = data.subscription;
        }
      } catch (err) {
        log.error('[AuthProvider] 認証初期化エラー:', err);
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

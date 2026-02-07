/**
 * ブックマーク上限チェックガード
 *
 * ブックマーク追加・フォルダ作成前に上限に達しているかを判定し、
 * 上限に達している場合はアラートを表示する。
 * 無料ユーザーの場合はプレミアムアップグレード導線を表示。
 * チェック時にSupabaseから直接COUNTとis_premiumを取得するため、
 * RLSポリシーと同じDB値を参照し、常に正確。
 */

import { useState, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/entities/user';
import { SUBSCRIPTION } from '@/shared/config/constants';
import { supabase } from '@/shared/api/supabase';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';

/** DBのis_premiumからブックマーク上限を算出（フォルダごと） */
function getBookmarkPerFolderLimit(isPremium: boolean): number {
  return isPremium ? SUBSCRIPTION.PREMIUM_BOOKMARKS_PER_FOLDER : SUBSCRIPTION.FREE_BOOKMARKS_PER_FOLDER;
}

/** DBのis_premiumからブックマーク上限を算出（後で見る） */
function getBookmarkUncategorizedLimit(isPremium: boolean): number {
  return isPremium ? SUBSCRIPTION.PREMIUM_BOOKMARKS_UNCATEGORIZED : SUBSCRIPTION.FREE_BOOKMARKS_UNCATEGORIZED;
}

/** DBのis_premiumからフォルダ上限を算出 */
function getFolderLimit(isPremium: boolean): number {
  return isPremium ? SUBSCRIPTION.PREMIUM_FOLDER_LIMIT : SUBSCRIPTION.FREE_FOLDER_LIMIT;
}

/**
 * ブックマーク上限チェックを提供するhook
 *
 * @returns checkBookmarkLimit - folderIdを受け取り、DBから最新のカウントとis_premiumを取得してチェック。追加可能ならtrue、上限到達ならfalse（アラート表示）
 * @returns checkFolderLimit - フォルダ作成前にDBから最新のカウントとis_premiumを取得してチェック。作成可能ならtrue、上限到達ならfalse（アラート表示）
 * @returns showBookmarkLimitAlert - ブックマーク上限アラートを直接表示する（RLSエラー時のフォールバック用）
 * @returns showFolderLimitAlert - フォルダ上限アラートを直接表示する（RLSエラー時のフォールバック用）
 * @returns isChecking - チェック中かどうか（ボタン無効化用）
 */
export function useBookmarkLimitGuard() {
  const userId = useUserStore((state) => state.user?.id ?? null);
  const [isChecking, setIsChecking] = useState(false);
  const isCheckingRef = useRef(false);
  const router = useRouter();
  const { t } = useI18n();

  /**
   * プレミアム画面へ遷移
   */
  const navigateToPremium = useCallback(() => {
    router.push('/premium');
  }, [router]);

  /**
   * ブックマーク上限アラートを表示
   * @param isUncategorized - 後で見るかどうか
   * @param isPremium - プレミアムユーザーかどうか
   * @param limit - 上限値
   */
  const showBookmarkLimitAlert = useCallback((isUncategorized: boolean, isPremium: boolean, limit?: number) => {
    const bookmarkLimit = limit ?? (isUncategorized
      ? SUBSCRIPTION.FREE_BOOKMARKS_UNCATEGORIZED
      : SUBSCRIPTION.FREE_BOOKMARKS_PER_FOLDER);

    if (isPremium) {
      // プレミアムユーザー向けメッセージ
      const premiumMessage = isUncategorized
        ? t('usageLimit.bookmarkUncategorizedMessage', { limit: bookmarkLimit })
        : t('usageLimit.bookmarkPerFolderMessage', { limit: bookmarkLimit });
      Alert.alert(t('usageLimit.bookmarkLimitTitle'), premiumMessage);
    } else {
      // 無料ユーザー向けメッセージ（アップグレード訴求）
      const freeMessage = isUncategorized
        ? t('usageLimit.bookmarkUncategorizedUpgradeMessage', { limit: bookmarkLimit, premiumLimit: SUBSCRIPTION.PREMIUM_BOOKMARKS_UNCATEGORIZED })
        : t('usageLimit.bookmarkPerFolderUpgradeMessage', { limit: bookmarkLimit, premiumLimit: SUBSCRIPTION.PREMIUM_BOOKMARKS_PER_FOLDER });
      Alert.alert(
        t('usageLimit.bookmarkLimitTitle'),
        freeMessage,
        [
          { text: t('usageLimit.close'), style: 'cancel' },
          { text: t('usageLimit.upgrade'), onPress: navigateToPremium },
        ]
      );
    }
  }, [navigateToPremium, t]);

  /**
   * フォルダ上限アラートを表示
   * @param isPremium - プレミアムユーザーかどうか
   * @param limit - 上限値
   */
  const showFolderLimitAlert = useCallback((isPremium: boolean, limit?: number) => {
    const folderLimit = limit ?? SUBSCRIPTION.FREE_FOLDER_LIMIT;

    if (isPremium) {
      Alert.alert(
        t('usageLimit.folderLimitTitle'),
        t('usageLimit.folderLimitMessage', { limit: folderLimit })
      );
    } else {
      Alert.alert(
        t('usageLimit.folderLimitTitle'),
        t('usageLimit.folderLimitUpgradeMessage', { limit: folderLimit, premiumLimit: SUBSCRIPTION.PREMIUM_FOLDER_LIMIT }),
        [
          { text: t('usageLimit.close'), style: 'cancel' },
          { text: t('usageLimit.upgrade'), onPress: navigateToPremium },
        ]
      );
    }
  }, [navigateToPremium, t]);

  /**
   * Supabaseからブックマーク数とis_premiumを直接取得してブックマーク上限をチェック
   * @param folderId - チェック対象のフォルダID（null = 後で見る）
   * @param bookmarkType - ブックマークタイプ（'maps' | 'spots'）。folderId=null時にタイプ別カウントに使用
   * @returns 追加可能ならtrue、上限到達ならfalse
   */
  const checkBookmarkLimit = useCallback(async (folderId: string | null, bookmarkType: 'maps' | 'spots'): Promise<boolean> => {
    // 連打防止
    if (isCheckingRef.current) return false;
    isCheckingRef.current = true;
    setIsChecking(true);

    try {
      if (!userId) {
        log.error('[useBookmarkLimitGuard] userId not found');
        return true;
      }

      // ブックマーク数とis_premiumを並行取得（RLSと同じDB値を参照）
      const [countResult, userResult] = await Promise.all([
        folderId === null
          ? supabase.rpc('count_bookmarks_uncategorized', { p_user_id: userId, p_bookmark_type: bookmarkType })
          : supabase.rpc('count_bookmarks_in_folder', { p_user_id: userId, p_folder_id: folderId }),
        supabase.from('users').select('is_premium').eq('id', userId).single(),
      ]);

      if (countResult.error) {
        log.error('[useBookmarkLimitGuard] ブックマーク数取得エラー:', countResult.error);
        // 取得失敗時は通過させる（DB側のRLSで最終防御）
        return true;
      }

      const isPremium = userResult.data?.is_premium ?? false;
      const isUncategorized = folderId === null;
      const bookmarkLimit = isUncategorized
        ? getBookmarkUncategorizedLimit(isPremium)
        : getBookmarkPerFolderLimit(isPremium);

      if ((countResult.data ?? 0) >= bookmarkLimit) {
        showBookmarkLimitAlert(isUncategorized, isPremium, bookmarkLimit);
        return false;
      }

      return true;
    } finally {
      isCheckingRef.current = false;
      setIsChecking(false);
    }
  }, [userId, showBookmarkLimitAlert]);

  /**
   * Supabaseからフォルダ数とis_premiumを直接取得してフォルダ上限をチェック
   * @param folderType - フォルダタイプ（'maps' | 'spots'）
   * @returns 作成可能ならtrue、上限到達ならfalse
   */
  const checkFolderLimit = useCallback(async (folderType: 'maps' | 'spots'): Promise<boolean> => {
    // 連打防止
    if (isCheckingRef.current) return false;
    isCheckingRef.current = true;
    setIsChecking(true);

    try {
      if (!userId) {
        log.error('[useBookmarkLimitGuard] userId not found');
        return true;
      }

      // フォルダ数とis_premiumを並行取得（RLSと同じDB値を参照）
      const [countResult, userResult] = await Promise.all([
        supabase.rpc('count_bookmark_folders', { p_user_id: userId, p_folder_type: folderType }),
        supabase.from('users').select('is_premium').eq('id', userId).single(),
      ]);

      if (countResult.error) {
        log.error('[useBookmarkLimitGuard] フォルダ数取得エラー:', countResult.error);
        // 取得失敗時は通過させる（DB側のRLSで最終防御）
        return true;
      }

      const isPremium = userResult.data?.is_premium ?? false;
      const folderLimit = getFolderLimit(isPremium);

      if ((countResult.data ?? 0) >= folderLimit) {
        showFolderLimitAlert(isPremium, folderLimit);
        return false;
      }

      return true;
    } finally {
      isCheckingRef.current = false;
      setIsChecking(false);
    }
  }, [userId, showFolderLimitAlert]);

  /**
   * フォルダ削除前に後で見るのオーバーフローをチェック
   * @param folderId - 削除対象のフォルダID
   * @returns 削除可能ならtrue、オーバーフローならfalse
   */
  const checkFolderDeleteAllowed = useCallback(async (folderId: string): Promise<boolean> => {
    // 連打防止
    if (isCheckingRef.current) return false;
    isCheckingRef.current = true;
    setIsChecking(true);

    try {
      if (!userId) {
        log.error('[useBookmarkLimitGuard] userId not found');
        return true;
      }

      // 後で見るの件数、フォルダ内の件数、重複件数、is_premiumを並行取得
      const [uncategorizedResult, folderResult, duplicateResult, userResult] = await Promise.all([
        supabase.rpc('count_bookmarks_uncategorized', { p_user_id: userId }),
        supabase.from('bookmarks').select('id', { count: 'exact', head: true })
          .eq('user_id', userId).eq('folder_id', folderId),
        supabase.rpc('count_bookmark_duplicates_on_folder_delete', {
          p_user_id: userId,
          p_folder_id: folderId,
        }),
        supabase.from('users').select('is_premium').eq('id', userId).single(),
      ]);

      const uncategorizedCount = uncategorizedResult.data ?? 0;
      const folderCount = folderResult.count ?? 0;
      const duplicateCount = duplicateResult.data ?? 0;
      const isPremium = userResult.data?.is_premium ?? false;

      // 重複分は移動しても件数が増えないので除外
      const netIncrease = folderCount - duplicateCount;
      const total = uncategorizedCount + netIncrease;
      const limit = getBookmarkUncategorizedLimit(isPremium);

      if (total > limit) {
        // 無料ユーザーで、プレミアムにすれば削除可能になる場合はアップグレード導線を表示
        const premiumLimit = getBookmarkUncategorizedLimit(true);
        const canDeleteWithPremium = !isPremium && total <= premiumLimit;

        if (canDeleteWithPremium) {
          Alert.alert(
            t('usageLimit.cannotDeleteFolder'),
            t('usageLimit.cannotDeleteFolderUpgradeMessage', { limit, premiumLimit }),
            [
              { text: t('usageLimit.close'), style: 'cancel' },
              { text: t('usageLimit.upgrade'), onPress: navigateToPremium },
            ]
          );
        } else {
          Alert.alert(
            t('usageLimit.cannotDeleteFolder'),
            t('usageLimit.cannotDeleteFolderMessage', { limit })
          );
        }
        return false;
      }
      return true;
    } finally {
      isCheckingRef.current = false;
      setIsChecking(false);
    }
  }, [userId, navigateToPremium, t]);

  /**
   * 現在のフォルダ数を取得
   * @returns 現在のフォルダ数
   */
  const getFolderCount = useCallback(async (): Promise<number> => {
    if (!userId) return 0;
    const result = await supabase.rpc('count_bookmark_folders', { p_user_id: userId });
    return result.data ?? 0;
  }, [userId]);

  return {
    checkBookmarkLimit,
    checkFolderLimit,
    checkFolderDeleteAllowed,
    showBookmarkLimitAlert,
    showFolderLimitAlert,
    getFolderCount,
    isChecking,
  };
}

/**
 * OTA更新をサイレントにチェック・適用するフック
 *
 * - コールドスタート時: useUpdates()が自動チェック
 * - フォアグラウンド復帰時: AppStateリスナーで手動チェック
 * - 更新検出 → バックグラウンドDL → 完了後に自動リロード
 */
import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import * as Updates from 'expo-updates';
import { log } from '@/shared/config/logger';

/** フォアグラウンド復帰時のOTAチェック最小間隔（30分） */
const MIN_CHECK_INTERVAL_MS = 30 * 60 * 1000;

export function useOTAUpdates() {
  const { isUpdateAvailable, isUpdatePending } = Updates.useUpdates();
  const lastCheckTimeRef = useRef(0);

  // 更新ダウンロード完了 → 自動リロード
  useEffect(() => {
    if (__DEV__ || !isUpdatePending) return;
    log.info('[OTAUpdates] 更新適用のためリロード');
    Updates.reloadAsync();
  }, [isUpdatePending]);

  // 更新検出 → ダウンロード開始
  useEffect(() => {
    if (__DEV__ || !isUpdateAvailable) return;
    log.info('[OTAUpdates] 更新を検出、ダウンロード開始');
    Updates.fetchUpdateAsync().catch((err) => {
      log.warn('[OTAUpdates] ダウンロード失敗:', err);
    });
  }, [isUpdateAvailable]);

  // フォアグラウンド復帰時にチェック（30分間隔でスロットル）
  useEffect(() => {
    if (__DEV__) return;

    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          const now = Date.now();
          if (now - lastCheckTimeRef.current < MIN_CHECK_INTERVAL_MS) return;
          lastCheckTimeRef.current = now;

          try {
            log.debug('[OTAUpdates] フォアグラウンド復帰、更新チェック');
            await Updates.checkForUpdateAsync();
          } catch {
            // チェック失敗時は無視（次回にリトライ）
          }
        }
      },
    );

    return () => subscription.remove();
  }, []);
}

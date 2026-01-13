/**
 * useSpotReport
 *
 * スポット通報画面への遷移ロジック
 */

import { useCallback } from 'react';
import { useRouter, type Href } from 'expo-router';
import { showLoginRequiredAlert } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';

interface UseSpotReportOptions {
  /** 現在のユーザーID（未ログイン時はnull） */
  currentUserId?: string | null;
}

export function useSpotReport(options?: UseSpotReportOptions) {
  const router = useRouter();
  const { t } = useI18n();

  const handleReport = useCallback((spotId: string) => {
    if (!options?.currentUserId) {
      showLoginRequiredAlert(t('menu.report'));
      return;
    }
    router.push(`/report?targetType=spot&targetId=${spotId}` as Href);
  }, [options?.currentUserId, router, t]);

  return {
    handleReport,
  };
}

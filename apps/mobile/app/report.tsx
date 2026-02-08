/**
 * 報告画面
 *
 * マップ、スポット、ユーザー、コメントの報告を行うページ
 * URLパラメータ: targetType, targetId
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { ReportPage } from '@/pages/report';
import type { ReportTargetType } from '@/shared/api/supabase/reports';
import { useI18n } from '@/shared/lib/i18n';

export default function ReportScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const params = useLocalSearchParams<{ targetType: string; targetId: string }>();

  const targetType = params.targetType as ReportTargetType;
  const targetId = params.targetId;

  // パラメータの検証
  useEffect(() => {
    const validTypes = ['map', 'spot', 'user', 'comment'];
    if (!targetType || !validTypes.includes(targetType) || !targetId) {
      Alert.alert(t('common.error'), t('report.invalidParams'), [
        { text: t('common.ok'), onPress: () => router.back() },
      ]);
    }
  }, [targetType, targetId, router, t]);

  if (!targetType || !targetId) {
    return null;
  }

  return <ReportPage targetType={targetType} targetId={targetId} />;
}

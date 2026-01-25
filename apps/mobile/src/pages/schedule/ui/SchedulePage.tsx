/**
 * スケジュールページ
 *
 * ユーザーの訪問予定スケジュールを専用ページで表示
 */

import React from 'react';
import { View } from 'react-native';
import { UserSchedule } from '@/widgets/user-schedule';
import { useCurrentUserId } from '@/entities/user';
import { PageHeader } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';

export function SchedulePage() {
  const currentUserId = useCurrentUserId();
  const { t } = useI18n();

  return (
    <View className="flex-1 bg-surface">
      <PageHeader title={t('schedule.title')} />
      <UserSchedule userId={currentUserId} />
    </View>
  );
}

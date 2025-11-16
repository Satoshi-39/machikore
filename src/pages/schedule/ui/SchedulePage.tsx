/**
 * スケジュールページ
 *
 * ユーザーの訪問予定スケジュールを専用ページで表示
 */

import React from 'react';
import { View } from 'react-native';
import { UserSchedule } from '@/widgets/user-schedule';
import { useCurrentUserId } from '@/entities/user';

export function SchedulePage() {
  const currentUserId = useCurrentUserId();

  return (
    <View className="flex-1 bg-gray-50">
      <UserSchedule userId={currentUserId} />
    </View>
  );
}

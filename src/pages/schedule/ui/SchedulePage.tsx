/**
 * スケジュールページ
 *
 * ユーザーの訪問予定スケジュールを専用ページで表示
 */

import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserSchedule } from '@/widgets/user-schedule';
import { useCurrentUserId } from '@/entities/user';

export function SchedulePage() {
  const currentUserId = useCurrentUserId();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="flex-1">
        <UserSchedule userId={currentUserId} />
      </View>
    </SafeAreaView>
  );
}

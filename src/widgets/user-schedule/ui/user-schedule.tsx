/**
 * ユーザースケジュールWidget
 *
 * ユーザーの訪問予定スケジュールを表示
 * カレンダーと予定リストを組み合わせた表示
 */

import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { Calendar } from './Calendar';
import { log } from '@/shared/config/logger';

interface UserScheduleProps {
  userId: string | null;
}

export function UserSchedule({ userId }: UserScheduleProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // TODO: スケジュールデータの取得
  // const { data: schedules } = useUserSchedules(userId);
  // const markedDates = schedules?.map(s => formatDateKey(new Date(s.scheduled_at))) ?? [];

  // 現在はプレースホルダー実装のためuserIdは未使用
  // スケジュールAPI実装時に使用予定
  log.debug('[UserSchedule] Rendering for userId:', userId);

  return (
    <ScrollView className="flex-1 bg-surface dark:bg-dark-surface">
      {/* カレンダー */}
      <Calendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        markedDates={[]} // TODO: スケジュールがある日付をマーク
      />

      {/* 選択日の予定リスト */}
      <View className="bg-surface dark:bg-dark-surface mt-2 px-4 py-4">
        <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-3">
          {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日の予定
        </Text>

        {/* プレースホルダー */}
        <View className="items-center py-8">
          <View className="w-16 h-16 rounded-full bg-muted dark:bg-dark-muted items-center justify-center mb-3">
            <Ionicons name="calendar-outline" size={32} color={colors.text.secondary} />
          </View>
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary text-center">
            予定はありません
          </Text>
          <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted text-center mt-2">
            スケジュール機能は今後実装予定です
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

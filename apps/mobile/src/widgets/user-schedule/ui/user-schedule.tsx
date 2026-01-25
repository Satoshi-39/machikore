/**
 * ユーザースケジュールWidget
 *
 * ユーザーの訪問予定スケジュールを表示
 * カレンダーと予定リストを組み合わせた表示
 */

import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from './Calendar';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';

interface UserScheduleProps {
  userId: string | null;
}

export function UserSchedule({ userId }: UserScheduleProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { t } = useI18n();

  // TODO: スケジュールデータの取得
  // const { data: schedules } = useUserSchedules(userId);
  // const markedDates = schedules?.map(s => formatDateKey(new Date(s.scheduled_at))) ?? [];

  // 現在はプレースホルダー実装のためuserIdは未使用
  // スケジュールAPI実装時に使用予定
  log.debug('[UserSchedule] Rendering for userId:', userId);

  return (
    <ScrollView className="flex-1 bg-surface">
      {/* カレンダー */}
      <Calendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        markedDates={[]} // TODO: スケジュールがある日付をマーク
      />

      {/* 選択日の予定リスト */}
      <View className="bg-surface mt-2 px-4 py-4">
        <Text className="text-base font-semibold text-on-surface mb-3">
          {t('schedule.dateSchedule', { month: selectedDate.getMonth() + 1, day: selectedDate.getDate() })}
        </Text>

        {/* プレースホルダー */}
        <View className="items-center py-8">
          <View className="w-16 h-16 rounded-full bg-secondary items-center justify-center mb-3">
            <Ionicons name="calendar-outline" size={32} className="text-on-surface-variant" />
          </View>
          <Text className="text-sm text-on-surface-variant text-center">
            {t('schedule.noSchedule')}
          </Text>
          <Text className="text-xs text-on-surface-variant text-center mt-2">
            {t('schedule.comingSoon')}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
